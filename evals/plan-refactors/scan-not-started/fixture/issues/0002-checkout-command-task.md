---
type: task
status: closed
parent: 0001
blocked_by: []
---

# Price an order at checkout

> Part of Spec #0001. Architecture: #0001. Order: #0001.

## Acceptance criteria

```gherkin
Feature: Order pricing

  Scenario: A discount code lowers the total
    Given an order of 3000 cents
    When the code WELCOME10 is applied
    Then the total is lowered by ten percent
```

## Implementation notes

- Components: `src/commands/checkout.sh`, `src/billing/totals.sh`, `src/billing/apply_discount.sh`, `src/billing/format_currency.sh`.
