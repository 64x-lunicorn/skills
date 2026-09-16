#!/usr/bin/env bash
# Copies the case's project state into the run workspace. No git history is
# needed: this is a design discussion, not a change.
set -euo pipefail
cp -R "$(dirname "${BASH_SOURCE[0]}")/fixture/." .
