import { expect, it } from "vitest";
import { loadCases } from "../src/cases.ts";
import { repoRoot } from "./root.ts";

/**
 * The scenarios of Spec #23, verbatim; each runs as an eval case. An example of the
 * Scenario Outline carries its criteria in parentheses, so `--case` can tell it apart.
 */
const SCENARIOS = [
  "A settled term is recorded at once",
  "A plain word is not recorded",
  "A term is not recorded without Daniel's confirmation",
  "Another word that came up is recorded as one to avoid",
  "No words to avoid are guessed",
  "A decision meeting all three criteria gets an ADR proposed",
  "An ADR is written after Daniel's ok",
  "An ADR is not written without Daniel's ok",
  "A decision missing one criterion gets no ADR (easy to reverse, surprising without context and a real trade-off)",
  "A decision missing one criterion gets no ADR (hard to reverse, obvious in context and a real trade-off)",
  "A decision missing one criterion gets no ADR (hard to reverse, surprising without context and without trade-off)",
  "An accepted ADR is superseded, never edited",
  "The ADR index is regenerated when an ADR is written",
  "A Spec's missing terms are reported at verification",
  "A Spec closes only with its terms recorded",
  "A Spec with all terms recorded closes without findings on terms",
  "An existing CONTEXT.md stays valid",
  "One CONTEXT.md and one ADR directory per project",
  "The interview records nothing itself",
];

const caseNames = loadCases(repoRoot).map((c) => c.name);

it.each(SCENARIOS)("Spec #23 scenario has exactly one case: %s", (name) => {
  expect(caseNames.filter((caseName) => caseName === name)).toHaveLength(1);
});
