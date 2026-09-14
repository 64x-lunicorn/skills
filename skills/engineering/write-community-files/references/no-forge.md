# No-forge community file templates

Read when the marker says `forge: none`. Without a forge there are no pull requests and no private advisory form, so there is no pull request template and no CODEOWNERS, and vulnerabilities go to the maintainer directly.

Fill rules, `<<name>>`, `<<default_branch>>`, `<<ci_command>>`, `<<check_list>>`, `<<license_name>>` and `<<license_file>>` are as in the GitHub templates: every paragraph one line, a placeholder that resolves to nothing removed with its line, no blank line after another outside code blocks, exactly one final newline. `<<name>>` is the project directory name. `<<holder>>` is the copyright holder the caller passed.

## Project sections

| File | Section | Holds | Drafted from |
| :--- | :--- | :--- | :--- |
| `SECURITY.md` | `scope_sentence` | One sentence on what the project handles that makes a report sensitive | README and code |
| `SECURITY.md` | `maintenance_scope` | Which branch gets fixes, and what is not promised | `<<name>> is an early-stage, single-maintainer project. Fixes are developed against the current \`<<default_branch>>\` branch; there is no long-term-support or backport policy.` |
| `SECURITY.md` | `project_sections` | Further `##` sections | Empty |
| `CONTRIBUTING.md` | `welcome` | One or two sentences on what contributions are welcome | `Focused changes are welcome.` |
| `CONTRIBUTING.md` | `development_setup` | Prerequisites with versions, then clone, branch and install as one `bash` block | `ci.runtime` and the stack's install command |
| `CONTRIBUTING.md` | `project_sections` | Further `##` sections | Empty |

## `SECURITY.md`

```markdown
# Security policy

<<keep:scope_sentence>> Please keep security reports confidential until a fix or mitigation can be coordinated.

## Reporting a vulnerability

Report a vulnerability directly to the maintainer, <<holder>>, through a private channel. Never write it into a file under `issues/`: issue files are committed and travel with every clone.

Include in the report:

- The affected version or commit.
- A description of the impact and prerequisites.
- Minimal reproduction steps using synthetic data.
- A proposed mitigation or fix, if available.

Never include real passwords, access tokens, SSH private keys or personal data.

## Maintenance scope

<<keep:maintenance_scope>>

<<keep:project_sections>>
```

## `CONTRIBUTING.md`

````markdown
# Contributing to <<name>>

<<keep:welcome>>

## Before you start

- Read the [project overview](README.md) and [CLAUDE.md](CLAUDE.md).
- Issues are Markdown files in `issues/`, in the format [issues/README.md](issues/README.md) describes.
- For vulnerabilities, follow [SECURITY.md](SECURITY.md).

## Development setup

<<keep:development_setup>>

## Checks

Run the whole gate in one command:

```bash
<<ci_command>>
```

It runs every check: <<check_list>>. Activate the hooks once per clone with `git config core.hooksPath .githooks`; `pre-commit` and `pre-push` then run the gate, as [docs/ci-cd.md](docs/ci-cd.md) describes.

<<keep:project_sections>>

## Submitting a change

1. Work on a branch and keep the change focused.
2. Add or update tests for changed behaviour, and update the affected documentation.
3. Write commits as Conventional Commits in English imperative mood.
4. Merge into `<<default_branch>>` with `git merge --squash`; the commit that finishes the merge runs the gate.

Only contribute material you have the right to submit. Contributions are made under the existing [<<license_name>>](<<license_file>>).
````
