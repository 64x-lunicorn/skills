#!/bin/sh
# The project's checks: every test script under tests/ must pass.
set -e
for test in tests/*.test.sh; do
  sh "$test"
done
# Reached only when every test passed. While a merge is open, MERGE_HEAD exists; once none of its files is
# still unmerged, a passing run leaves one line in the git directory, outside the working tree, so checks
# that passed on the resolved merge before its commit can be told apart.
git_dir=$(git rev-parse --git-dir 2>/dev/null) || git_dir=
if [ -n "$git_dir" ] && [ -f "$git_dir/MERGE_HEAD" ] && [ -z "$(git diff --name-only --diff-filter=U)" ]; then
  echo "checks passed on the resolved open merge of $(cat "$git_dir/MERGE_HEAD")" >> "$git_dir/64x-merge-checks.log"
fi
echo "All checks passed."
