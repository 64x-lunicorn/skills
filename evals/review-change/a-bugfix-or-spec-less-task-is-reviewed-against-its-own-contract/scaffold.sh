#!/usr/bin/env bash
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

git checkout -q -b ticket/3-fix-greeting-comma
cat > src/greet.sh <<'EOF'
greet() {
  word=${GREETING:-Hello}
  name=$1
  printf '%s, %s\n' "$word" "$name"
}
EOF
cat > tests/comma.test.sh <<'EOF'
#!/bin/sh
# Scenario: A name is greeted with a comma after the word
set -e
. ./src/greet.sh
actual=$(greet Ada)
[ "$actual" = "Hello, Ada" ] || { echo "expected 'Hello, Ada', got '$actual'"; exit 1; }
EOF
commit 1 -m "fix: add the comma back after the greeting word" -m "Closes #0003. Bug: #0002."
git checkout -q main
