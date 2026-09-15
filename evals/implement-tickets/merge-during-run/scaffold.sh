#!/usr/bin/env bash
# Copies the case's project state into the run workspace and builds its git history:
# main carries the squash commit of ticket #0004; ticket/5-missing-name
# is behind main without merge conflicts, and ticket/6-greet-several-names is up to
# date with it. A post-commit and post-merge hook stands in for Daniel merging a pull request
# while the run goes on: the first commit or merge on a ticket branch moves main one commit ahead,
# locally and on origin,
# which puts ticket/6-greet-several-names behind during the run.
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
git symbolic-ref HEAD refs/heads/main
printf 'origin.git/\n' >> .git/info/exclude
commit 0 -m "feat: greet a name"

git checkout -q -b ticket/5-missing-name
cat > src/greet.sh <<'SH'
greet() {
  word=Hello
  name=$1
  printf '%s, %s\n' "$word" "${name:-stranger}"
}
SH
cat > tests/default-name.test.sh <<'SH'
#!/bin/sh
# Scenario: A missing name is greeted as stranger
set -e
. ./src/greet.sh
actual=$(unset GREETING; greet)
[ "$actual" = "Hello, stranger" ] || { echo "expected 'Hello, stranger', got '$actual'"; exit 1; }
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
set -e
. ./src/greet.sh
actual=$(GREETING=Hi greet Ada)
[ "$actual" = "Hi, Ada" ] || { echo "expected 'Hi, Ada', got '$actual'"; exit 1; }
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
set -e
. ./src/greet.sh
actual=$(unset GREETING; greet Ada Grace)
expected=$(printf 'Hello, Ada\nHello, Grace')
[ "$actual" = "$expected" ] || { echo "expected '$expected', got '$actual'"; exit 1; }
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

# post-commit fires on git commit, post-merge on a one-step git merge; the hook moves main
# only while main is not yet the merged commit, so it fires at most once.
cat > .git/hooks/post-commit <<'SH'
#!/bin/sh
case "$(git symbolic-ref --short -q HEAD)" in
  ticket/*)
    merged=$(git rev-parse refs/fixture/merged-during-run)
    if [ "$(git rev-parse refs/heads/main)" != "$merged" ] &&
      git merge-base --is-ancestor refs/heads/main "$merged"; then
      git update-ref refs/heads/main "$merged"
      git --git-dir="$(git config remote.origin.url)" update-ref refs/heads/main "$merged"
    fi
    ;;
esac
SH
cp .git/hooks/post-commit .git/hooks/post-merge
chmod +x .git/hooks/post-commit .git/hooks/post-merge

git init -q --bare origin.git
git remote add origin "$PWD/origin.git"
# The merged pull request's commit goes to origin too, so the hook can move main there.
git push -q origin main ticket/5-missing-name ticket/6-greet-several-names refs/fixture/merged-during-run
git checkout -q main

# The graders pin these commit ids; a fixture edit that changes them must fail here, not look like missing behaviour.
[ "$(git rev-parse refs/fixture/merged-during-run)" = c6cf142792815673981e66cdae6098142f5850e2 ] || { echo "fixture drifted: refs/fixture/merged-during-run"; exit 1; }
[ "$(git rev-parse ticket/6-greet-several-names)" = 260f6361767eb4a420243ab5918cc8369218efbc ] || { echo "fixture drifted: ticket/6-greet-several-names"; exit 1; }
