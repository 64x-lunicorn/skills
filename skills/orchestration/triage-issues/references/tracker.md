# Tracker operations

Read in step 2. GitHub only; the commands need a logged-in `gh`.

## Pick-up queries

| List | Command |
|---|---|
| Unlabelled | `gh issue list --state open --search "no:label" --json number,title,labels,comments` |
| `needs-triage` | `gh issue list --state open --label needs-triage --json number,title,labels,comments` |
| `needs-info` | `gh issue list --state open --label needs-info --json number,title,labels,comments` |
| Named issue | `gh issue view <n> --json number,title,state,labels,comments,body` |

Each `comments` entry has `author`, `body` and `createdAt`.

## The `needs-info` rule

For each `needs-info` issue, take the newest comment whose body contains `Written by Claude during triage, reviewed by Daniel.` and the newest comment without it, by `createdAt`.

- A comment without the line is newer than the newest one with it: the reporter replied, the issue waits for triage.
- No comment carries the line: the label was set by hand, the issue waits for triage.
- Otherwise: the issue stays out.

The comment marker is used rather than the label event or `updatedAt`: the label may have been set by hand, and any edit would move `updatedAt`.

## Traps

- `gh issue list` never returns pull requests, so no filtering is needed and none must be added: an automated dependency update pull request must not be picked up or get an issue.
- An issue can match several lists, for example unlabelled and commented. Count it once.
