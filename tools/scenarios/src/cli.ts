import { spawnSync } from "node:child_process";
import path from "node:path";
import { evalArgs, loadCases, selectScenarios } from "./cases.ts";

const root = path.resolve(".");
const { cases, unknown } = selectScenarios(loadCases(root), process.argv.slice(2));

if (unknown.length > 0) {
  console.error(`No runnable scenario named: ${unknown.join(", ")}. Pending scenarios are skipped.`);
  process.exitCode = 1;
} else {
  const failed = cases.filter((scenario) => {
    console.log(`\nScenario: ${scenario.name}`);
    return spawnSync("claude", evalArgs(scenario), { cwd: root, stdio: "inherit" }).status !== 0;
  });

  console.log(`\n${cases.length - failed.length} of ${cases.length} scenario(s) passed.`);
  for (const { name } of failed) console.error(`Failed: ${name}`);
  if (failed.length > 0) process.exitCode = 1;
}
