---
"64x-lunicorn-skills": minor
---

A ticket gets one review. `review-change` checks scenarios, Spec, architecture decisions and scope together with standards, duplication, smells and tests in a single run of at most 20 tool calls, runs no tests or checks, and names files it could not check as `not checked`. `implement-tickets` sends hard findings and the judgement findings Daniel accepted to one `implement-ticket` fix run without a second review, no longer runs `ci.command` before the pull request because the implementer ends green, and runs no review after an update, matching the changed Spec #24.
