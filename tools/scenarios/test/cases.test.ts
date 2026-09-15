import fs from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { parse } from "yaml";
import { type ScenarioCase, evalArgs, loadCases, selectScenarios } from "../src/cases.ts";
import { removeRepos, repoWith } from "./repo.ts";
import { repoRoot } from "./root.ts";

afterEach(removeRepos);

describe("loadCases", () => {
  it("loads every case.yaml under evals/ with its name and tags", () => {
    const root = repoWith({
      "evals/interview-user/one-question/case.yaml": [
        'schema_version: "1.1"',
        "name: One question at a time",
        "tags: [scenario, pending]",
        "execution:",
        "  prompt: Ask me.",
        "graders:",
        "  - type: regex",
        "    name: marker",
        "    pattern: x",
      ].join("\n"),
      "evals/write-skill/vague-description/prompt.md": "Not a case.yaml.",
    });

    expect(loadCases(root)).toEqual([
      {
        path: "evals/interview-user/one-question/case.yaml",
        name: "One question at a time",
        tags: ["scenario", "pending"],
      },
    ]);
  });

  it("names the file of a case.yaml that does not parse", () => {
    const root = repoWith({ "evals/interview-me/broken/case.yaml": "name: [unclosed" });

    expect(() => loadCases(root)).toThrow("evals/interview-me/broken/case.yaml");
  });

  it.each([
    ["a missing name", "tags: [scenario]\nexecution:\n  prompt: p\ngraders: [{}]\n", "name must be a non-empty string"],
    ["a name that is not a string", "name: 2024\nexecution:\n  prompt: p\ngraders: [{}]\n", "name must be a non-empty string"],
    ["an empty name", 'name: ""\nexecution:\n  prompt: p\ngraders: [{}]\n', "name must be a non-empty string"],
    ["a name that is zero", "name: 0\nexecution:\n  prompt: p\ngraders: [{}]\n", "name must be a non-empty string"],
    ["tags that are not a list", "name: x\ntags: not-a-scenario-yet\nexecution:\n  prompt: p\ngraders: [{}]\n", "tags must be a list of strings"],
    ["tags that are not strings", "name: x\ntags: [1]\nexecution:\n  prompt: p\ngraders: [{}]\n", "tags must be a list of strings"],
    ["a prompt that is not a string", "name: x\nexecution:\n  prompt: [p]\ngraders: [{}]\n", "prompt must be a non-empty string"],
    ["a blank prompt", 'name: x\nexecution:\n  prompt: "  "\ngraders: [{}]\n', "prompt must be a non-empty string"],
    ["graders that are not a list", "name: x\nexecution:\n  prompt: p\ngraders: not-a-list\n", "graders must be a non-empty list"],
    ["an empty graders list", "name: x\nexecution:\n  prompt: p\ngraders: []\n", "graders must be a non-empty list"],
  ])("names the file of a case.yaml with %s", (_, content, reason) => {
    const root = repoWith({ "evals/interview-me/malformed/case.yaml": content });

    expect(() => loadCases(root)).toThrow(`evals/interview-me/malformed/case.yaml: ${reason}`);
  });
});

function scenario(name: string, tags: string[]): ScenarioCase {
  return { path: `evals/x/${name}/case.yaml`, name, tags };
}

describe("selectScenarios", () => {
  const active = scenario("A question carries a recommended answer", ["scenario"]);
  const pending = scenario("One question at a time", ["scenario", "pending"]);
  const other = scenario("basic", ["triggers"]);

  it("runs every scenario that is not pending when no name is given", () => {
    expect(selectScenarios([active, pending, other], [])).toEqual({ cases: [active], notRunnable: [] });
  });

  it("narrows the run to the scenarios named", () => {
    const second = scenario("No emojis in questions", ["scenario"]);

    expect(selectScenarios([active, second], ["No emojis in questions"])).toEqual({
      cases: [second],
      notRunnable: [],
    });
  });

  it("reports a name that matches no runnable scenario, such as a pending one", () => {
    expect(selectScenarios([active, pending], ["One question at a time"])).toEqual({
      cases: [],
      notRunnable: ["One question at a time"],
    });
  });
});

describe("evalArgs", () => {
  // Pinned contract: the flags come from the runner decisions in architecture issues #17 and #34.
  it("runs one case by name with scaffold, trusted plugin, Bash, Write and Edit granted, no publishing and no ablation", () => {
    expect(evalArgs(scenario("No emojis in questions", ["scenario"]))).toEqual([
      "plugin",
      "eval",
      ".",
      "--case",
      "No emojis in questions",
      "--scaffold",
      "--trust-plugin",
      "--allow-tools",
      "Bash",
      "Write",
      "Edit",
      "--no-publish",
      "--ablation",
      "none",
    ]);
  });
});

describe("cases of this repository", () => {
  const cases = loadCases(repoRoot);

  it.each(cases.map((c) => [c.path, c] as const))("%s is a scenario", (_, c) => {
    expect(c.tags).toContain("scenario");
  });

  it.each(cases.map((c) => [c.path] as const))("%s keeps its whole description through parsing", (rel) => {
    const text = fs.readFileSync(path.join(repoRoot, rel), "utf8");
    const raw = text.match(/^description: (.*)$/m)?.[1] ?? "";
    const { description } = parse(text) as { description?: unknown };

    // An unquoted " #" starts a YAML comment, so "Spec #16. ..." would parse as "Spec".
    if (raw.includes("#")) expect(description).toEqual(expect.stringContaining("#"));
  });

  it("gives every case a unique name", () => {
    const names = cases.map((c) => c.name);
    expect(names.filter((name, index) => names.indexOf(name) !== index)).toEqual([]);
  });
});
