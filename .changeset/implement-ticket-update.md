---
"64x-lunicorn-skills": minor
---

Add update mode to `implement-ticket`: `implement-ticket <n> update` checks out the ticket's existing branch and brings it up to date with the default branch through `resolve-merge`, handing it the ticket side's intent from the ticket, its Spec and its scenarios instead of the branch name. After `merged` it runs the refactor and verify steps and reports like fix mode; a `stopped: incompatible intents` or `stopped: checks failed` is returned verbatim with the merge left open. It never pushes. `CONTEXT.md` gains Update.
