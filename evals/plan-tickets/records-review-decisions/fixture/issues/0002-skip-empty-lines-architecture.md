---
type: architecture
status: open
parent: 0001
---

# Architecture: Skip empty lines

> Technical design for the tickets of Spec #0001. Order of work: #pending.

## Context

csv2json skips empty lines in a CSV file instead of turning them into empty JSON objects, and tells the user how many lines it skipped. The parser in `src/parse.js` reads lines one by one; `src/cli.js` owns stderr; tests use `node --test`.

## Technical notes

- The parser in `src/parse.js` reads lines one by one; the warning belongs to `src/cli.js`, which owns stderr.
- The existing tests live in `test/parse.test.js` and use `node --test`.

Technical questions:

- How does the skip count reach `src/cli.js`?

## Components

Pending architecture review.

## Flow

Pending architecture review.

## Decisions

Pending architecture review.

## Ticket dependencies

Pending architecture review.

## Implementation order

Pending architecture review.

## Risks

Pending architecture review.

## Review log

Pending architecture review.
