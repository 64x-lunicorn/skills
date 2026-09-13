# skills

Claude-Code-Plugin `64x-lunicorn`. Begriffe stehen in `CONTEXT.md`, Entscheidungen in `docs/adr/`.

## Konventionen, die kein Validator prüfen kann

- **Skills werden geerntet, nicht erfunden.** Ein Skill entsteht erst, wenn dieselbe Korrektur dreimal nötig war. Bis dahin: Eintrag in `inbox.md`, wörtlich.
- **Schichtung.** User-invoked orchestriert, model-invoked hält die wiederverwendbare Disziplin. User-invoked ruft model-invoked, nie umgekehrt, nie user-invoked zu user-invoked.
- **Die Description ist die einzige API.** Sie steht permanent im Kontext, der Body lädt erst beim Ziehen. Eine vage Description ist der häufigste Grund, warum ein Skill nie feuert.
- **Ein Skill, eine Entscheidung.** Test: Lässt sich in einem Satz sagen, was schiefgeht, wenn der Skill nicht greift? Wenn nein, ist er zu breit.
- **Progressive Disclosure.** Alles, was nicht bei jedem Aufruf gebraucht wird, kommt in eine Referenzdatei.
- **Duplikation in Prosa ist kein Smell.** DRY gilt hier nicht. Ein gemeinsamer Absatz in zwei Skills ist billiger als ein Pointer, der einen Ladeschritt kostet und manchmal ignoriert wird.
- **Grenze zum Projekt.** Ins Repo kommt nur, was projektübergreifend gilt. Projektspezifisches bleibt im `.claude/` des jeweiligen Projekts.
- **Beim Ändern einer `SKILL.md`** immer `writing-for-agents` ziehen; für Anlegen und Evals `skill-creator`.
- **Validator-Regeln werden per TDD geboren.** Neue Konvention heißt: Fixture, Test, rot, Regel, grün. Nie Regel zuerst.

## Neuer Skill

1. Verzeichnis `skills/<kategorie>/<verb>-<substantiv>/` mit `SKILL.md`.
2. Pfad in `skills` von `.claude-plugin/plugin.json` eintragen.
3. Mindestens einen Eval-Case unter `evals/<name>/<case>/prompt.md` anlegen.
4. `npm run validate` ist grün.

## Änderungen

- Commits folgen `write-commit-message`: Conventional Commits, englisch, imperativ.
- Jede Änderung am Plugin bringt ein Changeset mit (`npx changeset`). Reine Validator- oder Doku-Änderungen brauchen keins.
- Neue Validator-Regeln und geänderte Schwellwerte stehen in `tools/validator/src/conventions.ts` und in ADR 0002, beides im selben PR. Eine neue Regel ist ein Vorschlag an Daniel, bevor der erste Test entsteht.
