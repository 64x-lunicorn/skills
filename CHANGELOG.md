# 64x-lunicorn-skills

## 0.2.0

### Minor Changes

- 400d67c: Add `write-readme`, `write-community-files` and `write-agent-docs`, and let `setup-project` run them after the gate and the issue templates. Fixed parts come from templates, the project's own content lives in project sections that are drafted once and kept on every re-run. The README follows the house skeleton with a placeholder banner until the real one exists; the community files cover the pull request template, CODEOWNERS, SECURITY, CONTRIBUTING and an MIT or GPL-3.0 license, and enable private vulnerability reporting on confirmation; the agent docs are `CLAUDE.md`, `CONTEXT.md` and `docs/adr/` with a generated index. The interview gains license, code owners, tagline and pitch; the marker is unchanged.
- b2861a2: Add `configure-ci-gate` and `write-issue-templates`, and let `setup-project` run both. The gate comes from the checks in the marker: a GitHub workflow with Workflow lint, Secret scan and the single required `CI gate`, the standard ruleset and merge settings applied after confirmation, or committed git hooks without a forge. Issues get the user templates Bug and Request and the closed label set, including `architecture` and `wayfinder`. The marker gains `ci.runtime`, so `setup_version` is now 2 and projects set up before are asked to re-run setup.
- 079490f: Add `design-http-api`: HTTP API contracts are designed against fixed REST guidelines, starting with the per-API choices recorded once, then resources, methods, status codes, problem details, pagination, concurrency, idempotency, security and versioning, with the full rules in reference files loaded per topic. Every added or changed endpoint ships its OpenAPI 3.1 document, Swagger UI that is not public in production, and a Bruno collection with assertions in the same change. `review-architecture` designs endpoint contracts through it, `implement-ticket` builds endpoints with it, and `review-change` reports an endpoint change without matching OpenAPI and Bruno updates as a hard finding.
- cc96cde: Support GitLab and Forgejo in `setup-project`, `configure-ci-gate`, `write-issue-templates`, `write-community-files`, `write-readme` and `write-agent-docs`. GitLab gets one job per check with `CI gate` last under "Pipelines must succeed", the protected branch and merge request settings, Markdown issue templates and confidential security reports. Forgejo gets required and advisory matrices with `CI / CI gate (pull_request)` as the only required status, blocking actionlint, branch protection, issue forms and regex CODEOWNERS. Both use Renovate and read their API token from the environment. The marker gains `ci.runner`, so `setup_version` is now 3 and projects set up before are asked to re-run setup.
- 1369b86: Add `implement-tickets`, `implement-ticket`, `review-change` and `write-tests`: agreed tickets are built one at a time in fresh subagents, test-first at the seams from the architecture issue with a reuse inventory and a refactor step, reviewed on a spec and a standards axis in separate forked runs, and delivered as one pull request per ticket. Merged tickets are checked off in the wayfinder on the next run.
- d32346d: Add `plan-tickets`, `design-ticket` and `review-architecture`: a Spec is cut into sub-issue tickets with an integration test ticket, reviewed by a forked architecture agent whose proposals Daniel decides, and ordered in a wayfinder issue with native dependencies. `write-spec` and `promote-research` now keep the technical notes as a comment on the Spec.
- e8b676d: Add `research-idea` and `verify-claims`: research objects under `research/` with a lifecycle, verbatim discussion and verified sources, never implementable before promotion.
- 11401e3: Add `setup-project`: a guided interview with detected defaults that writes the committed marker `.claude/64x-lunicorn.yml` every other skill checks. README, CI gate, issue templates, community files and agent docs are reported as gaps until their skills exist.
- 11401e3: User-invoked skills now check the project setup as step 0 and print a notice when `.claude/64x-lunicorn.yml` is missing or outdated. The new validator rule SK014 enforces it.
- dcac17f: Add `verify-spec`: once every ticket of a Spec is merged, a forked review checks the Spec as a whole, including scenarios and domain rules on the default branch, duplication and architecture drift across tickets, and leftovers such as pending markers. `implement-tickets` runs it automatically, turns findings into follow-up tickets and closes the Spec, its architecture issue and its wayfinder on Daniel's go.
- 837f938: Add `write-spec` and `design-spec`: Specs from conversations after light gates, in one template that describes domain behaviour only, with a Mermaid domain flow and Gherkin acceptance criteria. `promote-research` now drafts through `design-spec`; the Tasks checklist is replaced by sub-issues.

## 0.1.1

### Patch Changes

- Add `harvest-skill`, which creates new skills by wrapping `skill-creator` with the repo's rules, and `write-skill`, the writing discipline for every `SKILL.md`. The validator accepts `harvest` as a verb.

## 0.1.0

### Minor Changes

- 8c4ef3c: First release: plugin `64x-lunicorn` with the `write-commit-message` skill and validator rules SK001–SK013.
