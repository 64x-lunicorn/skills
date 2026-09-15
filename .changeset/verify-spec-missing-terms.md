---
"64x-lunicorn-skills": minor
---

A Spec no longer closes while one of its terms is missing from `CONTEXT.md`. `verify-spec` compares every line of the Spec's `## Terms` with the root `CONTEXT.md`, reports each missing term as a `hard` finding on one line naming the term and `CONTEXT.md`, and always ends its findings with a line starting `Terms:`. `implement-tickets` hands the missing terms with the Spec's meanings to `write-term` before it asks to close the Spec, instead of cutting follow-up tickets for them, and its report names the uncommitted `CONTEXT.md`.
