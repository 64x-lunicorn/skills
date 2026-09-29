# Tracker operations

Read in steps 2 and 3. GitHub only; the commands need a logged-in `gh`.

## Pick-up queries

| List | Command |
|---|---|
| Unlabelled | `gh issue list --state open --search "no:label" --limit 200 --json number,title,labels,comments` |
| `needs-triage` | `gh issue list --state open --label needs-triage --limit 200 --json number,title,labels,comments` |
| `needs-info` | `gh issue list --state open --label needs-info --limit 200 --json number,title,labels,comments` |
| Named issue | `gh issue view <n> --json number,title,url,state,labels,comments,body` |

A named issue whose `url` contains `/pull/`, or whose `state` is not `OPEN`, is left out with that reason and not handled.

Each `comments` entry has `author`, `body` and `createdAt`.

## Earlier rejections

Read in step 3. Run one search per issue with its key terms (three to five distinctive words of its title):

`gh issue list --state closed --search 'reason:"not planned" <key terms>' --limit 50 --json number,title,url,stateReason,closedAt,comments`

`reason:"not planned"` limits the result to issues closed as not planned. Repeat with a synonym when the first terms find nothing. A closed issue of the same request is named with its number, title and the reason in its close comment.

Research objects are searched too: list the directories under `research.path` (`research/` unless the setup says otherwise), read each `README.md` front matter and keep those with `status: rejected` or `status: parked`, then match their title and text against the same key terms. A matching object is named with its directory name, status and the reason its README gives. Without a research directory, the Earlier rejections line carries the note `no research objects`, for example `no earlier rejection found; no research objects`.

Duplicates are searched with the same key terms, open and closed issues alike, leaving out the examined issue itself:

`gh issue list --state all --search '<key terms> in:title,body' --limit 50 --json number,title,url,state`

A hit asking for the same thing is named with its number, title and state.

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
