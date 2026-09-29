import { spawnSync } from "node:child_process";
import path from "node:path";
import { type ScenarioCase, evalArgs, loadCases, selectScenarios } from "./cases.ts";

const root = path.resolve(".");
const { cases, notRunnable } = selectScenarios(loadCases(root), process.argv.slice(2));

/** Directory of the `gh` shim and the `curl` stand-in, next to this file in the checkout. */
const ghShimDir = path.join(import.meta.dirname, "..", "bin");

/**
 * Puts the `gh` shim and the `curl` stand-in ahead of the real commands on PATH, so a scenario
 * that exercises the GitHub tracker or the GitHub REST API never reaches the network
 * (architecture issues #39 and #101). Served in place: a `claude plugin eval` run's sandbox
 * reads the plugin checkout under test, but not `$TMPDIR` or `/tmp`, so a copy there is
 * skipped on PATH and the real `gh` answers.
 */
function envWithGhShim(): NodeJS.ProcessEnv {
  return { ...process.env, PATH: `${ghShimDir}${path.delimiter}${process.env.PATH}` };
}

/** Runs one scenario through `claude plugin eval`; true when it passed. */
function runScenario(scenario: ScenarioCase, env: NodeJS.ProcessEnv): boolean {
  console.log(`\nScenario: ${scenario.name}`);
  const result = spawnSync("claude", evalArgs(scenario), { cwd: root, stdio: "inherit", env });
  if (result.error) console.error(`Could not start claude: ${result.error.message}`);
  return result.status === 0;
}

if (notRunnable.length > 0) {
  console.error(`No runnable scenario named: ${notRunnable.join(", ")}. Pending scenarios are skipped.`);
  process.exitCode = 1;
} else {
  const env = envWithGhShim();
  const results: { scenario: ScenarioCase; passed: boolean }[] = [];
  for (const scenario of cases) results.push({ scenario, passed: runScenario(scenario, env) });
  const failed = results.filter((result) => !result.passed).map((result) => result.scenario);

  console.log(`\n${cases.length - failed.length} of ${cases.length} scenario(s) passed.`);
  for (const { name } of failed) console.error(`Failed: ${name}`);
  if (failed.length > 0) process.exitCode = 1;
}
