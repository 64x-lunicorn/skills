# 0002 — Inline formatting in each report script

Status: accepted, 2026-03-20

## Context

tallyup grew three small report scripts (summary, receipt, csv export) after the checkout command. Each needed its own layout, and a shared module would have to serve all three from day one, before their formats had settled.

## Decision

Currency and date formatting is written inline in each report script, not factored into a shared reports module.

## Consequences

- Each report script stays self-contained and can be handed to someone who owns only one of them.
- A formatting rule change is made in up to three places.

## Alternatives

- **A shared `src/reports/format.sh` module:** one place to change a rule, but the three scripts had no other reason to share code yet.
