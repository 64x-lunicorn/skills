#!/usr/bin/env bash
# Usage: receipt.sh <cents>
# Prints one order's receipt line. Formatting is written here, not shared
# with summary.sh or csv_export.sh (ADR 0002).
set -euo pipefail
cents=$1
printf 'Receipt total: %d.%02d\n' $((cents / 100)) $((cents % 100))
