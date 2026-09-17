---
"64x-lunicorn-skills": minor
---

Reviews cost a fraction of what they did. `review-change` takes the axis `both` and an optional context directory holding `ticket.md`, `spec.md`, `architecture.md`, `ci.log` and, on a re-review, `findings.md`; with it the review fetches no issue and runs no `ci.command`. It works within a budget of 20 tool calls per axis, 30 on `both` and 10 on a re-review, names files it could not check as `not checked`, and the standards axis alone no longer reads Spec and architecture issue. A re-review checks only the fix commits against the findings it was given. `implement-tickets` fetches the issues and runs `ci.command` once per ticket into that directory, reviews a change of at most 150 changed lines in one `both` run, re-reviews only the axis that reported hard findings, skips the pull request step's `ci.command` when `ci.log` is at the same commit, and after an update reviews only when the merge resolved files.
