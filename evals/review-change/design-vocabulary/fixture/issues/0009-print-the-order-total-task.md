---
type: task
status: open
parent: null
blocked_by: []
---

# Print the order total on its own line

## Acceptance criteria

```gherkin
Feature: Order pricing

  Scenario: The order total is printed on its own line
    Given a priced order
    When the total is printed
    Then it shows the formatted amount alone
```

## Implementation notes

- Components: `src/billing/print_total.sh`.
