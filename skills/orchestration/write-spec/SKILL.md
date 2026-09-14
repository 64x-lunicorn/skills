---
name: write-spec
description: Turns a functional change from a conversation into a Spec issue after light quality gates with Daniel, describing domain behaviour that is never implemented directly.
argument-hint: "[change to specify, or empty to use the current conversation]"
disable-model-invocation: true
---

Writes one Spec from what Daniel and Claude discussed. The Spec describes domain behaviour and a functional change; it is split into sub-issues later and never built from directly. The gates exist so that an unchallenged conversation does not turn into a requirement.

## 0. Check project setup

Read `.claude/64x-lunicorn.yml` in the project root, then go on with step 1 in every case; the notice informs, it does not block:

- File missing: print `Project setup missing. Run /64x-lunicorn:setup-project.`
- `setup_version` below 2: print `Project setup outdated. Re-run /64x-lunicorn:setup-project.`

## 1. Pin down the source

Take the change named in the argument, otherwise the current conversation.

- The source is a research object under `research/`: stop. Research reaches a Spec only through promotion with its own gates; name `promote-research`, the object's status and what is still open.
- The conversation holds several unrelated changes: list them and ask which one this Spec is for. One Spec, one functional change, so it can be split cleanly.

Collect Daniel's statements about the change verbatim, in the language he used; they go into Origin.

**Done when** exactly one functional change is chosen and its statements are collected.

## 2. Light gates with Daniel

Ask one at a time and wait for each answer:

1. **Problem in one sentence.** Propose the sentence and ask whether it states the problem.
2. **"Do nothing" considered.** Ask what happens if nothing changes, and whether that is acceptable.
3. **Open questions.** List what is still undecided and ask for each whether it is resolved or explicitly accepted. An unaccepted open question stops the run; the change needs more discussion first.

Add the answers to the collected statements, verbatim.

**Done when** all three answers are recorded and no open question is unaccepted.

## 3. Draft

Draft the body with `design-spec`, from the collected statements and gate answers. Show Daniel the draft together with the technical notes `design-spec` sorted out, and say that those notes belong to the architecture issue when the Spec is split.

Rework the draft until Daniel is satisfied with it. Change nothing in the repo during this run: a Spec is not implementable, and code written now skips the split.

**Done when** Daniel has seen the current draft and the technical notes.

## 4. Create the Spec

Find the tracker:

- `.claude/64x-lunicorn.yml` exists: use `issues.tracker` and `issues.path`.
- Otherwise read `git remote -v`: GitHub via `gh`, GitLab via `glab`, Forgejo or Gitea via its API or web UI. No remote: a Markdown file `issues/NNNN-<slug>-spec.md` with `type: spec` in its frontmatter.

Ask: "Create `Spec: <title>` in <tracker>?" Only a yes to this question counts; an issue is visible to others. Label it `spec`, and ask before creating the label when it does not exist yet.

Write the body to a file in the scratchpad and pass it as a file (`gh issue create --body-file`), because backticks in the Mermaid and Gherkin blocks break when quoted inline in a shell.

Then post the technical notes as a comment on the Spec, headed `Technical notes for the architecture issue`, or `None` below the heading when there are none. For a local issue file, add them as a final section with that heading. The notes stay out of the Spec, but the architecture issue needs them when the Spec is split, usually in a later session.

**Done when** the Spec exists, carries the `spec` label, has its technical notes comment, and its URL or path is given to Daniel.
