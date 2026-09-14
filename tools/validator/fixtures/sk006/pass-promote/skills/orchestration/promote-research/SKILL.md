---
name: promote-research
description: Runs the quality gates on a concluded research object and turns it into a spec. Use when an idea is ready to be built.
disable-model-invocation: true
---

Check the gates, then write the spec.

## 0. Check project setup

Read `.claude/64x-lunicorn.yml` in the project root, then go on with step 1 in every case:

- File missing: print `Project setup missing. Run /64x-lunicorn:setup-project.`
- `setup_version` below 3: print `Project setup outdated. Re-run /64x-lunicorn:setup-project.`
