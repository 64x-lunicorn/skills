# Issue form templates

Read when writing `.github/ISSUE_TEMPLATE/`. Each file is the content of its fenced block, ending with exactly one newline. Syntax verified 2026-09-14 against the GitHub docs on issue forms: `name`, `description` and `body` are required at the top level, and `validations: required: true` makes a field mandatory.

## `bug.yml`

```yaml
name: Bug
description: Something does not work as expected.
labels: ["bug", "needs-triage"]
body:
  - type: textarea
    id: what-happened
    attributes:
      label: What happened
      description: What did you do, and what did you see?
    validations:
      required: true
  - type: textarea
    id: expected
    attributes:
      label: What you expected
    validations:
      required: true
  - type: input
    id: environment
    attributes:
      label: Version or environment
      description: The version you use, and your operating system or browser when it matters.
    validations:
      required: true
```

## `request.yml`

```yaml
name: Request
description: A problem you would like solved, or an idea.
labels: ["request", "needs-triage"]
body:
  - type: textarea
    id: problem
    attributes:
      label: Which problem
      description: What are you trying to do, and what gets in the way?
    validations:
      required: true
  - type: textarea
    id: idea
    attributes:
      label: How you imagine it
      description: Optional.
    validations:
      required: false
```

## `config.yml`

GitHub still shows people with write access a blank issue option; everyone else only sees the two forms.

```yaml
blank_issues_enabled: false
```
