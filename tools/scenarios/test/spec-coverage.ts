import { expect, it } from "vitest";
import { loadCases } from "../src/cases.ts";
import { repoRoot } from "./root.ts";

const caseNames = loadCases(repoRoot).map((c) => c.name);

/** Asserts each of a Spec's scenarios, verbatim, has exactly one eval case under `evals/`. */
export function expectOneCasePerScenario(specNumber: number, scenarios: string[]): void {
  it.each(scenarios)(`Spec #${specNumber} scenario has exactly one case: %s`, (name) => {
    expect(caseNames.filter((caseName) => caseName === name)).toHaveLength(1);
  });
}
