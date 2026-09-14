---
name: plan-sprint
description: Plans a sprint from GitHub tickets into a dependency graph. Use when Daniel says "plan the sprint" or "which tickets can run in parallel".
disable-model-invocation: true
---

Build the dependency graph.

## 0. Check project setup

Read `.claude/64x-lunicorn.yml` in the project root, then go on with step 1 in every case:

- File missing: print `Project setup missing. Run /64x-lunicorn:setup-project.`
- `setup_version` below 2: print `Project setup outdated. Re-run /64x-lunicorn:setup-project.`
