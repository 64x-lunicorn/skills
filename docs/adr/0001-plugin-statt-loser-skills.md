# 0001 — Plugin statt loser Skills-Sammlung

Status: angenommen, 2026-09-13

## Kontext

Das Repo startet mit Skills. Später kommen Subagents, Commands, Hooks und Workflows dazu, etwa für den Sprint-Orchestrator (Phase 5). Ein reiner Skills-Ordner kann nur Skills tragen und wird bei jedem neuen Baustein umgebaut.

## Entscheidung

Das Repo ist ein Claude-Code-Plugin mit dem Namen `64x-lunicorn`. Das Manifest liegt in `.claude-plugin/plugin.json`, das Repo ist zugleich sein eigener Marketplace (`.claude-plugin/marketplace.json`, `source: "./"`). Kommandos heißen `/64x-lunicorn:<skill>`.

Der Name `64x-lunicorn` ist eindeutig genug für Kommando-Präfix und Marketplace. Der Repo-Name `skills` wäre es nicht. Entscheidung Daniel, 2026-09-13.

## Konsequenzen

- Alle vier Ebenen (Skills, Subagents, Commands/Workflows, Hooks) finden ohne Umbau Platz.
- Kommandos tragen immer das Präfix `64x-lunicorn:`. Referenzen zwischen Skills schreiben es aus.
- Skills liegen unter `skills/<kategorie>/<name>/`. Claude Code lädt verschachtelte Skills nur, wenn sie in `skills` von `plugin.json` stehen. SK013 prüft das, siehe ADR 0002.
- Versioniert wird das Plugin als Ganzes über Changesets, nicht pro Skill.

## Alternativen

- **Loser Skills-Ordner** unter `~/.claude/skills/`: am schnellsten, aber ohne Subagents, Hooks und Workflows und ohne Versionierung.
- **Mehrere Plugins** (eins pro Ebene): sauber getrennt, aber mehr Installationen und kein gemeinsamer Release für Bausteine, die zusammengehören.
