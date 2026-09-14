---
name: setup-project
description: Sets up a project for the 64x-lunicorn plugin through a guided interview with detected defaults, writes the committed marker .claude/64x-lunicorn.yml that every other skill reads, and generates the CI gate, issue templates, agent docs, community files and README from it.
disable-model-invocation: true
---

Brings a project to one known setup, and brings it back when it drifted. The same answers must always produce the same files, so the interview collects everything first and the writing follows fixed templates. Every other user-invoked skill checks for the marker this skill writes.

This version supports GitHub and projects without a forge. GitLab and Forgejo are reported as a gap until the spike tasks of Spec #4 are done.

## 1. Detect

Read the repo before asking anything, so each question can come with a default and a confirmation is enough:

- **Marker:** an existing `.claude/64x-lunicorn.yml` makes this a re-run. Its values are the defaults, and step 5 reports what changed. A marker with `setup_version: 1` has no `ci.runtime` yet; that question has only a detected default.
- **Forge:** `git remote -v`. `github.com` is `github`, `gitlab.com` is `gitlab`, `codeberg.org` is `forgejo`. No remote is `none`. Any other host has no default; its forge is asked.
- **Default branch:** `git symbolic-ref refs/remotes/origin/HEAD`, otherwise the current branch.
- **Research:** whether `.gitignore` ignores `research/`.
- **Checks:** the stack's own entry points, such as `package.json` scripts, `mix.exs` aliases, `Makefile` targets, `CMakeLists.txt` or `Package.swift`. An existing all-in-one command like `npm run ci` or `mix ci` is the default `ci.command`. When none exists, prepare a stack-native one that runs every check in order: a `ci` script in `package.json`, a `ci` alias in `mix.exs`, or a `ci` target in the `Makefile`.
- **Runtime:**
  - `node`: `package.json` `engines.node` or `.nvmrc`.
  - `elixir`: `mix.exs`, with `.tool-versions` as the version file when it exists.
  - `swift`: `Package.swift` or an `.xcodeproj`, with the Xcode version an existing workflow selects.
  - `cpp-qt`: `CMakeLists.txt` with a `find_package(Qt` call, with CMake and Qt versions from existing workflows.
- **Description and topics** (GitHub only): `gh repo view --json description,repositoryTopics`.
- **License:** `LICENSE` or `COPYING` read as `mit` or `gpl-3.0` by its text, with the year and holder from its copyright line or from the README's license section. The holder defaults to the owner of the `origin` remote, otherwise `git config user.name`.
- **Code owners** (GitHub only): the owner and paths of an existing CODEOWNERS. Otherwise `@<origin owner>`, and as critical paths `/.github/workflows/`, `/.claude/64x-lunicorn.yml` and the stack's manifest and lock file when they exist.
- **README:** the tagline and the pitch (headline, paragraph and bold one-liner) of an existing README in the house skeleton.

**Done when** every question in step 2 has a detected default or is marked as having none.

## 2. Interview

Ask one question at a time and wait for the answer; show the detected default with each question.

1. **Forge:** `github`, `gitlab`, `forgejo` or `none`.
2. **Default branch.**
3. **Research:** `research/` tracked in git or gitignored.
4. **Issue tracker:** `forge`, or `local` for Markdown files in `issues/`. Without a forge it is always `local`; skip the question.
5. **Runtime:** the stack, `node`, `elixir`, `swift` or `cpp-qt`, and its versions.
6. **CI command:** the one command that runs every check locally. When step 1 prepared a new one, show it and ask whether to add it.
7. **CI checks:** each check with `name`, `run` and `required`. On a re-run, existing checks keep their order and new ones are appended; on a first run, the order is the order the entry points were detected. A fixed order is what keeps the generated workflow byte-identical. `Secret scan`, `Workflow lint` and `CI gate` are not listed here; `configure-ci-gate` adds them to every project.
8. **Description and topics** (GitHub only): the description is one sentence ending in the stack.
9. **License:** `mit` or `gpl-3.0`, and the copyright holder. A different existing license is only reported, never replaced.
10. **Code owners** (GitHub only): the owner and the critical paths, which are listed separately so a change there is never skimmed. On a re-run, existing paths keep their order and new ones are appended.
11. **README tagline and pitch:** the tagline, the pitch headline, the paragraph and the bold one-liner. Without a detected default, draft them from the repository and show the draft as the default.

Write nothing during the interview. A setup half-written from early answers is exactly the drift this skill removes.

**Done when** every answer that applies is confirmed.

## 3. Write the marker

Write `.claude/64x-lunicorn.yml` with exactly this key order and these comments, so the same answers give a byte-identical file:

```yaml
setup_version: 2
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
  runtime: { stack: <stack>, <stack keys> }
  checks:
    - { name: <name>, run: <command>, required: <true | false> }
```

The stack keys, in this order, with versions double-quoted:

| Stack | Keys |
|---|---|
| `node` | `node` |
| `elixir` | `version_file` (a path, unquoted), or `elixir` and `otp` |
| `swift` | `xcode` |
| `cpp-qt` | `cmake`, `qt`, `qt_modules` |

When Daniel accepted a new CI command in step 2, add it to the stack's entry point. When research is gitignored and `.gitignore` does not ignore `research/` yet, append `research/` to it.

**Done when** the marker exists, parses as YAML and every value matches an answer from step 2.

## 4. Generate from the marker

Invoke these skills one after another, each once the previous one has reported:

1. `configure-ci-gate`, passing the description and topics on GitHub.
2. `write-issue-templates`.
3. `write-agent-docs`.
4. `write-community-files`, passing the license key, the year and holder, and on GitHub the code owner and the critical paths. The year is the detected one, or the current year for a new license.
5. `write-readme`, passing the tagline, the pitch, the license key, the year and the holder. It comes last because the README links what the others write.

Each generates files from the marker and asks Daniel before it changes remote settings. When one of them stops on a gap, note the gap and go on.

**Done when** all five skills have reported or stopped with a named gap.

## 5. Report

End with one report and leave every change uncommitted, so Daniel reviews the result in a pull request:

- **Written:** the marker, `.gitignore` and the stack entry point when they changed, and every file from the five skills with its status.
- **Remote settings:** applied, matching or declined, per skill.
- **Drift** (re-run only): every marker key whose value changed, as old value and new value, and the drift the skills reported.
- **Gaps:**
  - GitLab and Forgejo: not supported yet, until the spike tasks of Spec #4 are done.
  - Every gap a skill named, such as a forge gap of the gate or the banner placeholder of the README.

**Done when** the report names every written file, every remote setting, every changed key and every gap.
