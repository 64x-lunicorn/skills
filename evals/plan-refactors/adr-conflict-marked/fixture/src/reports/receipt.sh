#!/usr/bin/env bash
# Usage: receipt.sh <cents>
# Prints one order's receipt line. Formatting is written here, not shared
# with summary.sh or csv_export.sh (ADR 0002).
#
# 2026-07-08: a refund prints a negative amount, and plain %d.%02d formatting
# of negative cents gave "-1.-50" instead of "-1.50" (bash truncates the
# division toward zero and the remainder keeps its sign). Fixed here only;
# summary.sh and csv_export.sh format the same way and were not checked.
set -euo pipefail
cents=$1
sign=""
if [ "$cents" -lt 0 ]; then sign="-"; cents=$((-cents)); fi
printf "%sReceipt total: %d.%02d\n" "$sign" $((cents / 100)) $((cents % 100))
