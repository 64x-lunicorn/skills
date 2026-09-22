---
"64x-lunicorn-skills": patch
---

`implement-tickets` stops at the start of step 1, before the wayfinder is touched, and again before each ticket in step 4, when the working tree is not clean or a merge is in progress: it shows `git status` verbatim and ends the run at the report, and never runs `git merge --abort`, `git stash`, `git reset` or `git checkout -- <file>` to get a clean tree. A stopped update's open merge therefore waits for Daniel instead of being cleaned up on his behalf. New scenario case `evals/implement-tickets/stopped-merge-next-run`.
