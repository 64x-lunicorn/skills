# 0015 — One review per ticket

Status: accepted, 2026-09-17. Supersedes [0014](0014-cheaper-change-reviews.md). Changes [0008](0008-implementing-tickets.md) and [0013](0013-merge-default-branch-into-ticket-branches.md).

## Context

ADR 0014 cut review cost with a context directory, a 150-line threshold for one combined run, narrowed re-reviews and budgets per mode. It kept the loop of reviews and fix rounds and added mechanism to make it cheaper. Daniel: "Wichtig war auch KISS! und wir verbrennen hier wirklich unfassbar viel geld!" The measurement behind 0014 stays: ticket #89, one README file, took six reviews, 68 minutes and about 23M context tokens against 4 minutes of implementation.

## Decision

- **One `review-change` run per ticket** checks scenarios, Spec, architecture decisions and scope as well as standards, duplication, smells and tests. There are no axes as separate runs.
- **The review runs no tests or checks.** `implement-ticket` ends every run with `ci.command` green, and the gate runs it again on the pull request.
- **One fix run, no re-review.** Hard findings and the judgement findings Daniel accepted go to one `implement-ticket` fix run; Daniel reviews the pull request.
- **A budget of 20 tool calls** per review; unchecked files are named `not checked` and shown to Daniel.
- **No review after an update.** An updated branch passes the gate again; Spec #24 was changed to match.

## Consequences

- A ticket costs one implementer run, one review and at most one fix run.
- One axis can mask the other in a single run.
- A fix is proven by `ci.command` and Daniel's pull request review, not by a second agent review.
- A resolved merge conflict reaches the pull request without an agent review.

## Alternatives

- **ADR 0014's mechanism:** cheaper than before, but a context directory, a threshold, a re-review mode and per-mode budgets are more to maintain and still loop.
- **Separate runs per axis:** doubles the reading of the same sources for every ticket.
- **Reviews after every update:** the merge adds no ticket behaviour, so they paid for the same findings again.
