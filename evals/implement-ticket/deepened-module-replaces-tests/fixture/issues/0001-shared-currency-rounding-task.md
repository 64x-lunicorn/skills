---
type: task
status: open
parent: null
blocked_by: []
---

# Give currency rounding a shared seam

## Goal

`format_currency` rounds half-cents up with its own inline arithmetic. This refactor gives it a separate, tested `round_half_up` function and changes no observable behaviour.

## Acceptance criteria

```gherkin
Feature: Currency rounding

  Scenario: A currency amount rounds to the nearest cent
    Given 1050 tenth-cents
    When it is formatted
    Then it shows as 1.05
```

## Implementation notes

- Components: `src/billing/format_currency.sh`, `src/billing/round_half_up.sh` (new).
- Seams: `format_currency`.
