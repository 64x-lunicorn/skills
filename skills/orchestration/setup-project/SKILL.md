---
name: setup-project
description: Sets up a project for the 64x-lunicorn plugin through a guided interview with detected defaults and writes the committed marker .claude/64x-lunicorn.yml that every other skill reads.
disable-model-invocation: true
---

Brings a project to one known setup, and brings it back when it drifted. The same answers must always produce the same files, so the interview collects everything first and the writing follows fixed templates. Every other user-invoked skill checks for the marker this skill writes.

This version writes the marker. README, CI gate and branch rules, issue templates and labels, community files and agent docs each come from their own model-invoked skill, added one by one; until one exists, its part is reported as a gap.

## 1. Detect

Read the repo before asking anything, so each question can come with a default and a confirmation is enough:

- **Marker:** an existing `.claude/64x-lunicorn.yml` makes this a re-run. Its values are the defaults, and step 4 reports what changed.
- **Forge:** `git remote -v`. `github.com` is `github`, `gitlab.com` is `gitlab`, `codeberg.org` is `forgejo`. No remote is `none`. Any other host has no default; its forge is asked.
- **Default branch:** `git symbolic-ref refs/remotes/origin/HEAD`, otherwise the current branch.
- **Research:** whether `.gitignore` ignores `research/`.
- **Checks:** the stack's own entry points, such as `package.json` scripts, `mix.exs` aliases, `Makefile` targets, `CMakeLists.txt` or `Package.swift`. An existing all-in-one command like `npm run ci` or `mix ci` is the default `ci.command`.

**Done when** every question in step 2 has a detected default or is marked as having none.

## 2. Interview

Ask one question at a time and wait for the answer; show the detected default with each question.

1. **Forge:** `github`, `gitlab`, `forgejo` or `none`.
2. **Default branch.**
3. **Research:** `research/` tracked in git or gitignored.
4. **Issue tracker:** `forge`, or `local` for Markdown files in `issues/`. Without a forge it is always `local`; skip the question.
5. **CI command:** the one command that runs every check locally.
6. **CI checks:** each check with `name`, `run` and `required`. Propose the detected list and let Daniel add, drop or rename entries. Secret scan, Workflow lint and `CI gate` are not listed here; they are added for every project by the CI gate skill.

Write nothing during the interview. A setup half-written from early answers is exactly the drift this skill removes.

**Done when** all six answers are confirmed.

## 3. Write the marker

Write `.claude/64x-lunicorn.yml` with exactly this key order and these comments, so the same answers give a byte-identical file:

```yaml
setup_version: 1
forge: <github | gitlab | forgejo | none>
default_branch: <branch>
research:
  path: research/
  tracked: <true | false>  # false = gitignored, local only
issues:
  tracker: <forge | local>
  path: <issues/ when tracker is local, otherwise null>
ci:
  command: <command>
  checks:
    - { name: <name>, run: <command>, required: <true | false> }
```

When research is gitignored and `.gitignore` does not ignore `research/` yet, append `research/` to it. Leave the changes uncommitted, so Daniel reviews the result before it lands.

**Done when** the marker exists, parses as YAML and every value matches an answer from step 2.

## 4. Report

End with one report:

- **Written:** the marker, and `.gitignore` if it changed.
- **Drift** (re-run only): every key whose value changed, as old value and new value.
- **Gaps:** README, CI gate and branch rules, issue templates and labels, community files, agent docs. Name each as not set up yet, because its skill does not exist in this plugin version.

**Done when** the report names every written file, every changed key and every gap.
