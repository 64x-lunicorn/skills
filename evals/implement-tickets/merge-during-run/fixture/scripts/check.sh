#!/bin/sh
# The project's checks: every test script under tests/ must pass.
set -e
[ ! -f "$(git rev-parse --git-common-dir)/pre-check.sh" ] || sh "$(git rev-parse --git-common-dir)/pre-check.sh"
for test in tests/*.test.sh; do
  sh "$test"
done
echo "All checks passed."
