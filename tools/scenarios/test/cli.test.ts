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

/** A temporary repo with one runnable case. */
function repoWithRunnableCase(): string {
  return repoWith({
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
  });
}

/** Adds a stub `claude` that exits with `exitCode` to `root` and returns an env that finds it first. */
function addStubClaude(root: string, exitCode: number): NodeJS.ProcessEnv {
  const bin = path.join(root, "bin");
  fs.mkdirSync(bin, { recursive: true });
  fs.writeFileSync(path.join(bin, "claude"), `#!/bin/sh\nexit ${exitCode}\n`, { mode: 0o755 });
  return { ...process.env, PATH: `${bin}${path.delimiter}${process.env.PATH}` };
}

/** Adds a stub `claude` that exits 0 only if `gh issue list` (whatever answers first on PATH) shows issue 42. */
function addStubClaudeThatReadsGh(root: string): NodeJS.ProcessEnv {
  const bin = path.join(root, "bin");
  fs.mkdirSync(bin, { recursive: true });
  const script = ['#!/bin/sh', 'case "$(gh issue list --json number)" in', '  *42*) exit 0 ;;', '  *) exit 1 ;;', 'esac', ''].join("\n");
  fs.writeFileSync(path.join(bin, "claude"), script, { mode: 0o755 });
  return { ...process.env, PATH: `${bin}${path.delimiter}${process.env.PATH}` };
}

/** Adds a stub `claude` that exits 0 only if `curl` (whatever answers first on PATH) serves the fixture's latest release. */
function addStubClaudeThatReadsCurl(root: string): NodeJS.ProcessEnv {
  const bin = path.join(root, "bin");
  fs.mkdirSync(bin, { recursive: true });
  const script = [
    "#!/bin/sh",
    'case "$(curl -fsS https://api.github.com/repos/64x-lunicorn/skills/releases/latest)" in',
    "  *v99.0.0*) exit 0 ;;",
    "  *) exit 1 ;;",
    "esac",
    "",
  ].join("\n");
  fs.writeFileSync(path.join(bin, "claude"), script, { mode: 0o755 });
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

  it("reports why claude could not be started and counts the scenario as failed", () => {
    const root = repoWithRunnableCase();

    const result = run(root, [], { ...process.env, PATH: path.join(root, "bin") });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Could not start claude:");
    expect(result.stderr).toContain("ENOENT");
    expect(result.stderr).toContain("Failed: A question carries a recommended answer");
  });

  it("puts the gh shim ahead of the real gh on PATH, so a scenario can fake the tracker", () => {
    const root = repoWithRunnableCase();
    fs.mkdirSync(path.join(root, ".gh"), { recursive: true });
    fs.writeFileSync(
      path.join(root, ".gh", "issues.json"),
      JSON.stringify([{ number: 42, title: "Fixture issue", state: "OPEN", labels: [], comments: [] }]),
    );
    const env = addStubClaudeThatReadsGh(root);

    const result = run(root, [], env);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("1 of 1 scenario(s) passed.");
  });

  it("puts the curl stand-in ahead of the real curl on PATH, so a scenario can fake the GitHub REST reads", () => {
    const root = repoWithRunnableCase();
    fs.mkdirSync(path.join(root, ".gh"), { recursive: true });
    fs.writeFileSync(path.join(root, ".gh", "releases.json"), JSON.stringify([{ tag_name: "v99.0.0" }]));
    const env = addStubClaudeThatReadsCurl(root);

    const result = run(root, [], env);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("1 of 1 scenario(s) passed.");
  });
});
