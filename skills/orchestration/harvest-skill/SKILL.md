---
name: harvest-skill
description: Turns a harvested correction or a proven gap into a new skill in this plugin, wrapping skill-creator with the repo's rules.
argument-hint: "[inbox entry or gap]"
disable-model-invocation: true
---

Creates one new skill in `64x-lunicorn`. `skill-creator` does the drafting and testing; this skill decides whether a skill is warranted and holds it to the repo's rules. `skill-creator` is only ever used through this skill.

## 0. Check project setup

Read `.claude/64x-lunicorn.yml` in the project root, then go on with step 1 in every case; the notice informs, it does not block:

- File missing: print `Project setup missing. Run /64x-lunicorn:setup-project.`
- `setup_version` below 3: print `Project setup outdated. Re-run /64x-lunicorn:setup-project.`

## 1. Gate

A skill is warranted by exactly one of:

- an entry in `inbox.md` with **Count: 3×** or more, or
- a gap Daniel names explicitly, where the repo's own process or his development skill set is missing a step.

It also has to fit the plugin: it serves developing products (domain to spec to tickets, code, security, CI/CD, operation) and applies across projects. Project-specific material stays in that project's `.claude/`.

When the evidence is below 3×, record or raise the inbox entry verbatim, in the language it was given in, and stop.

**Done when** the evidence is quoted back to Daniel, or the inbox entry is written and the run has stopped.

## 2. Existing skills

List `skills/` and read the descriptions. When an own skill already covers the job, extend that skill with `write-skill` instead of creating a second one.

**Done when** it is clear that no own skill covers the job.

## 3. Shape

Apply steps 1 and 2 of `write-skill`: the one-sentence test, invocation, category and name. Present the sentence, name, category and invocation to Daniel and wait for his go.

When the name needs a verb that is not in `SKILL_NAME_VERBS`, propose it to Daniel. Once he agrees, add it test first: fixture under `tools/validator/fixtures/sk006/`, failing test, then `conventions.ts` and the verb list in ADR 0002.

**Done when** Daniel has confirmed the shape.

## 4. Draft and test with skill-creator

Invoke `skill-creator` for the drafting and eval loop, with these repo rules taking precedence over its defaults:

- The skill lives at `skills/<category>/<name>/SKILL.md`, not in a separate workspace or `.skill` package.
- Eval prompts go to `evals/<name>/<case>/prompt.md`, one realistic prompt per case. Workspaces, benchmark files and viewer output go to the scratchpad and never into the repo.
- Everything in the skill is English. Inbox quotes stay in their original language.
- The text of the `SKILL.md` follows `write-skill`, which replaces `skill-creator`'s own writing guide.
- Runs with subagents and description optimisation start only when Daniel asks for them; offer them once the draft stands.

**Done when** the `SKILL.md` and at least one eval case exist and Daniel has seen the draft.

## 5. Wire up

1. Add the path to `skills` in `.claude-plugin/plugin.json`.
2. Add a row to the skills table in `README.md`.
3. When the skill was harvested from the inbox, remove that entry in the same change.
4. `npm test` and `npm run validate` pass.
5. Add a changeset with `npx changeset`. Ask Daniel for the bump; he sets the release version.
6. Commit with `write-commit-message` on a branch, never on `main`.

**Done when** the validator is green, the changeset exists and the commit is on a branch.
