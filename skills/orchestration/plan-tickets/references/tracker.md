# Tracker operations

Read when creating or linking issues in steps 3 to 6. Verified 2026-09-14 against the GitHub REST API docs, API version `2026-03-10`.

## GitHub

Write every body to a file in the scratchpad first. Backticks in Mermaid and Gherkin blocks break when a body is quoted inline in a shell.

| Operation | Command |
|---|---|
| Create an issue | `gh issue create --title "<title>" --label <label> --body-file <file>`; the issue number is the last segment of the printed URL |
| Replace a body | `gh issue edit <n> --body-file <file>` |
| Comment | `gh issue comment <n> --body-file <file>` |
| Close with reason | `gh issue close <n> --comment "<reason>"` |
| Check a label | `gh label list --search <label>` |
| Create a label | `gh label create <label> --description "<description>"` |
| Get the numeric id | `gh api repos/{owner}/{repo}/issues/<n> --jq .id` |
| Attach a sub-issue | `gh api -X POST repos/{owner}/{repo}/issues/<parent>/sub_issues -F sub_issue_id=<child id>` |
| List sub-issues | `gh api repos/{owner}/{repo}/issues/<parent>/sub_issues --jq '.[].number'` |
| Add "blocked by" | `gh api -X POST repos/{owner}/{repo}/issues/<n>/dependencies/blocked_by -F issue_id=<blocker id>` |
| List "blocked by" | `gh api repos/{owner}/{repo}/issues/<n>/dependencies/blocked_by --jq '.[].number'` |

Traps:

- `sub_issue_id` and `issue_id` take the numeric **id**, not the issue number. Passing a number attaches the wrong issue or fails.
- `-F` sends the id as an integer; `-f` sends a string, which the API rejects.
- Adding relations quickly can hit secondary rate limits. Add them one at a time and check each response.
- A sub-issue must belong to the same repository owner as its parent.

Labels, when they are created here:

| Label | Description |
|---|---|
| `task` | Agent-sized ticket cut from a Spec |
| `architecture` | Reviewed technical design for the tickets of a Spec |
| `wayfinder` | Order in which the tickets of a Spec are worked |

## Local issue files

When `issues.tracker` is `local`, every issue is a file `issues/NNNN-<slug>-<type>.md` with the next free number. Relations live in the frontmatter of the child:

```yaml
type: task | architecture | wayfinder
parent: NNNN
blocked_by: [NNNN]
status: open | closed
```

Sub-issues of a Spec are the files whose `parent` is its number. Closing sets `status: closed` and appends the reason to the body.
