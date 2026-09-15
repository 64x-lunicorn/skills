---
"64x-lunicorn-skills": minor
---

A CI check can receive repository secrets. A check in `ci.checks` names them with the optional `secrets: [NAME]` key, `setup-project` asks for them per check, and `configure-ci-gate` passes each secret on GitHub only to the checks that named it. A check without secrets renders as before, and existing markers stay valid at `setup_version: 3`. On GitLab and Forgejo a check that names secrets is a named gap.
