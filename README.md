<div align="center">

# skills

<img src="docs/assets/skills-banner.svg" alt="skills - harvested, not invented. SKILL.md, validator gate, versioned releases." width="1200">

### Agent skills for Claude Code. Harvested, not invented.

A [Claude Code](https://code.claude.com/docs/en/plugins) plugin whose skills grow out of
real corrections, and a validator that holds every `SKILL.md` to the same conventions.

[![License: MIT](https://img.shields.io/badge/license-MIT-22c55e?style=flat-square)](LICENSE)
[![Built with TypeScript](https://img.shields.io/badge/built_with-TypeScript-3178c6?style=flat-square)](package.json)
[![Claude Code plugin](https://img.shields.io/badge/Claude_Code-plugin-D97757?style=flat-square)](.claude-plugin/plugin.json)
[![Validator](https://img.shields.io/badge/validator-13_rules-334155?style=flat-square)](docs/adr/0002-own-conventions-stricter-than-the-spec.md)

[Install](#install) &nbsp; / &nbsp;
[Skills](#skills) &nbsp; / &nbsp;
[Contributing](CONTRIBUTING.md) &nbsp; / &nbsp;
[Report a bug](https://github.com/64x-lunicorn/skills/issues)

</div>

---

## Skills that earn their place

Most skill collections start from ideas. This one starts from friction: when an assistant
needs the same correction for the third time, that correction becomes a skill. Until then it
waits in the inbox, word for word.

**A skill exists because it was needed, not because it seemed like a good idea.**

| | What you get |
| :--- | :--- |
| **Harvested from practice** | Every skill traces back to a correction that kept coming up in real work. |
| **Descriptions that fire** | The description is a skill's only API. Vague ones are rejected before they ship. |
| **Conventions, enforced** | 13 deterministic rules check frontmatter, naming, layering, references and evals on every pull request. |
| **Layered on purpose** | User-invoked skills orchestrate; model-invoked skills hold the reusable discipline. |
| **Versioned releases** | Changesets, a changelog and tagged releases. Installed plugins update when the version moves. |

> [!NOTE]
> This collection is young and grows slowly on purpose. It holds three skills today,
> two of them for creating the rest; more arrive as they are harvested.

## How it works

```text
correction  -->  inbox.md  -->  SKILL.md  -->  validator  -->  pull request  -->  release
                    |              |              |
                    |              |              +-- 13 rules, blocks the merge
                    |              +-- written once the same correction was needed 3x
                    +-- recorded word for word, with a counter
```

The validator is deterministic, needs no API access and runs in milliseconds.
Behavioural evals under [`evals/`](evals/) come next; every skill already ships with at
least one case.

## Install

```text
/plugin marketplace add 64x-lunicorn/skills
/plugin install 64x-lunicorn@64x-lunicorn
```

Skills trigger on their own when a request matches their description, or run as
`/64x-lunicorn:<skill>`.

## Skills

| Skill | Invocation | What it does |
| :--- | :--- | :--- |
| [`harvest-skill`](skills/orchestration/harvest-skill/SKILL.md) | user-invoked | Turns a harvested correction or a proven gap into a new skill, wrapping `skill-creator` with the repo's rules. |
| [`write-commit-message`](skills/engineering/write-commit-message/SKILL.md) | model-invoked | Drafts a Conventional Commits message in English imperative mood for staged changes. |
| [`write-skill`](skills/engineering/write-skill/SKILL.md) | model-invoked | Writes or edits a `SKILL.md` so it triggers reliably and gets followed the same way every run. |

## The validator

```bash
npm ci
npm run validate
```

Every finding names its rule, the file and line, and the reason:

```text
SK003 skills/engineering/write-commit-message/SKILL.md:3 description has 24 characters, at least 60 are required.
```

The full rule catalogue, the frontmatter allowlist and the reasoning behind each threshold
live in [ADR 0002](docs/adr/0002-own-conventions-stricter-than-the-spec.md).

## Documentation

| Guide | Start here when you want to... |
| :--- | :--- |
| [CLAUDE.md](CLAUDE.md) | Learn the conventions no validator can check, and how a new skill is added. |
| [CONTEXT.md](CONTEXT.md) | Look up a term: harvest, layering, Gate A, rule ID. |
| [Architecture decisions](docs/adr/) | Understand why this is a plugin, why the rules are stricter than the spec, and why skills are created with own skills only. |
| [GitHub setup](docs/setup-github.md) | Reproduce the branch protection, signing and release flow. |
| [Changelog](CHANGELOG.md) | See what changed in each release. |
| [Contributing](CONTRIBUTING.md) | Set up development, propose a skill or a rule, and submit a focused change. |
| [Security policy](SECURITY.md) | Report a vulnerability privately. |

## Contributing

Bug reports, harvest candidates and focused pull requests are welcome. New skills start as
an [issue](https://github.com/64x-lunicorn/skills/issues) describing the correction that
keeps coming up.

```bash
npm ci
npm test
npm run validate
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the checks, how validator rules are added through
TDD, and what a pull request needs.

## License and credits

skills is licensed under the **[MIT License](LICENSE)**.
The copyright notice is **Copyright (c) 2026 64x-lunicorn**.

The repository layout and skill taxonomy take their cue from
[Matt Pocock's skills collection](https://github.com/mattpocock/skills). No files are copied
from it.
