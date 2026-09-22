# GitHub commands

Read in step 7. The plugin project is always `64x-lunicorn/skills`; it is passed with `--repo` on every call, so the reporter's own repository and its remote never decide where a report goes.

| Operation | Command |
|---|---|
| Can the reporter file directly | `command -v gh` succeeds and `gh auth status --hostname github.com` exits 0 |
| File the report | `gh issue create --repo 64x-lunicorn/skills --title "<title>" --body-file -` with the draft's body on stdin; the report's link is the URL it prints |

Traps:

- Pass the body on stdin, never with `--body`: quotes and backticks in the reporter's words break an inline shell argument.
- Pass no `--label`, `--assignee` or `--milestone`. GitHub drops them silently for reporters without push access, and `gh` fails before filing when a named label does not exist; triage picks up reports without a type label.
- Do not use `--template`: `gh issue create` does not fill YAML issue forms, and `--template` cannot be combined with a body.
- Judge `gh auth status` by its exit code, which is non-zero when nobody is logged in; a missing `gh` and a failing `gh auth status` are the same case.
