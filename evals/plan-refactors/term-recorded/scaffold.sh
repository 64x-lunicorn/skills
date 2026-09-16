#!/usr/bin/env bash
set -euo pipefail
cp -R "$(dirname "${BASH_SOURCE[0]}")/fixture/." .
source "$(dirname "${BASH_SOURCE[0]}")/../_fixtures/hot-spot-history.sh"
