import { describe, expect, it } from "vitest";
import { validate } from "../src/validate.ts";
import { fixture } from "./fixture.ts";

const skillMd = "skills/engineering/write-commit-message/SKILL.md";

describe("SK009: Body hat höchstens 200 Zeilen", () => {
  it("meldet die erste Zeile über dem Limit", () => {
    expect(validate(fixture("sk009/fail"))).toEqual([
      { rule: "SK009", path: skillMd, line: 205, message: expect.stringContaining("200") },
    ]);
  });

  it("akzeptiert genau 200 Body-Zeilen mit abschließendem Zeilenumbruch", () => {
    expect(validate(fixture("sk009/pass"))).toEqual([]);
  });
});
