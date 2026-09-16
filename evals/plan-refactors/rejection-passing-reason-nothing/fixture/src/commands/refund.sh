#!/usr/bin/env bash
# Usage: refund.sh <charged_cents>
set -euo pipefail
here=$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)
# shellcheck source=../billing/format_currency.sh
. "$here/src/billing/format_currency.sh"

echo "Refunded: $(format_currency "$1")"
