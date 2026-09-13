import { describe, expect, it } from "vitest";
import { validate } from "../src/validate.ts";
import { fixture } from "./fixture.ts";

const skillMd = "skills/orchestration/run-sprint/SKILL.md";

describe("SK011: user-invoked Skills referenzieren keine anderen user-invoked Skills", () => {
  it("meldet Referenzen mit und ohne Plugin-Präfix", () => {
    expect(validate(fixture("sk011/fail"))).toEqual([
      { rule: "SK011", path: skillMd, line: 7, message: expect.stringContaining("/fixture:plan-sprint") },
      { rule: "SK011", path: skillMd, line: 8, message: expect.stringContaining("/plan-sprint") },
    ]);
  });

  it("akzeptiert Referenzen auf model-invoked Skills, Code und Pfade", () => {
    expect(validate(fixture("sk011/pass"))).toEqual([]);
  });
});
