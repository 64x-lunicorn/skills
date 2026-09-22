---
type: task
status: open
parent: 0001
blocked_by: []
---

> Part of Spec #0001. Architecture: #0002. Order: #0003.

# Greet a missing name as stranger

## Goal

`greet` never prints an empty name: without a name it greets `stranger`.

## Acceptance criteria

```gherkin
Feature: Friendly greetings

  Scenario: A missing name is greeted as stranger
    Given GREETING is not set
    When nobody is named
    Then the greeting is "Hello, stranger"
```

## Implementation notes

- Components: `src/greet.sh`, `tests/missing-name.test.sh`.
