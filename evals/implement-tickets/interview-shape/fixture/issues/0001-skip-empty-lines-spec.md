---
type: spec
status: open
---

# Spec: Skip empty lines

> [!IMPORTANT]
> This Spec describes domain behaviour. It is never implemented directly; the work happens only in its sub-issues.

## Goal

csv2json skips empty lines in a CSV file instead of turning them into empty JSON objects.

## Domain rules

- A line that holds nothing or only whitespace is empty.
- An empty line never becomes an object in the output.

## Non-goals

- Skipping rows whose values are all empty.

## Terms

- **Empty line**: a line of a CSV file that holds nothing or only whitespace.

## Acceptance criteria

```gherkin
Feature: csv2json skips empty lines

  Scenario: An empty line is skipped
    Given a CSV file with an empty line between two rows
    When it is converted
    Then the output holds two objects
```
