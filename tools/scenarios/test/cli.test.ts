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

/** A temporary repo with one runnable case and a stub `claude` that exits with `exitCode`. */
function repoWithStubClaude(exitCode: number): { root: string; env: NodeJS.ProcessEnv } {
  const root = repoWith({
    "evals/interview-user/recommended-answer/case.yaml": [
      'schema_version: "1.1"',
      "name: A question carries a recommended answer",
      "tags: [scenario]",
      "execution:",
      "  prompt: Ask me.",
      "graders:",
      "  - type: regex",
      "    name: marker",
      "    pattern: x",
    ].join("\n"),
    "bin/claude": `#!/bin/sh\nexit ${exitCode}\n`,
  });
  const bin = path.join(root, "bin");
  fs.chmodSync(path.join(bin, "claude"), 0o755);
  return { root, env: { ...process.env, PATH: `${bin}${path.delimiter}${process.env.PATH}` } };
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
    const { root, env } = repoWithStubClaude(0);

    const result = run(root, [], env);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("1 of 1 scenario(s) passed.");
    expect(result.stderr).not.toContain("Failed:");
  });

  it("reports a failed scenario by name and exits with code 1", () => {
    const { root, env } = repoWithStubClaude(1);

    const result = run(root, [], env);

    expect(result.status).toBe(1);
    expect(result.stdout).toContain("0 of 1 scenario(s) passed.");
    expect(result.stderr).toContain("Failed: A question carries a recommended answer");
  });

  it("reports why claude could not be started and counts the scenario as failed", () => {
    const { root } = repoWithStubClaude(0);
    fs.rmSync(path.join(root, "bin", "claude"));

    const result = run(root, [], { ...process.env, PATH: path.join(root, "bin") });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("ENOENT");
    expect(result.stderr).toContain("Failed: A question carries a recommended answer");
  });
});
