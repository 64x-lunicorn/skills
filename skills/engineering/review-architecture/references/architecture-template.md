# Architecture template

Read when filling the architecture issue body. Replace every `<…>` and delete comments. Title: `Architecture: <Spec title>`. Label: `architecture`.

````markdown
> Technical design for the tickets of Spec #<spec>. Order of work: #<wayfinder>.

## Context

<The Spec's goal in one sentence, and the constraints from the codebase that shape the design.>

## Technical notes

<The technical notes from the Spec, verbatim.>

## Components

```mermaid
flowchart TD
    A["<existing component>"] --> B["<new component> (new)"]
```

## Flow

```mermaid
sequenceDiagram
    participant A as "<actor or component>"
    participant B as "<component>"
    A->>B: <domain step>
```

## Decisions

- **<technical decision>.** <reason>

Rejected:

- <option>: <one line why not>

## Ticket dependencies

```mermaid
flowchart LR
    T1["#<n> <title>"] --> T2["#<n> <title>"]
```

## Implementation order

| Phase | Tickets | Parallel | Reason |
|---|---|---|---|
| 1 | #<n> | <yes / no> | <why this comes first> |

## Risks

- <technical risk and how the order or design limits it>

## Review log

### <YYYY-MM-DD>

- Proposal <n>: <change>. Daniel: "<decision, verbatim>"
````
