import { expect, it } from "vitest";
import { loadCases } from "../src/cases.ts";
import { repoRoot } from "./root.ts";
import { SCENARIO as WORDING_SCENARIO } from "./wording.test.ts";

/** The scenarios of Spec #16 that ticket #25 owns, verbatim. */
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
  "The wording is interview",
];

/** Every eval case, plus the deterministic scenario that runs as a vitest test. */
const tests = [...loadCases(repoRoot).map((c) => c.name), WORDING_SCENARIO];

it.each(SCENARIOS)("Spec #16 scenario has exactly one test: %s", (name) => {
  expect(tests.filter((test) => test === name)).toHaveLength(1);
});
