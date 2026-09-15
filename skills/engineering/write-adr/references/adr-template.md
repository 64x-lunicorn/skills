# ADR format and index, copied verbatim from write-agent-docs/references/templates.md

Read when writing an ADR file and regenerating `docs/adr/README.md`. The two sections below are copies of the sections of the same name in `skills/engineering/write-agent-docs/references/templates.md`; change both copies together, so the index `write-adr` writes stays the index `write-agent-docs` generates.

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
