---
name: run-sprint
description: Runs a sprint over a set of GitHub tickets. Use when Daniel says "run the sprint" or "start the sprint" for a milestone.
disable-model-invocation: true
---

Plan the tickets, then fan them out.

## 0. Check project setup

Read `.claude/64x-lunicorn.yml` in the project root, then go on with step 1 in every case:

- File missing: print `Project setup missing. Run /64x-lunicorn:setup-project.`
- `setup_version` below 2: print `Project setup outdated. Re-run /64x-lunicorn:setup-project.`
