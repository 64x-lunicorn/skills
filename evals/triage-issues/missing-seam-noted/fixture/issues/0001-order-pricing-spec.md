---
type: spec
status: closed
---

# Spec: Order pricing

## Goal

A customer's order is priced at checkout with a discount and rounded to whole cents.

## Acceptance criteria

```gherkin
Feature: Order pricing

  Scenario: A total is rounded to whole cents
    Given an order total of 1050 half-cents
    When it is formatted for the receipt
    Then it shows as whole cents
```
