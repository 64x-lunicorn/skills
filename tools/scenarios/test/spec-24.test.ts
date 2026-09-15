import { expect, it } from "vitest";
import { loadCases } from "../src/cases.ts";
import { repoRoot } from "./root.ts";

/** The scenarios of Spec #24 that ticket #35 owns, verbatim; each runs as an eval case. */
const SCENARIOS = [
  "A behind ticket pull request is updated before a new ticket starts",
  "No pull request is behind",
  "Merge conflicts are resolved keeping both intents",
  "Resolving invents no behaviour",
  "The update runs in the ticket's own context",
  "Incompatible intents stop the update",
  "An incompatible-intents stop is not a review conflict",
  "An updated branch passes both reviews and the gate again",
  "The history the review saw stays intact",
  "Resolving never pushes",
  "The project's checks run before the merge is recorded",
  "A merge during a run is not noticed inside that run",
  "Behind without a forge",
];

const caseNames = loadCases(repoRoot).map((c) => c.name);

it.each(SCENARIOS)("Spec #24 scenario has exactly one case: %s", (name) => {
  expect(caseNames.filter((caseName) => caseName === name)).toHaveLength(1);
});
