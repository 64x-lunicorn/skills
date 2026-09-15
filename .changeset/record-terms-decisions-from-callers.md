---
"64x-lunicorn-skills": minor
---

`write-spec`, `promote-research` and `plan-tickets` record what they settled once Daniel has confirmed it. `write-spec` and `promote-research` hand every line of the created Spec's `## Terms` to `write-term` and every decision of its `## Decisions` to `write-adr`; `plan-tickets` hands the decisions of the recorded architecture issue to `write-adr` and each term Daniel fixed in its interviews to `write-term`. The recording is the last step of each run, so no earlier step waits on its questions, and `interview-user` still records nothing itself.
