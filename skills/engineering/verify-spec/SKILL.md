---
name: verify-spec
description: Verifies a Spec whose tickets are all merged, checking every scenario and domain rule on the default branch, duplication and drift across all ticket changes, and leftovers such as pending markers, and returns classified findings with a closing summary without changing anything. Use when a wayfinder is fully checked off, or when a Spec's implementation is verified before the Spec is closed.
context: fork
agent: Plan
background: false
---

Verify: $ARGUMENTS

The argument is a Spec number. You run without the conversation that led here. Every ticket of this Spec was reviewed on its own; your job is what only the whole shows: behaviour split across tickets, the same helper built twice, a decision followed in one ticket and dropped in another, scaffolding left behind. Change nothing: no edits, commits or comments. Running the project's checks is allowed.

## 1. Collect

- Read the tracker from `.claude/64x-lunicorn.yml`. With `issues.tracker: forge`, read issues with `gh issue view <n> --comments`. With `local`, issue `<n>` is the file in `issues.path` whose name starts with the number, zero-padded to four digits.
- Read the Spec. Find its sub-issues: on GitHub with `gh api repos/{owner}/{repo}/issues/<spec>/sub_issues`, for local files every file whose `parent` is the Spec's number. The label, or the frontmatter `type` for local files, tells them apart: `architecture`, `wayfinder`, and `task` for tickets. Read all of them.
- For every ticket, find its state and its change:
  - **GitHub:** `gh issue view <n> --json state,stateReason,closedByPullRequestsReferences` gives the state, whether it closed as completed or not planned, and the closing pull request; `gh pr diff <pr>` gives its change.
  - **Local files:** `status: closed` counts as completed unless the body has the line `Closed as not planned`. The change is the commits on the default branch whose subject or body references the ticket by its whole number, such as `#4` or `#0004` but never `#40`.

When a ticket is still open, return `Spec not complete` with the open tickets and stop; verifying a partial Spec reports gaps that are simply unbuilt. The architecture issue and the wayfinder are expected to be open here; they close together with the Spec.

**Done when** every ticket has its state and its change, or the Spec was reported as not complete.

## 2. Check completeness

- Every ticket is closed as completed with a change on the default branch. A ticket closed as not planned is named, not classed; that was Daniel's decision.
- Every ticket in the wayfinder is checked off.
- On the default branch, `ci.command` passes when run in the project root.
- Every scenario of the Spec has a test named like the scenario, with no pending marker (skip, todo or tag) left on it, and that test passes. A skipped scenario test does not pass, even when `ci.command` exits green.
- No check in `ci.checks` that runs the integration tests is still `required: false`. This is a finding even while scenarios are pending; its fix then waits for the pending ones.

**Done when** every point is checked.

## 3. Check the Spec as a whole

Search the whole repository, not only the tickets' changes: a rule can be broken by code no ticket touched, and duplication can repeat code older than the Spec.

- **Domain rules:** find every code path that reaches a rule's behaviour, including callers outside the changes. The rule has to hold on each of them.
- **Behaviour change:** every row's "After" is what the code now does.
- **Non-goals:** nothing the Spec rules out was built.
- **Terms:** the Spec's terms are used consistently across all changed code. Each `- **<term>**: <meaning>` line of the Spec's `## Terms` also needs a line starting with `**<term>**:` in the `CONTEXT.md` at the project root, compared case-insensitively; without a root `CONTEXT.md`, every term is missing. Each missing term is one finding, located at its line in the Spec's Terms with the meaning, so the term can be recorded as the Spec settled it before the Spec closes.

**Done when** every domain rule, behaviour change row, non-goal and line of the Spec's `## Terms` is checked.

## 4. Check across tickets

- **Duplication:** functions, types, constants and helpers that two tickets built for the same job, or that repeat code older than the Spec.
- **Architecture decisions:** each decision is followed by every ticket whose change touches its area, and, when the architecture issue has a Components section, its components still match the code.
- **Leftovers:** pending markers, skipped tests, TODOs naming a ticket, stubs and flags from intermediate steps, and code or test helpers that nothing uses or tests, whether they were used once or never.
- **Spread:** one behaviour scattered across files by several tickets, or one file changed by several tickets for unrelated reasons.

**Done when** the changes of all tickets are checked together against all four.

## 5. Classify

- **hard:** a failing check; a scenario missing, pending or failing; a domain rule broken on any path; a non-goal built; a departure from an architecture decision; duplication; a leftover; an advisory integration test check; a Spec term missing from `CONTEXT.md`.
- **judgement:** smells and naming that no source makes hard.
- **conflict:** sources contradict each other, so no change satisfies all of them. Quote every source involved.

Work found here becomes follow-up tickets, except missing terms, which are recorded in `CONTEXT.md` before the Spec closes; so give each finding a location precise enough to become implementation notes. Findings that one fix resolves form one finding and may name several sources; findings with different fixes stay separate, even in the same function.

**Done when** every finding has exactly one class.

## 6. Return

Return exactly these parts:

1. **Completeness:** every ticket with its state and its pull request or commits; tickets closed as not planned; the result of `ci.command`.
2. **Findings:** one entry each with class, `path:line` or line range, the quoted code, and its source: a quoted scenario, domain rule, non-goal or decision, or for findings without one the check from this skill (`leftover`, `advisory integration check`, `failing check`) or the smell name. Add a proposed fix, or for a conflict the options. Write a missing term on one line naming the class, the term and `CONTEXT.md`, located at the Spec's Terms line and quoting it. A finding that names a Spec term together with `CONTEXT.md` is always a missing-term finding, because a caller records every such hard finding through `write-term`; another finding may give a `CONTEXT.md` location, but names no Spec term next to it:

   ```
   1. hard, Spec #12 Terms line 40: the term Invoice is missing from CONTEXT.md. Source: "**Invoice**: a numbered request for payment sent to one customer." Fix: record the term in CONTEXT.md.
   ```

   Then the number of hard, judgement and conflict findings, or `No findings.`, optionally followed by one line per check that found nothing. Always end this part with one plain line starting with `Terms:` that names `CONTEXT.md`, also when every term is recorded, such as `Terms: Invoice is missing from CONTEXT.md; Customer is recorded.` or `Terms: every term of the Spec is in CONTEXT.md.` No list marker or bold before `Terms:`: the line shows the check ran, and callers look for it at the start of a line.
3. **Closing summary:** what the Spec now delivers in two or three sentences, the tickets with their pull requests or commits, and how many scenarios pass. Written for the comment that closes the Spec, and written even when findings are open: then it names them by number and class, and the Spec stays open until they are resolved. Leave file names, `CONTEXT.md` included, and the terms result out of it; the findings carry the locations and the `Terms:` line carries the terms, and a summary that names `CONTEXT.md` next to a hard finding and a ticket title reads like one more missing term.

End by confirming that `git status` shows no change.

**Done when** all three parts are returned and nothing in the repository or tracker changed.
