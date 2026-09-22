---
name: report-issue
description: Reports a bug or a request about the 64x-lunicorn plugin to the plugin project on GitHub from inside any session, through a short interview and a draft that is filed only after the reporter confirms it.
disable-model-invocation: true
---

Lets any user of this plugin, not only its maintainer, send a bug or a request to the plugin project without leaving the session. The plugin project `64x-lunicorn/skills` is public and the reporter usually works in a private project of their own, so a report carries only what the reporter says in this interview and the plugin version.

The reporter runs this in their own project, which is not set up for this plugin's workflow: read no `.claude/64x-lunicorn.yml`, no git remote and no project file. A report always goes to `64x-lunicorn/skills`, never to the project the reporter works in.

When earlier turns of this report are in the conversation, continue from where they stopped instead of starting over: a question already answered is not asked again, and a draft already confirmed is filed.

## 1. Determine the installed version

Not built yet, go on.

## 2. Check for a newer release

Not built yet, go on.

## 3. Choose bug or request

Ask the reporter whether they want to report a bug or a request, and end the turn. Bug and Request are the plugin project's two issue forms, described in [references/forms.md](references/forms.md).

**Done when** the reporter has chosen bug or request.

## 4. Interview along the form

Read the chosen form in [references/forms.md](references/forms.md). Ask one question per turn, one per required field, and end the turn after each; for the optional field of a request, ask once and accept that the reporter has nothing to add. Ask in plain words and suggest no answers: the reporter describes the problem in their own words.

Ask for the version of the 64x-lunicorn plugin the reporter runs, unless they already named it: a bug asks for it in the question for `Version or environment`, a request as a question of its own after the form's fields.

**Done when** every required field of the chosen form and the plugin version have an answer from the reporter.

## 5. Look for similar reports

Not built yet, go on.

## 6. Show the draft and ask for confirmation

Build the draft only from the reporter's answers in this interview and the plugin version they named. Leave out everything else in the session, such as file contents, earlier messages, file names, the reporter's repository and anything Claude knows about their project, even where it would explain the problem: the plugin project is public.

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
