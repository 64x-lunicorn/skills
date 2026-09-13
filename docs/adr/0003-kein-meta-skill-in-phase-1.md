# 0003 — Kein Meta-Skill in Phase 1

Status: angenommen, 2026-09-13

## Kontext

Naheliegend wäre ein Skill, der neue Skills nach Daniels Konventionen erzeugt. Zum Start des Repos gibt es aber noch keinen einzigen geernteten Skill, aus dem sich ablesen ließe, was ein guter Skill hier ist. `skill-creator` und `writing-for-agents` decken Anlegen, Evals und Schreiben bereits ab.

## Entscheidung

In Phase 1 entsteht kein Meta-Skill. Konventionen leben an zwei Orten:

- **maschinell prüfbar** im Validator (ADR 0002),
- **urteilsabhängig** in `CLAUDE.md`.

Der Meta-Skill kommt in Phase 4, geerntet aus dem, was in Phase 3 dreimal gleich gemacht wurde. Er wird ein dünner Wrapper um `skill-creator`, keine Neuimplementierung.

## Konsequenzen

- Ein Skill-Generator aus Theorie würde falsche Annahmen zementieren. Das bleibt aus.
- Neue Skills entstehen in Phase 3 von Hand. Das kostet mehr Zeit und liefert dafür das Material für Phase 4.
- `CLAUDE.md` greift auch, wenn eine `SKILL.md` ohne Meta-Skill angefasst wird.

## Alternativen

- **Meta-Skill sofort**: schneller Start, aber aus Ideen statt aus Praxis geschrieben.
- **Nur `skill-creator` ohne eigene Konventionen**: keine Durchsetzung, jeder Skill sähe anders aus.
