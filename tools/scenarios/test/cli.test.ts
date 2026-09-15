import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { removeRepos, repoWith } from "./repo.ts";

const cli = path.join(import.meta.dirname, "..", "src", "cli.ts");

afterEach(removeRepos);

function run(root: string, names: string[], env: NodeJS.ProcessEnv = process.env) {
  return spawnSync(process.execPath, [cli, ...names], { cwd: root, encoding: "utf8", env });
}

/** The text of a runnable case named `name`. */
function runnableCase(name: string): string {
  return [
    'schema_version: "1.1"',
    `name: ${name}`,
    "tags: [scenario]",
    "execution:",
    "  prompt: Ask me.",
    "graders:",
    "  - type: regex",
    "    name: marker",
    "    pattern: x",
  ].join("\n");
}

/** A temporary repo with one runnable case. */
function repoWithRunnableCase(): string {
  return repoWith({
    "evals/interview-user/recommended-answer/case.yaml": runnableCase("A question carries a recommended answer"),
  });
}

/**
 * Adds a stub `claude` that exits with `exitCode` to `root` and returns an env that finds it first.
 * With `evalResult`, the stub writes it as JSON to the path given after `--json`.
 */
function addStubClaude(root: string, exitCode: number, evalResult?: object): NodeJS.ProcessEnv {
  const bin = path.join(root, "bin");
  fs.mkdirSync(bin, { recursive: true });
  const write = evalResult
    ? [
        'while [ $# -gt 0 ]; do [ "$1" = "--json" ] && out="$2"; shift; done',
        `printf '%s' '${JSON.stringify(evalResult)}' > "$out"`,
      ].join("\n")
    : "";
  fs.writeFileSync(path.join(bin, "claude"), `#!/bin/sh\n${write}\nexit ${exitCode}\n`, { mode: 0o755 });
  return { ...process.env, PATH: `${bin}${path.delimiter}${process.env.PATH}` };
}

describe("CLI", () => {
  it("rejects the name of a pending scenario and exits with code 1", () => {
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
    });

    const result = run(root, ["One question at a time"]);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      "No runnable scenario named: One question at a time. Pending scenarios are skipped.",
    );
  });

  it("runs a runnable scenario and reports that it passed", () => {
    const root = repoWithRunnableCase();
    const env = addStubClaude(root, 0);

    const result = run(root, [], env);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("1 of 1 scenario(s) passed.");
    expect(result.stderr).not.toContain("Failed:");
  });

  it("reports a failed scenario by name and exits with code 1", () => {
    const root = repoWithRunnableCase();
    const env = addStubClaude(root, 1);

    const result = run(root, [], env);

    expect(result.status).toBe(1);
    expect(result.stdout).toContain("0 of 1 scenario(s) passed.");
    expect(result.stderr).toContain("Failed: A question carries a recommended answer");
  });

  it("reports a setup refusal as a setup error and runs no further scenario", () => {
    const root = repoWith({
      "evals/a/first/case.yaml": runnableCase("First scenario"),
      "evals/b/second/case.yaml": runnableCase("Second scenario"),
    });
    const refused = { score: 0, passed: false, turns: 0, error: "the Bash sandbox cannot run here", graders: [] };
    const env = addStubClaude(root, 1, { cases: [{ name: "First scenario", arms: { with: [refused, refused] } }] });

    const result = run(root, [], env);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Setup error in First scenario: the Bash sandbox cannot run here");
    expect(result.stderr).toContain("Not run: Second scenario");
    expect(result.stdout).not.toContain("Scenario: Second scenario");
    expect(result.stderr).not.toContain("Failed:");
  });

  it("counts a scenario with only some runs refused as failed and runs the next scenario", () => {
    const root = repoWith({
      "evals/a/first/case.yaml": runnableCase("First scenario"),
      "evals/b/second/case.yaml": runnableCase("Second scenario"),
    });
    const refused = { score: 0, passed: false, turns: 0, error: "the Bash sandbox cannot run here", graders: [] };
    const ran = { score: 0, passed: false, turns: 7, error: null, graders: [{ name: "marker", passed: false }] };
    const env = addStubClaude(root, 1, { cases: [{ name: "First scenario", arms: { with: [refused, ran] } }] });

    const result = run(root, [], env);

    expect(result.status).toBe(1);
    expect(result.stdout).toContain("Scenario: Second scenario");
    expect(result.stderr).toContain("Failed: First scenario");
    expect(result.stderr).not.toContain("Setup error");
  });

  it("reports why claude could not be started and counts the scenario as failed", () => {
    const root = repoWithRunnableCase();

    const result = run(root, [], { ...process.env, PATH: path.join(root, "bin") });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Could not start claude:");
    expect(result.stderr).toContain("ENOENT");
    expect(result.stderr).toContain("Failed: A question carries a recommended answer");
  });
});
