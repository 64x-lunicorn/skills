---
name: implement-ticket
description: Implements one agreed ticket, bugfix or Spec-less task in a fresh subagent on its own branch, activating its pending scenarios or writing them itself for a bugfix or Spec-less task, building test-first at the agreed seams, reusing existing code and stopping at any deviation from ticket, Spec or architecture. Use when an agreed ticket, a bugfix issue or a Spec-less task is to be built, when review or CI findings on a ticket branch are to be fixed, or when a ticket's branch or pull request is to be brought up to date with main or the default branch, is behind it or has merge conflicts.
context: fork
agent: general-purpose
background: true
---

Implement: $ARGUMENTS

The arguments are a ticket number, optionally followed by `fix <findings file>`, or a ticket number and the word `update` in any order. `fix <findings file>` is always fix mode. You run without the conversation that led here: the ticket, its Spec, the architecture issue and the repository are your only sources. Build exactly what the ticket asks and stop at anything that does not fit; a guess here becomes drift nobody decided. Never push, open or merge pull requests, or edit issues.

## 1. Read and check

Read `.claude/64x-lunicorn.yml` for `ci.command` and the tracker. With `issues.tracker: forge`, read issues with `gh issue view <n> --comments`; with `local`, issue `<n>` is the file in `issues.path` whose name starts with the number, zero-padded to four digits, its label the frontmatter `type`, its state `status`, and every number in `blocked_by` open until its own file says `closed`.

Read the ticket. A bugfix (label `bugfix`) or a Spec-less task (label `task`, body starting `> Task without a Spec.`) has no Spec and no architecture issue: follow [references/without-spec.md](references/without-spec.md) instead of the rest of this step and of step 3.

Otherwise its reference line starts with `> Part of Spec #<spec>. Architecture: #<architecture>.` and may carry more parts such as `Order:`; numbers may be zero-padded. Read the Spec and the architecture issue it names, `CONTEXT.md` when the project has one, and the ADRs in `docs/adr/` that concern the area you touch.

Stop when:

- the ticket is closed, has no `task` label, or has an open blocker,
- its Implementation notes are empty, so no seams were agreed,
- its acceptance criteria are not the Spec's scenarios verbatim, compared by scenario name and step lines, ignoring the `Feature` line and indentation,
- a domain rule of the Spec must be decided by this ticket's seam but no scenario in any ticket covers it, so minimal code would break the rule without any test noticing,
- a domain rule or scenario allows two readings that lead to different code,
- ticket, Spec and architecture issue contradict each other.

**Done when** every scenario of the ticket has a named seam and the components it touches, or the run has stopped.

## 2. Inventory what exists

Before the first test, search the codebase for functions, types, modules, test helpers and patterns that already do part of the job: by the Spec's domain terms (the Goal and Diagnosis of the issue for a bugfix or Spec-less task), by similar names, and inside the components from the implementation notes.

Write the inventory: what you will reuse, and for everything new, why nothing existing fits. The reviewer checks the change against this list.

**Done when** every planned function, type and module has a reuse target or a reason to be new.

## 3. Branch and activate the scenarios

Create `ticket/<n>-<slug>` from the current default branch, `<n>` the ticket number without padding and `<slug>` three to five words of its title in kebab case. In fix mode, check out the existing ticket branch; in update mode, create no branch. Both follow [references/modes.md](references/modes.md) instead of the rest of this step.

Find this ticket's scenario tests by their names, which are the scenario names verbatim. Remove their pending marker, the skip, todo or tag the integration test ticket put on them, and nothing else. Run them: each must fail for the missing behaviour or interface. A scenario without a test, a failure from setup, a missing harness or broken wiring means the integration test ticket is not done: stop.

**Done when** this ticket's scenario tests run without their pending marker and fail for the missing behaviour or interface.

## 4. Build test-first

Build every behaviour with `write-tests`, at the seams from the implementation notes, until the ticket's scenarios pass one by one. Where `write-tests` says to ask the caller, stop and report instead; nobody can answer inside this run.

- Run the typecheck, when the project has one, and the affected test file after every green; the full suite comes in step 6.
- Follow the Decisions of the architecture issue; for a bugfix or Spec-less task, which has none, the seams of its Implementation notes. Needing a library, component or seam it does not name: stop.
- When the ticket adds, changes or removes an HTTP endpoint, build it with `design-http-api`, OpenAPI document and Bruno collection in the same commits. A per-API choice that is not recorded is a stop.
- Write only what the scenarios need; options, hooks and abstractions for later stay out.

After every green, compare `git diff --stat` with the components in the implementation notes. A file outside them is either reverted or recorded with its reason; a change inside another ticket's scope is a stop.

**Done when** every scenario of the ticket passes and every file outside the implementation notes is reverted or has a recorded reason.

## 5. Refactor under green

With all tests green, clean the change before committing:

- Replace code that duplicates something from the inventory, or itself, with the shared shape.
- Rename to the terms of the Spec and `CONTEXT.md`.
- Remove unused code, dead branches and parameters nobody passes. Parameters of a seam named in the implementation notes stay, even while unused.
- Split functions that do several things, so each name says what it does.

Change no behaviour: tests stay unchanged and green after every step.

**Done when** a reread of the full diff finds no duplicate of the inventory, no unused code, and all tests pass.

## 6. Verify and commit

Run `ci.command`. Fix failures inside the ticket's scope; a failure whose cause lies outside it is a stop.

Stage and commit yourself, with the message drafted by `write-commit-message` and `#<n>` referenced in the body. Several small commits are fine; unrelated changes are not.

**Done when** `ci.command` passes and the working tree is clean.

## Fix mode and update mode

With `fix <findings file>` or `update` in the arguments, read [references/modes.md](references/modes.md) after step 2 and follow it instead of step 3. It holds both modes and leads back into steps 5 and 6.

## 7. Report

Return exactly these parts; after a stop, every part the run did not reach says `Not reached`:

1. **Outcome:** `done`, or `stopped:` with the reason and the passage of ticket, Spec or architecture issue it concerns.
2. **Branch and commits.**
3. **Scenarios:** each with its test file and whether it passes.
4. **Inventory:** what was reused, and what is new with its reason.
5. **Deviations:** files outside the implementation notes with their reason, or `None`.

**Done when** the report has all five parts.
