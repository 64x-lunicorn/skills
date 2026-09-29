---
name: triage-issues
description: Starts triage by picking up the issues waiting for it, the ones Daniel names or else every unlabelled issue, every needs-triage issue and every needs-info issue whose reporter replied since the last triage.
argument-hint: "[issue numbers]"
disable-model-invocation: true
---

Turns issues nobody has looked at into work with a route. Reporters file Bug and Request issues that arrive with `needs-triage` or with no label at all, and nothing else picks them up; without this run they wait forever. Triage posts and changes nothing on an issue until a later step says so, and it never files an issue for an automated dependency update pull request: those already have their own path through the CI gate.

Supported trackers are GitHub via `gh`. With `issues.tracker: local` print `Nothing to triage: this project tracks issues as local files. File a bugfix or task issue file directly.` and stop, since without a forge nobody reports from outside. For any other forge, stop and name the gap: triage has no verified procedure there yet.

## 0. Check project setup

Read `.claude/64x-lunicorn.yml` in the project root, then go on with step 2 in every case; the notice informs, it does not block:

- File missing: print `Project setup missing. Run /64x-lunicorn:setup-project.`
- `setup_version` below 3: print `Project setup outdated. Re-run /64x-lunicorn:setup-project.`

## 2. Pick up the waiting issues

Follow [references/tracker.md](references/tracker.md) for the commands.

- **Issue numbers given:** exactly those issues, whatever their labels, read with their comments. A number that resolves to a pull request or a closed issue is left out with that reason and not handled.
- **Nothing given:** the union of three lists, each issue once:
  1. every open issue without any label, because reports filed from a session by someone without write access arrive unlabelled;
  2. every open issue labelled `needs-triage`;
  3. every open `needs-info` issue whose reporter replied since the last triage. The last triage is the newest comment carrying the line `Written by Claude during triage, reviewed by Daniel.`; a reply is any newer comment without that line, whoever wrote it, Daniel and bots included. A `needs-info` issue with no triage comment at all counts as waiting, because its label was set by hand. A `needs-info` issue nobody commented on since stays out, or a reporter who has not answered would be asked again.

Pull requests are never picked up. `gh issue list` returns issues only, so an automated dependency update pull request never appears, and no issue is created for it.

Tell Daniel which issues were picked up, with number, title and why each is waiting. When none is waiting, say so and go to step 10.

**Done when** Daniel has the list of picked-up issues with the reason for each, or was told that none is waiting.

## 3. Examine each picked-up issue

Triage asks Daniel nothing about an issue before it has looked at what the project already has. For each picked-up issue, in this order:

1. **Existing behaviour.** Search the codebase (Glob, Grep, Read) by the issue's domain terms, their synonyms and the names in its title, and read what already does part of the asked job. A Bug is checked against the code that should produce the behaviour it reports.
2. **Earlier rejections.** An earlier rejection is a closed issue with reason "not planned" or a research object with status `rejected` or `parked`. Search both by the issue's key terms, with the searches in [references/tracker.md](references/tracker.md): the closed issues, and the research objects under `research.path` from `.claude/64x-lunicorn.yml`. A hit is an earlier rejection when it asks for the same thing, not merely the same area; read its close comment or its README for the reason it gave.

Print this block for every picked-up issue, always, even when both searches found nothing, because Daniel judges the route by it and a finding left out looks like a search never done:

```
Examination of #<n> "<title>"
- Existing behaviour: <what already does part of the job, with file paths, or that none exists>
- Earlier rejections: <every hit with its reason, by number and title for an issue, by directory name and status for a research object, each marked `same request` or `same area only`, or `no earlier rejection found`>
```

A hit that is only in the same area is listed too, marked so, because Daniel decides whether it covers this issue; `no earlier rejection found` is written only when the searches returned no hit at all.

Print the blocks at the top of the same message that asks the first question of step 5, above that question and never folded into it or its recommended answer, where Daniel would read only a reason and miss the finding. A block printed in an earlier message is printed again there, since that message is the one Daniel answers. Change nothing on the issue.

**Done when** every picked-up issue has its existing behaviour and earlier rejections, issues and research objects, reported, or the statement that none was found, before Daniel was asked anything about it.

## 5. Route by kind of change

Decide the route of every picked-up issue from its kind of change, never from its size: a small change to new domain behaviour still needs a Spec, and a large refactor still needs none. The kinds and their routes:

| Kind of change | Route |
|---|---|
| Broken behaviour | bugfix |
| No behaviour change (refactor, docs, chore) | Spec-less task |
| New domain behaviour, clear | Spec |
| New domain behaviour, still unclear | research object |
| Open feasibility question (spike) | research object |
| Rejected, out of scope or duplicate | closed with reason |

Ask only below the step 3 blocks. Ask Daniel which kind it is, through `interview-user`, one issue at a time, with a recommended kind and the reason for it taken from what the examination found. Daniel decides: a reporter's label or wording is evidence, not the answer.

Then set the route:

- **Spec:** name `/64x-lunicorn:write-spec` in inline code as the next step for the issue.
- **Research object:** name `/64x-lunicorn:research-idea` in inline code as the next step for the issue.
- Triage is user-invoked and cannot call another user-invoked skill, so it names the command and creates neither a Spec nor a research object.
- Remove `needs-triage` and `needs-info` from the issue, and set no status label: the route is what steps 6 to 9 attach to, and a lingering triage label would put the issue back in the next run. Follow the Routing section of [references/tracker.md](references/tracker.md).
- **Bugfix, Spec-less task, closed with reason:** the route is recorded; the later steps carry it out.

**Done when** every picked-up issue has exactly one route with its kind of change confirmed by Daniel, and the issues routed to a Spec or a research object have the next command named.

## 10. Report

Name every picked-up issue with number and title, and every issue that was left out with its reason, for example a `needs-info` issue without a reporter reply. The examination of step 3 is included per issue. Later steps add what triage did with each issue.

**Done when** Daniel has the report.
