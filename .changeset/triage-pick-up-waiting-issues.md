---
"64x-lunicorn-skills": minor
---

Add `/64x-lunicorn:triage-issues`: Daniel starts triage with issue numbers or without arguments, and it picks up the issues waiting for it: every unlabelled issue, every `needs-triage` issue and every `needs-info` issue whose reporter replied since the last triage comment. Automated dependency update pull requests are never picked up and get no issue. Local issue files and other forges stop with a notice. What triage does with a picked-up issue arrives in later changes.
