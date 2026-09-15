# 0001 — No native modules

Status: accepted, 2026-02-10

## Context

csv2json is installed with npx on machines without a compiler. A native CSV parser would be faster on large files.

## Decision

csv2json depends only on Node.js built-in modules and pure JavaScript packages.

## Consequences

- Installing never needs a compiler or a prebuilt binary.
- Parsing speed is bounded by JavaScript.

## Alternatives

- **A native CSV parser:** fails to install where no prebuilt binary matches the platform.
