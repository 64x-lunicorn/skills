---
name: review-architecture
description: Reviews the technical approach for a Spec that has been split into tickets, reading the Spec, its tickets and the codebase, and returns diagrams, ticket dependencies, an implementation order and proposed ticket changes. Use when agreed tickets for a Spec need their architecture and order decided, or when an architecture issue needs a fresh review.
context: fork
agent: Plan
background: false
---

Review the architecture for: $ARGUMENTS

You run without the conversation that led here. Everything you need is in the issues named above and in the repository. You return a report and change nothing: no issue edits, no comments, no files. Daniel decides on every proposal before anything is recorded.

## 1. Read

- The Spec issue, including its comment `Technical notes for the architecture issue`.
- Every ticket issue, and the architecture issue with its technical questions.
- The codebase where the Spec's behaviour will live: existing components, patterns, test setup, `CONTEXT.md` and `docs/adr/` when present.

Read issues with `gh issue view <n> --comments`, or from `issues/` when the project tracks issues as local files.

**Done when** you can name, for every ticket, the parts of the codebase it touches.

## 2. Decide the approach

For every technical question, pick one option and give the reason, with the rejected options in one line each.

- Follow existing ADRs and patterns. Departing from one is a decision of its own and says so.
- Check facts about libraries, APIs and platforms against their primary documentation, with version. A wrong fact here becomes the design every ticket builds on.
- Stay inside the Spec. Behaviour the Spec does not ask for is not added, however useful it looks.
- When the Spec needs HTTP endpoints, design the contract with `design-http-api`. Its per-API choices and each operation's method, path and status codes are decisions; a choice nobody recorded becomes a proposal for Daniel instead of being picked here.

**Done when** every technical question has a decision with a reason.

## 3. Draw

Fill the diagrams of [the architecture template](references/architecture-template.md):

- **Components:** `flowchart` of the components involved, existing and new marked apart.
- **Flow:** `sequenceDiagram` of the main path of the Spec's domain flow through those components.
- **Ticket dependencies:** `flowchart LR` with one node per ticket and an edge for each dependency.

Quote every node label, and never use `end` as a node id; both break rendering.

**Done when** all three diagrams exist and use the component and ticket names from the text.

## 4. Order the tickets

- A dependency exists only where one ticket needs code, a contract or data from another. Preference is not a dependency; every false edge removes parallel work.
- The integration test ticket comes first: its pending scenarios are the target every feature ticket turns green.
- Group tickets without dependencies between them into phases that can run in parallel. Give each phase a reason.

**Done when** every ticket is in exactly one phase and every dependency has a reason.

## 5. Propose ticket changes

Where the cut makes the order or the approach worse, propose a change: split, merge, move a scenario, or reword scope. Each proposal names the tickets, the change and the reason. Keep proposals to what the architecture actually requires; the cut was already agreed with Daniel.

For every ticket, write its implementation notes: the components it touches and the decisions from step 2 that apply.

**Done when** every ticket has implementation notes and every proposal has a reason.

## 6. Return the report

Return exactly these parts, in this order:

1. **Proposals:** numbered, one per change, or `None`.
2. **Architecture issue body:** the filled template.
3. **Dependencies:** one line per ticket, `#n blocked by #a, #b` or `#n blocked by none`.
4. **Phases:** ordered, with the tickets of each and whether they run in parallel.
5. **Implementation notes:** per ticket.

**Done when** the report has all five parts and nothing was written to any issue or file.
