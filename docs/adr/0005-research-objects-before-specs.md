# 0005 — Research objects before specs

Status: accepted, 2026-09-13.

Amended 2026-09-13: in this repo `research/` is gitignored and lives only locally. Other projects decide where research lives during project setup.

## Context

Ideas for features, epics or products come up long before anyone decides to build them. Many are never built and were only inspiration. Until now they had no home: they lived in chat history or went straight into implementation without being challenged.

Daniel wants a research skill set that:

1. documents an idea on its own, whether or not it is ever implemented,
2. keeps it in a `research/` folder inside the repo it belongs to, this repo included,
3. is developed in discussion with Claude to reach the best possible product,
4. can never be implemented directly, only after passing quality gates and becoming an epic or spec,
5. covers both domain research and technical research.

`mattpocock-skills:research` only overlaps in one step: delegating a factual question to a background agent that cites primary sources. It has no lifecycle, no discussion, no domain side and no gates. Per ADR 0004 it is replaced, not copied.

This is a gap Daniel named explicitly, so it passes the harvest gate (ADR 0004).

## Decision

**Research object.** A directory `research/NNNN-<slug>/` in the repo the idea belongs to:

```
research/NNNN-<slug>/
  README.md      # frontmatter + question, findings, options, recommendation
  sources.md     # every source with date and confidence
  discussion.md  # Daniel's statements verbatim, Claude's proposals marked as such
```

Frontmatter of `README.md`:

```yaml
kind: domain | technical | both
status: seed | exploring | concluded | promoted | parked | rejected
question: <one sentence>
created: YYYY-MM-DD
implementable: false
```

`kind` selects the template sections. Domain: problem, who has it, value, prior art, alternatives including "do nothing". Technical: constraints, options, trade-offs, risks. `both` uses both.

**Lifecycle.**

```
seed → exploring → concluded → promoted | parked | rejected
```

- `parked` and `rejected` are never deleted. The reason why not is kept.
- `promoted` freezes the object. It links to the resulting epic or spec, and the spec links back.

**Never implemented.** `implementable` is always `false`. Implementation skills refuse `research/**` as input. The only path to implementation is promotion through the gates.

**Quality gates**, split by what can be checked:

- *Deterministic (validator):* required sections present, valid `status`, at least one source, alternatives section not empty.
- *Judgement (skill, with Daniel):* problem stated in one sentence, "do nothing" seriously considered, open questions resolved or explicitly accepted, explicit go from Daniel.

**Skills**, along the layering, built one at a time:

- **`research`** (user-invoked, `skills/orchestration/`): creates or continues a research object and leads the discussion. First.
- **Source verification** (model-invoked, `skills/engineering/`): traces claims to primary sources, cites them, may delegate reading to a background agent, writes to `sources.md`. First, together with `research`.
- **`promote-research`** (user-invoked): runs the gates and produces the epic or spec. Only once the spec format is decided.

Research documents are written in English. `discussion.md` keeps statements in the language they were given in, like `inbox.md`.

## Open

- **Promotion target.** What an epic or spec is (GitHub issue, `docs/specs/` file, other). Blocks `promote-research`, not `research`.
- **Spikes.** Whether technical research may include a throwaway prototype, and where it lives.
- **Validator rules** for the deterministic gate. Each is proposed to Daniel and born through TDD (ADR 0002).

## Consequences

- Ideas get a durable, discoverable home, including the ones that are dropped.
- Nothing reaches implementation without being challenged against alternatives and sources.
- One more folder convention every project has to follow, and a spec format that still needs deciding.
- `mattpocock-skills:research` can be uninstalled once `research` and source verification ship.

## Alternatives

- **Keep using `mattpocock-skills:research`**: one-shot fact gathering, no discussion, no lifecycle, no gates. Contradicts ADR 0004.
- **Central research folder only in this repo**: breaks the project boundary. Research belongs next to the code it may one day shape.
- **Ideas as GitHub issues**: issues read as work to do. Research must not look implementable.
- **Delete rejected ideas**: loses why they were rejected, so the same idea comes back unexamined.
