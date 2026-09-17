---
name: review-change
description: Reviews a branch against a base on the spec axis (ticket scenarios, Spec, architecture decisions, scope creep), the standards axis (documented standards, code smells, duplication across the codebase, test quality) or both in one run, within a fixed tool-call budget, and returns classified findings without changing anything. Use when a ticket's change is reviewed before its pull request, or when a branch or pull request needs a spec or standards review.
context: fork
agent: Plan
background: false
---

Review: $ARGUMENTS

The arguments are a ticket number, a base ref, an axis, `spec`, `standards` or `both`, and optionally a context directory. When one of the first three is missing or the axis is unknown, return the expected form and stop. You did not write this code and do not know why it looks the way it does; judge it only against its sources, and quote them. Change nothing: no edits, commits or comments.

## Budget

A review costs every turn again with the whole context, so reading is aimed, never exploratory:

- At most 20 tool calls per axis, 30 on `both`, 10 on a re-review. Chain read-only commands in one call where their outputs belong together.
- Open only files in the diff, the sources below, and the hits of a duplication search. Fixtures, generated files and results the diff does not touch stay closed.
- When the budget runs out, return what is checked and name every changed file not yet checked as `not checked: <path>`, instead of going on.

**Done when** the review returned within its budget, or named what it left unchecked.

## 1. Pin the change

- Check that `git rev-parse <base>` resolves, then take the commits with `git log <base>..HEAD --oneline` and the diff with `git diff <base>...HEAD` in one call. A bad ref or an empty diff ends the review with that as its only result.
- **With a context directory:** it holds `ticket.md`, `spec.md` and `architecture.md` as the caller fetched them, `ci.log` from `ci.command` at the current `HEAD`, and on a re-review `findings.md`. Read those files; fetch nothing and do not run `ci.command` again, since the caller already did both.
- **Without one:** read the tracker from `.claude/64x-lunicorn.yml`. With `issues.tracker: forge`, read issues with `gh issue view <n> --comments`. With `local`, issue `<n>` is the file in `issues.path` whose name starts with the number, zero-padded to four digits. The ticket's reference line starts with `> Part of Spec #<spec>. Architecture: #<architecture>.` and may carry more parts such as `Order:`; numbers may be zero-padded. Then run `ci.command` in the project root.
- On the standards axis alone, read the ticket only; Spec and architecture issue belong to the spec axis, and reading them costs every later turn.
- A failing scenario test is a finding on the spec axis; any other failure is a finding on the standards axis. Failures that belong to the other axis are still named in step 5, so no single review hides a failing run.

**Done when** the diff, the commits, the issues the axis needs and the result of `ci.command` are known.

## Re-review

With `findings.md` in the context directory, `<base>` is the commit the previous review saw, so the diff holds only the fix commits. Check two things and nothing else: each finding in the file is resolved by the fix, quoting the fixed code, and the fix commits bring no new finding on this axis. Unchanged code was reviewed already; reviewing it again finds the same things at full price. Then go to step 4.

## 2. Review the spec axis

Skip this step on the standards axis. On `both`, run this step and step 3. This axis owns scenarios, scope, the architecture issue's decisions and implementation notes, the Spec's domain rules and terms.

For every scenario of the ticket:

- A test named like the scenario runs with no pending marker (skip, todo or tag) left on it, at a seam from the implementation notes, and asserts the scenario's `Then`.
- That test passes in `ci.command`, and the code path produces the behaviour. Read the code; a test name proves nothing.
- A scenario without a test is a finding: quote the scenario and give the ticket as its location.

Across the whole diff:

- Behaviour a caller can observe that no scenario asks for: options, flags, endpoints, fields, fallbacks. Structure without observable behaviour, such as an unused parameter, is a smell for the standards axis.
- Departures from the Decisions or the ticket's implementation notes, and from the Spec's domain rules. Code that copies what a decision says to reuse is reported here as a departure from that decision.
- Terms that differ from the Spec, and from `CONTEXT.md` when the project has one.

**Done when** every scenario and every changed file is checked.

## 3. Review the standards axis

Skip this step on the spec axis. This axis owns documented standards, duplication, smells and test quality; architecture decisions stay on the spec axis.

- **Documented standards:** `CONTRIBUTING.md`, `CLAUDE.md` or `AGENTS.md`, ADRs and coding standard documents. Skip rules the project's linter or formatter configuration already enforces.
- **Duplication:** for every new function, type, constant, component and test helper, search the whole codebase once with `grep` for its name and its job's key terms, and open only the hits. Repeated logic inside the diff counts as well; repeated literal test data does not. Code that copies what an architecture decision names for reuse is left to the spec axis, so it is reported once.
- **Smells:** check the diff against [the smell baseline](references/smells.md). A documented standard that endorses a pattern overrides the baseline.
- **Tests:** coupled to internals, mocking the project's own modules, expected values recomputed the way the code computes them, verification through a side channel instead of the interface.
- **HTTP API:** when the diff adds, changes or removes an HTTP endpoint, check it against the checklist of `design-http-api`. An endpoint change without the matching change to the OpenAPI document and the Bruno collection, or a violated MUST rule without a recorded reason, is hard; a violated SHOULD rule is judgement.

**Done when** every changed file is checked against all four, and every changed HTTP endpoint against the API checklist.

## 4. Classify

- **hard:** a scenario missing, failing or wrong; scope creep; a departure from an architecture decision or domain rule; a violation of a documented standard; duplication of existing code; a test that cannot fail; any other failing check.
- **judgement:** smells and naming, unless a documented standard makes them hard.
- **conflict:** the sources contradict each other, so no change satisfies all of them, such as a decision that makes a scenario unreachable. Quote every source involved.

A failing test caused by a conflict belongs to that conflict, not to a separate hard finding. A hard finding whose fix cannot succeed until a conflict is decided says `blocked by conflict <n>`.

Hard findings are fixed without asking, judgement findings go to Daniel, and conflicts are never fixed by the implementer, because only Daniel can decide which source gives way. Related smells on the same code form one finding. Leave out praise, what tooling enforces, and anything you cannot quote.

**Done when** every finding has exactly one class.

## 5. Return

One entry per finding:

- class and `path:line`, a line range where the finding spans several lines,
- the quoted code, plus the quoted existing code or source text it is compared with,
- the source: scenario, decision, domain rule, standard or smell name,
- a proposed fix, or for a conflict the options Daniel can choose between.

Label each finding with its axis on `both`. End with the number of hard, judgement and conflict findings, the files `not checked`, or `none`, then one line naming failing checks that belong to the other axis, or `none`, and confirm that `git status` shows no change. Without findings, return `No findings on the <axis> axis.`

**Done when** the result is returned and nothing in the repository or tracker changed.
