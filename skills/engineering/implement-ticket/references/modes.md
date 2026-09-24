# Fix mode and update mode

Read this when the arguments carry `fix <findings file>` or the word `update`. Steps 1 and 2 have run; these sections replace step 3 and lead back into steps 5 and 6.

## Fix mode

With `fix <file>`, the file holds findings as `review-change` returns them (class, location, quote, source, fix), or the log of a failing CI job. Apply exactly those on the ticket branch: a behaviour finding test-first with `write-tests`, everything else directly. Change nothing the file does not name. A finding classed `conflict`, or one that contradicts the ticket, the Spec or the architecture, is not applied; report it as a stop. Then run steps 5 and 6.

## Update mode

With `update`, the ticket branch is brought up to date with the default branch. Only this ticket knows what its side of the merge set out to achieve; a resolver working from the branch name alone guesses it.

1. Check out the existing branch whose name starts with `ticket/<n>-`.
2. Invoke `resolve-merge` and hand it the intent of this side as text, from what section 1 read: the ticket's reference (its number, and its file name with local issues), its Goal and Scope in its own words, the Spec's reference, and the names of the ticket's scenarios. Ask for the ticket's reference and scenario names to appear in the merge commit body as handed over; that is what traces the merge back to the ticket.
3. On `merged`, run this ticket's scenario tests by their names, then steps 5 and 6. A scenario test failing after the merge is a stop returned with its failing output, and steps 5 and 6 do not run: the required checks do not run scenario tests, so nothing later would catch it.
4. On `stopped: incompatible intents` or `stopped: checks failed`, return the stop verbatim, quoted sources or failing output included. The merge stays open for Daniel.

Report as in section 7, with Outcome `done` or the stop, Branch and commits the merge commit and any refactor commits or `no merge commit, already up to date`, and Deviations the files the merge resolved.

**Done when** the scenario tests pass after `merged` and steps 5 and 6 are done, or a stop is returned verbatim with the merge still open.
