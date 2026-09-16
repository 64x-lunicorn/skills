---
type: spec
status: closed
---

# Spec: Order pricing

## Goal

A customer's order is priced at checkout with discounts and tax, and a shop owner can get a summary, a receipt or a CSV export of a day's orders.

## Domain rules

- At most one discount code applies to an order.
- Tax is added after the discount.

## Terms

- **Order**: a customer's line items priced together at checkout, from cart to receipt.

## Acceptance criteria

```gherkin
Feature: Order pricing

  Scenario: A discount code lowers the total
    Given an order of 3000 cents
    When the code WELCOME10 is applied
    Then the total is lowered by ten percent
```
