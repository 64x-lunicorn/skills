# 0006 — Specs describe domain behaviour

Status: accepted, 2026-09-14.

## Context

ADR 0005 made a Spec issue the result of promoting a research object. Daniel wants Specs from conversations too, and wants every Spec to follow one fixed format before tickets are cut from it. His rules:

- A Spec is never implemented. It always describes domain behaviour and a functional change to be built.
- A Spec has a Mermaid flow diagram of the domain whenever possible.
- Acceptance criteria are written in Gherkin.
- A Spec is split into many small tickets for agents by a separate step.

This is a gap Daniel named explicitly, so it passes the harvest gate (ADR 0004).

## Decision

**Skills**, split like `harvest-skill` and `write-skill`:

- **`design-spec`** (model-invoked, `skills/engineering/`) holds the Spec template and the discipline: domain only, technical notes sorted out, a Mermaid domain flow or an explicit `No flow: <reason>`, Gherkin acceptance criteria. The template lives in its `references/spec-template.md`; there is exactly one.
- **`write-spec`** (user-invoked) creates a Spec from a conversation after light gates: problem in one sentence, "do nothing" considered, open questions resolved or accepted, explicit go before the issue is created.
- **`promote-research`** keeps its gates and freezing, and drafts through `design-spec`.

`write-spec` is user-invoked because creating a Spec orchestrates gates and publishes an issue, and must never fire in the middle of a research discussion.

**Template sections:** not-implementable note, Goal, Problem, Domain flow, Behaviour change, Domain rules, Terms, Decisions, Non-goals, Acceptance criteria, Open questions and risks, Origin. The Tasks checklist from ADR 0005 is dropped: tickets are attached as sub-issues instead.

## Splitting a Spec (`plan-tickets`)

Recorded here so the Spec format serves it; realised in [ADR 0007](0007-splitting-specs-into-tickets.md).

- Every ticket is attached to the Spec as a sub-issue.
- An **architecture issue** with Mermaid diagrams. Once the tickets exist and are agreed with Daniel, an architecture review agent reviews the best approach and implementation order, and records them there.
- A **wayfinder issue**, carrying its own label, keeps the tickets worked in the right order.
- An **integration test issue** automates integration tests, built from the Spec's Gherkin scenarios.
- Technical notes that `design-spec` sorted out of the Spec are input for the architecture issue.

## Consequences

- Specs from research and from conversations look the same.
- A Spec reads as requirements, not as a work order, so agents cannot pick it up as a task.
- Acceptance criteria are ready to become integration tests.
- Mermaid syntax errors only show when the issue renders; the skill names the common traps, but no gate checks them yet.

## Alternatives

- **`write-spec` model-invoked, shared with `promote-research`**: one skill, but it could fire on its own and create a Spec nobody asked for.
- **Two copies of the template**: no shared skill needed, but the copies drift.
- **Conversations always through a research object first**: heavy for changes that are already clear.
