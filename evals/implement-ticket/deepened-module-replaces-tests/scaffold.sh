#!/usr/bin/env bash
# Copies the case's project state into the run workspace and commits it on
# main, so implement-ticket can branch from a clean, committed tree.
set -euo pipefail
cp -R "$(dirname "${BASH_SOURCE[0]}")/fixture/." .

export GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_NOSYSTEM=1
export GIT_AUTHOR_NAME=Fixture GIT_AUTHOR_EMAIL=fixture@example.invalid
export GIT_COMMITTER_NAME=Fixture GIT_COMMITTER_EMAIL=fixture@example.invalid
export GIT_AUTHOR_DATE="2026-09-01T10:00:00Z" GIT_COMMITTER_DATE="2026-09-01T10:00:00Z"

git init -q
git config gc.auto 0
git symbolic-ref HEAD refs/heads/main
git add -A
git commit -q -m "feat: format a currency amount, rounding half a cent up"
