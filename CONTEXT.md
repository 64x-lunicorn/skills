# Terms

**Skill**: directory `skills/<category>/<name>/` with a `SKILL.md`. The name is also the command `/64x-lunicorn:<name>`.

**Category**: first level under `skills/`, e.g. `engineering` or `orchestration`.

**model-invoked**: the model invokes the skill on its own, triggered by the description.

**user-invoked**: only Daniel invokes the skill, by command. Marked by `disable-model-invocation: true`. Orchestrators are always user-invoked.

**Layering**: user-invoked orchestrates, model-invoked holds the reusable discipline. User-invoked calls model-invoked, never the other way round, never user-invoked to user-invoked.

**Harvest**: a skill only comes into being once the same correction was needed three times, or Daniel names a gap in the repo's process or his development skill set (ADR 0004). Harvested, not invented. `harvest-skill` runs it.

**Inbox**: `inbox.md`, the harvest backlog. Corrections are recorded verbatim with a counter.

**Research object**: directory `research/NNNN-<slug>/` holding one idea, domain or technical. Never implementable; it reaches implementation only by promotion (ADR 0005).

**Research status**: `seed → exploring → concluded → promoted | parked | rejected`. Parked and rejected objects are kept.

**Promotion**: a research object passes the quality gates and becomes an epic or spec. The object is frozen and linked both ways.

**Spec**: an issue labelled `spec` describing domain behaviour and one functional change, with a Mermaid domain flow and Gherkin acceptance criteria. Never implemented directly; the work happens in its sub-issues (ADR 0006).

**Technical notes**: statements about how to build a change that `design-spec` keeps out of a Spec. They are posted as a comment on the Spec and are input for the architecture issue.

**Ticket**: an issue labelled `task`, a sub-issue of its Spec. One vertical slice, one pull request; its acceptance criteria are Gherkin scenarios copied verbatim from the Spec (ADR 0007).

**Integration test ticket**: the ticket that writes every scenario of a Spec as an automated test tagged pending, first in the order. The required CI gate skips pending tests; each feature ticket removes the tag from its scenarios.

**Architecture issue**: an issue labelled `architecture`, a sub-issue of its Spec. Holds the reviewed technical design: components, flow, decisions, ticket dependencies and implementation order.

**Wayfinder**: an issue labelled `wayfinder`, a sub-issue of its Spec. The living order of work: phases, a progress graph and a checklist agents work through.

**Gate A**: the validator. Deterministic, no API, blocks the merge.

**Gate B**: the eval runner from phase 2 on. Non-deterministic, costs tokens, not blocking at first.

**Rule ID**: stable identifier of a validator rule, `SK001` …. Findings, tests and ADR 0002 refer to it.

**Finding**: one report from the validator: rule ID, path, line when known, reason.

**Fixture**: mini repo under `tools/validator/fixtures/skNNN/`. `fail-*` violates exactly one rule, `pass` satisfies it at its edge cases.
