---
"64x-lunicorn-skills": patch
---

`implement-ticket` and `review-change` now run in the background (`background: true`) instead of blocking silently until their report returns. `implement-tickets` tells Daniel before every dispatch it makes — starting a ticket, starting its review, starting a fix run, updating a branch — so the run stays visible instead of going silent for the whole cycle. New scenario case `evals/implement-tickets/dispatch-is-announced`.
