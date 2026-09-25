---
name: implement-tickets
description: Implements one or many agreed tickets in wayfinder order, or bugfix and Spec-less task issues by number, each in a fresh subagent on its own branch, reviewed once and delivered as its own pull request, and verifies and closes the Spec once all its tickets are merged.
argument-hint: "[ticket numbers, or a wayfinder issue number]"
disable-model-invocation: true
---

Turns agreed tickets into pull requests, one ticket at a time. Slow is steady: every ticket is built in a fresh context, reviewed by agents that did not write it, and stopped at the first deviation instead of guessed around. Merging stays with Daniel.

Supported trackers are GitHub via `gh` and local issue files; for any other forge, stop and name the gap. With `forge: none` or `issues.tracker: local`, read [references/local-tracker.md](references/local-tracker.md) for the file conventions, the behind detection, where update stops are recorded and how a Spec is closed.

## 0. Check project setup

Read `.claude/64x-lunicorn.yml` in the project root, then go on with step 1 in every case; the notice informs, it does not block:

- File missing: print `Project setup missing. Run /64x-lunicorn:setup-project.`
- `setup_version` below 3: print `Project setup outdated. Re-run /64x-lunicorn:setup-project.`

## 1. Reconcile the wayfinder and update behind branches

Before the wayfinder is touched: when `git status --porcelain` prints anything or a merge is in progress (`git rev-parse -q --verify MERGE_HEAD` succeeds), stop, show `git status` verbatim and end the run at the report. An earlier update that stopped left its merge open for Daniel to decide, so never run `git merge --abort`, `git stash`, `git reset` or `git checkout -- <file>` to get a clean tree.

Find the wayfinder: the argument, or the `Order: #<n>` part of the named tickets' reference line. Skip the rest of this step when every named issue is a bugfix or Spec-less task (label `bugfix`, or `task` with a first line `> Task without a Spec.`): they have no wayfinder, no order and no Spec to close.

Check off every unchecked ticket that is closed because its pull request was merged and mark its node `done` in the progress graph; without this, merged work never unblocks the tickets waiting for it. A ticket whose pull request was closed without merging stays unchecked and is named to Daniel.

Then bring behind ticket branches up to date, before any new ticket starts: the default branch requires branches to be up to date, so every merge puts the other open ticket pull requests behind.

1. Check out the default branch and, when a remote exists, run `git pull --ff-only`, so behind is measured against the current default branch.
2. Find this run's hits, once. An unchecked ticket is a hit when its branch is behind or has merge conflicts, or when its update stopped after an earlier merge commit and has not been picked up again since.
   - **`forge: github`:** one `gh pr list --state open --base <default_branch> --json number,headRefName,closingIssuesReferences,mergeStateStatus,mergeable`. A pull request belongs to an unchecked ticket when `closingIssuesReferences` names it, else when `headRefName` starts with `ticket/<n>-`. It is a hit when `mergeStateStatus` is `BEHIND` or `DIRTY`, or `mergeable` is `CONFLICTING`. On `UNKNOWN` GitHub is still calculating: query again up to three times, ten seconds apart, then name the pull request to Daniel as undetermined and leave it for the next run.
   - **Every tracker:** a ticket is a hit too when the wayfinder's last `Update stop for #<n>` entry, read with `gh issue view <wayfinder> --comments`, is not yet followed by an `Update stop for #<n> resolved` entry. The merge commit an earlier update recorded already landed, so git and `gh pr list` no longer report the branch behind or conflicting; only the wayfinder still shows the stop as open, whatever its cause.
3. For each hit, in wayfinder order, follow [references/behind-branches.md](references/behind-branches.md).

Check only here. Branches that fall behind while the run goes on are updated at the start of the next run.

**Done when** the run stopped on an unclean tree or open merge with the repository unchanged, or every merged ticket is checked off and every hit is updated, reviewed where its hit came from an `Update stop` entry, pushed, or shown and posted as a stop, named as not updated after a stop, or named as undetermined.

