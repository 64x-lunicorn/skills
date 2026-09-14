---
name: configure-ci-gate
description: Configures a project's CI gate from the checks in .claude/64x-lunicorn.yml, generating the workflow with Secret scan, Workflow lint and the single required CI gate check, the branch ruleset, merge settings and repo metadata, or local git hooks without a forge, and reports drift. Use when a project's gate is set up for the first time, re-run after its checks changed, or brought back in line after it drifted.
---

Brings one project to the house gate: one list of checks, one local command, one required check named `CI gate`. The same marker must always produce the same files, so everything comes from fixed templates with placeholders, and nothing is written from memory.

## 1. Check the inputs

Read `.claude/64x-lunicorn.yml`. The caller may also pass a repo description and topics.

Stop and name the gap when:

- `forge` is `gitlab` or `forgejo`. Their details are unverified until the spike tasks of Spec #4 are done.
- `default_branch`, `ci.command` or `ci.checks` is missing, a check has no `name` or `run`, or its `required` is not `true` or `false`. Every template depends on them.
- `ci.checks` has duplicate names, uses a reserved name (`Secret scan`, `Workflow lint`, `CI gate`), or a name or `run` contains `|` or a backtick, which would break the check table in `docs/ci-cd.md`. A complex command belongs in a script the check calls.
- `forge` is `github` and `ci.runtime.stack` is not in [the runtime templates](references/runtimes.md). A new stack gets its template when a project needs it, not a guess now.

**Done when** every input is valid or the run has stopped with the gap named.

## 2. Generate the files

Fill the templates exactly as their fill rules say: same key order, same quoting, no other change. A template edited by hand is how the house gate drifts apart again.

- **GitHub:** `.github/workflows/ci.yml` and `.github/dependabot.yml` from [the GitHub CI templates](references/github-ci.md), with the stack's setup steps from the runtime templates.
- **No forge:** `.githooks/pre-commit` and `.githooks/pre-push` from [the no-forge templates](references/no-forge.md), both executable.
- **Both:** `docs/ci-cd.md` from [the CI/CD document template](references/ci-cd-doc.md).

Compare every generated file with what exists, byte for byte, including the final newline and, for hooks, the executable bit. Report it as `new`, `unchanged` or `drift`, and write it when it is `new` or `drift`. Show the diff of every `drift` file before writing it: an edit made by hand in an untracked file is gone once overwritten. Leave every other file, such as release or CodeQL workflows, untouched.

**Done when** every file is generated and has its status.

## 3. Lint what was generated

- **GitHub:** run actionlint without arguments from the project root, as the Workflow lint job does, and zizmor with `--persona=regular --min-severity=low` on `.github`. Use the versions pinned in the Workflow lint job: actionlint as an installed binary of that version or a checksum-verified download, zizmor as that exact version from PyPI through `pipx` or `uvx`. Without a token zizmor runs offline; that result counts, as it does in CI.
- **No forge:** `sh -n` on both hooks, and `shellcheck` when it is installed.

A finding in a generated file is a defect in the template: stop and report it instead of patching the output.

**Done when** every linter that applies exits with 0.

## 4. Plan the remote settings

- **GitHub:** the repository is the `origin` remote on `github.com`. Without one, skip steps 4 and 5 and report the remote settings as a gap: they apply once the repository is pushed. Otherwise read its current state and compare it with [the GitHub settings templates](references/github-settings.md): the ruleset named like the default branch, the merge settings, and description, topics, wiki and discussions. List every difference as current value and target value. Also list every other ruleset that requires a status check, and every workflow job a ruleset requires under a name other than `CI gate`; each of them undoes the single required check.
- **No forge:** the only setting is `core.hooksPath` in the local git config.

**Done when** every setting is listed as matching or with its current and target value, or the missing remote is recorded as a gap.

## 5. Apply

- **GitHub:** show the plan and ask Daniel: "Apply these settings to <owner>/<repo>?" Only a yes to this question counts; branch rules and repo settings affect everyone working in the repository. Apply each change with the command from the settings template, then read the state back and compare it with the target again.
- **No forge:** set `git config core.hooksPath .githooks` without asking, since it changes only this clone, and read it back.

**Done when** the read-back state matches the target, or Daniel declined and the plan is kept for the report, or step 4 recorded the missing remote.

## 6. Report

- **Files:** each with `new`, `unchanged` or `drift`.
- **Lint:** the exit code per linter.
- **Remote settings:** applied, matching, declined with the open differences, or not applied for lack of a remote, including a description and topics the caller passed.
- **Gaps:** every gap the CI/CD document names for this forge, and the missing remote when there is none.

Leave all file changes uncommitted, so Daniel reviews them before they are committed.

**Done when** the report covers files, lint, remote settings and gaps.
