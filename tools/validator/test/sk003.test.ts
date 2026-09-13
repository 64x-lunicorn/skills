import { describe, expect, it } from "vitest";
import { validate } from "../src/validate.ts";
import { fixture } from "./fixture.ts";

const skillMd = "skills/engineering/write-commit-message/SKILL.md";

describe("SK003: description vorhanden, nicht leer, mindestens 60 Zeichen", () => {
  it("meldet eine fehlende description am Frontmatter-Anfang", () => {
    expect(validate(fixture("sk003/fail-missing"))).toEqual([
      { rule: "SK003", path: skillMd, line: 1, message: expect.stringContaining("fehlt") },
    ]);
  });

  it("meldet eine leere description an ihrer Zeile", () => {
    expect(validate(fixture("sk003/fail-empty"))).toEqual([
      { rule: "SK003", path: skillMd, line: 3, message: expect.stringContaining("leer") },
    ]);
  });

  it("meldet eine description unter 60 Zeichen", () => {
    expect(validate(fixture("sk003/fail-too-short"))).toEqual([
      { rule: "SK003", path: skillMd, line: 3, message: expect.stringContaining("60") },
    ]);
  });

  it("akzeptiert eine mehrzeilige description als YAML-Blockscalar", () => {
    expect(validate(fixture("sk003/pass"))).toEqual([]);
  });
});
