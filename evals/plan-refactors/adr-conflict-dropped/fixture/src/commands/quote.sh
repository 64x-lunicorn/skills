#!/usr/bin/env bash
# Usage: quote.sh <price_cents>...
set -euo pipefail
here=$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)
# shellcheck source=../billing/totals.sh
. "$here/src/billing/totals.sh"
# shellcheck source=../billing/format_currency.sh
. "$here/src/billing/format_currency.sh"

echo "Quote: $(format_currency "$(order_total "$@")")"
