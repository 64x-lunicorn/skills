# GitHub community file templates

Read when the marker says `forge: github`. The templates follow `64x-lunicorn/skills` and `64x-lunicorn/vigil`.

## Fill rules

- A plain placeholder is replaced by its value alone.
- `<<keep:…>>` is a project section: the content collected in step 2, inserted unchanged. It may span several lines. On a line with fixed text around it, the section is the text between that fixed text.
- A placeholder that resolves to nothing is removed together with its whole line. Afterwards, outside code blocks, no blank line follows another blank line.
- Every paragraph is one line. Wrapping depends on the length of the values, and a file that rewraps is a file that drifts.
- A generated file is the content of its fenced block, ending with exactly one newline.

## Values

| Placeholder | Value |
| :--- | :--- |
| `<<name>>` | The repository name from `origin` |
| `<<owner>>`, `<<repo>>` | From the `origin` remote |
| `<<default_branch>>`, `<<ci_command>>` | From the marker |
| `<<check_list>>` | The `name` of every `ci.checks` item in marker order, joined with `, ` |
| `<<code_owner>>` | The code owner the caller passed, such as `@64x-lunicorn` |
| `<<critical_paths>>` | One line per critical path in the order the caller passed: the path, padded with spaces to the length of the longest path plus two, then `<<code_owner>>` |
| `<<license_name>>`, `<<license_file>>` | From the license templates |

## Project sections

| File | Section | Holds | Drafted from |
| :--- | :--- | :--- | :--- |
| Pull request template | `project_checks` | Further checkbox lines under Checks | Scripts the project runs besides `ci.command` |
| Pull request template | `project_sections` | Further `##` sections before Notes for the reviewer, such as Deployment impact | Empty |
| `SECURITY.md` | `scope_sentence` | One sentence on what the project handles that makes a report sensitive | README and code |
| `SECURITY.md` | `reports_that_matter` | Optional `Reports that matter here include:` with a list | Empty |
| `SECURITY.md` | `maintenance_scope` | Which branch gets fixes, and what is not promised | `<<name>> is an early-stage, single-maintainer project. Fixes are developed against the current \`<<default_branch>>\` branch; there is no long-term-support or backport policy. This project does not offer a guaranteed security response time.` |
| `SECURITY.md` | `project_sections` | Further `##` sections, such as deployment precautions | Empty |
| `CONTRIBUTING.md` | `welcome` | One or two sentences on what contributions are welcome | `Bug reports, clearer documentation and focused changes are welcome.` |
| `CONTRIBUTING.md` | `development_setup` | Prerequisites with versions, then clone, branch and install as one `bash` block | `ci.runtime` and the stack's install command |
| `CONTRIBUTING.md` | `project_sections` | Further `##` sections, such as how to propose a feature | Empty |

## `.github/pull_request_template.md`

```markdown
<!-- CI runs <<check_list>>, Workflow lint and Secret scan, and ends in the CI gate. Run `<<ci_command>>` before pushing to get the same answer without a round trip. -->

## What and why

<!-- The problem, and why this is the right fix. Link the issue: Fixes #123 -->

## Checks

<!-- Delete what does not apply; say so if something could not be run. -->

- [ ] `<<ci_command>>` passes locally
<<keep:project_checks>>
- [ ] Tests added or updated for the changed behaviour
- [ ] Affected documentation updated

<<keep:project_sections>>

## Notes for the reviewer

<!-- Known limitations, deliberate trade-offs, what you are unsure about. -->

<!-- Please use synthetic data in examples, tests and fixtures, never real tokens, private repository URLs or personal data. -->
```

## `.github/CODEOWNERS`

GitHub reads `.github/CODEOWNERS` before a root or `docs/` copy.

```text
# Every file has an owner, so every pull request names who is responsible for it.
* <<code_owner>>

# The paths where a mistake is expensive and silent: they define the quality gate, what the project ships, and what reaches a release. Called out separately so a change here is never skimmed.
<<critical_paths>>
```

## `SECURITY.md`

````markdown
# Security policy

<<keep:scope_sentence>> Please keep security reports confidential until a fix or mitigation can be coordinated.

## Reporting a vulnerability

Use GitHub's **[Report a vulnerability](https://github.com/<<owner>>/<<repo>>/security/advisories/new)** form for a private report to the repository maintainers.

**Do not disclose vulnerabilities in public issues or pull requests.** If you cannot access the private form, open a public issue asking only for a private contact channel. Do not include vulnerability details there.

<<keep:reports_that_matter>>

Include in the private report:

- The affected version or commit.
- A description of the impact and prerequisites.
- Minimal reproduction steps using synthetic data.
- A proposed mitigation or fix, if available.

Never include real passwords, access tokens, SSH private keys or personal data.

## Maintenance scope

<<keep:maintenance_scope>>

<<keep:project_sections>>
````

## `CONTRIBUTING.md`

````markdown
# Contributing to <<name>>

<<keep:welcome>>

## Before you start

- Search [existing issues](https://github.com/<<owner>>/<<repo>>/issues) before opening a new one, and discuss larger changes in an issue before starting a pull request.
- Read the [project overview](README.md) and [CLAUDE.md](CLAUDE.md).
- Keep discussions respectful, constructive and focused on the work.
- For vulnerabilities, follow [SECURITY.md](SECURITY.md) rather than opening a public issue.

## Development setup

<<keep:development_setup>>

## Checks

Before pushing, run the whole gate in one command:

```bash
<<ci_command>>
```

It runs every check CI runs: <<check_list>>. On a pull request, CI also runs Workflow lint and Secret scan and ends in `CI gate`, the only required status check. [docs/ci-cd.md](docs/ci-cd.md) describes the gate and the rules on `<<default_branch>>`.

<<keep:project_sections>>

## Submitting a pull request

1. Keep the change focused and avoid unrelated formatting or refactors.
2. Explain the problem and the solution, and link the issue.
3. Add or update tests for changed behaviour, and update the affected documentation.
4. Write commits as Conventional Commits in English imperative mood.
5. List the checks you ran and any known limitations.

Only contribute material you have the right to submit. Contributions are made under the existing [<<license_name>>](<<license_file>>).
````
