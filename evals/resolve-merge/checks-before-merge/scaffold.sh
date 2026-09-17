#!/usr/bin/env bash
# Copies the case's project state into the run workspace and builds its git history:
# main carries the squash commit of ticket #0004, and missing-name-stranger, a branch that
# belongs to no ticket, changes the same line of src/greet.sh, so merging main into it has
# merge conflicts. Fixed identities and dates keep every commit id the same on every run.
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

git checkout -q -b missing-name-stranger
cat > src/greet.sh <<'EOF'
greet() {
  printf 'Hello, %s\n' "${1:-stranger}"
}
EOF
cat > tests/default-name.test.sh <<'EOF'
#!/bin/sh
# Scenario: A missing name is greeted as stranger
set -e
. ./src/greet.sh
actual=$(unset GREETING; greet)
[ "$actual" = "Hello, stranger" ] || { echo "expected 'Hello, stranger', got '$actual'"; exit 1; }
EOF
commit 1 -m "feat: greet a missing name as stranger"

git checkout -q main
cat > src/greet.sh <<'EOF'
greet() {
  printf '%s, %s\n' "${GREETING:-Hello}" "$1"
}
EOF
cat > tests/greeting-word.test.sh <<'EOF'
#!/bin/sh
# Scenario: The greeting word comes from GREETING
set -e
. ./src/greet.sh
actual=$(GREETING=Hi greet Ada)
[ "$actual" = "Hi, Ada" ] || { echo "expected 'Hi, Ada', got '$actual'"; exit 1; }
EOF
commit 2 -m "feat: take the greeting word from GREETING" -m "Closes #0004."

git init -q --bare origin.git
git remote add origin "$PWD/origin.git"
git push -q origin main missing-name-stranger
git checkout -q missing-name-stranger
