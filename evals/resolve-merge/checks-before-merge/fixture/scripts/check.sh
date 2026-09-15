#!/bin/sh
# The project's checks: every test script under tests/ must pass.
set -e
# While a merge is open, MERGE_HEAD exists; each check run on it leaves one line in the
# git directory, outside the working tree, so a run on the merge before its commit can be told apart.
git_dir=$(git rev-parse --git-dir 2>/dev/null) || git_dir=
if [ -n "$git_dir" ] && [ -f "$git_dir/MERGE_HEAD" ]; then
  echo "checks ran on the open merge of $(cat "$git_dir/MERGE_HEAD")" >> "$git_dir/64x-merge-checks.log"
fi
for test in tests/*.test.sh; do
  sh "$test"
done
echo "All checks passed."
