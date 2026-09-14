---
type: task
parent: 1
blocked_by: []
status: closed
---

# Skip empty lines

> Part of Spec #1. Architecture: #2. Order: #3.

## Goal

An empty line in a CSV file never becomes an object in the output.

## Acceptance criteria

```gherkin
Scenario: An empty line is skipped
  Given a CSV file with an empty line between two rows
  When it is converted
  Then the output holds two objects
```

## Implementation notes

- **Components:** `src/parse.js`, `src/header.js`, `test/parse.test.js`.
- **Decisions that apply:** the parser skips empty lines.

Closed: merged with the commit "feat: skip empty lines".
