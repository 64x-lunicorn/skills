---
"64x-lunicorn-skills": minor
---

Add `resolve-merge`: the default branch is brought into the current branch with `git merge --no-ff --no-commit`, never by rebasing. For each merge conflict the intent of this side comes from the caller and the intent of the default branch from the commits that touched the file, their pull request, ticket and Spec; the resolved files keep both intents and hold only changes one of the two sides made. When both cannot be kept, the merge stays open and the run stops with `incompatible intents`, quoting both sides' sources, and Daniel decides. `ci.command` runs on the open merge; when it fails, the merge stays open and the run stops with `checks failed`. Only after the checks passed is the merge committed with a message drafted by `write-commit-message`. It never pushes, never aborts the merge and never edits issues. ADR 0013 records merge-not-rebase, and `CONTEXT.md` gains Merge conflict, Intent and Incompatible intents.
