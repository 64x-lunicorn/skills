---
type: bugfix
status: open
parent: 0001
blocked_by: []
---

> Part of Spec #0001. Architecture: #0001.

# A receipt total rounds down instead of to the nearest cent

## Goal

`format_currency` must round to the nearest cent, not truncate. An order of 1050 half-cents (10.50 cents in tenths) must show as 10.50, not 10.49.

## Acceptance criteria

```gherkin
Feature: Order pricing

  Scenario: A total is rounded to whole cents
    Given an order total of 1050 half-cents
    When it is formatted for the receipt
    Then it shows as whole cents
```

## Implementation notes

- Components: `src/billing/format_currency.sh`.

## Diagnosis

diagnose-bug found no correct seam for a regression test of this rounding rule: `format_currency` only receives an already-computed integer number of cents, so a test at that interface cannot tell whether the rounding happened correctly upstream or was merely passed through. The rounding actually happens in `src/billing/totals.sh`, which `format_currency` never sees.
