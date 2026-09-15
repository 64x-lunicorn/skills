---
type: task
status: closed
parent: 0001
blocked_by: [0004]
---

# Hand a returned book to its member

> Part of Spec #0001. Architecture: #0002. Order: #0003.

## Acceptance criteria

```gherkin
Feature: Members reserve books that are lent out

  Scenario: A returned book goes to the member who reserved it
    Given a book with a reservation is lent out
    When the book is returned
    Then the organiser is shown the member who reserved it
```
