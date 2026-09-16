#!/bin/sh
set -e
. ./src/billing/format_currency.sh

tenths=1050
expected_cents=$(( (tenths + 5) / 10 ))
actual=$(format_currency "$tenths")
expected=$(printf '%d.%02d' $((expected_cents / 100)) $((expected_cents % 100)))
[ "$actual" = "$expected" ] || { echo "expected $expected, got $actual"; exit 1; }
echo ok
