# 0002 — Own conventions, stricter than the spec

Status: accepted, 2026-09-13

## Context

According to the Agent Skills spec and the Claude Code docs, every frontmatter field is optional; only `description` is recommended. The mistakes that make a skill ineffective in practice are all spec-compliant: a vague description, frontmatter that does not start on line 1, a skill that was never registered.

## Decision

The validator (Gate A, `tools/validator/`) enforces this repo's conventions, not the spec. It is deterministic, needs no API access and blocks the merge.

The values live once in code, in `tools/validator/src/conventions.ts`. This ADR is where they are discussed. Changing a value means changing both, test first.

### Rule catalogue

| ID | Rule |
|---|---|
| SK001 | Every directory `skills/<category>/<name>/` contains a `SKILL.md` |
| SK002 | Frontmatter takes effect: `---` on line 1, closing `---` present, valid YAML |
| SK003 | `description` present, not empty, at least 60 characters |
| SK004 | `description` in third person: no start with "This skill", "Dieser Skill", "Dieses Skill", "I ", "You "; at least 12 words |
| SK005 | `name` matches the directory name |
| SK006 | Name lowercase, hyphenated, verb-noun, verb from the allowlist |
| SK007 | Only fields from the allowlist |
| SK008 | Skills under `skills/orchestration/` set `disable-model-invocation: true` |
| SK009 | Body at most 200 lines |
| SK010 | Every file referenced by a Markdown link in the body exists |
| SK011 | A user-invoked skill does not reference another user-invoked skill (`/name` or `/64x-lunicorn:name`) |
| SK012 | Every skill has at least one case under `evals/<skill-name>/` (`prompt.md` or `case.yaml`) |
| SK013 | Every skill is listed in `skills` of `plugin.json`, every entry there points to a skill |
| SK014 | A user-invoked skill has a `## 0. Check project setup` section with the exact notice `Project setup missing. Run /64x-lunicorn:setup-project.` and `` `setup_version` below N `` where N is the current setup version |

SK013 was not part of the original catalogue. Daniel approved it on 2026-09-13, once it was clear that Claude Code silently skips nested skills without an entry.

SK014 was approved by Daniel on 2026-09-14 for Spec #4 (project setup). Without it, a user-invoked skill runs in a project that was never set up and nobody notices. The notice informs and never blocks. The current setup version is `SETUP_VERSION` in `conventions.ts`; raising it fails every skill that still checks the old value, so no skill keeps an outdated check. The notice sits in inline code, which SK011 ignores, so SK011 needs no exception for `setup-project`. `setup-project` is exempt (`SETUP_SKILL_NAME`): it creates the setup the notice points to, added through TDD on 2026-09-14 when the skill was harvested. `SETUP_VERSION` was raised to 2 on 2026-09-14, when the marker gained `ci.runtime` (ADR 0010); every step 0 now checks `below 2`, so a project set up before is told to re-run setup. It was raised to 3 on 2026-09-14, when the marker gained `ci.runner` for GitLab and Forgejo runners (ADR 0012).

### Field allowlist (SK007)

Allowed are the six spec fields `allowed-tools`, `compatibility`, `description`, `license`, `metadata`, `name` and these Claude Code fields: `agent`, `argument-hint`, `arguments`, `background`, `context`, `disable-model-invocation`, `disallowed-tools`, `effort`, `model`, `paths`, `user-invocable`.

Deliberately excluded:

- `when_to_use` splits the trigger phrases across two fields. The description is the only API.
- `hooks` hides side effects inside a skill. Hooks belong in the plugin's `hooks/`.
- `shell` is only needed once PowerShell is needed.

### Terms the validator pins down

- **user-invoked**: `disable-model-invocation: true`. All other skills are model-invoked.
- **Category**: first level under `skills/`. Only `orchestration` has its own rule (SK008).
- **Verb allowlist (SK006)**: `configure`, `design`, `diagnose`, `harvest`, `implement`, `interview`, `plan`, `promote`, `refactor`, `research`, `resolve`, `review`, `run`, `setup`, `test`, `triage`, `verify`, `write`. A new verb is added through TDD when a harvested skill needs it. `harvest` was added on 2026-09-13 for `harvest-skill` (ADR 0004). `verify` was added on 2026-09-13 for `verify-claims` (ADR 0005). `promote` was added on 2026-09-13 for `promote-research` (ADR 0005). `setup` was added on 2026-09-14 for `setup-project` (Spec #4); "set up" is two words, but the name was already fixed in the Spec and the SK014 notice. `configure` was added on 2026-09-14 for `configure-ci-gate` (Spec #4, ADR 0010).

### Decisions from the bootstrap (2026-09-13)

- Validator in TypeScript with vitest. Changesets needs Node anyway; a second toolchain would be pure overhead.
- Layout `skills/<category>/<name>/` for all skills, not only orchestrators.
- Default branch is `main`.
- Everything in the repo is English. Skills instruct Claude, not end users; Claude answers in the user's language either way, and English reaches more readers and contributors.

## Consequences

- Convention breaches surface before the merge, not when a skill never fires.
- A spec-compliant skill from outside can be rejected. That is intended.
- New Claude Code fields are an error until the allowlist is extended on purpose.
- SK004 is a heuristic. If it reports a false positive, the rule is sharpened through TDD, not switched off.

## Alternatives

- **Check only the spec** (`claude plugin validate`): catches syntax and schema errors, no conventions.
- **Conventions only in `CLAUDE.md`**: works only if the model follows them. Nothing blocks the merge.
