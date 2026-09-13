import { describe, expect, it } from "vitest";
import { validate } from "../src/validate.ts";
import { fixture } from "./fixture.ts";

const skillMd = "skills/engineering/write-commit-message/SKILL.md";

describe("SK004: description in dritter Person, mit Anwendungsfall und Auslösern", () => {
  it.each(["fail-this-skill", "fail-dieser-skill", "fail-you"])(
    "meldet einen verbotenen Anfang (%s)",
    (name) => {
      expect(validate(fixture(`sk004/${name}`))).toEqual([
        { rule: "SK004", path: skillMd, line: 3, message: expect.stringContaining("dritter Person") },
      ]);
    },
  );

  it("meldet eine description mit weniger als 12 Wörtern", () => {
    expect(validate(fixture("sk004/fail-too-few-words"))).toEqual([
      { rule: "SK004", path: skillMd, line: 3, message: expect.stringContaining("12") },
    ]);
  });

  it("akzeptiert „this skill“ mitten im Text", () => {
    expect(validate(fixture("sk004/pass"))).toEqual([]);
  });
});
