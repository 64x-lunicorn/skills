#!/usr/bin/env bash
# Copies the case's project state into the run workspace and builds a git
# history with two hot spots by commit count: src/billing (carries the
# missing-seam note of bugfix #0004) and src/reports (changed just as often,
# no missing-seam note). Fixed identities and dates keep the history, and so
# the hot-spot ranking, the same on every run.
set -euo pipefail
cp -R "$(dirname "${BASH_SOURCE[0]}")/fixture/." .

# No global or system git config, so signing or hooks on the machine cannot
# change what this scaffold produces.
export GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_NOSYSTEM=1
export GIT_AUTHOR_NAME=Fixture GIT_AUTHOR_EMAIL=fixture@example.invalid
export GIT_COMMITTER_NAME=Fixture GIT_COMMITTER_EMAIL=fixture@example.invalid

n=0
commit() {
  n=$((n + 1))
  minute=$((n % 60))
  hour=$((8 + n / 60))
  ts=$(printf '2026-06-01T%02d:%02d:00Z' "$hour" "$minute")
  export GIT_AUTHOR_DATE="$ts" GIT_COMMITTER_DATE="$ts"
  git add -A
  git commit -q -m "$1"
}

# Appends a short, real change to $1 so each commit is non-empty and the
# file's own history stays readable.
touch_line() {
  printf '# rev %s: %s\n' "$n" "$2" >> "$1"
}

git init -q
git config gc.auto 0
git symbolic-ref HEAD refs/heads/main
commit "feat: initial tallyup project"

# Hot spot 1: src/billing, the missing-seam area. Bugfix #0004 names
# src/billing/apply_discount.sh as the affected code path.
for i in $(seq 1 12); do touch_line src/billing/apply_discount.sh "discount rule note $i"; commit "refactor(billing): adjust discount handling ($i)"; done
for i in $(seq 1 10); do touch_line src/billing/totals.sh "totals note $i"; commit "refactor(billing): adjust totals ($i)"; done
for i in $(seq 1 8);  do touch_line src/billing/format_currency.sh "formatting note $i"; commit "refactor(billing): adjust currency formatting ($i)"; done

# Hot spot 2: src/reports, changed just as often as src/billing, but no
# bugfix issue names it, so it carries no missing-seam note.
for i in $(seq 1 8); do touch_line src/reports/summary.sh "summary note $i"; commit "refactor(reports): adjust summary ($i)"; done
for i in $(seq 1 7); do touch_line src/reports/receipt.sh "receipt note $i"; commit "refactor(reports): adjust receipt ($i)"; done
for i in $(seq 1 6); do touch_line src/reports/csv_export.sh "csv note $i"; commit "refactor(reports): adjust csv export ($i)"; done

# Noise: a handful of single, unrelated commits so the ten most-changed
# paths are not only src/billing and src/reports files.
touch_line README.md "typo fix"; commit "docs: fix a typo in the README"
touch_line CONTEXT.md "wording"; commit "docs: reword a term"
touch_line docs/adr/README.md "index note"; commit "docs: note the ADR index"
touch_line src/commands/checkout.sh "usage note"; commit "docs: note checkout usage"
touch_line src/commands/refund.sh "usage note"; commit "docs: note refund usage"
touch_line issues/README.md "format note"; commit "docs: note the issue format"
