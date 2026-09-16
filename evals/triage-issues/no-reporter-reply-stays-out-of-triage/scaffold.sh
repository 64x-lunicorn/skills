#!/usr/bin/env bash
# Copies the case's fixture tracker/marker state into the run workspace.
set -euo pipefail
cp -R "$(dirname "${BASH_SOURCE[0]}")/fixture/." .
