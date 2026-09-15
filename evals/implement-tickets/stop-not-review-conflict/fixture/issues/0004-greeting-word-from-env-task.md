---
type: task
status: closed
parent: 0001
blocked_by: []
---

> Part of Spec #0001. Architecture: #0002. Order: #0003.

# Take the greeting word from GREETING

## Goal

The user chooses the greeting word through `GREETING`; without it, `greet` still says `Hello`.

## Acceptance criteria

```gherkin
Feature: Friendly greetings

  Scenario: The greeting word comes from GREETING
    Given GREETING is "Hi"
    When Ada is greeted
    Then the greeting is "Hi, Ada"
```

## Implementation notes

- Components: `src/greet.sh`, `tests/greeting-word.test.sh`.
