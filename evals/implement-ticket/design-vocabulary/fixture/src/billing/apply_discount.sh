#!/usr/bin/env bash
# apply_discount total_cents code
#
# Looks up a discount code and applies its rule; leaves the total unchanged
# for an unknown or empty code.
apply_discount() {
  total_cents=$1
  code=${2:-}
  case "$code" in
    "") printf '%s\n' "$total_cents" ;;
    WELCOME10)
      printf '%s\n' $((total_cents - total_cents / 10)) ;;
    FLAT5)
      printf '%s\n' $((total_cents - 500)) ;;
    *) printf '%s\n' "$total_cents" ;;
  esac
}
