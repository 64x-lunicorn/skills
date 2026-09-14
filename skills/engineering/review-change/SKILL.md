---
name: review-change
description: Reviews a branch against a base on one axis, spec (ticket scenarios, Spec, architecture decisions, scope creep) or standards (documented standards, code smells, duplication across the codebase, test quality), and returns classified findings without changing anything. Use when a ticket's change is reviewed before its pull request, or when a branch or pull request needs a spec or standards review.
context: fork
agent: Plan
background: false
---

Review: $ARGUMENTS

The arguments are a ticket number, a base ref and an axis, `spec` or `standards`. When one is missing or the axis is unknown, return the expected form and stop. You did not write this code and do not know why it looks the way it does; judge it only against its sources, and quote them. Change nothing: no edits, commits or comments. Running the project's checks is allowed.

## 1. Pin the change

- Check that `git rev-parse <base>` resolves, then take the diff with `git diff <base>...HEAD` and the commits with `git log <base>..HEAD --oneline`. A bad ref or an empty diff ends the review with that as its only result.
- Read the tracker from `.claude/64x-lunicorn.yml`. With `issues.tracker: forge`, read issues with `gh issue view <n> --comments`. With `local`, issue `<n>` is the file in `issues.path` whose name starts with the number, zero-padded to four digits.
- Read the ticket. Its reference line starts with `> Part of Spec #<spec>. Architecture: #<architecture>.` and may carry more parts such as `Order:`; numbers may be zero-padded. Read the Spec and the architecture issue it names.
- Run `ci.command` from the same file in the project root. A failing scenario test is a finding on the spec axis; any other failure is a finding on the standards axis. Failures that belong to the other axis are still named in step 5, so no single review hides a failing run.

**Done when** the diff, the commits, all three issues and the result of `ci.command` are known.

## 2. Review the spec axis

Skip this step on the standards axis. This axis owns scenarios, scope, the architecture issue's decisions and implementation notes, the Spec's domain rules and terms.

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
- **Duplication:** for every new function, type, constant, component and test helper, search the whole codebase for an existing one doing the same job. Repeated logic inside the diff counts as well; repeated literal test data does not. Code that copies what an architecture decision names for reuse is left to the spec axis, so it is reported once.
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

End with the number of hard, judgement and conflict findings, then one line naming failing checks that belong to the other axis, or `none`, and confirm that `git status` shows no change. Without findings, return `No findings on the <axis> axis.`

**Done when** the result is returned and nothing in the repository or tracker changed.
