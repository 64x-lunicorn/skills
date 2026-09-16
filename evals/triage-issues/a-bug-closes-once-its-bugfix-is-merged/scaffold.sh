#!/usr/bin/env bash
set -euo pipefail
cp -R "$(dirname "${BASH_SOURCE[0]}")/fixture/." .

# gh-calls.log is created lazily by the gh shim on its first call. Touch it so a grader that
# reads it (regex, source file) sees a clean "no match" instead of a thrown error when the
# agent under test never calls gh.
touch gh-calls.log
