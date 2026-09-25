# Pull request template

Read when opening the pull request in step 6. Replace every `<…>`. Title: a Conventional Commits summary of the ticket's behaviour, following `write-commit-message`.

```markdown
Closes #<ticket>. Part of Spec #<spec>. Order: #<wayfinder>.

## What

<The ticket's goal, one sentence.>

## Scenarios

- [x] <scenario name, verbatim>: `<test file>`

## Reuse

- Reused: <existing function, type or module, and where>
- New: <function, type or module>, because <why nothing existing fits>

## Review

- Findings fixed: <count, or none>
- Not checked: <files, or none>
- Daniel's decisions: "<verbatim>"

## Deviations

<Files changed outside the ticket's implementation notes, each with its reason. Or: None.>
```

A bugfix or Spec-less task has no Spec and no wayfinder: replace the first line with `Closes #<bugfix>. Bug: #<bug>.` (`Bug: none` when the bugfix has no Bug issue) or `Closes #<task>. Task without a Spec.`, never `Fixes #<bug>`, because the Bug is closed by triage with its own comment. For a bugfix, list the scenario with its red and green run.
