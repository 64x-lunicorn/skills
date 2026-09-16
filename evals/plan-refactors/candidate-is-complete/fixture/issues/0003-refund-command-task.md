---
type: task
status: closed
parent: 0001
blocked_by: []
---

# Refund a priced order

> Part of Spec #0001. Architecture: #0001. Order: #0001.

## Acceptance criteria

```gherkin
Feature: Order pricing

  Scenario: A refund reverses the priced total
    Given an order was checked out for 2700 cents
    When it is refunded in full
    Then 2700 cents is returned
```

## Implementation notes

- Components: `src/commands/refund.sh`, `src/billing/totals.sh`, `src/billing/format_currency.sh`.
