# Without a forge: local issue files

Read this when `.claude/64x-lunicorn.yml` has `forge: none` or `issues.tracker: local`.

## Issue files

Issue `<n>` is the file in `issues.path` whose name starts with the number, zero-padded to four digits. Its label is the frontmatter `type`, its state is `status` with `closed` meaning closed, and every number in `blocked_by` is open until its own file says `closed`.

## Behind ticket branches

For each local `refs/heads/ticket/<n>-*` of an unchecked ticket, run `git merge-base --is-ancestor <default_branch> <ref>`. Exit 1 means behind, a hit; any other non-zero exit is an error: stop and show it.

Without a remote nothing is pushed and no checks are watched; the updated branch stays local and is reported by its branch name instead of a pull request link.

## Update stops on the wayfinder

An `Update stop for #<n>` entry is a line under the wayfinder's final `## Update stops` section; add the section when the wayfinder has none yet. The last such entry for a ticket counts as open until a line `Update stop for #<n> resolved` follows it.

## Closing a Spec

Set `status: closed` in the Spec, architecture issue and wayfinder files, and append the closing summary to the Spec.
