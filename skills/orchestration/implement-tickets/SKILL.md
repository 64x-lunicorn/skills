---
name: implement-tickets
description: Implements one or many agreed tickets in wayfinder order, each in a fresh subagent on its own branch, reviewed on a spec and a standards axis and delivered as its own pull request, and verifies and closes the Spec once all its tickets are merged.
argument-hint: "[ticket numbers, or a wayfinder issue number]"
disable-model-invocation: true
---

Turns agreed tickets into pull requests, one ticket at a time. Slow is steady: every ticket is built in a fresh context, reviewed by agents that did not write it, and stopped at the first deviation instead of guessed around. Merging stays with Daniel.

## 0. Check project setup

Read `.claude/64x-lunicorn.yml` in the project root, then go on with step 1 in every case; the notice informs, it does not block:

- File missing: print `Project setup missing. Run /64x-lunicorn:setup-project.`
- `setup_version` below 3: print `Project setup outdated. Re-run /64x-lunicorn:setup-project.`

## 1. Reconcile the wayfinder

Find the wayfinder: the argument, or the `Order: #<n>` part of the named tickets' reference line. Supported trackers are GitHub via `gh` and local issue files; for any other forge, stop and name the gap.

For every unchecked ticket in the wayfinder that is closed because its pull request was merged, check it off and mark its node `done` in the progress graph. A ticket whose pull request was closed without merging stays unchecked and is named to Daniel. Without this step, merged work never unblocks the tickets waiting for it.

**Done when** every closed ticket is checked off in the wayfinder and nothing else changed there.

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

Before each ticket: the working tree is clean, and the default branch from `.claude/64x-lunicorn.yml` is checked out and up to date with `git pull --ff-only`.

Invoke `implement-ticket` with the ticket number. It runs in a fresh subagent and returns a report that ends either `done` or `stopped`.

On `stopped`, show Daniel the reason and the passage it concerns, verbatim, and post the same as a comment on the wayfinder. Ask how to proceed and leave the ticket untouched until he decides; working around a stop is exactly the drift this skill prevents.

**Done when** the report says `done` with a branch and commits, or the stop is shown to Daniel and posted.

## 5. Review

Invoke `review-change` twice, as separate runs: `<ticket> <base> spec` and `<ticket> <base> standards`, with `<base>` the merge-base of the branch and the default branch. Separate runs keep one axis from masking the other, and neither shares the implementer's reasoning.

- **Hard findings:** write them to a file in the scratchpad and invoke `implement-ticket` with `<ticket> fix <file>`. Then run both reviews again, fresh. After two fix rounds, hard findings still open go to Daniel.
- **Judgement findings:** interview Daniel on them with `interview-user`, one decision per finding, and keep his decisions verbatim. Accepted ones are fixed in one more fix round, followed by both reviews.
- **Conflicts:** present them to Daniel before any fix round, with every quoted source. The ticket waits for his decision like a stop; which source gives way is his call, and a change to Spec, ticket or architecture issue happens outside this run.

**Done when** no hard finding is open, every judgement finding has Daniel's decision, and no conflict is open.

## 6. Open the pull request

1. On the ticket branch, run `ci.command` from `.claude/64x-lunicorn.yml`. The last fix round may have changed code after the implementer's own run.
2. Push the branch and create the pull request from [the pull request template](references/pull-request-template.md), with the body passed as a file.
3. Watch the checks with `gh pr checks <pr> --watch`. When they fail, invoke `implement-ticket` with `<ticket> fix <file>` holding the failing job's log, once. Still red: stop and show Daniel.

Never merge and never enable auto-merge. Then go back to step 4 with the next ticket.

**Done when** the pull request is open, its checks are green, and Daniel has its link.

## 7. Report

End with one report:

- **Spec:** the verification result, the terms recorded with `CONTEXT.md` named as changed and not committed, the terms still missing, follow-up tickets created, or the issues closed, when step 2 ran.
- **Per ticket:** pull request link, review rounds per axis, Daniel's decisions verbatim.
- **Stopped:** tickets with their stop reason.
- **Waiting:** tickets dropped for an open blocker, with the pull request to merge first.

**Done when** every ticket from step 3, dropped ones included, and the outcome of step 2 appear in the report.
