# skills

**Skills as code for Claude Code.** Harvested from real corrections, not invented. Every `SKILL.md` passes a validator before it can land on `main`.

## Install

```
/plugin marketplace add 64x-lunicorn/skills
/plugin install 64x-lunicorn@64x-lunicorn
```

Skills trigger on their own or run as `/64x-lunicorn:<skill>`.

## Skills

| Skill | What it does |
| :-- | :-- |
| [`write-commit-message`](skills/engineering/write-commit-message/SKILL.md) | Drafts a Conventional Commits message in English imperative mood for staged changes. |

## Contributing

A correction goes into [`inbox.md`](inbox.md) first. The third time it is needed, it becomes a skill ([`CLAUDE.md`](CLAUDE.md)). Open a PR; `npm run validate` and `npm test` must pass. The rules behind the validator: [ADR 0002](docs/adr/0002-own-conventions-stricter-than-the-spec.md).

## License

[MIT](LICENSE)