## 2. Verify a completed Spec

Skip this step without a wayfinder, and while any ticket in the wayfinder is unchecked. When every ticket is checked off, follow [references/verify-and-close-spec.md](references/verify-and-close-spec.md): it holds the `verify-spec` run, the missing terms, the follow-up tickets and the close question.

**Done when** the wayfinder has an unchecked ticket, or follow-up tickets exist, or a conflict waits for Daniel, or a Spec term stays missing and is named in the report, or the three issues are closed. While `write-term` waits for Daniel's answer, this step is paused, not done.

## 3. Choose the tickets

- **Ticket numbers given:** those tickets, ordered as in the wayfinder. Bugfix and Spec-less task numbers need no `Order:` and no wayfinder, and stay in the order given.
- **Wayfinder given:** its frontier, the unchecked tickets whose blockers are all closed, in phase order.
- **Nothing given:** list the frontier and ask which.

Drop a ticket and say why when it is closed, has neither a `task` nor a `bugfix` label, is labelled `spec`, `architecture` or `wayfinder`, or points into `research/`. Drop it too when a blocker is still open, even if the blocker is part of this run: dependent work starts only after Daniel has merged the blocker's pull request.

When no ticket remains, go to step 7.

Read back number, title and Spec of every remaining ticket (number and title only for a bugfix or Spec-less task, which has no Spec), and ask: "Implement <#n title, …> in this order, each on its own branch with a pull request?" Only a yes to this question counts; branches and pull requests are visible to others.

**Done when** Daniel has confirmed the list and every dropped ticket is named with its reason, or no ticket remains.

## 4. Implement

Before each ticket: stop as at the start of step 1 when the tree is not clean or a merge is in progress; otherwise check out the default branch and `git pull --ff-only`.

Tell Daniel the ticket is starting, then invoke `implement-ticket` with the ticket number. It runs in a fresh, background subagent, so that message is what shows the run is alive; wait for its report, which ends `done` or `stopped`.

On `stopped`, show Daniel the reason and the passage it concerns, verbatim, and post the same as a comment on the wayfinder, or on the issue itself for a bugfix or Spec-less task, which has no wayfinder. Ask how to proceed and leave the ticket untouched until he decides; working around a stop is exactly the drift this skill prevents.

**Done when** Daniel saw the ticket start, and the report says `done` with a branch and commits, or the stop is shown to Daniel and posted.

## 5. Review

Tell Daniel the review is starting, then invoke `review-change` once with `<ticket> <base>`, `<base>` the merge-base of the branch and the default branch. It runs in a fresh, background subagent that does not share the implementer's reasoning.

- **Conflicts:** present them to Daniel first, with every quoted source. The ticket waits for his decision like a stop; a change to Spec, ticket or architecture issue happens outside this run.
- **Judgement findings:** interview Daniel on them with `interview-user`, one decision per finding, kept verbatim.
- **Fix once:** write the hard findings and the accepted judgement findings to a file in the scratchpad, tell Daniel the fix run is starting, then invoke `implement-ticket` with `<ticket> fix <file>`. It ends with `ci.command` green. No second review runs: Daniel reviews the pull request, and a loop of reviews costs more than it finds.
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
- **Updated:** the branches brought up to date in step 1, each with its pull request link or branch name, pull requests named as undetermined, the hits after a stop named as not updated, and, for a hit from an `Update stop` entry, its review findings fixed and Daniel's decisions verbatim.
- **Per ticket:** pull request link, review findings fixed, files `not checked`, Daniel's decisions verbatim.
- **Stopped:** tickets with their stop reason, updates included, and a stop on an unclean tree or open merge with its `git status` verbatim.
- **Waiting:** tickets dropped for an open blocker, with the pull request to merge first.

**Done when** every ticket from step 3, every branch from step 1 and the outcome of step 2 appear in the report.
