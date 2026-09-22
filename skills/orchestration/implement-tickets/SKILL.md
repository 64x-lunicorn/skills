---
name: implement-tickets
description: Implements one or many agreed tickets in wayfinder order, each in a fresh subagent on its own branch, reviewed once and delivered as its own pull request, and verifies and closes the Spec once all its tickets are merged.
argument-hint: "[ticket numbers, or a wayfinder issue number]"
disable-model-invocation: true
---

Turns agreed tickets into pull requests, one ticket at a time. Slow is steady: every ticket is built in a fresh context, reviewed by agents that did not write it, and stopped at the first deviation instead of guessed around. Merging stays with Daniel.

## 0. Check project setup

Read `.claude/64x-lunicorn.yml` in the project root, then go on with step 1 in every case; the notice informs, it does not block:

- File missing: print `Project setup missing. Run /64x-lunicorn:setup-project.`
- `setup_version` below 3: print `Project setup outdated. Re-run /64x-lunicorn:setup-project.`

## 1. Reconcile the wayfinder and update behind branches

First, before the wayfinder is touched: when `git status --porcelain` prints anything or a merge is in progress (`git rev-parse -q --verify MERGE_HEAD` succeeds), stop, show `git status` verbatim and end the run at the report. Leave the repository exactly as it is: an earlier update that stopped left its merge open for Daniel to decide, so `git merge --abort`, `git stash`, `git reset` or `git checkout -- <file>` would decide on his behalf. Never run them to get a clean tree.

Find the wayfinder: the argument, or the `Order: #<n>` part of the named tickets' reference line. Supported trackers are GitHub via `gh` and local issue files; for any other forge, stop and name the gap.

For every unchecked ticket in the wayfinder that is closed because its pull request was merged, check it off and mark its node `done` in the progress graph. A ticket whose pull request was closed without merging stays unchecked and is named to Daniel. Without this step, merged work never unblocks the tickets waiting for it.

Then bring behind ticket branches up to date, before any new ticket starts. Daniel merges only squash commits into a default branch that requires branches to be up to date, so every merge puts the other open ticket pull requests behind.

1. Check out the default branch and, when a remote exists, run `git pull --ff-only`, so behind is measured against the current default branch.
2. Find this run's hits, once: an unchecked ticket whose branch is behind or has merge conflicts, or one whose update stopped after an earlier merge commit and has not been picked up again since.
   - **`forge: github`:** one `gh pr list --state open --base <default_branch> --json number,headRefName,closingIssuesReferences,mergeStateStatus,mergeable`. A pull request belongs to an unchecked ticket of the wayfinder when `closingIssuesReferences` names it, else when `headRefName` starts with `ticket/<n>-`. It is a hit when `mergeStateStatus` is `BEHIND` or `DIRTY`, or `mergeable` is `CONFLICTING`. `UNKNOWN` means GitHub is still calculating: query again up to three times, ten seconds apart; still `UNKNOWN`, name the pull request to Daniel as undetermined and leave it for the next run.
   - **`forge: none`:** for each local `refs/heads/ticket/<n>-*` of an unchecked ticket, run `git merge-base --is-ancestor <default_branch> <ref>`. Exit 1 means behind, a hit; any other non-zero exit is an error: stop and show it.
   - **Every tracker:** an unchecked ticket is a hit too when the wayfinder's last `Update stop for #<n>` entry for it — a comment, read with `gh issue view <wayfinder> --comments`, or without a forge the last matching line under the wayfinder's final `## Update stops` section — is not yet followed by an `Update stop for #<n> resolved` entry. The merge commit an earlier update recorded already landed on the branch, so git and `gh pr list` no longer report it behind or conflicting; only the wayfinder still shows the stop as open, whatever its cause: a scenario failing after the merge, a conflict from the review that follows, or a red `ci.command`, before or after the push.
