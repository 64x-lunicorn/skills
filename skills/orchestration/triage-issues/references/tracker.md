# Tracker operations

Read in step 2. GitHub only; the commands need a logged-in `gh`.

## Pick-up queries

| List | Command |
|---|---|
| Unlabelled | `gh issue list --state open --search "no:label" --limit 200 --json number,title,labels,comments` |
| `needs-triage` | `gh issue list --state open --label needs-triage --limit 200 --json number,title,labels,comments` |
| `needs-info` | `gh issue list --state open --label needs-info --limit 200 --json number,title,labels,comments` |
| Named issue | `gh issue view <n> --json number,title,url,state,labels,comments,body` |

A named issue whose `url` contains `/pull/`, or whose `state` is not `OPEN`, is left out with that reason and not handled.

Each `comments` entry has `author`, `body` and `createdAt`.

## Routing

Read in step 5. After the route is set, remove the triage labels from the issue:

`gh issue edit <n> --remove-label needs-triage --remove-label needs-info`

A label the issue does not carry makes `gh` fail; remove only the ones it has.

## The `needs-info` rule

For each `needs-info` issue, take the newest comment whose body contains `Written by Claude during triage, reviewed by Daniel.` and the newest comment without it, by `createdAt`.

- A comment without the line is newer than the newest one with it: it counts as the reporter's reply, whoever wrote it, Daniel and bots included, and the issue waits for triage.
- No comment carries the line: the label was set by hand, the issue waits for triage.
- Otherwise: the issue stays out.

The comment marker is used rather than the label event or `updatedAt`: the label may have been set by hand, and any edit would move `updatedAt`.

## Traps

- `gh issue list` never returns pull requests, so no filtering is needed and none must be added: an automated dependency update pull request must not be picked up or get an issue.
- An issue can match several lists, for example unlabelled and commented. Count it once.
