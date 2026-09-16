#!/usr/bin/env bash
set -euo pipefail
cp -R "$(dirname "${BASH_SOURCE[0]}")/fixture/." .

# src/billing carries the missing-seam note of bugfix #0004; src/reports has
# none. Unlike the shared default, src/reports is rebalanced here to change
# more often than src/billing (33 commits vs 30), so this case proves the
# missing-seam override: a scan that only sorted by commit frequency would
# rank src/reports first, not src/billing.
source "$(dirname "${BASH_SOURCE[0]}")/../_fixtures/hot-spot-history.sh" 12 10 8 13 11 9
