# 0004 — Own skill creation instead of mattpocock-skills

Status: accepted, 2026-09-13. Supersedes [0003](0003-no-meta-skill-in-phase-1.md).

## Context

ADR 0003 postponed a meta skill until phase 4, relying on `skill-creator` and `writing-for-agents` in the meantime. On 2026-09-13 Daniel decided to move away from `mattpocock-skills` entirely and use only his own skills. `writing-for-agents` belongs to that collection, and `CLAUDE.md` required it for every `SKILL.md` change. The repo's own process lost a mandatory step, so the meta skill is no longer speculative.

`skill-creator` (Anthropic) stays allowed, but only wrapped by an own skill with this repo's rules.

## Decision

Two skills, split along the layering:

- **`write-skill`** (model-invoked, `skills/engineering/`) holds the writing discipline for a `SKILL.md`. It replaces `writing-for-agents` and applies to every change, with or without an orchestrator.
- **`harvest-skill`** (user-invoked, `skills/orchestration/`) creates a new skill: harvest gate, check for an existing skill, shape confirmed by Daniel, drafting and evals through `skill-creator` under repo rules, wiring up. `skill-creator` is used only through it.

The gate accepts a correction counted 3× in `inbox.md`, or a gap Daniel names explicitly. This case is the first such gap.

`harvest` joins the verb allowlist (SK006), added test first.

The other `mattpocock-skills` are replaced one at a time. Each is uninstalled once an own skill covers its job, so no step of the workflow disappears overnight.

## Consequences

- Writing and creating skills no longer depend on a third-party collection.
- The writing guide is shaped by this repo's conventions and grows through harvest like any other skill.
- The harvest rule has a second entry point. It stays narrow: a named gap in the process, not an idea.

## Alternatives

- **Keep 0003 and stay on `writing-for-agents` until phase 4**: contradicts the decision to leave `mattpocock-skills`.
- **One combined skill**: editing an existing `SKILL.md` would run through the full creation workflow, or the discipline would not fire at all outside it.
- **Use `skill-creator` directly**: its defaults (workspace layout, `evals.json`, packaging, pushy descriptions) do not match this repo's conventions.
