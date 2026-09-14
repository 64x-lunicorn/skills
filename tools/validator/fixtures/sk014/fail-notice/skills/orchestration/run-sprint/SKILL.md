---
name: run-sprint
description: Runs a sprint over a set of GitHub tickets. Use when Daniel says "run the sprint" or "start the sprint" for a milestone.
disable-model-invocation: true
---

## 0. Check project setup

Read `.claude/64x-lunicorn.yml` in the project root, then go on with step 1 in every case:

- File missing: print a notice.
- `setup_version` below 1: print `Project setup outdated. Re-run /64x-lunicorn:setup-project.`

## 1. Run

Implement each ticket.
