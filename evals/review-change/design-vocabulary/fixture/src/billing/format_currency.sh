#!/usr/bin/env bash
# format_currency cents
format_currency() {
  printf '%d.%02d\n' $(($1 / 100)) $(($1 % 100))
}
