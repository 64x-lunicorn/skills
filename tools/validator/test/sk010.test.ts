import { describe, expect, it } from "vitest";
import { validate } from "../src/validate.ts";
import { fixture } from "./fixture.ts";

const skillMd = "skills/engineering/write-commit-message/SKILL.md";

describe("SK010: jede im Body referenzierte Datei existiert", () => {
  it("meldet einen Link auf eine fehlende Datei an seiner Zeile", () => {
    expect(validate(fixture("sk010/fail"))).toEqual([
      { rule: "SK010", path: skillMd, line: 8, message: expect.stringContaining("references/examples.md") },
    ]);
  });

  it("ignoriert URLs, Anker, Fragmente und Links in Code", () => {
    expect(validate(fixture("sk010/pass"))).toEqual([]);
  });
});
