---
type: bugfix
status: closed
parent: 0001
blocked_by: []
---

> Part of Spec #0001. Architecture: #0001.

# A retried checkout must not apply a second discount

## Goal

`WELCOME10` and `FLAT5` must not both reduce the same order: only the code given at checkout applies once. A retried request that calls checkout again with a different code must not reduce the total a second time.

## Acceptance criteria

```gherkin
Feature: Discount codes

  Scenario: A retried checkout does not apply a second discount
    Given an order already discounted with WELCOME10
    When the same order is checked out again with FLAT5
    Then only one discount is applied
```

## Implementation notes

- Components: `src/billing/apply_discount.sh`.
- No correct seam: `apply_discount` only ever sees the total handed to it and cannot tell whether a discount was already applied to that order; a regression test would need to observe the order's discount history, and nothing in this codebase exposes that as a seam.
