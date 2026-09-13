---
name: write-commit-message
description: Drafts a Conventional Commits message in English imperative mood for staged changes. Use when the user says "commit", "commit this" or "write the commit message".
allowed-tools: Bash(git diff:*), Bash(git status:*), Bash(git log:*)
---

Read `git diff --staged` before writing anything. The message describes what is staged, nothing else.

## Format

```
<type>(<scope>): <subject>

<body>
```

- **type**: `feat`, `fix`, `refactor`, `test`, `docs`, `ci`, `build`, `perf` or `chore`. Append `!` for a breaking change: `feat!: …`.
- **scope**: optional, the area touched, e.g. `validator` or `ci`.
- **subject**: English, imperative mood (`add`, not `added`), lowercase start, no trailing period, at most 72 characters including type and scope.
- **body**: optional. Explain _why_, not what the diff already shows. Wrap at 72 characters.

## One commit, one change

When the staged diff holds unrelated changes, propose how to split it before writing a message.

## Examples

```
feat(api): add dashboard delete endpoints
fix(ci): pin action versions
feat!: relicense from MIT to GPL-3.0-or-later
```
