---
type: spec
status: open
---

# Spec: A real interface for discount handling

## Goal

`apply_discount` keeps its discount-code rules correct and testable as more codes are added, without every caller learning its internals.

## Domain rules

- A caller passes an order total and a discount code and gets back the discounted total; it does not need to know which codes exist or how each is computed.

## Acceptance criteria

```gherkin
Feature: A real interface for discount handling

  Scenario: A caller need not know the discount rules
    Given a new discount code is added
    When a caller applies a discount
    Then the caller's own code does not change
```
