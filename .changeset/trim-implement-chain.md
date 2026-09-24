---
"64x-lunicorn-skills": patch
---

`implement-tickets`, `implement-ticket`, `resolve-merge` and `review-change` say the same things in fewer words: rationale paragraphs became short clauses next to the rule they explain, `Done when` lines became one checkable condition each, and `implement-ticket`'s update mode no longer repeats the report schema of its own report section.

What only some runs need moved out of the bodies into reference files, each linked at the point where the run branches: `implement-tickets` keeps the hit detection inline but reads [references/behind-branches.md](../skills/orchestration/implement-tickets/references/behind-branches.md) only when step 1 found a hit, [references/verify-and-close-spec.md](../skills/orchestration/implement-tickets/references/verify-and-close-spec.md) only when every ticket is checked off, and [references/local-tracker.md](../skills/orchestration/implement-tickets/references/local-tracker.md) only without a forge; `implement-ticket` reads [references/modes.md](../skills/engineering/implement-ticket/references/modes.md) only when its arguments carry `fix` or `update`.

No rule changed. A ticket run through `implement-tickets`, `implement-ticket`, `write-tests` and `review-change` now loads 4217 words of skill body instead of 6845.
