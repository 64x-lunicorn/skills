---
name: write-issue-templates
description: Writes a project's user issue templates and brings its labels to the closed house set, or documents the local issue file format when there is no forge, and reports drift. Use when a project's issues are set up for the first time, when its labels or templates drifted, or when a label the skills rely on is missing.
---

Users get the simplest possible entry: Bug and Request. Specs, tickets and bugfixes are never filed from forge templates; the skills that create them carry the only template for each, so no second copy drifts. Labels are a closed set, because skills and triage match them by exact name.

## 1. Check the inputs

Read `forge` and `issues.tracker` from `.claude/64x-lunicorn.yml`.

- The marker, `forge` or `issues.tracker` is missing: stop and point to `setup-project`.
- `forge` is `gitlab` or `forgejo`: stop and name the gap. Their template details are unverified until the spike tasks of Spec #4 are done.
- `issues.tracker` is `local`: do step 4, then step 5. There are no forge templates and no labels.
- `forge` is `github`: do steps 2, 3 and 5. The repository is the `origin` remote on `github.com`; without one, skip step 3 and report the labels as a gap, since they apply once the repository is pushed.

Whenever the run stops or skips a step, it still ends with the report in step 5.

**Done when** the path through this skill is chosen, or the run has stopped with the reason named.

## 2. Write the user templates

Generate `.github/ISSUE_TEMPLATE/bug.yml`, `request.yml` and `config.yml` exactly as in [the issue form templates](references/github-issue-forms.md). Compare each with what exists, byte for byte including the final newline, and report it as `new`, `unchanged` or `drift`; write it when it is `new` or `drift`. Parse the three templates with any YAML parser afterwards; a form that does not parse silently disappears from GitHub's issue chooser.

Report every other file in `.github/ISSUE_TEMPLATE/` by name, such as a legacy `bug_report.md`, and remove it only after Daniel confirms; it may carry fields a project needs.

**Done when** the three templates are written with their status and parse, and every other template file is reported.

## 3. Bring the labels to the house set

Read the current labels with `gh label list --limit 200 --json name,color,description` and compare them with [the label set](references/labels.md):

- **Missing:** create.
- **Different color or description:** update. Colors compare without regard to case, and a missing description counts as empty.
- **Not in the set:** list each with the number of issues and pull requests carrying it, from `gh issue list --label "<name>" --state all --limit 1000 --json number --jq length` and the same with `gh pr list`.

Ask Daniel: "Create <n> and update <m> labels in <owner>/<repo>?" Apply with `gh label create "<name>" --color <color> --description "<description>" --force`. Then ask separately: "Delete these labels outside the house set: <labels>?" Deleting a label removes it from every issue and pull request that carries it, which is why it is its own question. Apply with `gh label delete "<name>" --yes`. When anything was applied, read the labels back and compare again.

**Done when** the labels match the set, apart from changes Daniel declined, or step 1 recorded the missing remote.

## 4. Document local issues

Generate `issues/README.md` from [the local issue format](references/local-issues.md), compare it byte for byte, report it as `new`, `unchanged` or `drift`, and write it when it is `new` or `drift`. Skills read and write these files by that format, so it has to be written down in the project itself.

**Done when** `issues/README.md` matches the template.

## 5. Report

- **Files:** each with `new`, `unchanged` or `drift`, and other template files found.
- **Labels:** created, updated and deleted; changes Daniel declined, with their current and target values; extras kept.
- **Gaps:** the reason the run stopped, when it did.

Leave all file changes uncommitted, so Daniel reviews them before they are committed.

**Done when** the report covers files, labels and gaps.
