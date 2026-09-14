# Architecture decisions

One file per decision, `NNNN-<slug>.md`, numbered in order and never renumbered. A decision is not edited once accepted: a new ADR supersedes it, and the old one stays with its status pointing to the new one.

## Format

```markdown
# NNNN — <Title>

Status: <proposed | accepted | superseded by [NNNN](NNNN-<slug>.md)>, YYYY-MM-DD

## Context

## Decision

## Consequences

## Alternatives
```

A `## Verification` section before Consequences records how the decision was checked, when it was.

## Index

| ADR | Decision | Status |
| :--- | :--- | :--- |
| [0001](0001-plugin-instead-of-loose-skills.md) | Plugin instead of a loose skills collection | accepted |
| [0002](0002-own-conventions-stricter-than-the-spec.md) | Own conventions, stricter than the spec | accepted |
| [0003](0003-no-meta-skill-in-phase-1.md) | No meta skill in phase 1 | superseded by [0004](0004-own-skill-creation-instead-of-mattpocock.md) |
| [0004](0004-own-skill-creation-instead-of-mattpocock.md) | Own skill creation instead of mattpocock-skills | accepted |
| [0005](0005-research-objects-before-specs.md) | Research objects before specs | accepted |
| [0006](0006-specs-describe-domain-behaviour.md) | Specs describe domain behaviour | accepted |
| [0007](0007-splitting-specs-into-tickets.md) | Splitting Specs into tickets | accepted |
| [0008](0008-implementing-tickets.md) | Implementing tickets | accepted |
| [0009](0009-verifying-and-closing-a-spec.md) | Verifying and closing a Spec | accepted |
| [0010](0010-ci-gate-and-issue-templates.md) | CI gate and issue templates | accepted |
| [0011](0011-readme-community-files-and-agent-docs.md) | README, community files and agent docs | accepted |
| [0012](0012-gitlab-and-forgejo.md) | GitLab and Forgejo | accepted |
