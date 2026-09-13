# 0002 — Eigene Konventionen strenger als die Spec

Status: angenommen, 2026-09-13

## Kontext

Laut Agent-Skills-Spec und Claude-Code-Doku sind alle Frontmatter-Felder optional, nur `description` ist empfohlen. Die Fehler, die einen Skill in der Praxis unwirksam machen, sind damit alle spec-konform: eine vage description, ein Frontmatter, das nicht in Zeile 1 beginnt, ein Skill, der nie registriert wurde.

## Entscheidung

Der Validator (Gate A, `tools/validator/`) erzwingt Daniels Konventionen, nicht die Spec. Er ist deterministisch, braucht keinen API-Zugriff und blockiert den Merge.

Die Werte stehen einmal im Code, in `tools/validator/src/conventions.ts`. Dieses ADR ist der Ort, an dem sie diskutiert werden. Wer einen Wert ändert, ändert beides und schreibt zuerst den Test.

### Regelkatalog

| ID | Regel |
|---|---|
| SK001 | Jedes Verzeichnis `skills/<kategorie>/<name>/` enthält eine `SKILL.md` |
| SK002 | Frontmatter wirkt: `---` in Zeile 1, schließendes `---` vorhanden, gültiges YAML |
| SK003 | `description` vorhanden, nicht leer, mindestens 60 Zeichen |
| SK004 | `description` in dritter Person: kein Anfang mit „This skill“, „Dieser Skill“, „Dieses Skill“, „I “, „You “; mindestens 12 Wörter |
| SK005 | `name` identisch mit dem Verzeichnisnamen |
| SK006 | Name kleingeschrieben, Bindestriche, Verb-Substantiv, Verb aus der Allowlist |
| SK007 | Nur Felder aus der Allowlist |
| SK008 | Skills unter `skills/orchestration/` setzen `disable-model-invocation: true` |
| SK009 | Body höchstens 200 Zeilen |
| SK010 | Jede im Body per Markdown-Link referenzierte Datei existiert |
| SK011 | Ein user-invoked Skill referenziert kein anderes user-invoked Skill (`/name` oder `/64x-lunicorn:name`) |
| SK012 | Zu jedem Skill gibt es unter `evals/<skill-name>/` mindestens einen Case (`prompt.md` oder `case.yaml`) |
| SK013 | Jeder Skill steht in `skills` von `plugin.json`, jeder Eintrag dort zeigt auf einen Skill |

SK013 ist nicht Teil des ursprünglichen Katalogs. Daniel hat sie am 2026-09-13 freigegeben, nachdem klar war, dass Claude Code verschachtelte Skills ohne Eintrag stillschweigend nicht lädt.

### Feld-Allowlist (SK007)

Erlaubt sind die sechs Spec-Felder `allowed-tools`, `compatibility`, `description`, `license`, `metadata`, `name` und diese Claude-Code-Felder: `agent`, `argument-hint`, `arguments`, `background`, `context`, `disable-model-invocation`, `disallowed-tools`, `effort`, `model`, `paths`, `user-invocable`.

Bewusst ausgeschlossen:

- `when_to_use` verteilt die Auslöse-Formulierungen auf zwei Felder. Die description ist die einzige API.
- `hooks` versteckt Seiteneffekte im Skill. Hooks gehören in `hooks/` des Plugins.
- `shell` wird erst gebraucht, wenn PowerShell gebraucht wird.

### Begriffe, die der Validator festlegt

- **user-invoked**: `disable-model-invocation: true`. Alle anderen Skills sind model-invoked.
- **Kategorie**: erste Ebene unter `skills/`. Nur `orchestration` hat eine eigene Regel (SK008).
- **Verb-Allowlist (SK006)**: `design`, `diagnose`, `implement`, `plan`, `refactor`, `research`, `resolve`, `review`, `run`, `test`, `triage`, `write`. Ein neues Verb kommt per TDD dazu, wenn ein geernteter Skill es braucht.

### Entscheidungen aus dem Bootstrap (2026-09-13)

- Validator in TypeScript mit vitest. Changesets braucht ohnehin Node, eine zweite Toolchain wäre reiner Mehraufwand.
- Layout `skills/<kategorie>/<name>/` für alle Skills, nicht nur für Orchestratoren.
- Default-Branch ist `main`.

## Konsequenzen

- Konventionsbrüche fallen vor dem Merge auf, nicht erst, wenn ein Skill nie feuert.
- Ein spec-konformer Skill von außen kann abgelehnt werden. Das ist gewollt.
- Neue Claude-Code-Felder sind ein Fehler, bis die Allowlist bewusst erweitert wird.
- SK004 ist eine Heuristik. Meldet sie falsch-positiv, wird die Regel per TDD geschärft, nicht die Prüfung abgeschaltet.

## Alternativen

- **Nur die Spec prüfen** (`claude plugin validate`): fängt Syntax- und Schemafehler, keine Konventionen.
- **Konventionen nur in `CLAUDE.md`**: greift nur, wenn das Modell sie beachtet. Nichts blockiert den Merge.
