# Research object template

Read when creating a new research object. Replace every `<…>`. Keep the sections for the chosen `kind` and delete the others.

## README.md

```markdown
---
kind: domain | technical | both
status: seed
question: <one sentence>
created: YYYY-MM-DD
implementable: false
---

# NNNN — <title>

> Research only. Not implementable until promoted to an epic or spec.

## Question

<the question, and why it came up>

## Problem (domain)

<who has the problem, how often, what it costs today>

## Prior art (domain)

<what exists already, with links to sources.md>

## Constraints (technical)

<limits any option has to respect>

## Options

<each option, including "do nothing", with trade-offs and risks>

## Findings

<what is established, each claim linked to sources.md>

## Open questions

- <still unknown>

## Recommendation

<empty until concluded>

## Outcome

<for parked or rejected: Daniel's reason. For promoted: link to the epic or spec.>
```

## sources.md

```markdown
# Sources

| # | Claim | Source | Accessed | Version | Confidence |
| :- | :- | :- | :- | :- | :- |
```

## discussion.md

```markdown
# Discussion

Daniel's statements verbatim, in the language he used. Claude's ideas marked `Proposal (Claude):`.

## YYYY-MM-DD
```
