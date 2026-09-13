# Contributing to skills

Thanks for helping make agent skills more predictable.
Bug reports, harvest candidates, clearer documentation and focused changes are welcome.

## Before you start

- Search [existing issues](https://github.com/64x-lunicorn/skills/issues) before
  opening a new one. Discuss new skills and new validator rules in an issue
  before starting a pull request.
- Read the [project overview](README.md) and [CLAUDE.md](CLAUDE.md).
  Harvesting instead of inventing, layering and the description as the only API
  are deliberate constraints, not missing features.
- Keep discussions respectful, constructive and focused on the work.
- For vulnerabilities, follow [SECURITY.md](SECURITY.md) rather than opening a
  public issue.

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

Before pushing, run the same checks as CI:

```bash
npm run validate
npm run typecheck
npm run coverage
```

`validate` runs the validator against the repository, `typecheck` runs the
TypeScript compiler without emitting, and `coverage` runs the test suite with a
100 % line and function threshold. The `validate` and `test` jobs in
[`ci.yml`](.github/workflows/ci.yml) are required status checks on `main`.

Documentation-only changes do not need a test run. Verify links and examples
instead.

## Proposing a skill

Skills here are harvested, not invented. Open an issue with:

- The correction, word for word, as it was given to the assistant.
- How often it was needed, and in which kind of project.
- What goes wrong when the skill does not kick in, in one sentence.

Once the same correction has been needed three times, it becomes a skill,
following the steps under "New skill" in [CLAUDE.md](CLAUDE.md). Every skill
needs at least one eval case under `evals/<skill-name>/`.

## Changing the validator

A new rule is a proposal first: open an issue naming the convention and a real
mistake it would have caught.

Rules are born through TDD:

1. Add a fixture under `tools/validator/fixtures/skNNN/` that violates exactly
   this rule, plus a `pass` fixture for its edge cases.
2. Write the test and watch it fail.
3. Implement the rule until the test passes.

Thresholds and lists live in
[`tools/validator/src/conventions.ts`](tools/validator/src/conventions.ts) and in
[ADR 0002](docs/adr/0002-own-conventions-stricter-than-the-spec.md). Change both
in the same pull request.

## Writing a useful issue

Include:

- The plugin version or commit and your Claude Code version.
- What you expected, what happened, and minimal steps to reproduce.
- Relevant validator output or a small synthetic `SKILL.md` when needed.

Redact tokens, private repository URLs and personal data.

## Submitting a pull request

1. Keep the change focused and avoid unrelated formatting or refactors.
2. Explain the problem and solution, and link the relevant issue.
3. Add a fixture and test for validator changes, and an eval case for skill
   changes. Update the affected docs.
4. Add a changeset with `npx changeset` when the plugin itself changes.
5. Write commits as Conventional Commits in English imperative mood, as
   [`write-commit-message`](skills/engineering/write-commit-message/SKILL.md)
   describes. Commits to `main` must be signed.
6. List the checks you ran and any known limitations.

Only contribute material you have the right to submit. Contributions are made
under the existing [MIT License](LICENSE).
