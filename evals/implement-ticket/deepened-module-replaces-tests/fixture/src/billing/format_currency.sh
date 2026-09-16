#!/usr/bin/env bash
# format_currency tenth_cents
#
# Formats an amount given in tenth-cents, rounding half a cent up.
format_currency() {
  tenths=$1
  cents=$(( (tenths + 5) / 10 ))
  printf '%d.%02d\n' $((cents / 100)) $((cents % 100))
}
