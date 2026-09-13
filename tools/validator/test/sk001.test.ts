import { describe, expect, it } from "vitest";
import { validate } from "../src/validate.ts";
import { fixture } from "./fixture.ts";

describe("SK001: every skill directory contains a SKILL.md", () => {
  it("reports a skill directory without SKILL.md", () => {
    expect(validate(fixture("sk001/fail"))).toEqual([
      {
        rule: "SK001",
        path: "skills/engineering/review-diff",
        message: expect.stringContaining("SKILL.md"),
      },
    ]);
  });

  it("accepts category READMEs and subfolders inside skills", () => {
    expect(validate(fixture("sk001/pass"))).toEqual([]);
  });
});
