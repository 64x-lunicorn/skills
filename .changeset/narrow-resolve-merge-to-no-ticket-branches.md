---
"64x-lunicorn-skills": minor
---

`resolve-merge`'s description narrows to branches that belong to no ticket; a ticket's branch or pull request that is behind or has merge conflicts goes through `implement-ticket <n> update` instead, so a ticket-named update request always reaches the mode that knows the ticket's own intent, never `resolve-merge` on its own. `CONTEXT.md` gains the term `resolve-merge`. Its eval prompts (`behind-with-conflicts` and the five scenario cases `checks-before-merge`, `incompatible-intents`, `invents-no-behaviour`, `keeps-both-intents` and `never-pushes`) are reworded to name no ticket and give the intent of each side as plain text, so they still grade a direct `resolve-merge` call on a branch of no ticket.
