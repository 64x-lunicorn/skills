---
type: architecture
parent: 1
status: open
---

# Architecture: Skip empty lines

> Technical design for the tickets of Spec #1. Order of work: #3.

## Decisions

- **The parser skips empty lines.** `parseCsv` in `src/parse.js` drops them before a row is built; the scenario test lives in `test/parse.test.js`.

## Implementation order

| Phase | Tickets | Parallel | Reason |
|---|---|---|---|
| 1 | #4 | no | One ticket |
