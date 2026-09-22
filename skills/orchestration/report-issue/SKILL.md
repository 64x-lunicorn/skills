---
name: report-issue
description: Reports a bug or a request about the 64x-lunicorn plugin to the plugin project on GitHub from inside any session, through a short interview and a draft that is filed only after the reporter confirms it.
disable-model-invocation: true
---

Lets any user of this plugin, not only its maintainer, send a bug or a request to the plugin project without leaving the session. The plugin project `64x-lunicorn/skills` is public and the reporter usually works in a private project of their own, so a report carries only what the reporter says in this interview and the plugin version.

The reporter runs this in their own project, which is not set up for this plugin's workflow: read no `.claude/64x-lunicorn.yml`, no git remote and no project file. A report always goes to `64x-lunicorn/skills`, never to the project the reporter works in.

When earlier turns of this report are in the conversation, continue from where they stopped instead of starting over: a question already answered is not asked again, and a draft already confirmed is filed.

## 1. Determine the installed version

!`grep -m1 '"version"' "${CLAUDE_PLUGIN_ROOT}/.claude-plugin/plugin.json" || echo "version unknown"`

A version number there is the installed 64x-lunicorn plugin version: it goes straight into the draft in step 6, and the reporter is not asked for it. `version unknown`, or any other line without a version number, such as a note that shell command execution is disabled, means the version could not be determined: ask the reporter which version of the 64x-lunicorn plugin they run, and end the turn.

**Done when** the installed version is known, or the reporter has named it after being asked.

## 2. Check for a newer release

Look up the latest release of the plugin project with the command in [references/github.md](references/github.md). Strip the leading `v` from its tag and compare it, as semver, against the installed version from step 1.

- **The lookup fails:** say nothing about it and go on to step 3.
- **The installed version is the same as or newer than the latest release:** go on to step 3.
- **The installed version is older than the latest release:** tell the reporter and end the turn with the question:

  ```
  You run an older version of 64x-lunicorn than the latest release, <latest version>. To update, run `claude plugin update 64x-lunicorn` (or `/plugin update`), then `/reload-plugins`. The problem may already be fixed there. Do you want to report anyway?
  ```

  - **A clear yes:** go on to step 3. The draft in step 6 keeps stating the installed version from step 1, never the latest release.
  - **Anything else, such as a no, a correction or no answer:** say that nothing was filed, and end the report.

**Done when** no newer release applies, or the reporter has decided whether to report anyway.

## 3. Choose bug or request

Ask the reporter whether they want to report a bug or a request, and end the turn. Bug and Request are the plugin project's two issue forms, described in [references/forms.md](references/forms.md).

**Done when** the reporter has chosen bug or request.

## 4. Interview along the form

Read the chosen form and its concreteness criteria in [references/forms.md](references/forms.md). Ask one question at a time, end the turn after each, and suggest no answers: the reporter describes the problem in their own words. Ask it as plain conversation, never naming the field, its label or the form; for the optional field of a request, ask once and accept that the reporter has nothing to add. An answer that does not yet meet its field's criteria gets a follow-up aimed at what is missing, in place of the next field's question: someone else must be able to reproduce the bug or understand the request from it.

Step 1 already settled the plugin version: for a bug's `environment` field, ask only about the reporter's operating system or browser, not the version again.

**Done when** every required field of the chosen form meets its concreteness criteria, and the plugin version is known from step 1.

## 5. Look for similar reports

Take 3 to 5 distinctive words from the reporter's answers and look for similar reports in the plugin project, open and closed together, with the command in [references/github.md](references/github.md).

- **The search fails:** say so in one line and go on to step 6.
- **No similar report:** say "I found no similar reports in the plugin project." and go on to step 6.
- **One or more similar reports:** show at most three, each with its number, title, state and link, and end the turn with the question:

```
These reports in the plugin project look similar:

- #<number> <title> (<state>) <link>

Is your problem one of them?
```

On the reporter's answer:

- **None of them:** go on to step 6.
- **One of them:** file no new report. Build a comment from the reporter's answers, in the same fields as the draft in step 6 but without a title, show it and end the turn with the question "Add this to #<number>?"

  On a clear yes, check whether the reporter can file directly, with the commands in [references/github.md](references/github.md):

  - **Can file directly:** add the confirmed comment with `gh issue comment` and give the reporter the link it prints.
  - **Cannot file directly:** add nothing and give the reporter the report's link.

  On anything else, such as a no, a correction or no answer, add nothing: after a correction, show the corrected comment again; otherwise say that nothing was added.

**Done when** the reporter has seen any similar reports and, on a confirmed match, the offer to add to it, or the search found nothing or failed and step 6 follows.

## 6. Show the draft and ask for confirmation

Build the draft only from the reporter's answers in this interview and the plugin version from step 1. Leave out everything else in the session, such as file contents, earlier messages, file names, the reporter's repository and anything Claude knows about their project, even where it would explain the problem: the plugin project is public.

Show it in this shape and end the turn with the question:

```
Draft of the report for the plugin project 64x-lunicorn/skills:

Title: <the problem in a few words, taken from the reporter's answers>

### <label of the first field>

<the reporter's answer>

### <label of the next field>

<the reporter's answer>

File this report?
```

- **Bug:** `What happened` holds what the reporter did and what they saw, `What you expected` their expectation, `Version or environment` the plugin version and the environment they named.
- **Request:** `Which problem`, then `How you imagine it` with `_No response_` when the reporter had nothing to add, then `Plugin version`.

**Done when** the draft is shown with the question and the turn has ended, or the reporter has answered it.

## 7. File the report

File only on a clear yes to the draft as shown. On anything else, such as a no, a correction or no answer, file nothing: after a correction, show the corrected draft in step 6 again; otherwise say that nothing was filed. Nothing reaches the plugin project that the reporter has not seen and confirmed.

On a yes, check whether the reporter can file directly, with the commands in [references/github.md](references/github.md):

- **Can file directly:** file the confirmed draft with `gh issue create` exactly as shown, title and body unchanged, in the plugin project. Give the reporter the link of the filed report.
- **Cannot file directly:** file nothing and say: "This session cannot file in the plugin project, and a link with the draft to paste is not built yet. Nothing was filed."

**Done when** the report is filed and its link given, or the reporter was told that nothing was filed.

## 8. Give the link and the draft

Not built yet, go on.
