---
"64x-lunicorn-skills": minor
---

Add `write-adr`: when a decision settles that is hard to reverse, surprising without context and the result of a real trade-off, an ADR is proposed to Daniel with the question `Write ADR NNNN <title>?`, and only after his yes it is written to the project's single `docs/adr/` as `NNNN-<slug>.md` with Status accepted and every section of the ADR format. A decision that misses one criterion, or one Daniel declines, gets no ADR and stays where it was made. An ADR the decision replaces changes only its status line, which points to the new ADR, and `docs/adr/README.md` is regenerated with the index rules copied verbatim from `write-agent-docs`, so a later `write-agent-docs` run reports it unchanged. A project without `docs/adr/README.md` is pointed to `write-agent-docs`.
