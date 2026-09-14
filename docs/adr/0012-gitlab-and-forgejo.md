# 0012 — GitLab and Forgejo

Status: accepted, 2026-09-14. Realises the rest of Spec #4 (project setup).

## Context

ADR 0010 and ADR 0011 cover GitHub and projects without a forge. Spec #4 requires GitLab Free and Forgejo too, with every rule a forge can enforce applied and every other one named as a gap. Four details were explicitly left for spike tasks: whether GitLab can disable blank issues, how Forgejo Actions job results appear as required status checks, how a GitLab lint job authenticates, and how Forgejo marks advisory checks without `continue-on-error`. Daniel chose on 2026-09-14 to settle them against local throwaway instances instead of documentation alone.

## The spikes

Run on 2026-09-14 against GitLab CE 19.2.6 with a Docker runner, and Forgejo 16.0.4 with Forgejo Runner 13.1.0, each in Docker with synthetic data.

1. **GitLab blank issues cannot be disabled.** The project API has no such setting and the templates documentation names none. Templates on the default branch are offered; they guide and do not enforce.
2. **Forgejo names statuses `<workflow> / <job> (<event>)`.** The gate reports `CI / CI gate (pull_request)`. Branch protection with that context blocked a pull request without it ("Not all required status checks successful") and allowed the merge once it was green.
3. **A GitLab job cannot lint through the API with its job token.** `CI_JOB_TOKEN` on `/projects/:id/ci/lint` returned `404 Project Not Found`. No lint job is needed: a broken `.gitlab-ci.yml` gave a failed pipeline and a merge request that could not be merged under "Pipelines must succeed".
4. **Forgejo advisory checks are a separate job.** Job-level `continue-on-error` was ignored and the red check failed the gate. Step-level `continue-on-error: true` works, but `continue-on-error: ${{ matrix.required == false }}` made the whole workflow invalid (`cannot unmarshal !!str into bool`). A second matrix job for advisory checks, outside the gate's `needs`, showed red while `CI gate` stayed green and the pull request merged.

## Decision

**Per forge, what it can enforce.**

- **GitLab:** one job per check, `allow_failure: true` for advisory checks, Secret scan, and `CI gate` in the last stage. The protected default branch allows pushes by no one and merges by maintainers. The merge request settings are "Pipelines must succeed" without skipped pipelines, squash always, fast-forward merges and deleted source branches. Merge request template `Default.md`, Bug and Request as Markdown templates with `/label` quick actions, SECURITY through confidential issues. The skill lints `.gitlab-ci.yml` through the API with Daniel's token.
- **Forgejo:** a required matrix, an advisory matrix outside the gate, Workflow lint and Secret scan, with `CI / CI gate (pull_request)` as the only required status. Branch protection disables pushes, requires that status and an up-to-date branch, and allows squash merges only. The issue forms are the GitHub ones under `.forgejo/ISSUE_TEMPLATE/`, and `.forgejo/CODEOWNERS` holds regular expressions. SECURITY sends reports to the maintainer.
- **Renovate** replaces Dependabot on both, with a seven-day minimum release age.

**Marker key `ci.runner`, `setup_version` 3** (Daniel, 2026-09-14). Forgejo runner labels and GitLab runner tags differ per instance, and a workflow for a label no runner has never starts. The runner is asked in the interview with a detected default and stored in the marker, so the same answers give the same pipeline. Every step 0 now checks `below 3`.

**Workflow lint on Forgejo blocks** (Daniel, 2026-09-14), unlike Spec #4's "advisory". actionlint passed the generated workflow once the runner label is configured in `.forgejo/actionlint.yaml` and actions use the `owner/repo@sha` form, which Forgejo resolves through its actions mirror.

**Signed commits on Forgejo depend on the instance.** With `require_signed_commits` and no instance signing key, every merge failed with "won't sign: nokey". The rule is set only when `/api/v1/signing-key.gpg` returns a key; otherwise it is a named gap.

**Tokens come from the environment.** GitLab and Forgejo settings and labels use `GITLAB_TOKEN` or `FORGEJO_TOKEN`. The skills ask Daniel to export a missing token and never to paste it.

**Tools per architecture.** gitleaks and actionlint are downloaded by checksum for `x86_64` and `arm64`, because Forgejo and self-managed GitLab runners come in both. Both scripts ran green on the arm64 sandbox runners.

**Runtimes on GitLab and Forgejo:** `node` only, the stack that was run. Other stacks stop with a gap until a project needs them.

## Verification

Beyond the spikes, on the same instances:

- **GitLab:** the protected branch rejected a direct push; the settings read back as set; a pipeline with a failing advisory job succeeded and its merge request merged as one squash commit, which was unsigned; labels, confidential issues and issue templates on the default branch worked; gitleaks scanned the full history.
- **Forgejo:** a direct push was rejected; the merge settings read back as set; a `.forgejo/CODEOWNERS` rule `.* @user` requested a review, and `docs/`, `/docs/.*` and `docs/.*\.md` against `docs/anchor.md` showed that rules match whole paths without a leading slash; `actions/checkout` and `actions/setup-node` pinned by SHA resolved and ran; the issue forms were listed with their labels and blank issues disabled.

End to end, the templates themselves were filled for a Node project with a required `Tests` check and an advisory `Lint` check that always fails:

- **GitLab:** the API lint returned `valid: true`; `Tests`, Secret scan and `CI gate` succeeded, `Lint` failed with `allow_failure`, and the merge request was mergeable.
- **Forgejo:** actionlint exited 0 locally and in the Workflow lint job; `Tests` with `actions/setup-node` and its npm cache, Secret scan and `CI / CI gate (pull_request)` succeeded, `Lint` showed red, and the pull request squash-merged under the branch protection. The first run failed only because the test harness left `<<node>>` unfilled.
- **Renovate:** `renovate-config-validator` accepted `renovate.json`.

Not run: a Renovate bot, the GitLab and Forgejo remote setting commands through the skills themselves, and any instance on the public internet such as `gitlab.com` or `codeberg.org`.

## Consequences

- Setup runs on all four targets of Spec #4, and the remaining differences are written down per forge in `docs/ci-cd.md` and the skill reports.
- Every project set up before sees an outdated notice until setup re-runs.
- GitLab and Forgejo projects need a token in the environment for remote settings and labels.
- Pins and checksums age in five places now; Renovate and Dependabot update generated files, and the templates here need the same updates.

## Alternatives

- **Documentation only for the spikes:** step-level `continue-on-error` and the Forgejo signing failure were not documented, and would have shipped as broken workflows and unmergeable pull requests.
- **Fixed runner defaults without a marker key:** every instance with other labels would get a pipeline that never starts.
- **A GitLab lint job with a stored project token:** a secret in every project for a check pipeline creation already does.
- **Shell-level `|| true` for Forgejo advisory checks:** hides the failure behind a green status.
