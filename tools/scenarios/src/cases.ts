import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";

/** File by which `claude plugin eval` recognises a case written in YAML. */
const CASE_FILE = "case.yaml";

/** One `claude plugin eval` case, as far as the scenario runner needs it. */
export interface ScenarioCase {
  /** Path relative to the repo root, with forward slashes. */
  path: string;
  name: string;
  tags?: string[];
  prompt?: string;
  graders?: unknown[];
}

interface CaseYaml {
  name?: string;
  tags?: string[];
  execution?: { prompt?: string };
  graders?: unknown[];
}

/** Loads every `case.yaml` below `evals/`, sorted by path. */
export function loadCases(root: string): ScenarioCase[] {
  const evals = path.join(root, "evals");
  return fs
    .readdirSync(evals, { recursive: true, encoding: "utf8" })
    .filter((entry) => path.basename(entry) === CASE_FILE)
    .map((entry) => path.posix.join("evals", entry.split(path.sep).join("/")))
    .sort()
    .map((rel) => readCase(root, rel));
}

/** Tag of every case that automates a Spec scenario. */
const SCENARIO_TAG = "scenario";

/** Tag the integration test ticket sets; the feature ticket removes it. */
const PENDING_TAG = "pending";

/**
 * Keeps the scenarios that are not pending, narrowed to `names` when any are
 * given. `unknown` holds the names that match no runnable scenario.
 */
export function selectScenarios(
  cases: ScenarioCase[],
  names: string[],
): { cases: ScenarioCase[]; unknown: string[] } {
  const runnable = cases.filter((c) => c.tags?.includes(SCENARIO_TAG) && !c.tags.includes(PENDING_TAG));
  if (names.length === 0) return { cases: runnable, unknown: [] };
  return {
    cases: runnable.filter((c) => names.includes(c.name)),
    unknown: names.filter((name) => !runnable.some((c) => c.name === name)),
  };
}

/** Arguments for `claude` that run one scenario case against this plugin. */
export function evalArgs(scenario: ScenarioCase): string[] {
  return [
    "plugin",
    "eval",
    ".",
    "--case",
    scenario.name,
    "--scaffold",
    "--trust-plugin",
    "--allow-tools",
    "Write",
    "Edit",
    "--no-publish",
    "--ablation",
    "none",
  ];
}

function readCase(root: string, rel: string): ScenarioCase {
  let data: CaseYaml | null;
  try {
    data = parse(fs.readFileSync(path.join(root, rel), "utf8")) as CaseYaml | null;
  } catch (error) {
    throw new Error(`${rel}: ${(error as Error).message}`);
  }
  if (!data?.name) throw new Error(`${rel}: missing name`);
  return {
    path: rel,
    name: data.name,
    tags: data.tags,
    prompt: data.execution?.prompt,
    graders: data.graders,
  };
}
