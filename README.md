# 64x-lunicorn

Claude-Code-Plugin: eigene Skills, später Subagents, Commands, Hooks und Workflows. Jede `SKILL.md` läuft vor dem Merge durch einen Validator, der die Konventionen aus [ADR 0002](docs/adr/0002-eigene-konventionen-strenger-als-die-spec.md) erzwingt.

**Installieren**

```
/plugin marketplace add Lunicorn-lab/skills
/plugin install 64x-lunicorn@64x-lunicorn
```

**Beitragen:** Korrektur zuerst in [`inbox.md`](inbox.md). Beim dritten Mal wird daraus ein Skill, nach [`CLAUDE.md`](CLAUDE.md). PR öffnen, `npm run validate` und `npm test` müssen grün sein.
