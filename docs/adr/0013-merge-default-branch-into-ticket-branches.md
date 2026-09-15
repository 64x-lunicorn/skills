# 0013 — Merge the default branch into ticket branches

Status: accepted, 2026-09-15. Extends [0008](0008-implementing-tickets.md). Realises the merge decision of Spec #24.

## Context

`implement-tickets` builds tickets one after another, each on its own branch with its own pull request, and Daniel merges (ADR 0008). The generated ruleset requires a branch to be up to date with the default branch, and the default branch takes squash merges only. After any merge, every other open ticket pull request is behind and must be brought up to date, sometimes with merge conflicts. Reviews have already seen the ticket branch's commits, and a push to it is never forced.

## Decision

**A ticket branch is brought up to date by merging the default branch into it, never by rewriting its history.** `resolve-merge` holds the discipline, how the merge is run, resolved, checked and recorded.

## Consequences

- Each merge conflict is resolved once, and every commit a review saw stays on the branch, so the push stays normal.
- A ticket branch carries merge commits; the squash merge still leaves one commit on the default branch.
- A stop leaves the repository mid-merge, so the next run's clean-tree rule waits until Daniel decided.
- `git diff <merge-base>...HEAD` after the update is the ticket's own diff on the current default branch, so `review-change` needs no change.

## Alternatives

- **Rebase onto the default branch:** rewrites commits the review saw, resolves the same merge conflict once per commit, and needs a force push.
- **The forge's update-branch button:** off in the generated settings and resolves no merge conflicts.
- **Branch each ticket only after its blockers merged:** tickets without dependencies still share a base commit, and the up-to-date rule still applies.
- **Amend ADR 0008:** an accepted decision is not edited.
