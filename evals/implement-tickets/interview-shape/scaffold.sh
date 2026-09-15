#!/usr/bin/env bash
# Copies the case's project state into the run workspace and commits it,
# so the merged ticket's change is a commit on the default branch.
set -euo pipefail
cp -R "$(dirname "${BASH_SOURCE[0]}")/fixture/." .
git init --quiet --initial-branch=main
git -c user.name=fixture -c user.email=fixture@example.invalid add .
git -c user.name=fixture -c user.email=fixture@example.invalid commit --quiet -m "feat: skip empty lines" -m "Closes #4"
