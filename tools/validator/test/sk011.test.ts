import { describe, expect, it } from "vitest";
import { validate } from "../src/validate.ts";
import { fixture } from "./fixture.ts";

const skillMd = "skills/orchestration/run-sprint/SKILL.md";

describe("SK011: user-invoked skills do not reference other user-invoked skills", () => {
  it("reports references with and without the plugin prefix", () => {
    expect(validate(fixture("sk011/fail"))).toEqual([
      { rule: "SK011", path: skillMd, line: 7, message: expect.stringContaining("/fixture:plan-sprint") },
      { rule: "SK011", path: skillMd, line: 8, message: expect.stringContaining("/plan-sprint") },
    ]);
  });

  it("accepts references to model-invoked skills, code and paths", () => {
    expect(validate(fixture("sk011/pass"))).toEqual([]);
  });
});
