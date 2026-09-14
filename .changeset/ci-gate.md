---
"64x-lunicorn-skills": minor
---

Add `configure-ci-gate` and `write-issue-templates`, and let `setup-project` run both. The gate comes from the checks in the marker: a GitHub workflow with Workflow lint, Secret scan and the single required `CI gate`, the standard ruleset and merge settings applied after confirmation, or committed git hooks without a forge. Issues get the user templates Bug and Request and the closed label set, including `architecture` and `wayfinder`. The marker gains `ci.runtime`, so `setup_version` is now 2 and projects set up before are asked to re-run setup.
