---
"64x-lunicorn-skills": minor
---

`implement-tickets` brings behind ticket branches up to date before any new ticket starts. In step 1, after reconciling the wayfinder, it pulls the default branch and finds the open ticket pull requests that are behind or have merge conflicts: on GitHub with one `gh pr list` over `mergeStateStatus` and `mergeable`, re-querying `UNKNOWN` up to three times, and without a forge with `git merge-base --is-ancestor` on the local ticket branches. For each, in wayfinder order, it runs `implement-ticket <n> update`, both reviews against the recomputed merge-base, `ci.command`, a push without force and, with a forge, the checks. A stop such as `incompatible intents` is shown and posted like any other stop, and no review runs on that branch. The check runs once per run, so a merge during the run is picked up by the next one. The report lists the updated pull requests with their review rounds, and `CONTEXT.md` gains Behind.
