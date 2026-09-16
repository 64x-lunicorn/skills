#!/usr/bin/env bash
# Usage: csv_export.sh <cents>...
# Prints one CSV line per order. Formatting is written here, not shared
# with summary.sh or receipt.sh (ADR 0002).
set -euo pipefail
for cents in "$@"; do
  printf '%d.%02d\n' $((cents / 100)) $((cents % 100))
done
