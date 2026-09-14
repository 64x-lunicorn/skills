# 0010 — CI gate and issue templates

Status: accepted, 2026-09-14. Realises part of Spec #4 (project setup).

## Context

Spec #4 decided the house gate, the standard ruleset, the forge mapping, the issue templates and the closed label set, and named `configure-ci-gate` and `write-issue-templates` as the next skills. Since the Spec was written, ADR 0006 and ADR 0007 introduced the Spec and ticket templates of `design-spec` and `design-ticket`, the `architecture` and `wayfinder` labels, and an integration test ticket whose pending scenarios must not block. Daniel decided on 2026-09-14 how the two skills are cut against that.

## Decision

**Scope of the first version.** GitHub and projects without a forge. GitLab and Forgejo stop with a named gap until the four spike tasks of Spec #4 have verified their details.

**`configure-ci-gate`** (model-invoked) generates the workflow with one matrix job per `ci.checks` entry, Workflow lint (actionlint, zizmor), Secret scan (gitleaks) and `CI gate`, plus Dependabot and `docs/ci-cd.md`, all from template files with SHA pins and checksums verified on 2026-09-14. It lints what it generated, plans the ruleset, merge settings and metadata against the live repo, and applies them only after Daniel confirms. A re-run reports every file as new, unchanged or drift.

**Runtime per stack.** The marker gains `ci.runtime` with a stack and its versions; the setup steps come from a template per stack in Daniel's repos: `node`, `elixir`, `swift`, `cpp-qt`. A new stack gets a template when a project needs it. Because the marker format changed, `setup_version` is 2, and every step 0 asks projects set up before to re-run setup.

**Hooks without a forge.** `.githooks/pre-commit` and `.githooks/pre-push` are committed, and `git config core.hooksPath .githooks` activates them per clone. Spec #4 said `pre-commit` rejects commits on the default branch and merges use `git merge --squash`; the squash commit is itself a commit on the default branch, and `pre-push` never runs without a remote. So `pre-commit` lets exactly the commit that finishes a squash merge through, and runs `ci.command` on it; `pre-push` runs it as well.

**`write-issue-templates`** (model-invoked) writes only the user templates Bug and Request with blank issues disabled, and brings the labels to the closed set. Spec, ticket and bugfix bodies are not forge templates: the skills that create them hold the only template for each, so no second copy drifts. The label set of Spec #4 gains `architecture` and `wayfinder`. Without a forge, `issues/README.md` documents the local issue format the skills rely on.

**Integration tests stay advisory while pending.** No separate mechanism: the integration test ticket adds a `ci.checks` entry with `required: false`, and `verify-spec` flags it once no scenario is pending (ADR 0009).

**Remote changes need a yes.** Rulesets, merge settings, metadata, label creation and label deletion are asked for before they are applied; label deletion is its own question, because it removes the label from every issue.

## Verification

On 2026-09-14 the skills ran against throwaway sandbox repos.

- **`configure-ci-gate` on GitHub (Node):** the generated workflow passed actionlint 1.7.12 and zizmor 1.30.1 with exit code 0, and a second run reported every file as unchanged. Linting `.github` instead of `.github/workflows` surfaced a missing Dependabot `cooldown`; the templates now set `default-days: 7`, and the Workflow lint job audits `.github` as well.
- **`configure-ci-gate` without a forge:** both hooks passed `shellcheck`. A commit on the default branch was rejected, a branch commit allowed, a clean squash merge with a green gate allowed, a squash merge with a red gate rejected, and a squash merge with an untracked file rejected until the file was gone. The last check was added after a run showed that the gate otherwise tests files that are not part of the commit.
- **`write-issue-templates`:** the three forms parsed, a second run reported them unchanged, and the label plan against `64x-lunicorn/skills` was computed read-only.

Every ambiguity the runs reported was fixed before the skills shipped. Remote settings and label changes were not applied to a real repository.

## Open

- GitLab and Forgejo, after the spike tasks.
- `write-readme`, `write-community-files` and `write-agent-docs` from Spec #4.
- Triage statuses for local issue files; the format covers `open` and `closed` only.

## Consequences

- One marker drives the local command, the forge workflow and the documentation, so they cannot disagree.
- Every project set up before this change sees an outdated notice until setup re-runs.
- Pins and checksums in the templates age; Dependabot updates generated workflows, and the templates themselves need the same updates here.

## Alternatives

- **All four forges at once:** blocked on unverified forge details; rejected by Daniel for now.
- **`mise` as one setup step for every stack:** stack-independent, but every project needs mise and it does not cover Xcode.
- **`ci.runtime` without a version bump:** old markers would stay silently incomplete.
- **Forge templates for Spec, Task and Bugfix, as Spec #4 said:** a second copy of templates that `design-spec` and `design-ticket` already own.
- **The pre-commit framework for hooks:** needs Python and pre-commit on every machine.
