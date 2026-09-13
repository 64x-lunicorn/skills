---
name: write-commit-message
description: Drafts a commit message for staged changes. Use when the user says "commit this", "write the commit" or asks for a commit message.
license: MIT
argument-hint: "[scope]"
allowed-tools: Bash(git diff:*)
user-invocable: true
effort: low
metadata:
  version: 1.0.0
  owner: daniel
---

Write the subject line in imperative mood.
