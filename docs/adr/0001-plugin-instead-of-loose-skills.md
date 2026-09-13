# 0001 — Plugin instead of a loose skills collection

Status: accepted, 2026-09-13

## Context

The repo starts with skills. Subagents, commands, hooks and workflows follow later, for example for the sprint orchestrator (phase 5). A plain skills folder can only hold skills and would need restructuring for every new building block.

## Decision

The repo is a Claude Code plugin named `64x-lunicorn`. The manifest lives in `.claude-plugin/plugin.json`; the repo is also its own marketplace (`.claude-plugin/marketplace.json`, `source: "./"`). Commands are `/64x-lunicorn:<skill>`.

The name is the public GitHub account that hosts the repo. That makes it unique as command prefix and marketplace name, and keeps real names out of the repo. The repo name `skills` would not be unique. Decided by Daniel, 2026-09-13.

## Consequences

- All four layers (skills, subagents, commands/workflows, hooks) fit without restructuring.
- Commands always carry the `64x-lunicorn:` prefix. References between skills spell it out.
- Skills live under `skills/<category>/<name>/`. Claude Code only loads nested skills that are listed in `skills` of `plugin.json`. SK013 checks this, see ADR 0002.
- The plugin is versioned as a whole through Changesets, not per skill.

## Alternatives

- **Loose skills folder** under `~/.claude/skills/`: fastest, but no subagents, hooks, workflows or versioning.
- **Several plugins** (one per layer): cleanly separated, but more installs and no shared release for pieces that belong together.
- **Shorter prefix** such as `lunicorn`: easier to type, but not identical to the account.
