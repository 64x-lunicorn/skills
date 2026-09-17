#!/usr/bin/env bash
# Copies the reporter's own project and the plugin project's fixture state (.gh/) into the run
# workspace, and makes the workspace a git repository whose remote is the reporter's project,
# not the plugin project.
set -euo pipefail
cp -R "$(dirname "${BASH_SOURCE[0]}")/fixture/." .

# No global or system git config, so signing or hooks on the machine cannot change a commit id.
export GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_NOSYSTEM=1
export GIT_AUTHOR_NAME=Fixture GIT_AUTHOR_EMAIL=fixture@example.invalid
export GIT_COMMITTER_NAME=Fixture GIT_COMMITTER_EMAIL=fixture@example.invalid
export GIT_AUTHOR_DATE="2026-09-01T10:00:00Z" GIT_COMMITTER_DATE="2026-09-01T10:00:00Z"
git init -q
git symbolic-ref HEAD refs/heads/main
git remote add origin https://github.com/acme/shop.git
printf '.gh/\ngh-calls.log\n' >> .git/info/exclude
git add -A
git commit -q -m "feat: list products"

# gh-calls.log is created lazily by the gh shim or the curl stand-in on their first call. Touch
# it so a grader that reads it sees a clean "no match" instead of a thrown error when the agent
# under test never calls either.
touch gh-calls.log
