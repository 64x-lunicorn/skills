# GitHub commands

Read in steps 5 and 7. The plugin project is always `64x-lunicorn/skills`; it is passed with `--repo` on every call, so the reporter's own repository and its remote never decide where a report goes.

| Operation | Command |
|---|---|
| Can the reporter file directly | `command -v gh` succeeds and `gh auth status --hostname github.com` exits 0 |
| Look for similar reports | `curl -fsS -G https://api.github.com/search/issues --data-urlencode "q=repo:64x-lunicorn/skills is:issue <3 to 5 distinctive words>" -d per_page=3`; open and closed, each result's number, title, state and link |
| File the report | `gh issue create --repo 64x-lunicorn/skills --title "<title>" --body-file -` with the draft's body on stdin; the report's link is the URL it prints |
| Add to an existing report | `gh issue comment <number> --repo 64x-lunicorn/skills --body-file -` with the comment's body on stdin; the added comment's link is the URL it prints |

Traps:

- Pass the body on stdin, never with `--body`: quotes and backticks in the reporter's words break an inline shell argument.
- Pass no `--label`, `--assignee` or `--milestone`. GitHub drops them silently for reporters without push access, and `gh` fails before filing when a named label does not exist; triage picks up reports without a type label.
- Do not use `--template`: `gh issue create` does not fill YAML issue forms, and `--template` cannot be combined with a body.
- Judge `gh auth status` by its exit code, which is non-zero when nobody is logged in; a missing `gh` and a failing `gh auth status` are the same case.
- Pass `-G` (or `--get`) on the search: without it, `--data-urlencode` sends the query as a POST body instead of a query string, and the request fails.
- Look for similar reports with `curl`, never `gh`: it needs no login, so a reporter who cannot file directly still sees them.
