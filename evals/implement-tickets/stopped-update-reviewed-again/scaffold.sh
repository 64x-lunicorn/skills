#!/usr/bin/env bash
# Copies the case's project state into the run workspace and builds its git history: main
# carries the squash commit of ticket #0004, and ticket/5-missing-name already carries a merge
# commit that brought main's tip in, the way an earlier implement-tickets run's update left it
# after resolve-merge combined both sides' changes on their own lines of src/greet.sh. The
# branch is therefore no longer behind or conflicting. The wayfinder still lists #0005
# unchecked and keeps an open `Update stop for #0005` entry from that earlier run's stop after
# the merge (a red ci.command on the push), so this run's widened detection, not git, is what
# keeps the branch among this run's hits. Fixed identities and dates keep every commit id the
# same on every run.
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

# The earlier run's update: resolve-merge merged main into ticket/5-missing-name cleanly,
# combining both sides' changes, and recorded it, the same shape as its own commit message.
git checkout -q ticket/5-missing-name
export GIT_AUTHOR_DATE="2026-09-02T09:00:00Z" GIT_COMMITTER_DATE="2026-09-02T09:00:00Z"
if ! git merge -q --no-ff main \
    -m "chore: merge main into ticket/5-missing-name" \
    -m "Kept from ticket/5-missing-name: greet a missing name as stranger (#0005). Kept from main: the greeting word from GREETING (#0004)."; then
  echo "fixture drifted: the merge of main into ticket/5-missing-name has conflicts"
  exit 1
fi
git rev-parse -q --verify MERGE_HEAD >/dev/null 2>&1 && { echo "fixture drifted: the merge is still open"; exit 1; }
git merge-base --is-ancestor main ticket/5-missing-name || { echo "fixture drifted: the branch is still behind main"; exit 1; }

git init -q --bare origin.git
git remote add origin "$PWD/origin.git"
git push -q origin main ticket/5-missing-name
