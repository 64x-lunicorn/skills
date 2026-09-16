#!/usr/bin/env bash
# Copies the case's project state into the run workspace and builds its git history:
# main carries the squash commit of ticket #0004; ticket/5-missing-name
# is behind main without merge conflicts, and ticket/6-greet-several-names is up to
# date with it. An untracked script that scripts/check.sh calls stands in for Daniel merging
# a pull request while the run goes on (case.yaml explains why it is not a git hook).
# Fixed identities and dates keep every commit id the same on every run.
set -euo pipefail
cp -R "$(dirname "${BASH_SOURCE[0]}")/fixture/." .

# No global or system git config, so signing or hooks on the machine cannot change a commit id.
export GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_NOSYSTEM=1
export GIT_AUTHOR_NAME=Fixture GIT_AUTHOR_EMAIL=fixture@example.invalid
export GIT_COMMITTER_NAME=Fixture GIT_COMMITTER_EMAIL=fixture@example.invalid
commit() {
  export GIT_AUTHOR_DATE="2026-09-01T10:0$1:00Z" GIT_COMMITTER_DATE="2026-09-01T10:0$1:00Z"
  shift
  git add -A
  git commit -q "$@"
}

git init -q
# The graders read ref and reflog files, so packing is off in every repository they read.
git config gc.auto 0
git symbolic-ref HEAD refs/heads/main
printf 'origin.git/\n' >> .git/info/exclude
commit 0 -m "feat: greet a name"

git checkout -q -b ticket/5-missing-name
# The default stays in the printf line: main changes word= just above name=, so writing it
# as name=${1:-stranger} would put both sides' changes on adjacent lines and the merge would conflict.
cat > src/greet.sh <<'SH'
greet() {
  word=Hello
  name=$1
  printf '%s, %s\n' "$word" "${name:-stranger}"
}
SH
cat > tests/missing-name.test.sh <<'SH'
#!/bin/sh
# Scenario: A missing name is greeted as stranger
. ./tests/expect-greeting.sh
unset GREETING
expect_greeting 'Hello, stranger'
SH
commit 1 -m "feat: greet a missing name as stranger" -m "Refs #0005."

git checkout -q main
cat > src/greet.sh <<'SH'
greet() {
  word=${GREETING:-Hello}
  name=$1
  printf '%s, %s\n' "$word" "$name"
}
SH
cat > tests/greeting-word.test.sh <<'SH'
#!/bin/sh
# Scenario: The greeting word comes from GREETING
. ./tests/expect-greeting.sh
GREETING=Hi
expect_greeting 'Hi, Ada' Ada
SH
commit 2 -m "feat: take the greeting word from GREETING" -m "Closes #0004."

git checkout -q -b ticket/6-greet-several-names
cat > src/greet.sh <<'SH'
greet() {
  word=${GREETING:-Hello}
  for name in "$@"; do
    printf '%s, %s\n' "$word" "$name"
  done
}
SH
cat > tests/several-names.test.sh <<'SH'
#!/bin/sh
# Scenario: Several names are greeted one per line
. ./tests/expect-greeting.sh
unset GREETING
expect_greeting "$(printf 'Hello, Ada\nHello, Grace')" Ada Grace
SH
commit 3 -m "feat: greet several names one per line" -m "Refs #0006."

# The pull request Daniel merges during the run, held on a ref outside refs/heads.
git checkout -q --detach main
cat > README.md <<'MD'
# greet

Source `src/greet.sh` and call `greet <name>`.
MD
commit 4 -m "docs: describe how to call greet"
git update-ref refs/fixture/merged-during-run HEAD
git checkout -q main

# The stand-in merge, untracked under .git/ so no review reads it as project code. On a ticket
# branch that holds an open merge or already contains main, it moves main locally and on origin
# to the merged commit, only while main is not yet that commit and is its ancestor, so at most once.
cat > .git/pre-check.sh <<'SH'
#!/bin/sh
case "$(git symbolic-ref --short -q HEAD)" in
  ticket/*) ;;
  *) exit 0 ;;
esac
merged=$(git rev-parse refs/fixture/merged-during-run)
main=$(git rev-parse refs/heads/main)
[ "$main" != "$merged" ] && git merge-base --is-ancestor "$main" "$merged" || exit 0
if git rev-parse -q --verify MERGE_HEAD >/dev/null || git merge-base --is-ancestor "$main" HEAD; then
  git update-ref refs/heads/main "$merged"
  git --git-dir="$(git config remote.origin.url)" update-ref refs/heads/main "$merged"
fi
SH

git init -q --bare origin.git
git -C origin.git config gc.auto 0
git remote add origin "$PWD/origin.git"
# The merged pull request's commit goes to origin too, so the stand-in merge can move main there.
git push -q origin main ticket/5-missing-name ticket/6-greet-several-names refs/fixture/merged-during-run

# The graders pin these commit ids; a fixture edit that changes them must fail here, not look like missing behaviour.
[ "$(git rev-parse refs/fixture/merged-during-run)" = 055b0da465f70ad41320714ae5923ded785242a4 ] || { echo "fixture drifted: refs/fixture/merged-during-run"; exit 1; }
[ "$(git rev-parse ticket/6-greet-several-names)" = 05f776a14529d80ee44bcc0b1e1a8a10020b6877 ] || { echo "fixture drifted: ticket/6-greet-several-names"; exit 1; }
