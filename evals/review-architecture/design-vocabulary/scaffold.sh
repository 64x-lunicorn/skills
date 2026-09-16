#!/usr/bin/env bash
# Copies the case's project state into the run workspace. No git history is
# needed: review-architecture reads the issue files and the source tree.
set -euo pipefail
cp -R "$(dirname "${BASH_SOURCE[0]}")/fixture/." .
