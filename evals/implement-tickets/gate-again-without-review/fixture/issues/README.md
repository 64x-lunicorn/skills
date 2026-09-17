# Issues

This project tracks issues as Markdown files, one per issue. Skills read and write them by this format, so keep it exact.

## File names

`NNNN-<slug>-<type>.md`, with the next free four-digit number. The number is the issue's identity: `#12` and `#0012` both mean `0012-*.md`.

## Frontmatter

```yaml
type: spec | task | bugfix | architecture | wayfinder
status: open | closed
parent: NNNN        # tickets, architecture issue and wayfinder: their Spec
blocked_by: [NNNN]  # tickets: the tickets that must be closed first
```

## Body

- Tickets start with the reference line `> Part of Spec #NNNN. Architecture: #NNNN. Order: #NNNN.`
- The architecture issue starts with `> Technical design for the tickets of Spec #NNNN. Order of work: #NNNN.`
- The wayfinder starts with `> Order of work for Spec #NNNN. Architecture: #NNNN.`

## Closing

Set `status: closed`. An issue closed without being done also gets the line `Closed as not planned`, followed by the reason.
