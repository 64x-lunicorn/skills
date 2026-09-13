import { spawnSync } from "node:child_process";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { fixture } from "./fixture.ts";

const cli = path.join(import.meta.dirname, "..", "src", "cli.ts");

function run(root: string) {
  return spawnSync(process.execPath, [cli, root], { encoding: "utf8" });
}

describe("CLI", () => {
  it("prints rule ID, path, line and reason per finding and exits with code 1", () => {
    const result = run(fixture("sk003/fail-too-short"));
    expect(result.status).toBe(1);
    expect(result.stdout).toMatch(
      /^SK003 skills\/engineering\/write-commit-message\/SKILL\.md:3 description has 24 characters/m,
    );
  });

  it("omits the line when it cannot be determined", () => {
    const result = run(fixture("sk001/fail"));
    expect(result.stdout).toMatch(/^SK001 skills\/engineering\/review-diff Skill directory without SKILL\.md/m);
  });

  it("exits with code 0 without findings", () => {
    const result = run(fixture("sk001/pass"));
    expect(result.status).toBe(0);
  });
});