3. For each hit, in wayfinder order:
   1. Tell Daniel which ticket is being updated, then invoke `implement-ticket` with `<n> update`. It now runs in the background, so that message is the only sign of progress until its report returns. On `stopped`, such as `stopped: incompatible intents`, handle it like a stop in step 4: show it verbatim, post `Update stop for #<n>: <stop, verbatim>` on the wayfinder — a comment on a forge, else a line added under the wayfinder's final `## Update stops` section, the section added when the wayfinder has none yet — and end the run at the report: the repository stays as the stop left it, mid-merge after incompatible intents or failed checks, until Daniel decides, and the hits after this one are named as not updated. No review runs on that branch, because a stop is not a review finding and must not become one of class `conflict`.
   2. On `done` for a ticket that was a hit only because it was behind or had merge conflicts, push the branch when a remote exists, with a plain `git push`, never with `--force` or `--force-with-lease`: the update only adds a merge commit, so every commit already on the branch stays. With a forge, watch the checks as in step 6.2. No review runs: the update holds no ticket behaviour of its own, and `implement-ticket` already ran the scenario tests and `ci.command` on the merged branch.
   3. On `done` for a ticket that was a hit through its wayfinder's `Update stop for #<n>` entry — an update that stopped after an earlier merge commit, picked up again — invoke `review-change` once with `<n> <base>`, `<base>` the merge-base of the branch and the default branch, and handle its findings exactly as step 5 does. A conflict waits for Daniel like any other stop: post `Update stop for #<n>: <conflict, verbatim>` on the wayfinder the same way as item 1 and end the run at the report. Once review leaves nothing open, push and watch the checks as in item 2, then post `Update stop for #<n> resolved` on the wayfinder the same way `Update stop for #<n>` was posted, so the next run's detection above stops counting this ticket a hit.

   Checks still red after step 6.2, on either kind of hit, are a stop handled the same way as item 1: shown verbatim, posted on the wayfinder as `Update stop for #<n>: checks still red`, ending the run at the report, with the hits after this one named as not updated.

Check only here, at the start of the run. A pull request Daniel merges while the run goes on puts other branches behind only after this check; they are updated at the start of the next run, not in this one.

**Done when** the run stopped on a working tree that was not clean or a merge in progress, with `git status` shown and the repository unchanged, or every closed ticket is checked off in the wayfinder and nothing else changed there, and every ticket branch that was behind, had merge conflicts or carried an open `Update stop` entry at the check is updated, reviewed when its hit came from that entry, and, when a remote exists, pushed, with its checks green on a forge, or its stop is shown and posted, or it comes after a stop and is named as not updated, or it is named as undetermined.

## 2. Verify a completed Spec

Skip this step while any ticket in the wayfinder is unchecked.

When every ticket is checked off, the Spec is built but not yet proven as a whole: each review saw one ticket. Invoke `verify-spec` with the Spec number from the wayfinder's reference line. It runs in a fresh subagent and returns completeness, findings and a closing summary without changing anything.

Present the result to Daniel: completeness first, then conflicts and hard findings. Then record the missing terms through `write-term`, as the first bullet below says. Then interview him on the judgement findings with `interview-user`, one decision per finding, keeping his decisions verbatim.

- **Missing terms** (hard findings naming a Spec term missing from `CONTEXT.md`): invoke `write-term` once with every missing term and the meaning from its line in the Spec's `## Terms`, before the judgement interview and before any other question. They never become follow-up tickets: a term line needs no implementer and no review. `write-term` shows Daniel the lines and ends the turn on its question, so the close question waits until every term is in `CONTEXT.md`. Once `write-term` has answered, go on with the judgement interview, the remaining bullets of this step and then step 3, so follow-up tickets cut here are offered like after any other verification. Go on the same way when it appends only some lines or records nothing, such as when Daniel strikes a term or there is no root `CONTEXT.md`. A term still missing keeps the Spec open, because no Spec closes while one of its terms is missing from `CONTEXT.md`; name it in the step 7 report, with `write-term`'s pointer to `write-agent-docs` when the root `CONTEXT.md` is missing.
- **Work to do** (the other hard findings, and judgement findings Daniel accepts): ask "Cut follow-up tickets for these findings as sub-issues of Spec #<spec>?" On a yes, cut them with `design-ticket`, fill their implementation notes from the findings' locations and the architecture decisions they name, create them as sub-issues labelled `task`, and add them to the wayfinder under a new phase `Verification follow-ups`. They are chosen in step 3 like any other ticket; the Spec stays open and is verified again once they are merged.
- **Conflicts:** the Spec stays open. Which source gives way is Daniel's call, outside this run.
- **Nothing open** (every term of the Spec in `CONTEXT.md`, no hard finding, no conflict and no judgement finding Daniel accepted): ask "Close Spec #<spec>, architecture issue #<architecture> and wayfinder #<wayfinder>?" On a yes, post the closing summary as a comment on the Spec and close all three. For local issue files, set `status: closed` and append the summary to the Spec.

**Done when** the wayfinder has an unchecked ticket, or follow-up tickets exist, or a conflict waits for Daniel, or a Spec term stays missing after `write-term`'s answer or stop, named in the report, or the Spec, architecture issue and wayfinder are closed. While `write-term` waits for Daniel's answer on missing terms, this step is paused, not done: it goes on after his answer.

