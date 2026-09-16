import { expect, it } from "vitest";
import { loadCases } from "../src/cases.ts";
import { repoRoot } from "./root.ts";

/** The scenarios of Spec #33, verbatim; each runs as an eval case. */
const SCENARIOS = [
  "A scan runs only when Daniel starts it",
  "A named area sets the scope",
  "Without an area the hot spots set the scope",
  "A missing seam weighs above frequent change",
  "Every candidate is complete",
  "A strength is one of three values",
  "The report ends with one top recommendation",
  "The report lands nowhere in the project",
  "A candidate that contradicts an ADR without real friction is dropped",
  "A candidate that contradicts an ADR with real friction is marked",
  "Candidates speak the project's terms and the design vocabulary",
  "A suspected shallow module passes the deletion test before it becomes a candidate",
  "A pass-through does not become a candidate",
  "Daniel picks no candidate",
  "A picked candidate is worked through in an interview",
  "Alternative interfaces are offered and declined",
  "Alternative interfaces are drafted on yes",
  "An accepted candidate becomes a refactor task",
  "A refactor task is green before and after",
  "The seams of a refactor task are agreed with Daniel",
  "A term that settled in the interview is recorded",
  "A rejection with a lasting reason becomes an ADR",
  "A rejection with a passing reason records nothing",
  "A later scan does not re-suggest a rejected candidate",
  "A missing seam is noted on the bugfix issue",
  "The architecture review uses the design vocabulary",
  "The change review uses the design vocabulary",
  "Ticket implementation uses the design vocabulary",
  "Seam keeps its meaning",
  "A seam is introduced only where something varies",
  "A deepened module replaces its shallow tests",
];

const caseNames = loadCases(repoRoot).map((c) => c.name);

it.each(SCENARIOS)("Spec #33 scenario has exactly one case: %s", (name) => {
  expect(caseNames.filter((caseName) => caseName === name)).toHaveLength(1);
});
