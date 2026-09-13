# skills

Claude Code plugin `64x-lunicorn`. Terms live in `CONTEXT.md`, decisions in `docs/adr/`.

## Conventions no validator can check

- **Skills are harvested, not invented.** A skill only comes into being once the same correction was needed three times. Until then: an entry in `inbox.md`, verbatim.
- **Layering.** User-invoked orchestrates, model-invoked holds the reusable discipline. User-invoked calls model-invoked, never the other way round, never user-invoked to user-invoked.
- **The description is the only API.** It stays in context permanently; the body loads only on invocation. A vague description is the most common reason a skill never fires.
- **One skill, one decision.** Test: can you say in one sentence what goes wrong when the skill does not kick in? If not, it is too broad.
- **Progressive disclosure.** Everything not needed on every invocation goes into a reference file.
- **Duplication in prose is not a smell.** DRY does not apply here. A shared paragraph in two skills is cheaper than a pointer that costs a load step and is sometimes ignored.
- **Project boundary.** Only what applies across projects goes into this repo. Project-specific material stays in that project's `.claude/`.
- **When changing a `SKILL.md`**, always invoke `writing-for-agents`; for creating skills and evals, `skill-creator`.
- **Validator rules are born through TDD.** A new convention means: fixture, test, red, rule, green. Never the rule first.
- **English throughout.** Code, docs, messages and commits are English. Entries in `inbox.md` keep the language the correction was given in.

## New skill

1. Directory `skills/<category>/<verb>-<noun>/` with a `SKILL.md`.
2. Add the path to `skills` in `.claude-plugin/plugin.json`.
3. Add at least one eval case under `evals/<name>/<case>/prompt.md`.
4. `npm run validate` passes.

## Changes

- Commits follow `write-commit-message`: Conventional Commits, English, imperative.
- Every change to the plugin ships with a changeset (`npx changeset`). Validator-only or docs-only changes need none.
- New validator rules and changed thresholds go into `tools/validator/src/conventions.ts` and ADR 0002, both in the same PR. A new rule is a proposal to Daniel before its first test is written.
