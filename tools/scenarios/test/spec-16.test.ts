import { expect, it } from "vitest";
import { loadCases } from "../src/cases.ts";
import { repoRoot } from "./root.ts";

/** The model-observed scenarios of Spec #16 that ticket #25 owns, verbatim; each runs as an eval case. */
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
];

// "The wording is interview" is deterministic and is covered by wording.test.ts, not by an eval case.

const caseNames = loadCases(repoRoot).map((c) => c.name);

it.each(SCENARIOS)("Spec #16 scenario has exactly one case: %s", (name) => {
  expect(caseNames.filter((caseName) => caseName === name)).toHaveLength(1);
});
