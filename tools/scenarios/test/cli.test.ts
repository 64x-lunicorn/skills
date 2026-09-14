import { spawnSync } from "node:child_process";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { removeRepos, repoWith } from "./repo.ts";

const cli = path.join(import.meta.dirname, "..", "src", "cli.ts");

afterEach(removeRepos);

function run(root: string, names: string[]) {
  return spawnSync(process.execPath, [cli, ...names], { cwd: root, encoding: "utf8" });
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
});
