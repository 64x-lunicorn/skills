---
"64x-lunicorn-skills": minor
---

`implement-tickets` step 1 now also counts an unchecked ticket a hit when its wayfinder carries an open `Update stop for #<n>` entry from an earlier update that stopped after its merge commit was recorded — a scenario failing after the merge, a conflict from the review that follows, or a red `ci.command` before or after the push. Git or `gh pr list` no longer sees such a branch as behind or conflicting once the merge landed, so without this it silently dropped out of the flow. Once picked up, the ticket's update runs `review-change` and the gate again, the same as a fresh ticket, before any new ticket starts, and posts `Update stop for #<n> resolved` once both are green. A plain update, never stopped, still gets no review. New scenario case `evals/implement-tickets/stopped-update-reviewed-again`.
