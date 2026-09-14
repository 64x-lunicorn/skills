import { afterEach, describe, expect, it } from "vitest";
import { type ScenarioCase, evalArgs, loadCases, selectScenarios } from "../src/cases.ts";
import { removeRepos, repoWith } from "./repo.ts";
import { repoRoot } from "./root.ts";

afterEach(removeRepos);

describe("loadCases", () => {
  it("loads every case.yaml under evals/ with its name, tags, prompt and graders", () => {
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
        prompt: "Ask me.",
        graders: [{ type: "regex", name: "marker", pattern: "x" }],
      },
    ]);
  });

  it("names the file of a case.yaml that does not parse", () => {
    const root = repoWith({ "evals/interview-me/broken/case.yaml": "name: [unclosed" });

    expect(() => loadCases(root)).toThrow("evals/interview-me/broken/case.yaml");
  });

  it("names the file of a case.yaml without a name", () => {
    const root = repoWith({ "evals/interview-me/nameless/case.yaml": "tags: [scenario]" });

    expect(() => loadCases(root)).toThrow("evals/interview-me/nameless/case.yaml: missing name");
  });

  it("names the file of a case.yaml whose tags are not a list", () => {
    const root = repoWith({ "evals/interview-me/tag-string/case.yaml": "name: x\ntags: not-a-scenario-yet\n" });

    expect(() => loadCases(root)).toThrow("evals/interview-me/tag-string/case.yaml: tags must be a list");
  });
});

function scenario(name: string, tags: string[]): ScenarioCase {
  return { path: `evals/x/${name}/case.yaml`, name, tags, prompt: "p", graders: [{}] };
}

describe("selectScenarios", () => {
  const active = scenario("A question carries a recommended answer", ["scenario"]);
  const pending = scenario("One question at a time", ["scenario", "pending"]);
  const other = scenario("basic", ["triggers"]);

  it("runs every scenario that is not pending when no name is given", () => {
    expect(selectScenarios([active, pending, other], [])).toEqual({ cases: [active], unknown: [] });
  });

  it("narrows the run to the scenarios named", () => {
    const second = scenario("No emojis in questions", ["scenario"]);

    expect(selectScenarios([active, second], ["No emojis in questions"])).toEqual({
      cases: [second],
      unknown: [],
    });
  });

  it("reports a name that matches no runnable scenario, such as a pending one", () => {
    expect(selectScenarios([active, pending], ["One question at a time"])).toEqual({
      cases: [],
      unknown: ["One question at a time"],
    });
  });
});

describe("evalArgs", () => {
  // Pinned contract: the flags come from the runner decision in architecture issue #17.
  it("runs one case by name with scaffold, trusted plugin, Write and Edit granted, no publishing and no ablation", () => {
    expect(evalArgs(scenario("No emojis in questions", ["scenario"]))).toEqual([
      "plugin",
      "eval",
      ".",
      "--case",
      "No emojis in questions",
      "--scaffold",
      "--trust-plugin",
      "--allow-tools",
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

  it.each(cases.map((c) => [c.path, c] as const))("%s is a scenario with a prompt and a grader", (_, c) => {
    expect(c.prompt?.trim()).toBeTruthy();
    expect(c.graders?.length).toBeGreaterThan(0);
    expect(c.tags).toContain("scenario");
  });

  it("gives every case a unique name", () => {
    const names = cases.map((c) => c.name);
    expect(names.filter((name, index) => names.indexOf(name) !== index)).toEqual([]);
  });
});
