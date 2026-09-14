// Thresholds and lists that define the repo's conventions.
// Rationale and discussion: docs/adr/0002-own-conventions-stricter-than-the-spec.md

/** SK003 */
export const MIN_DESCRIPTION_LENGTH = 60;

/** SK004 */
export const MIN_DESCRIPTION_WORDS = 12;

/** SK004: starts that do not lead with the use case in third person. Case-insensitive. */
export const FORBIDDEN_DESCRIPTION_STARTS = ["this skill", "dieser skill", "dieses skill", "i ", "you "];

/** SK009: beyond this, content belongs in a reference file next to SKILL.md. */
export const MAX_BODY_LINES = 200;

/** SK014: every user-invoked skill checks the project setup before its own steps. */
export const SETUP_STEP_HEADING = "## 0. Check project setup";

/** SK014: the exact notice, so every skill says the same thing. */
export const SETUP_MISSING_NOTICE = "Project setup missing. Run /64x-lunicorn:setup-project.";

/** SK014: current `setup_version` of `.claude/64x-lunicorn.yml`. Raising it fails every skill still checking the old value. */
export const SETUP_VERSION = 1;

/** SK008: category whose skills only Daniel invokes, never the model. */
export const ORCHESTRATION_CATEGORY = "orchestration";

/**
 * SK007: frontmatter allowlist. The six spec fields plus deliberately allowed Claude Code fields.
 * Excluded: when_to_use (the description is the only API), hooks (side effects belong in the
 * plugin's hooks/), shell (only needed once PowerShell is needed).
 */
export const ALLOWED_FRONTMATTER_FIELDS = [
  // Agent Skills spec
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

/** SK006: allowed verbs as the first name segment. Grows through TDD, never in advance. */
export const SKILL_NAME_VERBS = [
  "design",
  "diagnose",
  "harvest",
  "implement",
  "plan",
  "promote",
  "refactor",
  "research",
  "resolve",
  "review",
  "run",
  "test",
  "triage",
  "verify",
  "write",
];
