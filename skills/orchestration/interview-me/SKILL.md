---
name: interview-me
description: Interviews Daniel about a plan of his own, outside any skill's flow, and ends by naming the next command for him to start, without starting it or saving anything.
argument-hint: "[plan to be interviewed about, or empty to use the current conversation]"
disable-model-invocation: true
---

Gives Daniel an interview on a plan he brings himself. The confirmed decisions stay in the conversation, so the command he starts next works from them; this skill only asks and points the way.

## 0. Check project setup

Read `.claude/64x-lunicorn.yml` in the project root, then go on with step 1 in every case; the notice informs, it does not block:

- File missing: print `Project setup missing. Run /64x-lunicorn:setup-project.`
- `setup_version` below 3: print `Project setup outdated. Re-run /64x-lunicorn:setup-project.`

## 1. Interview on the plan

Take the plan from the argument, or from the conversation when the argument is empty. Invoke `interview-user` on it and follow it through every question and the confirmation of the list; the questions, their shape and the end of the interview are its job.

When earlier turns of this interview are in the conversation, continue from where they stopped instead of starting over.

**Done when** Daniel has confirmed the list of his decisions.

## 2. Name the next command

With the confirmed list, name the one command Daniel starts next, in inline code, with a sentence on why it fits his decisions:

- `/64x-lunicorn:write-spec` when the plan is a functional change that is ready to be specified.
- `/64x-lunicorn:research-idea` when the plan is still an idea that needs exploring.
- Another command of this plugin when the decisions point to its job.

Name it and end the turn. Do not start that command or any other skill: one user-invoked skill starting another breaks the layering, and Daniel decides when to go on. Write nothing, no file of decisions and no issue: the next command records them where it keeps its results, and a copy here would drift from that.

**Done when** the turn ends with the next command named, no other skill started and nothing written.
