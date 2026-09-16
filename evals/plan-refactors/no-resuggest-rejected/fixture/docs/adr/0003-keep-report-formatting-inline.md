# 0003 — Keep report formatting inline, shared module rejected

Status: accepted, 2026-07-10

## Context

A refactor scan proposed extracting the duplicated currency formatting from `summary.sh`, `receipt.sh` and `csv_export.sh` into one shared `src/reports/format.sh` module, contradicting ADR 0002. The negative-cents rounding fix already made once in `receipt.sh` (2026-07-08) was the friction behind the proposal.

## Decision

Rejected. Report formatting stays inline in each script, as ADR 0002 already decided. The one fix so far is small enough to repeat in the other two scripts, and the three scripts still diverge more than they agree.

## Consequences

- A later scan should not re-propose a shared reports module without friction beyond the one fix this record and ADR 0002 already weighed.

## Alternatives

- **A shared `src/reports/format.sh` module:** the candidate this record rejects.
