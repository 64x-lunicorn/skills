---
type: task
status: open
parent: 0001
blocked_by: [0004]
---

> Part of Spec #0001. Architecture: #0002. Order: #0003.

# Greet several names one per line

## Goal

`greet` accepts several names and greets each on its own line.

## Acceptance criteria

```gherkin
Feature: Friendly greetings

  Scenario: Several names are greeted one per line
    Given GREETING is not set
    When Ada and Grace are greeted
    Then the greetings are "Hello, Ada" and "Hello, Grace", one per line
```

## Implementation notes

- Components: `src/greet.sh`, `tests/several-names.test.sh`.
