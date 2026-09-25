---
name: review-change
description: Reviews a branch against a base in one run, checking ticket scenarios, Spec, architecture decisions and scope creep, or for a bugfix or Spec-less task the issue's own scenarios and seams, as well as documented standards, code smells, duplication across the codebase and test quality, within a fixed tool-call budget, and returns classified findings without changing anything. Use when a ticket's change is reviewed before its pull request, or when a branch or pull request needs a spec or standards review.
context: fork
agent: Plan
background: true
---

Review: $ARGUMENTS

The arguments are a ticket number and a base ref; a word such as `spec` or `standards` after them changes nothing, every run checks both. When one is missing, return the expected form and stop. You did not write this code: judge it only against its sources and quote them. Change nothing, no edits, commits or comments, and run no tests or checks; the implementer ran `ci.command` before handing over and the gate runs it again.

## Budget

Every turn costs the whole context again, so read aimed, never exploratory. At most 20 tool calls; chain read-only commands in one call. Open only files in the diff, the ticket's sources and the hits of a duplication search. When the budget runs out, return what is checked and name each changed file not yet checked as `not checked: <path>`.

**Done when** the review returned within its budget, or named what it left unchecked.

## 1. Pin the change

- In one call: `git rev-parse <base>`, `git log <base>..HEAD --oneline` and `git diff <base>...HEAD`. A bad ref or an empty diff ends the review with that as its only result.
- Read the tracker from `.claude/64x-lunicorn.yml`. With `issues.tracker: forge`, read issues with `gh issue view <n>`. With `local`, issue `<n>` is the file in `issues.path` whose name starts with the number, zero-padded to four digits.
- Read the ticket. A bugfix (label `bugfix`) or Spec-less task (label `task`, body starting `> Task without a Spec.`) has no Spec and no architecture issue: its own scenarios and the seams in its Implementation notes are the contract, so read nothing else and check it as step 2 says for a Spec-less issue.
- Otherwise its reference line starts with `> Part of Spec #<spec>. Architecture: #<architecture>.` and may carry more parts such as `Order:`; numbers may be zero-padded. Read the Spec and the architecture issue it names.

**Done when** the diff, the commits and every source the issue has are known.

## 2. Check against the sources

This step owns scenarios, scope, the architecture issue's decisions and notes, and the Spec's domain rules and terms.

For every scenario of the ticket:

- A test named like the scenario runs with no pending marker (skip, todo or tag) left on it, at a seam from the implementation notes, and asserts the scenario's `Then`.
- The code path produces the behaviour. Read the code; a test name proves nothing.
- A scenario without a test is a finding: quote the scenario and give the ticket as its location.

Across the whole diff:

- Behaviour a caller can observe that no scenario asks for: options, flags, endpoints, fields, fallbacks. Structure without observable behaviour, such as an unused parameter, is a smell for step 3.
- Departures from the Decisions or the ticket's implementation notes, and from the Spec's domain rules. Code that copies what a decision says to reuse is reported here as a departure from that decision.
- Terms that differ from the Spec, and from `CONTEXT.md` when the project has one.

For a bugfix or Spec-less task the same checks run against the issue alone: a departure from the agreed seams replaces a departure from a decision, scope creep is behaviour no scenario of the issue asks for, and a Spec's domain rules and terms do not apply. A bugfix's test must be able to fail on the unfixed code; a task's scenarios pin today's behaviour and must still hold.

**Done when** every scenario and every changed file is checked.

## 3. Check against the standards

This step owns documented standards, duplication, smells and test quality; architecture decisions stay in step 2.

- **Documented standards:** `CONTRIBUTING.md`, `CLAUDE.md` or `AGENTS.md`, ADRs and coding standard documents. Skip rules the project's linter or formatter configuration already enforces.
- **Duplication:** for every new function, type, constant, component and test helper, search the whole codebase once with `grep` for its name and its job's key terms, and open only the hits. Repeated logic inside the diff counts as well; repeated literal test data does not. Code that copies what an architecture decision names for reuse is left to step 2, so it is reported once.
- **Smells:** check the diff against [the smell baseline](references/smells.md). A documented standard that endorses a pattern overrides the baseline.
- **Tests:** coupled to internals, mocking the project's own modules, expected values recomputed the way the code computes them, verification through a side channel instead of the interface.
- **HTTP API:** when the diff adds, changes or removes an HTTP endpoint, check it against the checklist of `design-http-api`. An endpoint change without the matching change to the OpenAPI document and the Bruno collection, or a violated MUST rule without a recorded reason, is hard; a violated SHOULD rule is judgement.

**Done when** every changed file is checked against all four, and every changed HTTP endpoint against the API checklist.

## 4. Classify

- **hard:** a scenario missing, failing or wrong; scope creep; a departure from an architecture decision or domain rule; a violation of a documented standard; duplication of existing code; a test that cannot fail.
- **judgement:** smells and naming, unless a documented standard makes them hard.
- **conflict:** the sources contradict each other, so no change satisfies all of them, such as a decision that makes a scenario unreachable. Quote every source involved.

A failing test caused by a conflict belongs to that conflict, not to a separate hard finding. A hard finding whose fix cannot succeed until a conflict is decided says `blocked by conflict <n>`.

Hard findings are fixed without asking, judgement findings go to Daniel, conflicts are never fixed: only Daniel decides which source gives way. Related smells on the same code form one finding. Leave out praise, what tooling enforces, and anything you cannot quote.

**Done when** every finding has exactly one class.

## 5. Return

One entry per finding:

- class and `path:line`, a line range where the finding spans several lines,
- the quoted code, plus the quoted existing code or source text it is compared with,
- the source: scenario, decision, domain rule, standard or smell name,
- a proposed fix, or for a conflict the options Daniel can choose between.

End with the number of hard, judgement and conflict findings and the files `not checked`, or `none`, and confirm that `git status` shows no change. Without findings, return `No findings.`

**Done when** the result is returned and nothing in the repository or tracker changed.
