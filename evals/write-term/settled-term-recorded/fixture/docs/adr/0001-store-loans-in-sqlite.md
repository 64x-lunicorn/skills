# 0001 — Store loans in SQLite

Status: accepted, 2026-03-02

## Context

lendbook runs on one small home server for a lending circle of about thirty members. Loans must survive restarts and be queried by member and by book.

## Decision

Loans, members and books are stored in one SQLite file next to the application.

## Consequences

- Backups are a copy of one file.
- Only one application instance may write at a time.

## Alternatives

- **PostgreSQL:** a server process to run and update for thirty members.
- **JSON files:** no transactions when two loans change at once.
