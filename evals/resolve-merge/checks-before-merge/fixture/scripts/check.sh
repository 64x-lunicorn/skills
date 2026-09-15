#!/bin/sh
# The project's checks: every test script under tests/ must pass.
set -e
for test in tests/*.test.sh; do
  sh "$test"
done
git_dir=$(git rev-parse --git-dir 2>/dev/null) || git_dir=
if [ -n "$git_dir" ] && [ -f "$git_dir/MERGE_HEAD" ] && [ -z "$(git diff --name-only --diff-filter=U)" ]; then
  echo "passed $(cat "$git_dir/MERGE_HEAD")" >> "$git_dir/check-runs.log"
fi
echo "All checks passed."
