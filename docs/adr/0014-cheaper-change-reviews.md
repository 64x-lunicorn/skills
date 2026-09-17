# 0014 — Cheaper change reviews

Status: superseded by [0015](0015-one-review-per-ticket.md), 2026-09-17. Extends [0008](0008-implementing-tickets.md) and [0013](0013-merge-default-branch-into-ticket-branches.md).

## Context

ADR 0008 runs `review-change` on a spec and a standards axis in separate fresh runs, and both again after every fix round; ADR 0013 and Spec #24 add both reviews after every update. Daniel: "review-changes läuft selbst für mini änderungen viel zu lange und ist zu teuer! Der gesamte Implementflow ist so nicht nutzbar!" On 2026-09-17, 149 review runs since 2026-09-14 were measured from the session transcripts. Ticket #89, one README file with 43 insertions and 29 deletions, took six reviews, 68 minutes and about 23M context tokens, against 4 minutes of implementation. Every review ran `ci.command` again, fetched the ticket, Spec and architecture issue again (about 43 KB for #89), and read files outside the diff without a limit; cost grows with turns times context. Re-reviews the orchestrator narrowed to the fix commits on ticket #38 took 1 to 2 minutes instead of 7 to 14.

## Decision

- **One context directory per ticket.** `implement-tickets` fetches the ticket, Spec and architecture issue once into `ticket.md`, `spec.md` and `architecture.md`, runs `ci.command` into `ci.log`, and hands the directory to every review. A review with the directory fetches nothing and runs no checks. The standards axis alone reads the ticket only.
- **Small diffs in one run.** With at most 150 changed lines, one `review-change` run covers the axis `both`; above that the two axes stay separate runs.
- **Re-reviews see only the fix.** After a fix round, only the axis that reported the hard findings runs again, against the commit the previous review saw, checking the fix commits against `findings.md`.
- **A tool-call budget.** 20 tool calls per axis, 30 on `both`, 10 on a re-review; what is left unchecked is named `not checked` and shown to Daniel.
- **No review after a conflict-free update.** After an update, reviews run only when the merge resolved files; otherwise the scenario tests and `ci.command` cover the combination. This departs from Spec #24's rule that every updated branch passes both reviews again, which stays for Daniel to change.

## Consequences

- A small ticket costs one review run plus short re-reviews instead of two full runs per round.
- `ci.command` runs once per review round instead of once per review, and the pull request step reuses a `ci.log` at the same commit.
- A change of up to 150 lines no longer gets an axis-separated review, so one axis can mask the other there.
- A review that runs out of budget leaves files unchecked; Daniel sees them named instead of the review running on.
- A clean update merge reaches the pull request without any review of the combined code.
- Spec #24 and its eval case `reviews-and-gate-again` still expect both reviews after every update until the Spec is changed.

## Alternatives

- **A cheaper model for reviews:** the measured Sonnet reviews took more turns (25 to 66) than the Opus reviews (7 to 17), on different tickets, so nothing showed the cost falling with the model.
- **Keeping full fresh re-reviews:** re-review unchanged code at full price and find the same things again.
- **Separate axes at every size:** doubles the reading of the same sources for changes too small for one axis to mask the other.
