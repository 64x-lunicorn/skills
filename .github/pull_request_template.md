<!--
CI runs the validator, the TypeScript type check, the tests on Node 24 and 26,
a workflow lint and a secret scan, and ends in the CI gate. Run
`npm run validate`, `npm run typecheck` and `npm run coverage` before pushing
to get the same answer without a round trip.
-->

## What and why

<!-- The problem, and why this is the right fix. Link the issue: Fixes #123 -->

## Checks

<!-- Delete what does not apply; say so if something could not be run. -->

- [ ] `npm run validate` passes locally
- [ ] `npm run typecheck` and `npm run coverage` pass locally
- [ ] Fixture and failing test came first (validator changes)
- [ ] Eval case added or updated (skill changes)
- [ ] Changeset added with `npx changeset` (plugin changes)
- [ ] Affected documentation updated

## Notes for the reviewer

<!-- Known limitations, deliberate trade-offs, what you are unsure about. -->

<!--
Please use synthetic data in skills, eval cases and fixtures — never real
tokens, private repository URLs or personal data.
-->
