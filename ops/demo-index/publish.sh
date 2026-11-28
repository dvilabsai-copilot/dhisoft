#!/usr/bin/env bash
set -euo pipefail
umask 077

readonly root=/srv/hdemo
readonly public="$root/public"
readonly assets="$public/demo-screenshots"
readonly size_limit=$((128 * 1024))

if ! IFS= read -r -t 10 -n 70 header || [[ ! "$header" =~ ^([a-f0-9]{64})([[:blank:]]webp)?$ ]]; then
  echo 'Expected a SHA-256 digest, optionally followed by " webp".' >&2
  exit 1
fi
digest="${BASH_REMATCH[1]}"
format="${BASH_REMATCH[2]}"

exec 9>"$root/.demo-index-deploy.lock"
flock -w 15 9
if [[ -n "$format" ]]; then
  [[ -d "$assets" && ! -L "$assets" ]]
  target="$assets/$digest.webp"
else
  target="$public/index.html"
  [[ -f "$target" ]]
fi
[[ ! -L "$target" ]]

candidate="$(mktemp "$public/.demo-index.XXXXXXXX")"
trap 'rm -f -- "$candidate"' EXIT

timeout 20s head -c "$((size_limit + 1))" > "$candidate"
if (( $(stat -c %s "$candidate") > size_limit )); then
  echo 'The upload exceeds the 128 KiB per-file limit.' >&2
  exit 1
fi
printf '%s  %s\n' "$digest" "$candidate" | sha256sum --check --status
if [[ -n "$format" ]]; then
  [[ "$(head -c 4 "$candidate")" == RIFF && "$(dd if="$candidate" bs=1 skip=8 count=4 status=none)" == WEBP ]]
else
  grep -qix -m 1 '<!doctype html>' "$candidate"
fi

if cmp -s "$candidate" "$target"; then
  echo "Already current: $target"
  exit 0
fi

chmod 0644 "$candidate"
mv -fT -- "$candidate" "$target"
echo "Published $target ($digest)."
