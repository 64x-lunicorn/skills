#!/usr/bin/env bash
# Copies the case's project state into the run workspace. No git history is
# needed: triage only edits the bugfix issue file.
set -euo pipefail
cp -R "$(dirname "${BASH_SOURCE[0]}")/fixture/." .
