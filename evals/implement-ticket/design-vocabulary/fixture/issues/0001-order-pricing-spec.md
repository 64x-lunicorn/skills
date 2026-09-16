---
type: spec
status: closed
---

# Spec: Order pricing

## Goal

A customer's order is priced at checkout with a discount code.

## Acceptance criteria

```gherkin
Feature: Order pricing

  Scenario: A discount code lowers the total
    Given an order of 3000 cents
    When the code WELCOME10 is applied
    Then the total is lowered by ten percent
```
