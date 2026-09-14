---
kind: technical
status: concluded
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

- **Do nothing:** document a size limit and keep reading the whole file. Rejected: the reported export is a normal size for the users who asked.
- **Stream rows:** read and write row by row with Node.js streams, emitting a JSON array incrementally.
- **Newline-delimited JSON:** stream rows and write one JSON object per line instead of an array. Rejected: it changes the output format for every consumer.

## Findings

- Reading the whole file keeps the entire CSV and the JSON array in memory at once ([1](sources.md)).
- Node.js streams keep memory flat for files of any size when rows are written as they are parsed ([1](sources.md)).

## Open questions

- Whether a progress indicator is shown for long conversions. Accepted as open: it does not change the conversion.

## Recommendation

Stream rows and keep the JSON array as output, as the default for every file.

## Outcome
