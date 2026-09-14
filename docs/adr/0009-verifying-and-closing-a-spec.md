# 0009 — Verifying and closing a Spec

Status: accepted, 2026-09-14.

## Context

`implement-tickets` reviews every ticket on its own (ADR 0008). What only shows once all tickets are merged has no check: the same helper built by two tickets, a decision followed in one ticket and dropped in another, a domain rule enforced on one path and missing on another, a pending marker or an advisory integration test check the integration test ticket left behind. Nothing closes the Spec, its architecture issue and its wayfinder either, so finished work looks unfinished.

Daniel named the gap on 2026-09-14 and decided that closing happens automatically inside `implement-tickets`, not through another command.

## Decision

- **`verify-spec`** (model-invoked, forked `Plan` subagent) verifies one Spec whose tickets are all checked off. It checks completeness, runs `ci.command` on the default branch, checks every scenario and domain rule against the code, looks across all ticket changes for duplication, departures from architecture decisions and leftovers, and returns hard, judgement and conflict findings plus a closing summary. It changes nothing.
- **`implement-tickets` step 2** invokes it whenever the wayfinder is fully checked off.
  - Work found becomes follow-up tickets, cut with `design-ticket` after Daniel's go, attached to the Spec and added to the wayfinder as `Verification follow-ups`. The next complete wayfinder is verified again.
  - A conflict keeps the Spec open until Daniel decides.
  - Without open findings, and on Daniel's go, the Spec, the architecture issue and the wayfinder are closed, with the summary on the Spec.
- **Follow-up tickets skip `review-architecture`.** A finding already names its location and the decision it concerns, which is what implementation notes hold.
- **An advisory integration test check is a hard finding once no scenario is pending.** It protected nothing while scenarios were pending, and it protects nothing afterwards either unless it becomes required.

## Verification

On 2026-09-14 `verify-spec` was run twice against a sandbox repo with local issue files: a Spec with two domain rules, a non-goal, two architecture decisions and three closed tickets, all checked off in the wayfinder. Planted across the tickets were a scenario test still marked pending, an integration test check left advisory, and a refund preview that rebuilt the fee rule, rounded inline instead of through the decided helper, and exempted VIP customers against the non-goal. Both runs found all four as hard findings; the first also surfaced an unrounded refund and the unused preview. The ambiguities the runs reported were fixed before the skill shipped.

## Consequences

- A Spec is closed only when it is proven as a whole, not when its last pull request merges.
- Every completed Spec costs one more subagent run, and another after follow-ups.
- The flow from Spec to closed Spec needs no command beyond `plan-tickets` and `implement-tickets`.

## Alternatives

- **Own user-invoked command**: one more step Daniel has to remember; rejected by Daniel.
- **Close the Spec when the last ticket merges**: leaves cross-ticket duplication and leftovers undetected.
- **Fix findings inside the verification**: the verifier would review its own fixes, and follow-ups would bypass the per-ticket reviews.
