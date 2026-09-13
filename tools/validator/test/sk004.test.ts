import { describe, expect, it } from "vitest";
import { validate } from "../src/validate.ts";
import { fixture } from "./fixture.ts";

const skillMd = "skills/engineering/write-commit-message/SKILL.md";

describe("SK004: description in third person with use case and triggers", () => {
  it.each(["fail-this-skill", "fail-dieser-skill", "fail-you"])(
    "reports a forbidden start (%s)",
    (name) => {
      expect(validate(fixture(`sk004/${name}`))).toEqual([
        { rule: "SK004", path: skillMd, line: 3, message: expect.stringContaining("third person") },
      ]);
    },
  );

  it("reports a description with fewer than 12 words", () => {
    expect(validate(fixture("sk004/fail-too-few-words"))).toEqual([
      { rule: "SK004", path: skillMd, line: 3, message: expect.stringContaining("12") },
    ]);
  });

  it('accepts "this skill" in the middle of the text', () => {
    expect(validate(fixture("sk004/pass"))).toEqual([]);
  });
});
