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

## 10. Report

Name every picked-up issue with number and title, and every issue that was left out with its reason, for example a `needs-info` issue without a reporter reply. Later steps add what triage did with each issue.

**Done when** Daniel has the report.
