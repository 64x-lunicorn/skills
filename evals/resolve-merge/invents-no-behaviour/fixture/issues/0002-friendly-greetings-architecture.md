---
type: architecture
status: open
parent: 0001
---

> Technical design for the tickets of Spec #0001. Order of work: #0003.

# Architecture: Friendly greetings

## Decisions

- `greet` stays one shell function in `src/greet.sh`.
- Every scenario is a test script under `tests/`, named after the scenario and run by `scripts/check.sh`.

## Ticket dependencies

#0004 is independent of #0006.
