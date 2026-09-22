# 0016 — Review after a resumed update stop

Status: accepted, 2026-09-22. Extends [0015](0015-one-review-per-ticket.md). Realises the widened detection of Architecture #34.

## Context

ADR 0015 decided "No review after an update": an updated branch only passes the gate again, because the merge adds no ticket behaviour a review could judge. Ticket #90 (Spec #24) found a gap in that reasoning: a stop after the update's merge commit was recorded — a scenario failing after the merge, a conflict from the review that follows, or a red `ci.command`, before or after the push — takes the branch out of the next run's hits, because git and `gh pr list` no longer report it behind or conflicting once the merge landed. Spec #24 was changed to accept a scenario requiring such a branch to be reviewed and gated again once Daniel has decided on the stop and the ticket is picked back up. Architecture #34 (2026-09-22) decided how: step 1 of `implement-tickets` also counts a ticket a hit when its wayfinder carries an open `Update stop for #<n>` entry.

## Decision

**Step 1 of `implement-tickets` counts a ticket a hit not only when it is behind or has merge conflicts, but also when its wayfinder carries an open `Update stop for #<n>` entry from an earlier update that stopped after its merge commit was recorded.** Once picked back up, `implement-ticket <n> update` invokes `review-change` once on that ticket, the same as a fresh ticket, before the push, and posts `Update stop for #<n> resolved` once review and gate are both green. A plain update — one that was never stopped — still gets no review, unchanged from ADR 0015.

## Consequences

- A ticket resumed after a stopped update costs one more `review-change` run than a plain update, the same as a fresh ticket.
- The merge itself is not redone: `resolve-merge`'s "already up to date" handling and `implement-ticket`'s existing update-mode flow apply unchanged when the merge already succeeded.
- The wayfinder carries an `Update stop for #<n>` / `Update stop for #<n> resolved` marker pair across runs, read by step 1's detection the same way a stop is already posted there.
- ADR 0015's other decisions (one `review-change` run per ticket, no tests inside the review, one fix run, the 20-call budget) are unaffected.

## Alternatives

- **Delay the merge commit until the ticket's scenarios are green:** would keep every stop mid-merge and outside the run's hits, closing the gap without a review exception, but reopens the merge-then-verify order already shipped in #36/#37/#38.
- **Leave the gap as an accepted, unresolved risk:** was the state after #38 (Architecture #34, 2026-09-16: "Risk now, fix via ticket"), but contradicts Spec #24's own accepted scenario "A stopped update passes both reviews and the gate before a new ticket starts".
- **Amend ADR 0015 directly:** an accepted decision is not edited; a new ADR extends it instead, the same pattern ADR 0013 used for ADR 0008.
