# Contributing to skills

Thanks for helping make agent skills more predictable. Bug reports, harvest candidates, clearer documentation and focused changes are welcome.

## Before you start

- Search [existing issues](https://github.com/64x-lunicorn/skills/issues) before opening a new one, and discuss larger changes in an issue before starting a pull request.
- Read the [project overview](README.md) and [CLAUDE.md](CLAUDE.md).
- Keep discussions respectful, constructive and focused on the work.
- For vulnerabilities, follow [SECURITY.md](SECURITY.md) rather than opening a public issue.

## Development setup

Install Git and Node.js 24 or later, then work from your fork or a local clone:

```bash
git clone https://github.com/64x-lunicorn/skills.git
cd skills
git switch -c your-change
npm ci
npm test
```

## Checks

Before pushing, run the whole gate in one command:

```bash
npm run ci
```

It runs every check CI runs: Validator, Type check, Tests. On a pull request, CI also runs Workflow lint and Secret scan and ends in `CI gate`, the only required status check. [docs/ci-cd.md](docs/ci-cd.md) describes the gate and the rules on `main`.

## What the checks do

`validate` runs the validator against the repository, `typecheck` runs the TypeScript compiler without emitting, and `coverage` runs the test suite with a 100 % line and function threshold.

Documentation-only changes do not need a test run. Verify links and examples instead.

## Scenario tests

Scenarios of a Spec that need a model to observe run as `claude plugin eval` cases in `case.yaml` files under `evals/`. A case tagged `scenario` automates one scenario and carries the scenario name verbatim; a case for one example of a Scenario Outline adds what distinguishes the example in parentheses, such as its skill in `Every calling skill interviews the same way (write-spec)` or its criteria in `A decision missing one criterion gets no ADR (easy to reverse, surprising without context and a real trade-off)`. A case also tagged `pending` waits for its feature ticket, which removes the tag. Run every scenario that is not pending, or one case by its name:

```bash
npm run scenarios
npm run scenarios -- "One question at a time"
```

A name must belong to a scenario that is not pending; the runner rejects any other name and exits 1. A pending case runs by name only after its `pending` tag is removed.

The required CI checks do not run scenario tests. They only check the structure of the cases and run the deterministic scenarios as ordinary tests.

## Proposing a skill

Skills here are harvested, not invented. Harvesting instead of inventing, layering and the description as the only API are deliberate constraints, not missing features. Open an issue with:

- The correction, word for word, as it was given to the assistant.
- How often it was needed, and in which kind of project.
- What goes wrong when the skill does not kick in, in one sentence.

Once the same correction has been needed three times, it becomes a skill, following the steps under "New skill" in [CLAUDE.md](CLAUDE.md). Every skill needs at least one eval case under `evals/<skill-name>/`.

## Changing the validator

A new rule is a proposal first: open an issue naming the convention and a real mistake it would have caught.

Rules are born through TDD:

1. Add a fixture under `tools/validator/fixtures/skNNN/` that violates exactly this rule, plus a `pass` fixture for its edge cases.
2. Write the test and watch it fail.
3. Implement the rule until the test passes.

Thresholds and lists live in [`tools/validator/src/conventions.ts`](tools/validator/src/conventions.ts) and in [ADR 0002](docs/adr/0002-own-conventions-stricter-than-the-spec.md). Change both in the same pull request.

## Writing a useful issue

Include:

- The plugin version or commit and your Claude Code version.
- What you expected, what happened, and minimal steps to reproduce.
- Relevant validator output or a small synthetic `SKILL.md` when needed.

Redact tokens, private repository URLs and personal data.

## Submitting a pull request

1. Keep the change focused and avoid unrelated formatting or refactors.
2. Explain the problem and the solution, and link the issue.
3. Add or update tests for changed behaviour, and update the affected documentation.
4. Write commits as Conventional Commits in English imperative mood.
5. List the checks you ran and any known limitations.

Only contribute material you have the right to submit. Contributions are made under the existing [MIT License](LICENSE).
