---
type: bugfix
status: closed
parent: 0001
blocked_by: []
---

> Part of Spec #0001. Architecture: #0002.

# Refuse a missing name

## Goal

Scripts pipe the output of `greet` into other tools, and a greeting for nobody corrupts their input. Without a name, `greet` prints nothing to standard output, prints `greet: a name is required` to standard error and fails.

## Acceptance criteria

```gherkin
Feature: Friendly greetings

  Scenario: A missing name is refused
    Given GREETING is not set
    When nobody is named
    Then greet fails with "greet: a name is required"
```

## Implementation notes

- Components: `src/greet.sh`, `tests/missing-name-refused.test.sh`.
