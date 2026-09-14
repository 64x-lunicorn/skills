# 0008 — Implementing tickets

Status: accepted, 2026-09-14. Resolves "Implementation" from ADR 0007.

## Context

`plan-tickets` produces tickets, an architecture issue and a wayfinder (ADR 0007), but nothing builds the tickets. Daniel wants a skill that takes one or many tickets and implements them, based on the implement skills of `mattpocock/skills`, but tightened to minimise drift, code smells, duplication and deviation from the Spec. His principle: move slower but safely, "slow is steady, steady is fast".

The upstream `implement`, `tdd`, `code-review` and `implement-spec` skills were read on 2026-09-14. What they get right: implementation never reopens the plan; tests sit at public seams, mocks only at system boundaries; vertical red-green cycles; expected values from an independent source; review on a spec and a standards axis in separate subagents, with a Fowler smell baseline.

Where their own documentation names the gaps: ticket references resolve fail-open; nothing actually agrees the seams; refactoring is outside the loop; review runs before the commit and sees an empty diff, inside the context that wrote the code; findings are not acted on; tickets stay open, so blocked work never becomes unblocked; parallel sessions in one checkout corrupt each other's git state; the plan is trusted without checks.

Per ADR 0004 the ideas are adopted and the text is written anew; no file is copied.

## Decision

**Skills**, along the layering:

- **`implement-tickets`** (user-invoked) orchestrates: reconcile the wayfinder, choose tickets, implement, review, open the pull request, report.
- **`implement-ticket`** (model-invoked, forked `general-purpose` subagent) builds one ticket in a fresh context: checks, reuse inventory, branch, activate pending scenarios, test-first build, refactor under green, full CI command, commit, report. A fix mode applies review or CI findings.
- **`review-change`** (model-invoked, forked `Plan` subagent) reviews one axis per run and returns hard and judgement findings without changing anything. It replaces `mattpocock-skills:code-review`.
- **`write-tests`** (model-invoked) holds the test-first discipline. It replaces `mattpocock-skills:tdd`.

**Tightened against the upstream gaps:**

| Gap | Rule |
|---|---|
| Fail-open ticket reference | Tickets are checked for label, state and blockers and read back to Daniel before the run |
| Unagreed seams | Seams come from the ticket's implementation notes; without them the implementer stops |
| Duplication | A reuse inventory before the first test; the standards review searches the whole codebase |
| Smells left behind | A refactor step under green tests inside every ticket |
| Scope and spec drift | Diff checked against the implementation notes after every green; any contradiction or unplanned dependency is a stop, never a reinterpretation |
| Self-biased, empty review | Review after the commit, against the merge-base, in fresh subagents per axis |
| Findings ignored | Hard findings fixed and re-reviewed, at most two rounds; judgement findings decided by Daniel; conflicts between sources never fixed, only decided by Daniel |
| Gaps in the plan | A Spec domain rule the ticket's seam must decide without any scenario, or a rule with two readings, stops the implementer before code is written |
| Tickets never closed | One pull request per ticket with `Closes #n`; the next run checks merged tickets off in the wayfinder |
| Parallel sessions collide | Tickets run one after another; dependent tickets wait until Daniel merges their blocker |
| Tests only | The full `ci.command` runs before committing and again before the pull request |

**Stops are reported, not worked around.** A stop is shown to Daniel and posted on the wayfinder; the ticket stays untouched until he decides.

**Merging stays with Daniel.** The skill never merges and never enables auto-merge.

## Verification

On 2026-09-14 the skills were run against throwaway sandbox repos with local issue files. `review-change` found planted duplication and scope creep on the correct axes, and classed a decision that made a scenario unreachable as a conflict. `implement-ticket` built a ticket test-first while reusing the helper its architecture decision named, and in a second run stopped on a domain rule no scenario covered. The ambiguities those runs reported were fixed before the skills shipped. The fork mechanism itself (`context: fork`, `$ARGUMENTS`) is verified against the Claude Code docs, not by a run.

## Consequences

- Each ticket costs an implementer run and at least two review runs, more with fix rounds. Throughput is traded for fewer defects and less rework, on purpose.
- Tickets without recorded architecture review cannot be implemented; `plan-tickets` has to be complete first.
- `mattpocock-skills:tdd` and `mattpocock-skills:code-review` can be uninstalled once these skills ship.

## Alternatives

- **Parallel worktrees per phase**: faster, but several reviews at once and git state shared across worktrees (the stash); rejected for now in favour of steady progress.
- **One branch and one pull request for all tickets** (upstream `implement-spec`): convenient, but large pull requests are where drift hides.
- **Implement in the main session**: direct questions to Daniel, but context grows with every ticket and carries assumptions from one ticket into the next.
- **Fix every finding automatically**: removes Daniel from judgement calls about design, which are his.
