# Agent doc templates

Read when collecting project sections and generating `CLAUDE.md`, `CONTEXT.md` and `docs/adr/README.md`. The shape follows `64x-lunicorn/skills`.

## Fill rules

- A plain placeholder is replaced by its value alone.
- `<<keep:…>>` is a project section: the content collected in step 2, inserted unchanged. It may span several lines. On a line with fixed text around it, the section is the text between that fixed text.
- A placeholder that resolves to nothing is removed together with its whole line. Afterwards, outside code blocks, no blank line follows another blank line.
- Every paragraph and list item is one line, so values of any length never rewrap.
- A generated file is the content of its fenced block, ending with exactly one newline.

## Values

| Placeholder | Value |
| :--- | :--- |
| `<<name>>` | The repository name from `origin`, otherwise the project directory name |
| `<<ci_command>>` | `ci.command` from the marker |
| `<<change_flow>>` | GitHub: ``Work on a branch; `<default_branch>` changes only through a squash-merged pull request that passed `CI gate`.`` No forge: ``Work on a branch; `<default_branch>` changes only through `git merge --squash`, whose commit runs the gate.`` |
| `<<issues_line>>` | `tracker: forge` on GitHub: ``Issues live in GitHub Issues of `<owner>/<repo>`, with the closed label set.`` `tracker: local`: ``Issues are Markdown files in `issues/`, in the format [issues/README.md](issues/README.md) describes.`` |
| `<<research_line>>` | `tracked: true`: ``Ideas live in `research/` and reach code only after promotion to a Spec.`` `tracked: false`: ``Ideas live in `research/`, gitignored and local only, and reach code only after promotion to a Spec.`` |
| `<<adr_index>>` | The index below |

## Project sections

| File | Section | Holds | When there is no content yet |
| :--- | :--- | :--- | :--- |
| `CLAUDE.md` | `summary` | One sentence on what the project is | Drafted from the README or manifest |
| `CLAUDE.md` | `conventions` | Bullets: conventions no linter, test or validator enforces, each with its reason | `- None recorded yet. A convention is added once the same correction was needed a second time.` |
| `CLAUDE.md` | `project_sections` | Further `##` sections, such as architecture notes or commands | Empty |
| `CONTEXT.md` | `terms` | One paragraph per term, `**Term**: meaning.` | Empty |

## ADR index

List every file matching `docs/adr/[0-9][0-9][0-9][0-9]-*.md`, sorted by name. Each gives one row:

- **Number:** the four digits of the file name, linked to the file.
- **Title:** the first heading, without the leading `# NNNN — `. `|` in a title is escaped as `\|`.
- **Status:** the text after `Status: ` up to the first `, ` followed by a date in `YYYY-MM-DD`, or the whole rest of the line when there is no date.

A file without a first heading gets its file name as the title; one without a `Status:` line gets `unknown`. With at least one file, `<<adr_index>>` is the table; with none, it is `None yet.`

```markdown
| ADR | Decision | Status |
| :--- | :--- | :--- |
| [0001](0001-<slug>.md) | <title> | <status> |
```

## `CLAUDE.md`

```markdown
# <<name>>

<<keep:summary>> Terms live in [CONTEXT.md](CONTEXT.md), decisions in [docs/adr/](docs/adr/README.md).

## Project setup

`.claude/64x-lunicorn.yml` records forge, default branch, research, issues and the CI checks, and every 64x-lunicorn skill reads it. Change it by re-running `/64x-lunicorn:setup-project`, not by hand: the gate, the templates and these docs are generated from it.

## Conventions no validator can check

<<keep:conventions>>

<<keep:project_sections>>

## Changes

- Code, docs, messages and commits are English.
- Commits follow Conventional Commits in imperative mood.
- <<change_flow>>
- Run `<<ci_command>>` before pushing; it runs every check the gate runs.
- <<issues_line>>
- <<research_line>>
```

## `CONTEXT.md`

```markdown
# Terms

The words this project uses with one fixed meaning, one paragraph each. Code, issues and Specs use the same word; a new term is added here when it gets a fixed meaning.

<<keep:terms>>
```

## `docs/adr/README.md`

````markdown
# Architecture decisions

One file per decision, `NNNN-<slug>.md`, numbered in order and never renumbered. A decision is not edited once accepted: a new ADR supersedes it, and the old one stays with its status pointing to the new one.

## Format

```markdown
# NNNN — <Title>

Status: <proposed | accepted | superseded by [NNNN](NNNN-<slug>.md)>, YYYY-MM-DD

## Context

## Decision

## Consequences

## Alternatives
```

A `## Verification` section before Consequences records how the decision was checked, when it was.

## Index

<<adr_index>>
````
