# skills

Claude Code plugin `64x-lunicorn`. Terms live in [CONTEXT.md](CONTEXT.md), decisions in [docs/adr/](docs/adr/README.md).

## Project setup

`.claude/64x-lunicorn.yml` records forge, default branch, research, issues and the CI checks, and every 64x-lunicorn skill reads it. Change it by re-running `/64x-lunicorn:setup-project`, not by hand: the gate, the templates and these docs are generated from it.

## Conventions no validator can check

- **Skills are harvested, not invented.** A skill only comes into being once the same correction was needed three times, or Daniel names a gap in the repo's process (ADR 0004). Until then: an entry in `inbox.md`, verbatim.
- **Layering.** User-invoked orchestrates, model-invoked holds the reusable discipline. User-invoked calls model-invoked, never the other way round, never user-invoked to user-invoked.
- **The description is the only API.** It stays in context permanently; the body loads only on invocation. A vague description is the most common reason a skill never fires.
- **One skill, one decision.** Test: can you say in one sentence what goes wrong when the skill does not kick in? If not, it is too broad.
- **Progressive disclosure.** Everything not needed on every invocation goes into a reference file.
- **Duplication in prose is not a smell.** DRY does not apply here. A shared paragraph in two skills is cheaper than a pointer that costs a load step and is sometimes ignored.
- **Project boundary.** Only what applies across projects goes into this repo. Project-specific material stays in that project's `.claude/`.
- **When changing a `SKILL.md`**, always invoke `write-skill`. New skills are created through `/64x-lunicorn:harvest-skill`, which wraps `skill-creator` with this repo's rules; `skill-creator` is never used on its own. No `mattpocock-skills` (ADR 0004).
- **Research is never implemented.** Anything under `research/` reaches code only after promotion to an epic or spec (ADR 0005). Ideas are worked on with `/64x-lunicorn:research-idea`.
- **Validator rules are born through TDD.** A new convention means: fixture, test, red, rule, green. Never the rule first.
- **English throughout.** Code, docs, messages and commits are English. Entries in `inbox.md` keep the language the correction was given in.

## New skill

`harvest-skill` walks these steps; they are listed here so a change without it still meets them.

1. Directory `skills/<category>/<verb>-<noun>/` with a `SKILL.md`.
2. Add the path to `skills` in `.claude-plugin/plugin.json`.
3. Add at least one eval case under `evals/<name>/<case>/prompt.md`.
4. `npm run validate` passes.

## Shipping a change

- Commit messages are drafted with `write-commit-message`.
- Every change to the plugin ships with a changeset (`npx changeset`). Validator-only or docs-only changes need none.
- New validator rules and changed thresholds go into `tools/validator/src/conventions.ts` and ADR 0002, both in the same PR. A new rule is a proposal to Daniel before its first test is written.

## Changes

- Code, docs, messages and commits are English.
- Commits follow Conventional Commits in imperative mood.
- Work on a branch; `main` changes only through a squash-merged pull request that passed `CI gate`.
- Run `npm run ci` before pushing; it runs every check the gate runs.
- Issues live in the GitHub issues of `64x-lunicorn/skills`, with the closed label set.
- Ideas live in `research/`, gitignored and local only, and reach code only after promotion to a Spec.
