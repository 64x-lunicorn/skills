#!/usr/bin/env bash
# Usage: checkout.sh <price_cents>... [-- <discount_code>]
set -euo pipefail
here=$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)
# shellcheck source=../billing/totals.sh
. "$here/src/billing/totals.sh"
# shellcheck source=../billing/apply_discount.sh
. "$here/src/billing/apply_discount.sh"
# shellcheck source=../billing/format_currency.sh
. "$here/src/billing/format_currency.sh"

code=""
prices=()
after_dashdash=0
for arg in "$@"; do
  if [ "$arg" = "--" ]; then after_dashdash=1; continue; fi
  if [ "$after_dashdash" = 1 ]; then code=$arg; else prices+=("$arg"); fi
done

total=$(order_total "${prices[@]}")
total=$(apply_discount "$total" "$code")
echo "Total: $(format_currency "$total")"
