#!/bin/sh
# The project's checks: every test script under tests/ must pass.
set -e
for test in tests/*.test.sh; do
  sh "$test"
done
echo "All checks passed."
