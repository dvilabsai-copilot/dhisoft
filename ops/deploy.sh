#!/usr/bin/env bash
set -Eeuo pipefail

# Build away from the running application. Only this app's build/dependencies
# are swapped; Apache, sibling applications and demo routes stay in place.
APP=/var/www/dhisoft
STATE=/var/lib/dhisoft-deploy
SERVICE=dhisoft.service
TARGET=${1:?Pass the exact main commit SHA}
[[ $TARGET =~ ^[0-9a-f]{40}$ ]] || { echo 'Invalid commit SHA' >&2; exit 1; }
[[ $(id -u) == 0 ]] || { echo 'Run deployment as root' >&2; exit 1; }
install -d -o root -g www-data -m 0750 "$STATE"
exec 9>"$STATE/deploy.lock"
flock -w 600 9
repo() { git -c safe.directory="$APP" -C "$APP" "$@"; }
repo fetch origin main
[[ $(repo rev-parse origin/main) == "$TARGET" ]] || { echo 'main changed; deploy its current verified commit instead' >&2; exit 1; }
repo diff --quiet && repo diff --cached --quiet || { echo 'Tracked server changes must be reviewed before deploying' >&2; exit 1; }
if [[ -f $STATE/current-revision ]] && [[ $(cat "$STATE/current-revision") == "$TARGET" ]] && [[ $(repo rev-parse HEAD) == "$TARGET" ]] && systemctl is-active --quiet "$SERVICE"; then
  echo "Already deployed $TARGET"
  exit 0
fi

OLD=$(repo rev-parse HEAD)
BUILD=$(mktemp -d "$STATE/build.XXXXXXXX")
BACKUP="$STATE/previous-$(date -u +%Y%m%dT%H%M%SZ)-${OLD:0:12}"
CUTOVER=0
cleanup() {
  case "$BUILD" in "$STATE"/build.*) rm -rf -- "$BUILD" ;; esac
}
rollback() {
  trap - ERR
  if [[ $CUTOVER == 1 ]]; then
    systemctl stop "$SERVICE" || true
    if [[ -d $BACKUP/.next ]]; then
      [[ ! -e $APP/.next ]] || mv "$APP/.next" "$BUILD/failed-next"
      mv "$BACKUP/.next" "$APP/.next"
    fi
    if [[ -d $BACKUP/node_modules ]]; then
      [[ ! -e $APP/node_modules ]] || mv "$APP/node_modules" "$BUILD/failed-node-modules"
      mv "$BACKUP/node_modules" "$APP/node_modules"
    fi
    repo reset --hard "$OLD"
    systemctl start "$SERVICE" || true
    echo "Deployment failed; restored $OLD" >&2
  fi
  exit 1
}
trap cleanup EXIT
trap rollback ERR
repo archive "$TARGET" | tar -x -C "$BUILD"
chown -R www-data:www-data "$BUILD"
for name in .env .env.local .env.production .env.production.local; do
  if [[ -f $APP/$name ]]; then install -o www-data -g www-data -m 0600 "$APP/$name" "$BUILD/$name"; fi
done
install -d -o www-data -g www-data -m 0700 "$STATE/npm-cache"
runuser -u www-data -- bash -c 'cd "$1" && export npm_config_cache="$2" && npm ci --prefer-offline --no-audit && NODE_OPTIONS=--max-old-space-size=3072 npm run build' bash "$BUILD" "$STATE/npm-cache"
test -s "$BUILD/.next/BUILD_ID"

install -d -o root -g root -m 0700 "$BACKUP"
systemctl stop "$SERVICE"
CUTOVER=1
repo checkout main
repo merge --ff-only "$TARGET"
if [[ -d $APP/.next ]]; then mv "$APP/.next" "$BACKUP/.next"; fi
if [[ -d $APP/node_modules ]]; then mv "$APP/node_modules" "$BACKUP/node_modules"; fi
mv "$BUILD/.next" "$APP/.next"
mv "$BUILD/node_modules" "$APP/node_modules"
systemctl start "$SERVICE"
HEALTHY=0
for attempt in {1..20}; do
  if systemctl is-active --quiet "$SERVICE" && curl --fail --silent --max-time 4 http://127.0.0.1:4080/ -o /dev/null; then HEALTHY=1; break; fi
  sleep 1
done
[[ $HEALTHY == 1 ]]
printf '%s\n' "$TARGET" > "$STATE/current-revision"
trap - ERR
echo "Deployed $TARGET; previous build saved in $BACKUP"
