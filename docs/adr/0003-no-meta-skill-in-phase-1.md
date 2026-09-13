# 0003 — No meta skill in phase 1

Status: superseded by [0004](0004-own-skill-creation-instead-of-mattpocock.md), 2026-09-13

## Context

The obvious idea is a skill that generates new skills following the repo's conventions. At the start there is not a single harvested skill yet from which to learn what a good skill looks like here. `skill-creator` and `writing-for-agents` already cover creating, evaluating and writing skills.

## Decision

Phase 1 ships no meta skill. Conventions live in two places:

- **machine-checkable** in the validator (ADR 0002),
- **judgement-dependent** in `CLAUDE.md`.

The meta skill arrives in phase 4, harvested from whatever was done the same way three times in phase 3. It becomes a thin wrapper around `skill-creator`, not a reimplementation.

## Consequences

- A skill generator written from theory would cement wrong assumptions. That does not happen.
- New skills are written by hand in phase 3. That takes longer and produces the material for phase 4.
- `CLAUDE.md` applies even when a `SKILL.md` is changed without a meta skill.

## Alternatives

- **Meta skill right away**: fast start, but written from ideas instead of practice.
- **Only `skill-creator`, no own conventions**: nothing enforced, every skill would look different.
