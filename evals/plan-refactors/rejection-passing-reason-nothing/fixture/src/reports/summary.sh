#!/usr/bin/env bash
# Usage: summary.sh <cents>...
# Prints a one-line total for a day's orders. Formatting is written here,
# not shared with receipt.sh or csv_export.sh (ADR 0002).
set -euo pipefail
sum=0
for cents in "$@"; do sum=$((sum + cents)); done
printf 'Summary: %d.%02d (%d orders)\n' $((sum / 100)) $((sum % 100)) "$#"
