import { describe, expect, it } from "vitest";
import { validate } from "../src/validate.ts";
import { fixture } from "./fixture.ts";

describe("SK001: jedes Skill-Verzeichnis enthält eine SKILL.md", () => {
  it("meldet ein Skill-Verzeichnis ohne SKILL.md", () => {
    expect(validate(fixture("sk001/fail"))).toEqual([
      {
        rule: "SK001",
        path: "skills/engineering/review-diff",
        message: expect.stringContaining("SKILL.md"),
      },
    ]);
  });

  it("akzeptiert README in Kategorien und Unterordner in Skills", () => {
    expect(validate(fixture("sk001/pass"))).toEqual([]);
  });
});
