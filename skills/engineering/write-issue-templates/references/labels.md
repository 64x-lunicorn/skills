# Label set

Read when bringing labels to the house set. The set is closed: names are matched exactly by skills and triage. Colors are hex without `#`. The descriptions of `task`, `architecture` and `wayfinder` match what `plan-tickets` creates.

## Type

| Name | Color | Description |
|---|---|---|
| `bug` | `d73a4a` | Something does not work as expected |
| `request` | `a2eeef` | A problem or idea from a user |
| `spec` | `5319e7` | Domain behaviour to build; never implemented directly |
| `task` | `0e8a16` | Agent-sized ticket cut from a Spec |
| `bugfix` | `b60205` | Work order to fix a confirmed bug |
| `architecture` | `1d76db` | Reviewed technical design for the tickets of a Spec |
| `wayfinder` | `fbca04` | Order in which the tickets of a Spec are worked |

## Status

Set by triage, a later skill. This skill only keeps the labels themselves in the set.

| Name | Color | Description |
|---|---|---|
| `needs-triage` | `ededed` | Not looked at yet |
| `needs-info` | `d876e3` | Waiting for more information |
| `ready-for-agent` | `0052cc` | Complete enough for an agent to work on |
| `ready-for-human` | `c5def5` | Needs a person to work on or decide |
| `blocked` | `e99695` | Waiting on something outside this issue |

## Other

| Name | Color | Description |
|---|---|---|
| `dependencies` | `0366d6` | Dependency update |

There is no `wontfix` label: an issue that will not be done is closed as not planned, with the reason in a comment.

## Commands

Colors are stored without `#` in the tables above. GitLab and Forgejo expect `#` in front of the color.

### GitHub

| Operation | Command |
|---|---|
| Read | `gh label list --limit 200 --json name,color,description` |
| Count | `gh issue list --label "<name>" --state all --limit 1000 --json number --jq length`, and the same with `gh pr list` |
| Create or update | `gh label create "<name>" --color <color> --description "<description>" --force` |
| Delete | `gh label delete "<name>" --yes` |

### GitLab

Calls are `curl --fail-with-body -sS --header "PRIVATE-TOKEN: ${GITLAB_TOKEN}" "https://<host>/api/v4/..."`, with `<project>` as the URL-encoded project path from `origin`.

| Operation | Command |
|---|---|
| Read | `GET /projects/<project>/labels?per_page=100`, following the `x-next-page` header |
| Count | `GET /projects/<project>/issues?labels=<name>&scope=all&per_page=1`, the `x-total` header; the same with `merge_requests` |
| Create | `POST /projects/<project>/labels` with `name`, `color=#<color>` and `description` |
| Update | `PUT /projects/<project>/labels/<name>` with `color=#<color>` and `description` |
| Delete | `DELETE /projects/<project>/labels/<name>` |

### Forgejo

Calls are `curl --fail-with-body -sS --header "Authorization: token ${FORGEJO_TOKEN}" "https://<host>/api/v1/..."`, with `<owner>` and `<repo>` from `origin`.

| Operation | Command |
|---|---|
| Read | `GET /repos/<owner>/<repo>/labels?limit=50&page=<n>`, until a page is empty |
| Count | `GET /repos/<owner>/<repo>/issues?labels=<name>&state=all&type=issues&limit=1`, the `x-total-count` header; the same with `type=pulls` |
| Create | `POST /repos/<owner>/<repo>/labels` with `{"name": "<name>", "color": "#<color>", "description": "<description>"}` |
| Update | `PATCH /repos/<owner>/<repo>/labels/<id>` with the same fields |
| Delete | `DELETE /repos/<owner>/<repo>/labels/<id>` |
