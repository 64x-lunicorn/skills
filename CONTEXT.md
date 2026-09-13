# Terms

**Skill**: directory `skills/<category>/<name>/` with a `SKILL.md`. The name is also the command `/64x-lunicorn:<name>`.

**Category**: first level under `skills/`, e.g. `engineering` or `orchestration`.

**model-invoked**: the model invokes the skill on its own, triggered by the description.

**user-invoked**: only Daniel invokes the skill, by command. Marked by `disable-model-invocation: true`. Orchestrators are always user-invoked.

**Layering**: user-invoked orchestrates, model-invoked holds the reusable discipline. User-invoked calls model-invoked, never the other way round, never user-invoked to user-invoked.

**Harvest**: a skill only comes into being once the same correction was needed three times. Harvested, not invented.

**Inbox**: `inbox.md`, the harvest backlog. Corrections are recorded verbatim with a counter.

**Gate A**: the validator. Deterministic, no API, blocks the merge.

**Gate B**: the eval runner from phase 2 on. Non-deterministic, costs tokens, not blocking at first.

**Rule ID**: stable identifier of a validator rule, `SK001` …. Findings, tests and ADR 0002 refer to it.

**Finding**: one report from the validator: rule ID, path, line when known, reason.

**Fixture**: mini repo under `tools/validator/fixtures/skNNN/`. `fail-*` violates exactly one rule, `pass` satisfies it at its edge cases.
