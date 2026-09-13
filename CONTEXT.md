# Begriffe

**Skill**: Verzeichnis `skills/<kategorie>/<name>/` mit einer `SKILL.md`. Der Name ist zugleich das Kommando `/64x-lunicorn:<name>`.

**Kategorie**: erste Ebene unter `skills/`, z. B. `engineering` oder `orchestration`.

**model-invoked**: das Modell zieht den Skill selbst, ausgelöst über die description.

**user-invoked**: nur Daniel zieht den Skill, per Kommando. Erkennbar an `disable-model-invocation: true`. Orchestratoren sind immer user-invoked.

**Schichtung**: user-invoked orchestriert, model-invoked hält die wiederverwendbare Disziplin. User-invoked ruft model-invoked, nie umgekehrt, nie user-invoked zu user-invoked.

**Ernte**: ein Skill entsteht erst, wenn dieselbe Korrektur dreimal nötig war. Geerntet, nicht erfunden.

**Inbox**: `inbox.md`, der Backlog der Ernte. Korrekturen stehen dort wörtlich mit Zähler.

**Gate A**: der Validator. Deterministisch, ohne API, blockiert den Merge.

**Gate B**: der Eval-Runner ab Phase 2. Nicht-deterministisch, kostet Tokens, zunächst nicht blockierend.

**Regel-ID**: stabile Kennung einer Validator-Regel, `SK001` …. Befunde, Tests und ADR 0002 verweisen darauf.

**Befund**: eine Meldung des Validators: Regel-ID, Pfad, Zeile wenn ermittelbar, Begründung.

**Fixture**: Mini-Repo unter `tools/validator/fixtures/skNNN/`. `fail-*` verstößt gegen genau eine Regel, `pass` erfüllt sie an ihren Grenzfällen.
