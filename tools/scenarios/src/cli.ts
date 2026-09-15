import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { type ScenarioCase, evalArgs, loadCases, selectScenarios } from "./cases.ts";

const root = path.resolve(".");
const { cases, notRunnable } = selectScenarios(loadCases(root), process.argv.slice(2));

/** How one scenario ended: passed, failed, or refused before any run could start. */
type Outcome = { kind: "passed" } | { kind: "failed" } | { kind: "setup error"; error: string };

/** One run in the JSON result of `claude plugin eval`, as far as the runner needs it. */
interface EvalRun {
  error?: string | null;
}

/** Runs one scenario through `claude plugin eval` and tells how it ended. */
function runScenario(scenario: ScenarioCase): Outcome {
  console.log(`\nScenario: ${scenario.name}`);
  const jsonPath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "scenario-")), "result.json");
  const result = spawnSync("claude", evalArgs(scenario, jsonPath), { cwd: root, stdio: "inherit" });
  if (result.error) console.error(`Could not start claude: ${result.error.message}`);
  const refusal = setupRefusal(jsonPath);
  fs.rmSync(path.dirname(jsonPath), { recursive: true, force: true });
  if (refusal) return { kind: "setup error", error: refusal };
  return { kind: result.status === 0 ? "passed" : "failed" };
}

/** The error shared by the runs when every run of the scenario was refused, else undefined. */
function setupRefusal(jsonPath: string): string | undefined {
  if (!fs.existsSync(jsonPath)) return undefined;
  const evalResult = JSON.parse(fs.readFileSync(jsonPath, "utf8")) as {
    cases?: { arms?: Record<string, EvalRun[]> }[];
  };
  const runs = (evalResult.cases ?? []).flatMap((c) => Object.values(c.arms ?? {}).flat());
  const first = runs[0];
  if (!first || !runs.every((run) => run.error)) return undefined;
  return first.error as string;
}

if (notRunnable.length > 0) {
  console.error(`No runnable scenario named: ${notRunnable.join(", ")}. Pending scenarios are skipped.`);
  process.exitCode = 1;
} else {
  const results: { scenario: ScenarioCase; outcome: Outcome }[] = [];
  for (const scenario of cases) {
    const outcome = runScenario(scenario);
    results.push({ scenario, outcome });
    if (outcome.kind === "setup error") break;
  }
  const failed = results.filter((r) => r.outcome.kind === "failed").map((r) => r.scenario);
  const passed = results.filter((r) => r.outcome.kind === "passed").length;

  console.log(`\n${passed} of ${cases.length} scenario(s) passed.`);
  for (const { name } of failed) console.error(`Failed: ${name}`);
  const last = results.at(-1);
  if (last?.outcome.kind === "setup error") {
    console.error(`Setup error in ${last.scenario.name}: ${last.outcome.error}`);
    const notRun = cases.slice(results.length).map((c) => c.name);
    if (notRun.length > 0) console.error(`Not run: ${notRun.join(", ")}`);
  }
  if (passed < cases.length) process.exitCode = 1;
}
