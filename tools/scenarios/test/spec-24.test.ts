import { expectOneCasePerScenario } from "./spec-coverage.ts";

/**
 * The scenarios of Spec #24, verbatim; each runs as an eval case. The first 13 were owned by
 * the integration test ticket #35; the last was accepted into the Spec later and added directly
 * by ticket #90, which built its case.
 */
const SCENARIOS = [
  "A behind ticket pull request is updated before a new ticket starts",
  "No pull request is behind",
  "Merge conflicts are resolved keeping both intents",
  "Resolving invents no behaviour",
  "The update runs in the ticket's own context",
  "Incompatible intents stop the update",
  "An incompatible-intents stop is not a review conflict",
  "An updated branch passes the gate again without a review",
  "The history the review saw stays intact",
  "Resolving never pushes",
  "The project's checks run before the merge is recorded",
  "A merge during a run is not noticed inside that run",
  "Behind without a forge",
  "A stopped update passes both reviews and the gate before a new ticket starts",
];

expectOneCasePerScenario(24, SCENARIOS);