## 3. Choose the tickets

- **Ticket numbers given:** those tickets, ordered as in the wayfinder.
- **Wayfinder given:** its frontier, the unchecked tickets whose blockers are all closed, in phase order.
- **Nothing given:** list the frontier and ask which.

Drop a ticket and say why when it is closed, has no `task` label, is labelled `spec`, `architecture` or `wayfinder`, or points into `research/`. For local issue files, the label is the frontmatter `type`, the state is `status` with `closed` meaning closed, and every number in `blocked_by` is open until its own file says `closed`. Drop it too when a blocker is still open, even if the blocker is part of this run: dependent work starts only after Daniel has merged the blocker's pull request.

When no ticket remains, go to step 7.

Read back number, title and Spec of every remaining ticket, and ask: "Implement <#n title, …> in this order, each on its own branch with a pull request?" Only a yes to this question counts; branches and pull requests are visible to others.

**Done when** Daniel has confirmed the list and every dropped ticket is named with its reason, or no ticket remains.

## 4. Implement

Before each ticket: when the working tree is not clean or a merge is in progress, stop as at the start of step 1, with `git status` shown verbatim, the repository left as it is and the run ended at the report. Otherwise check out the default branch from `.claude/64x-lunicorn.yml` and bring it up to date with `git pull --ff-only`.

Tell Daniel the ticket is starting, then invoke `implement-ticket` with the ticket number. It runs in a fresh, background subagent, so that message is what shows the run is alive while it builds; wait for its report, which ends either `done` or `stopped`.

On `stopped`, show Daniel the reason and the passage it concerns, verbatim, and post the same as a comment on the wayfinder. Ask how to proceed and leave the ticket untouched until he decides; working around a stop is exactly the drift this skill prevents.

**Done when** Daniel saw the ticket start, and the report says `done` with a branch and commits, or the stop is shown to Daniel and posted.

## 5. Review

Tell Daniel the review is starting, then invoke `review-change` once with `<ticket> <base>`, `<base>` the merge-base of the branch and the default branch. It runs in a fresh, background subagent that does not share the implementer's reasoning; that message is what shows the run is alive while it reads.

- **Conflicts:** present them to Daniel first, with every quoted source. The ticket waits for his decision like a stop; which source gives way is his call, and a change to Spec, ticket or architecture issue happens outside this run.
- **Judgement findings:** interview Daniel on them with `interview-user`, one decision per finding, and keep his decisions verbatim.
- **Fix once:** write the hard findings and the judgement findings Daniel accepted to a file in the scratchpad, tell Daniel the fix run is starting, then invoke `implement-ticket` with `<ticket> fix <file>`. It ends with `ci.command` green. No second review runs: Daniel reviews the pull request, and a loop of reviews costs more than it finds.
- **Files named `not checked`:** name them to Daniel with the pull request.

**Done when** Daniel saw the review start, no conflict is open, every judgement finding has Daniel's decision, and the fix run returned `done`, or there was nothing to fix.

## 6. Open the pull request

1. Push the branch and create the pull request from [the pull request template](references/pull-request-template.md), with the body passed as a file.
2. Watch the checks with `gh pr checks <pr> --watch`. When they fail, tell Daniel a fix run is starting, then invoke `implement-ticket` with `<ticket> fix <file>` holding the failing job's log, once. Still red: stop and show Daniel.

Never merge and never enable auto-merge. Then go back to step 4 with the next ticket.

**Done when** the pull request is open, its checks are green, and Daniel has its link.

## 7. Report

End with one report:

- **Spec:** the verification result, the terms recorded with `CONTEXT.md` named as changed and not committed, the terms still missing, follow-up tickets created, or the issues closed, when step 2 ran.
- **Updated:** pull requests or, without a forge, ticket branches brought up to date in step 1, each with its pull request link or, without a forge, its branch name, pull requests named as undetermined, the hits after a stop named as not updated, and, for a hit picked up from its wayfinder's `Update stop` entry, its review findings fixed and Daniel's decisions verbatim.
- **Per ticket:** pull request link, review findings fixed, files `not checked`, Daniel's decisions verbatim.
- **Stopped:** tickets with their stop reason, updates included, and a stop on a working tree that was not clean or a merge in progress, with its `git status` verbatim.
- **Waiting:** tickets dropped for an open blocker, with the pull request to merge first.

**Done when** every ticket from step 3, dropped ones included, every branch updated, stopped, named as undetermined or named as not updated in step 1, and the outcome of step 2 appear in the report.
