// Schwellwerte und Listen, die Daniels Konventionen festlegen.
// Begründung und Diskussion: docs/adr/0002-eigene-konventionen-strenger-als-die-spec.md

/** SK003 */
export const MIN_DESCRIPTION_LENGTH = 60;

/** SK004 */
export const MIN_DESCRIPTION_WORDS = 12;

/** SK004: Anfänge, die nicht in dritter Person mit dem Anwendungsfall führen. Groß-/Kleinschreibung egal. */
export const FORBIDDEN_DESCRIPTION_STARTS = ["this skill", "dieser skill", "dieses skill", "i ", "you "];

/**
 * SK007: Frontmatter-Allowlist. Die sechs Spec-Felder plus bewusst zugelassene Claude-Code-Felder.
 * Ausgeschlossen: when_to_use (die description ist die einzige API), hooks (Seiteneffekte
 * gehören in hooks/ des Plugins), shell (erst nötig, wenn PowerShell gebraucht wird).
 */
export const ALLOWED_FRONTMATTER_FIELDS = [
  // Agent-Skills-Spec
  "allowed-tools",
  "compatibility",
  "description",
  "license",
  "metadata",
  "name",
  // Claude Code
  "agent",
  "argument-hint",
  "arguments",
  "background",
  "context",
  "disable-model-invocation",
  "disallowed-tools",
  "effort",
  "model",
  "paths",
  "user-invocable",
];

/** SK009: darüber gehört Inhalt in eine Referenzdatei neben der SKILL.md. */
export const MAX_BODY_LINES = 200;

/** SK008: Kategorie, deren Skills nur Daniel zieht, nie das Modell. */
export const ORCHESTRATION_CATEGORY = "orchestration";

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
