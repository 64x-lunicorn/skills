import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { type ScenarioCase, evalArgs, loadCases, selectScenarios } from "./cases.ts";

const root = path.resolve(".");
const { cases, notRunnable } = selectScenarios(loadCases(root), process.argv.slice(2));

/** Source directory of the `gh` shim, next to this file on disk regardless of the run's cwd. */
const ghShimSource = path.join(import.meta.dirname, "..", "bin");

/** Files of the `gh` shim, copied together so its local `package.json` always travels with it. */
const GH_SHIM_FILES = ["gh", "package.json"];

/**
 * Puts the `gh` shim ahead of the real `gh` on PATH, so a scenario that exercises the GitHub
 * tracker never reaches the network (architecture issue #39). Copied to a directory outside the
 * repo because a `claude plugin eval` run's Bash tool cannot read the checkout that started it.
 */
function envWithGhShim(): NodeJS.ProcessEnv {
  const shimDir = path.join(os.tmpdir(), "64x-scenarios", "bin");
  fs.mkdirSync(shimDir, { recursive: true });
  for (const file of GH_SHIM_FILES) fs.copyFileSync(path.join(ghShimSource, file), path.join(shimDir, file));
  fs.chmodSync(path.join(shimDir, "gh"), 0o755);
  return { ...process.env, PATH: `${shimDir}${path.delimiter}${process.env.PATH}` };
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
