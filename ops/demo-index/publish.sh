#!/usr/bin/env bash
set -euo pipefail
umask 077

readonly root=/srv/hdemo
readonly target="$root/public/index.html"
readonly size_limit=$((128 * 1024))

if ! IFS= read -r -t 10 -n 65 digest || [[ ! "$digest" =~ ^[0-9a-f]{64}$ ]]; then
  echo 'Expected a SHA-256 digest on the first line.' >&2
  exit 1
fi

exec 9>"$root/.demo-index-deploy.lock"
flock -w 15 9
[[ -f "$target" && ! -L "$target" ]]
candidate="$(mktemp "$root/public/.demo-index.XXXXXXXX")"
trap 'rm -f -- "$candidate"' EXIT

timeout 20s head -c "$((size_limit + 1))" > "$candidate"
if (( $(stat -c %s "$candidate") > size_limit )); then
  echo 'The demo index exceeds the 128 KiB upload limit.' >&2
  exit 1
fi
printf '%s  %s\n' "$digest" "$candidate" | sha256sum --check --status
grep -qix -m 1 '<!doctype html>' "$candidate"

if cmp -s "$candidate" "$target"; then
  echo "The demo index is already current ($digest)."
  exit 0
fi

chmod 0644 "$candidate"
mv -fT -- "$candidate" "$target"
echo "Published the demo index ($digest)."
