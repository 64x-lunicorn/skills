#!/bin/sh
# Scenario: A price in cents renders with a dollar sign and two decimals
set -e
. ./src/render.sh
actual=$(render_price 1099)
[ "$actual" = '$10.99' ] || { echo "expected '\$10.99', got '$actual'"; exit 1; }
