#!/usr/bin/env bash
# format_currency cents
#
# A thin wrapper around printf; every caller could format the same way
# itself with the same format string.
format_currency() {
  printf '%d.%02d\n' $(($1 / 100)) $(($1 % 100))
}
