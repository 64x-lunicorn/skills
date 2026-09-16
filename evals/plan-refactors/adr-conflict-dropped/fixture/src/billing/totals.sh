#!/usr/bin/env bash
# order_total price_cents...
#
# Sums an order's line items and adds tax at TAX_RATE_BP basis points,
# rounded to the nearest cent.
order_total() {
  sum=0
  for cents in "$@"; do sum=$((sum + cents)); done
  tax=$(((sum * ${TAX_RATE_BP:-750} + 5000) / 10000))
  printf '%s\n' $((sum + tax))
}
