# Bugfix and Spec-less task

Read this when step 1 recognises the issue as a bugfix or a Spec-less task. It replaces the reading and the stops of step 1 that concern a Spec, and step 3.

## Recognition

The issue is a bugfix when its label is `bugfix`, and a Spec-less task when its label is `task` and its body starts with `> Task without a Spec.`. A bugfix starts with `> Bugfix for Bug #<n>.` or `> Bugfix without a Bug issue.` Neither has a Spec, an architecture issue, a wayfinder or an integration test ticket, so read none of them; the issue's own Goal, Diagnosis (bugfix), scenarios and Implementation notes are the whole contract. Read `CONTEXT.md` and the ADRs as usual.

## Step 1 stops

The stops for a closed issue, an open blocker, empty Implementation notes (no seams agreed), an ambiguous scenario and a contradiction inside the issue stay. The stops for the reference line, verbatim Spec scenarios and Spec domain rules do not apply.

## Step 3 instead

Create the branch as in step 3; nobody wrote the scenario tests before you, so write them yourself with `write-tests` at the seams of the Implementation notes, named after the scenarios verbatim.

- **Bugfix, red then green:** each scenario test must fail on the unchanged code before any fix, for the reason the Diagnosis names. A test that passes on the unchanged code does not show the bug: stop. Record the failing run in the report, then build the fix in step 4 until the tests pass.
- **Spec-less task, green before and green after:** each scenario test pins today's behaviour, so it must pass on the unchanged code. Commit the tests green before any change; one that fails means the scenario misdescribes the code: stop. Step 4 changes the code with these tests staying unchanged and green.

**Done when** every scenario has a test at its seam and, for a bugfix, its red run is recorded, or, for a task, its green run before any change.

## Report

Scenarios: each with its test file and, for a bugfix, its red run and its green run; for a task, its green run before and after. Pull requests for these issues start `Closes #<n>. Bug: #<bug>.` or `Closes #<n>. Task without a Spec.`, never `Fixes #<bug>`.
