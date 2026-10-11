#!/usr/bin/env bash
set -euo pipefail
OUT="${1:-attachments}"
if [[ -d "$OUT" ]]; then
  find "$OUT" -maxdepth 1 -type f -name 'image-*.jpg' -print -delete
  rmdir "$OUT" 2>/dev/null || true
fi
