# Updating a behind ticket branch

Read this when step 1 found at least one hit. Work the hits in wayfinder order.

1. Tell Daniel which ticket is being updated, then invoke `implement-ticket` with `<n> update`. It runs in the background, so that message is the only sign of progress until its report returns.
2. On `stopped`, show it verbatim, post `Update stop for #<n>: <stop, verbatim>` on the wayfinder and end the run at the report. The repository stays as the stop left it, mid-merge, until Daniel decides; the hits after this one are named as not updated. No review runs on that branch: a stop is not a review finding and must not become one of class `conflict`.
3. On `done` for a hit that was behind or had merge conflicts, push the branch when a remote exists with a plain `git push`, never `--force` or `--force-with-lease`, since the update only adds a merge commit. With a forge, watch the checks as in step 6.2. No review runs: the update holds no ticket behaviour of its own, and `implement-ticket` already ran the scenario tests and `ci.command` on the merged branch.
4. On `done` for a hit that came from an `Update stop for #<n>` entry, invoke `review-change` once with `<n> <base>`, `<base>` the merge-base of the branch and the default branch, and handle its findings exactly as step 5 does. A conflict waits for Daniel like any other stop: post it as in item 2 and end the run at the report. Once review leaves nothing open, push and watch the checks as in item 3, then post `Update stop for #<n> resolved` on the wayfinder, so the next run stops counting this ticket a hit.
5. Checks still red after step 6.2 are a stop handled as in item 2, posted as `Update stop for #<n>: checks still red`.
