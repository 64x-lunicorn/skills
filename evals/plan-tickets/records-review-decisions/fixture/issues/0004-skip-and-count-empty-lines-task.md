---
type: task
status: open
parent: 0001
blocked_by: []
---

# Skip and count empty lines

> Part of Spec #0001. Architecture: #0002. Order: pending.

## Goal

csv2json skips empty lines and warns once on stderr how many it skipped.

## Scope

- The parser skips empty lines and counts them.
- The CLI prints one warning when the count is above zero.

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

## Out of scope

- Skipping rows whose values are all empty.

## Dependencies

<!-- Filled after the architecture review. -->

## Implementation notes

<!-- Filled after the architecture review: components touched and the decisions from the architecture issue that apply. -->

## Done when

- [ ] The scenarios above run green in the integration tests, without the pending tag.
- [ ] The pull request is merged and this ticket is checked off in the wayfinder.
