---
type: task
status: open
parent: 0001
blocked_by: []
---

# Add the SUMMER15 discount code

> Part of Spec #0001. Architecture: #0002. Order: #0004.

## Acceptance criteria

```gherkin
Feature: Order pricing

  Scenario: SUMMER15 lowers the total by fifteen percent
    Given an order of 3000 cents
    When the code SUMMER15 is applied
    Then the total is lowered by fifteen percent
```

## Implementation notes

- Components: `src/billing/apply_discount.sh`, `tests/apply_discount.test.sh`.
- Seams: `apply_discount`.
