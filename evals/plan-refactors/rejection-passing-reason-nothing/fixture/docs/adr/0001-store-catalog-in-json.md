# 0001 — Store the product catalog in one JSON file

Status: accepted, 2026-02-01

## Context

tallyup prices a handful of products for one small shop. A database would need its own migration and backup story for a file that changes a few times a year.

## Decision

The product catalog (name, price in cents) is stored in one `catalog.json` file read at startup, not a database.

## Consequences

- Editing a price is a one-line JSON change reviewed like any other file.
- A second process writing the catalog at the same time is not handled.

## Alternatives

- **SQLite:** durable and queryable, but more than a handful of products need.
