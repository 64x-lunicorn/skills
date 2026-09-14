import { spawnSync } from "node:child_process";
import path from "node:path";
import { type ScenarioCase, evalArgs, loadCases, selectScenarios } from "./cases.ts";

const root = path.resolve(".");
const { cases, unknown } = selectScenarios(loadCases(root), process.argv.slice(2));

/** Runs one scenario through `claude plugin eval`; true when it passed. */
function runScenario(scenario: ScenarioCase): boolean {
  console.log(`\nScenario: ${scenario.name}`);
  const result = spawnSync("claude", evalArgs(scenario), { cwd: root, stdio: "inherit" });
  if (result.error) console.error(`Could not start claude: ${result.error.message}`);
  return result.status === 0;
}

if (unknown.length > 0) {
  console.error(`No runnable scenario named: ${unknown.join(", ")}. Pending scenarios are skipped.`);
  process.exitCode = 1;
} else {
  const results: { scenario: ScenarioCase; passed: boolean }[] = [];
  for (const scenario of cases) results.push({ scenario, passed: runScenario(scenario) });
  const failed = results.filter((result) => !result.passed).map((result) => result.scenario);

  console.log(`\n${cases.length - failed.length} of ${cases.length} scenario(s) passed.`);
  for (const { name } of failed) console.error(`Failed: ${name}`);
  if (failed.length > 0) process.exitCode = 1;
}
