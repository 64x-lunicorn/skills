import { describe, expect, it } from "vitest";
import { validate } from "../src/validate.ts";
import { fixture } from "./fixture.ts";

const skillMd = "skills/engineering/write-commit-message/SKILL.md";

describe("SK002: Frontmatter beginnt in Zeile 1 und wirkt", () => {
  it("meldet ein öffnendes --- nach einer Leerzeile", () => {
    expect(validate(fixture("sk002/fail-leading-blank-line"))).toEqual([
      { rule: "SK002", path: skillMd, line: 1, message: expect.stringContaining("Zeile 1") },
    ]);
  });

  it("meldet ein Frontmatter ohne schließendes ---", () => {
    expect(validate(fixture("sk002/fail-unclosed"))).toEqual([
      { rule: "SK002", path: skillMd, line: 1, message: expect.stringContaining("schließende") },
    ]);
  });

  it("meldet ungültiges YAML mit der Zeile in der Datei", () => {
    expect(validate(fixture("sk002/fail-invalid-yaml"))).toEqual([
      { rule: "SK002", path: skillMd, line: 3, message: expect.stringContaining("YAML") },
    ]);
  });

  it("akzeptiert eine horizontale Linie --- im Body", () => {
    expect(validate(fixture("sk002/pass"))).toEqual([]);
  });
});
