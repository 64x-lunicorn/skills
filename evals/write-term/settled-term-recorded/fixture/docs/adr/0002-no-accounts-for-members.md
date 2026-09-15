# 0002 — No accounts for members

Status: accepted, 2026-03-09

## Context

Members borrow books in person at the circle's meetings. The organiser records every hand-over and return; members only look up what they have borrowed.

## Decision

Members have no accounts and no passwords. The organiser is the only user who signs in; members see their loans through a personal link the organiser sends them.

## Consequences

- No password resets and no stored credentials for members.
- A leaked personal link shows that member's loans until the organiser renews it.

## Alternatives

- **Accounts with email sign-in for every member:** a sign-in flow and stored credentials for a circle that meets in person.
