---
name: promote-research
description: Runs the quality gates on a concluded research object with Daniel and, on his explicit go, turns it into a self-contained Spec issue and freezes the object.
argument-hint: "[number or slug of a concluded research object]"
disable-model-invocation: true
---

Promotion is the only path from `research/` to implementation (ADR 0005). The gates exist so that an idea nobody challenged never turns into a requirement. This skill checks, asks and writes; it does not change what the research concluded.

## 1. Pick the object

Take the object named in the argument. Without one, list the objects in `research/` whose status is `concluded` and ask which.

- Status is not `concluded`: stop. Name the status and what is still open, and point to `research-idea` for continuing the discussion. A half-finished object promoted "just this once" is exactly what the gates are for.
- Status is already `promoted`: stop and give the link from its Outcome section.

**Done when** exactly one object with status `concluded` is chosen.

## 2. Deterministic gates

Check `README.md` and `sources.md` of the object and report every gate as pass or fail:

- Frontmatter has `kind`, `status`, `question`, `created` and `implementable: false`.
- The sections Question, Options, Findings, Open questions and Recommendation exist and are not empty.
- Options contain "do nothing" or an equivalent.
- `sources.md` has at least one row.

On any fail, stop and name what is missing. Fixes happen through `research-idea`, not here: editing findings while promoting would skip the discussion they need.

**Done when** every gate is reported, and all of them pass.

## 3. Judgement gates with Daniel

Ask one at a time and wait for each answer:

1. **Problem in one sentence.** Read the question back and ask whether it still states the problem.
2. **"Do nothing" considered.** Quote what the object says about it and ask whether that was taken seriously.
3. **Open questions.** List each one and ask whether it is resolved or explicitly accepted. An unaccepted open question stops the promotion.
4. **Go.** Ask: "Promote NNNN-<slug> to a Spec?" Only a yes to this question counts. Approval given earlier to other questions is not a go, because promotion freezes the record.

Append the four answers verbatim, in Daniel's language, under a dated heading in `discussion.md`.

**Done when** all four answers are recorded and the last one is a yes.

## 4. Draft the Spec

Fill [the Spec template](references/spec-template.md) from the object's README, in English.

- The Spec stands on its own. Its reader may never see the research object, which can be gitignored; everything needed to build lives in the Spec.
- Every decision carries its reason. Rejected options appear as one line each, taken from Options.
- Leave the Tasks checklist empty. Splitting the Spec into Task issues is a later step.
- Write nothing the research did not decide. A gap you notice goes to Open risks and is named to Daniel.

Show the draft to Daniel before creating anything.

**Done when** Daniel has seen the draft and every section except Tasks is filled.

## 5. Create the Spec

Find the tracker:

- `.claude/64x-lunicorn.yml` exists: use `issues.tracker` and `issues.path`.
- Otherwise read `git remote -v`: GitHub via `gh`, GitLab via `glab`, Forgejo or Gitea via its API or web UI. No remote: a Markdown file `issues/NNNN-<slug>-spec.md` with `type: spec` in its frontmatter.

Name the tracker and the title `Spec: <title>` to Daniel and create the issue after his confirmation; an issue is visible to others. Label it `spec`. When the label does not exist yet, ask before creating it.

**Done when** the Spec exists and its URL or path is known.

## 6. Freeze the object

- Set `status: promoted` in the frontmatter.
- Write the link to the Spec and today's date into Outcome.
- Add a `discussion.md` entry: promoted, with the link.

Change nothing else in the object. It is the record of what was decided at promotion, and a Spec that later diverges should be visibly different from it.

**Done when** the frontmatter says `promoted` and Outcome links the Spec.
