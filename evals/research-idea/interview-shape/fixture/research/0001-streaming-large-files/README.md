---
kind: technical
status: exploring
question: How should csv2json convert CSV files larger than the available memory?
created: 2026-09-01
implementable: false
---

# 0001 — Streaming large files

> Research only. Not implementable until promoted to an epic or spec.

## Question

How should csv2json convert CSV files larger than the available memory? A user reported that a 4 GB export crashes the tool.

## Constraints (technical)

- Node.js 24 or later, no native modules.
- The output of small files must stay byte-identical.

## Options

- **Do nothing:** document a size limit and keep reading the whole file.
- **Stream rows:** read and write row by row with Node.js streams, emitting a JSON array incrementally.
- **Newline-delimited JSON:** stream rows and write one JSON object per line instead of an array.

## Findings

- Reading the whole file keeps the entire CSV and the JSON array in memory at once.

## Open questions

- Whether streamed output stays a JSON array or switches to newline-delimited JSON.
- Whether streaming becomes the default or an opt-in flag.
- Whether a size limit is documented for the non-streaming path.

## Recommendation

## Outcome
