import { expectOneCasePerScenario } from "./spec-coverage.ts";

/**
 * The model-observed scenarios of Spec #16, verbatim; each runs as an eval case. An example of a
 * Scenario Outline, or a second case of a scenario, adds its skill in parentheses, because `--case`
 * cannot tell duplicate names apart.
 */
const SCENARIOS = [
  "A question carries a recommended answer",
  "A question shows the decisions still open",
  "One question at a time",
  "A fact that can be looked up is not asked",
  "The interview ends with confirmed decisions",
  "A rejected list reopens the interview",
  "The interview saves nothing",
  "Daniel starts an interview himself",
  "interview-me names the next command",
  "A question with fixed wording is asked word for word",
  "No emojis in questions",
  "Every calling skill interviews the same way (setup-project)",
  "Every calling skill interviews the same way (research-idea)",
  "Every calling skill interviews the same way (promote-research)",
  "Every calling skill interviews the same way (write-spec)",
  "Every calling skill interviews the same way (plan-tickets)",
  "Every calling skill interviews the same way (implement-tickets)",
  "The interview saves nothing (promote-research)",
];

// "The wording is interview" is deterministic and is covered by wording.test.ts, not by an eval case.

expectOneCasePerScenario(16, SCENARIOS);
