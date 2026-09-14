---
"64x-lunicorn-skills": minor
---

Add `verify-spec`: once every ticket of a Spec is merged, a forked review checks the Spec as a whole, including scenarios and domain rules on the default branch, duplication and architecture drift across tickets, and leftovers such as pending markers. `implement-tickets` runs it automatically, turns findings into follow-up tickets and closes the Spec, its architecture issue and its wayfinder on Daniel's go.
