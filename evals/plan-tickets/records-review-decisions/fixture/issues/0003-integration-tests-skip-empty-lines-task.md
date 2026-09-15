---
type: task
status: open
parent: 0001
blocked_by: []
---

# Integration tests: Skip empty lines

> Part of Spec #0001. Architecture: #0002. Order: pending.

## Goal

Every scenario of Spec #0001 runs as an automated integration test, so each feature ticket has a checkable target.

## Scope

- Test harness that runs the scenarios against the CLI from outside.
- Every scenario below as a test tagged pending.

## Acceptance criteria

```gherkin
Scenario: An empty line is skipped
  Given a CSV file with an empty line between two rows
  When it is converted
  Then the output holds two objects

Scenario: A whitespace line is skipped
  Given a CSV file with a line of three spaces between two rows
  When it is converted
  Then the output holds two objects

Scenario: Skipped lines are counted in one warning
  Given a CSV file that ends with two empty lines
  When it is converted
  Then stderr shows one warning that 2 lines were skipped

Scenario: No warning without skipped lines
  Given a CSV file without empty lines
  When it is converted
  Then stderr shows no warning

Scenario: A line of separators is kept
  Given a CSV file with the header "a,b" and a line ",,"
  When it is converted
  Then the output holds one object with empty values for a and b
```

## Dependencies

<!-- Filled after the architecture review. -->

## Implementation notes

<!-- Filled after the architecture review: test framework, where the harness lives, how the system is started. -->
