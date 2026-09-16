---
type: task
status: open
parent: 0001
blocked_by: []
---

# Give apply_discount a stable public entry point

> Part of Spec #0001. Architecture: #0002. Order: #0005.

## Acceptance criteria

```gherkin
Feature: A real interface for discount handling

  Scenario: A caller need not know the discount rules
    Given a new discount code is added
    When a caller applies a discount
    Then the caller's own code does not change
```
