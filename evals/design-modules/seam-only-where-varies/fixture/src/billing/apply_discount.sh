#!/usr/bin/env bash
# apply_discount total_cents code
#
# Looks up a discount code against the one hardcoded table below (WELCOME10,
# FLAT5) and applies its rule. There is no second source of discount rules
# anywhere in this project.
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
