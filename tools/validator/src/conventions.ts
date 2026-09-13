// Schwellwerte und Listen, die Daniels Konventionen festlegen.
// Begründung und Diskussion: docs/adr/0002-eigene-konventionen-strenger-als-die-spec.md

/** SK003 */
export const MIN_DESCRIPTION_LENGTH = 60;

/** SK004 */
export const MIN_DESCRIPTION_WORDS = 12;

/** SK004: Anfänge, die nicht in dritter Person mit dem Anwendungsfall führen. Groß-/Kleinschreibung egal. */
export const FORBIDDEN_DESCRIPTION_STARTS = ["this skill", "dieser skill", "dieses skill", "i ", "you "];

/** SK006: erlaubte Verben als erstes Namenssegment. Wächst per TDD, nie auf Vorrat. */
export const SKILL_NAME_VERBS = [
  "design",
  "diagnose",
  "implement",
  "plan",
  "refactor",
  "research",
  "resolve",
  "review",
  "run",
  "test",
  "triage",
  "write",
];
