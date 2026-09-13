import { spawnSync } from "node:child_process";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { fixture } from "./fixture.ts";

const cli = path.join(import.meta.dirname, "..", "src", "cli.ts");

function run(root: string) {
  return spawnSync(process.execPath, [cli, root], { encoding: "utf8" });
}

describe("CLI", () => {
  it("gibt pro Befund Regel-ID, Pfad, Zeile und Begründung aus und endet mit Exit-Code 1", () => {
    const result = run(fixture("sk003/fail-too-short"));
    expect(result.status).toBe(1);
    expect(result.stdout).toMatch(
      /^SK003 skills\/engineering\/write-commit-message\/SKILL\.md:3 description hat 24 Zeichen/m,
    );
  });

  it("lässt die Zeile weg, wenn sie nicht ermittelbar ist", () => {
    const result = run(fixture("sk001/fail"));
    expect(result.stdout).toMatch(/^SK001 skills\/engineering\/review-diff Skill-Verzeichnis ohne SKILL\.md/m);
  });

  it("endet ohne Befund mit Exit-Code 0", () => {
    const result = run(fixture("sk001/pass"));
    expect(result.status).toBe(0);
  });
});
