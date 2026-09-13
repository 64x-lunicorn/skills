import { describe, expect, it } from "vitest";
import { validate } from "../src/validate.ts";
import { fixture } from "./fixture.ts";

const skillMd = "skills/engineering/write-commit-message/SKILL.md";

describe("SK007: nur Felder aus der Allowlist", () => {
  it("meldet ein unbekanntes Feld an seiner Zeile", () => {
    expect(validate(fixture("sk007/fail-unknown-field"))).toEqual([
      { rule: "SK007", path: skillMd, line: 4, message: expect.stringContaining("„version“") },
    ]);
  });

  it("meldet bewusst ausgeschlossene Claude-Code-Felder einzeln", () => {
    expect(validate(fixture("sk007/fail-excluded-fields"))).toEqual([
      { rule: "SK007", path: skillMd, line: 4, message: expect.stringContaining("„when_to_use“") },
      { rule: "SK007", path: skillMd, line: 5, message: expect.stringContaining("„hooks“") },
    ]);
  });

  it("akzeptiert erlaubte Felder und beliebige Schlüssel unter metadata", () => {
    expect(validate(fixture("sk007/pass"))).toEqual([]);
  });
});
