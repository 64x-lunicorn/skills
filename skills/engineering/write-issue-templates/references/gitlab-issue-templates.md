# GitLab issue templates

Read when writing `.gitlab/issue_templates/` for `forge: gitlab`. Each file is the content of its fenced block, ending with exactly one newline. Verified 2026-09-14 on GitLab CE 19.2.6: templates on the default branch are offered for new issues.

GitLab issue templates are Markdown. They have no required fields, and GitLab has no switch that disables blank issues, so the templates guide reporters without enforcing anything. The labels come from `/label` quick actions on the last line, which GitLab applies when the issue is created.

## `Bug.md`

```markdown
## What happened

<!-- What did you do, and what did you see? -->

## What you expected

## Version or environment

<!-- The version you use, and your operating system or browser when it matters. -->

/label ~bug ~needs-triage
```

## `Request.md`

```markdown
## Which problem

<!-- What are you trying to do, and what gets in the way? -->

## How you imagine it

<!-- Optional. -->

/label ~request ~needs-triage
```
