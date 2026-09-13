import { describe, expect, it } from "vitest";
import { validate } from "../src/validate.ts";
import { fixture } from "./fixture.ts";

const skillMd = "skills/engineering/write-commit-message/SKILL.md";

describe("SK009: body has at most 200 lines", () => {
  it("reports the first line over the limit", () => {
    expect(validate(fixture("sk009/fail"))).toEqual([
      { rule: "SK009", path: skillMd, line: 205, message: expect.stringContaining("200") },
    ]);
  });

  it("accepts exactly 200 body lines with a trailing newline", () => {
    expect(validate(fixture("sk009/pass"))).toEqual([]);
  });
});
