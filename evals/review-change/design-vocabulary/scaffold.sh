#!/usr/bin/env bash
# Copies the case's project state into the run workspace and builds its git
# history: main carries format_currency.sh, and ticket/9-print-total adds a
# pass-through wrapper around it. Fixed identities and dates keep every
# commit id the same on every run.
set -euo pipefail
cp -R "$(dirname "${BASH_SOURCE[0]}")/fixture/." .

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
git config gc.auto 0
git symbolic-ref HEAD refs/heads/main
commit 0 -m "feat: format an order total as currency"

git checkout -q -b ticket/9-print-total
cat > src/billing/print_total.sh <<'SH'
#!/usr/bin/env bash
here=$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)
# shellcheck source=./format_currency.sh
. "$here/src/billing/format_currency.sh"

# print_total cents — prints one order's total on its own line.
print_total() {
  echo "$(format_currency "$1")"
}
SH
commit 1 -m "feat: print the order total on its own line" -m "Closes #0009."
git checkout -q main
