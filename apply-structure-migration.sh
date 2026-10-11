#!/usr/bin/env bash
set -euo pipefail

# One-time migration helper. Run from the repository root after extracting this archive.
if [[ ! -d practice || ! -d assignments || ! -d docs ]]; then
  echo "New structure not found. Extract the changed-files archive into the repository root first." >&2
  exit 1
fi

rm -rf -- \
  CA-ALGORITHMS \
  CA-ARCH \
  CA-DSGN1 \
  CA-DSGN1PLUS \
  CA-DSGN2 \
  CA-DSGN2PLUS \
  CA-JS \
  CA-JSTS1 \
  CA-JSTS1MAX \
  CA-JSTS1PLUS \
  CA-NET \
  CA-OS \
  CA-PHP \
  CA-REACT \
  CA-SOFTWARE-DOCUMENTATION \
  CA-UIUX \
  CS1 \
  CS1MAX \
  CS1PLUS \
  CS2 \
  CS2MAX \
  CS2PLUS \
  CS3 \
  CS3MAX \
  CS3PLUS \
  CS4 \
  CS4MAX \
  CS4PLUS \
  CS5 \
  CS5MAX \
  CS5PLUS
rm -f -- ASSIGNMENT_STATUS.md COMPLETION_REPORT.md

echo "Legacy layout removed. New public structure is active."
rm -f -- "$0"
