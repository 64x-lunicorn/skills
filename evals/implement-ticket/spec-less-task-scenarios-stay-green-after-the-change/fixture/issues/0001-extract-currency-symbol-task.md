---
type: task
status: open
parent: null
blocked_by: []
---

# Extract the hard-coded currency symbol

> Task without a Spec.

## Goal

Extract the hard-coded currency symbol in `render_price` into a named constant. No behaviour changes.

## Acceptance criteria

```gherkin
Feature: render_price keeps its output

  Scenario: A price in cents renders with a dollar sign and two decimals
    Given a price of 1099 cents
    When render_price is called
    Then it prints "$10.99"
```

## Implementation notes

- Seam: `src/render.sh`, `render_price`.

## Done when

- [ ] The scenario above passes before and after the change.
