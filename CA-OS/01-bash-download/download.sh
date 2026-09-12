#!/usr/bin/env bash
set -euo pipefail
OUT="${1:-attachments}"
COUNT="${COUNT:-20}"
mkdir -p "$OUT"
for i in $(seq 1 "$COUNT"); do
  url="https://picsum.photos/seed/synergy-${i}/640/480"
  curl --fail --location --silent --show-error "$url" -o "$OUT/image-${i}.jpg"
  printf 'downloaded %s\n' "$OUT/image-${i}.jpg"
done
