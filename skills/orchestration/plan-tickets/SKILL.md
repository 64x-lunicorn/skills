---
name: plan-tickets
description: Splits an agreed Spec into sub-issue tickets, an integration test ticket, a reviewed architecture issue and a wayfinder issue that fixes the order agents work in.
argument-hint: "[Spec issue number]"
disable-model-invocation: true
---

Turns one Spec into work agents can pick up in the right order. The tickets are agreed with Daniel before the architecture is reviewed, because the review decides order and approach for a cut that already stands. Nothing is implemented during this run.

## 0. Check project setup

Read `.claude/64x-lunicorn.yml` in the project root, then go on with step 1 in every case; the notice informs, it does not block:

- File missing: print `Project setup missing. Run /64x-lunicorn:setup-project.`
- `setup_version` below 3: print `Project setup outdated. Re-run /64x-lunicorn:setup-project.`

## 1. Pick the Spec

Take the Spec named in the argument. Without one, list the open issues labelled `spec` and ask which.

Find the tracker: `issues.tracker` in `.claude/64x-lunicorn.yml`, otherwise `git remote -v`. For GitHub or local issue files, follow [the tracker reference](references/tracker.md). For any other forge, stop and name the gap: sub-issues and dependencies have no verified procedure there yet.

Stop in these cases, naming what was found:

- The issue has no `spec` label.
- The Spec already has sub-issues. Re-planning an existing split is not covered yet.
- The Spec has no Gherkin acceptance criteria. Tickets take their criteria from the Spec; it needs revising with `design-spec` first.

Read the Spec and its comment `Technical notes for the architecture issue`.

**Done when** exactly one Spec is chosen, its tracker is supported, and its body and technical notes are read.

## 2. Cut the tickets

Cut the Spec with `design-ticket`. Show Daniel:

- a table of the tickets: title, scenarios covered, dependency candidates,
- the integration test ticket,
- the technical questions for the architecture issue.

Rework the cut until Daniel agrees with it. Interview him with `interview-user` on what is unclear in the cut and on his agreement to it.

**Done when** Daniel has agreed to the cut.

## 3. Create the issues

Ask: "Create <n> tickets, the integration test ticket and the architecture issue as sub-issues of Spec #<spec>?" Only a yes to this question counts; the issues are visible to others.

Create in this order, each attached as a sub-issue of the Spec:

1. The architecture issue, labelled `architecture`: the template of `review-architecture` with Context, Technical notes and the technical questions filled, every other section reading `Pending architecture review.`
2. The integration test ticket and every feature ticket, labelled `task`, with the architecture issue's number in their header and `Order: pending` for the wayfinder.

When a label does not exist yet, ask before creating it.

**Done when** every issue exists, carries its label and is listed as a sub-issue of the Spec.

## 4. Review the architecture

Invoke `review-architecture` with the Spec number, every ticket number and the architecture issue number. It runs in its own subagent and returns a report without writing anything.

Present the report to Daniel:

1. Each proposal with its reason, as one decision of an interview with `interview-user`. Keep his answer verbatim.
2. Then the order in phases and the dependency graph.

Apply the accepted proposals to the tickets: edit bodies, create a new ticket as a sub-issue for a split, close a merged ticket with a comment naming the ticket it went into. When accepted proposals change which tickets exist, invoke `review-architecture` again on the new set, so the order matches the tickets.

**Done when** every proposal has Daniel's decision, the accepted ones are applied, and the order and dependencies of the last review have his ok.

## 5. Record the architecture

Ask: "Write the architecture issue, the dependencies and the implementation notes into the tickets?" Then:

- Replace the architecture issue body with the report's filled template, and add Daniel's decisions verbatim to the Review log.
- Set every dependency from the report as a native "blocked by" relation.
- Fill Dependencies and Implementation notes in every ticket.

**Done when** the architecture issue holds all diagrams, every dependency is a relation, and no ticket still has a placeholder in those two sections.

## 6. Create the wayfinder

Fill [the wayfinder template](references/wayfinder-template.md) from the phases of the review. Create it labelled `wayfinder` as a sub-issue of the Spec; the confirmation from step 5 covers it, since its content is the order Daniel just approved. Then replace `Order: pending` in every ticket and the architecture issue with the wayfinder's number.

**Done when** the wayfinder exists, every ticket links it, and Daniel has the links to the Spec, the architecture issue and the wayfinder.

## 7. Record decisions and terms

Daniel's ok in step 5 confirmed the review, so what it settled is recorded now: the interview records nothing itself, and a decision left only in the architecture issue or a term left only in a ticket drifts from `docs/adr/` and `CONTEXT.md`.

- Invoke `write-adr` with every decision of the recorded architecture issue's `## Decisions`, with its reason and the rejected options.
- Invoke `write-term` with each word Daniel fixed to one meaning in his answers during steps 2 and 4, with that meaning and the other words that came up for it, such as a word an accepted proposal replaced.

Invoke both before asking Daniel anything, and put their questions into one message: each ends the turn on its question, so a question asked first keeps the other from running. His answers are handled by `write-adr` and `write-term`. With no decision or no settled term, that skill gets nothing.

**Done when** `write-adr` has every decision of the architecture issue and `write-term` every settled term, or there is neither.
