---
type: task
status: closed
parent: 0001
blocked_by: []
---

# Reserve a lent book

> Part of Spec #0001. Architecture: #0002. Order: #0003.

## Acceptance criteria

```gherkin
Feature: Members reserve books that are lent out

  Scenario: A member reserves a book that is lent out
    Given a book is lent out to one member
    When another member reserves the book
    Then the reservation is recorded for that member
```
