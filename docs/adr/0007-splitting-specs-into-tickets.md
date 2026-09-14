# 0007 — Splitting Specs into tickets

Status: accepted, 2026-09-14. Realises the plan recorded in ADR 0006.

## Context

A Spec describes domain behaviour and is never implemented directly (ADR 0006). Agents need it cut into small packages, in an order that avoids conflicts and half-done work. Daniel's rules:

- Every ticket is attached to the Spec as a sub-issue.
- An architecture issue with Mermaid diagrams. An architecture review agent reviews the best approach and implementation order once the tickets exist and are agreed with Daniel, and records them there.
- There is always a wayfinder issue, carrying its own label, so the tickets are worked in the right order.
- An integration test ticket automates the integration tests.

This is a gap Daniel named explicitly, so it passes the harvest gate (ADR 0004).

## Decision

**Skills**, along the layering:

- **`plan-tickets`** (user-invoked) orchestrates: pick the Spec, cut with Daniel, create the issues, run the review, record the architecture, create the wayfinder.
- **`design-ticket`** (model-invoked) holds the cut and the ticket template: vertical slices, one pull request each, every Gherkin scenario in exactly one ticket, acceptance criteria copied verbatim.
- **`review-architecture`** (model-invoked) runs in a forked `Plan` subagent and waits for its result. It reads the Spec, the tickets and the codebase and returns a report: proposals, the architecture issue body, dependencies, phases, implementation notes. It writes nothing.

**Order of steps.** Tickets are cut and agreed first, then created, then reviewed. The review proposes ticket changes; Daniel decides each one, and only then are the architecture, the dependencies and the wayfinder recorded.

**Issues.** All created issues are sub-issues of the Spec. Labels: `task` for tickets, `architecture`, `wayfinder`. Dependencies are native "blocked by" relations on GitHub, and `blocked_by` in the frontmatter for local issue files.

**Integration tests first.** The integration test ticket comes first in the order. It writes every scenario as a test tagged pending, which the required CI gate skips, so red tests never block other pull requests. Each feature ticket removes the tag from its scenarios and makes them green.

**Living wayfinder.** Phases with parallel groups, a Mermaid progress graph and an ordered checklist. Agents take the first unchecked ticket whose blockers are closed and check it off after the merge. Changing the order stays Daniel's decision.

**Technical notes persist.** `write-spec` and `promote-research` post the technical notes from `design-spec` as a comment on the Spec, so they reach the architecture issue even when the split happens in a later session.

## Open

- **Other forges.** GitLab and Forgejo have no verified procedure for sub-issues and dependencies; `plan-tickets` stops there and names the gap.
- **Re-planning.** Splitting a Spec that already has sub-issues is not covered yet.
- **Implementation.** Resolved by [ADR 0008](0008-implementing-tickets.md): `implement-tickets` works the frontier of the wayfinder.

## Consequences

- Agents get tickets they can finish in one pull request with a checkable target.
- The order is decided once, reviewed against the codebase, and visible in the tracker itself.
- The review costs a subagent run per split, and again when accepted proposals change the tickets.

## Alternatives

- **Review before the tickets exist**: the review would reason about a cut nobody agreed on, and Daniel asked for the agreed tickets as its input.
- **Review agent edits tickets itself**: faster, but ticket changes are Daniel's decision.
- **Integration tests last**: agents would have no automated target while building.
- **Order only as text in the wayfinder**: GitHub's native relations make blocked tickets visible where agents look.
