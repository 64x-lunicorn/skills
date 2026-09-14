# Ticket template

Read when drafting ticket bodies. Replace every `<…>` and delete comments. Label: `task`.

## Feature ticket

Title: `<imperative phrase naming the behaviour>`

````markdown
> Part of Spec #<spec>. Architecture: #<architecture>. Order: #<wayfinder>.

## Goal

<One sentence: the observable behaviour this ticket delivers.>

## Scope

- <what changes, in the Spec's terms>

## Acceptance criteria

```gherkin
Scenario: <copied verbatim from the Spec>
  Given <…>
  When <…>
  Then <…>
```

## Out of scope

- <neighbouring behaviour>: #<ticket that owns it>

## Dependencies

<!-- Filled after the architecture review. -->

Blocked by: <#n, or none>

## Implementation notes

<!-- Filled after the architecture review: components touched and the decisions from the architecture issue that apply. -->

## Done when

- [ ] The scenarios above run green in the integration tests, without the pending tag.
- [ ] The pull request is merged and this ticket is checked off in the wayfinder.
````

## Integration test ticket

Title: `Integration tests: <Spec title>`

````markdown
> Part of Spec #<spec>. Architecture: #<architecture>. Order: #<wayfinder>.

## Goal

Every scenario of Spec #<spec> runs as an automated integration test, so each feature ticket has a checkable target.

## Scope

- Test harness that runs the scenarios against the system from outside.
- Every scenario below as a test tagged pending.
- The required CI gate skips pending tests; a separate, non-required job runs them.

## Acceptance criteria

```gherkin
<every scenario of the Spec, verbatim>
```

## Dependencies

<!-- Filled after the architecture review. -->

Blocked by: <#n, or none>

## Implementation notes

<!-- Filled after the architecture review: test framework, where the harness lives, how the system is started. -->

## Done when

- [ ] The harness runs in CI.
- [ ] Every scenario exists as a pending test and fails because the behaviour is missing, not because of setup errors.
- [ ] The required CI gate stays green.
````
