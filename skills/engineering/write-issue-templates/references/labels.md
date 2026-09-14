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
