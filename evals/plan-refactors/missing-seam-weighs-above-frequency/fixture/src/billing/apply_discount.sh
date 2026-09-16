#!/usr/bin/env bash
# apply_discount total_cents code
#
# Looks up a discount code, applies its percentage-off or fixed-off rule,
# enforces the code's minimum order value, and leaves the total unchanged for
# an unknown or empty code. Every command that prices an order calls this, so
# a discount rule change happens in one place.
apply_discount() {
  total_cents=$1
  code=${2:-}
  case "$code" in
    "") printf '%s\n' "$total_cents" ;;
    WELCOME10)
      if [ "$total_cents" -lt 2000 ]; then printf '%s\n' "$total_cents"; return; fi
      printf '%s\n' $((total_cents - total_cents / 10)) ;;
    FLAT5)
      if [ "$total_cents" -lt 500 ]; then printf '%s\n' "$total_cents"; return; fi
      printf '%s\n' $((total_cents - 500)) ;;
    *) printf '%s\n' "$total_cents" ;;
  esac
}
