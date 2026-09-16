---
type: bugfix
status: open
parent: null
blocked_by: []
---

# Greeting prints the word and name without a comma

> Bugfix for Bug #0002.

## Goal

Fix the missing comma after the greeting word.

## Diagnosis

Command: `sh -c '. ./src/greet.sh; greet Ada'` prints `Hello Ada`.
Root cause: `src/greet.sh`'s printf format string is `'%s %s\n'`, missing the comma after the word (`src/greet.sh:3`).

## Acceptance criteria

```gherkin
Feature: The greeting word is followed by a comma

  Scenario: A name is greeted with a comma after the word
    Given the default greeting word
    When greet is called with a name
    Then the greeting has a comma after the word
```

## Implementation notes

- Seam: `src/greet.sh`, the printf format string.

## Done when

- [ ] The scenario above fails before the fix and passes after it.
