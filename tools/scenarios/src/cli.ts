import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { type ScenarioCase, evalArgs, loadCases, selectScenarios } from "./cases.ts";

const root = path.resolve(".");
const { cases, notRunnable } = selectScenarios(loadCases(root), process.argv.slice(2));

/** Source directory of the `gh` shim and the `curl` stand-in, next to this file on disk regardless of the run's cwd. */
const ghShimSource = path.join(import.meta.dirname, "..", "bin");

/** Commands the scenario runner fakes, each an executable in `ghShimSource`. */
const FAKED_COMMANDS = ["gh", "curl"];

/**
 * Files of the `gh` shim and the `curl` stand-in, copied together so the module they share and
 * their local `package.json` always travel with them.
 */
const GH_SHIM_FILES = [...FAKED_COMMANDS, "github-fixture.js", "package.json"];

/**
 * Puts the `gh` shim and the `curl` stand-in ahead of the real commands on PATH, so a scenario
 * that exercises the GitHub tracker or the GitHub REST API never reaches the network
 * (architecture issues #39 and #101). Copied to a directory outside the repo because a
 * `claude plugin eval` run's Bash tool cannot read the checkout that started it.
 */
function envWithGhShim(): NodeJS.ProcessEnv {
  const shimDir = path.join(os.tmpdir(), "64x-scenarios", "bin");
  fs.mkdirSync(shimDir, { recursive: true });
  for (const file of GH_SHIM_FILES) fs.copyFileSync(path.join(ghShimSource, file), path.join(shimDir, file));
  for (const command of FAKED_COMMANDS) fs.chmodSync(path.join(shimDir, command), 0o755);
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
