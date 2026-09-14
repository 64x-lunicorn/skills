---
name: harvest-skill
description: Turns a correction that came up three times into a new skill. Use when Daniel says "harvest this" for an inbox entry.
disable-model-invocation: true
---

Check the inbox count, then write the skill.

## 0. Check project setup

Read `.claude/64x-lunicorn.yml` in the project root, then go on with step 1 in every case:

- File missing: print `Project setup missing. Run /64x-lunicorn:setup-project.`
- `setup_version` below 1: print `Project setup outdated. Re-run /64x-lunicorn:setup-project.`
