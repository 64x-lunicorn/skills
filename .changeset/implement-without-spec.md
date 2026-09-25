---
"64x-lunicorn-skills": minor
---

`implement-ticket`, `review-change` and `implement-tickets` work a bugfix issue or a Spec-less task without a Spec, architecture issue, wayfinder or integration test ticket. `implement-ticket` recognises them by label and first line and writes the scenario tests itself, red then green for a bugfix and green before and after for a task; `review-change` checks the change against the issue's own scenarios and seams; `implement-tickets` accepts their numbers outside a wayfinder and opens the pull request with `Closes #<n>. Bug: #<bug>.` or `Closes #<n>. Task without a Spec.`, never `Fixes #<bug>`.
