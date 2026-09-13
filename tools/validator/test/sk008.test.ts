import { describe, expect, it } from "vitest";
import { validate } from "../src/validate.ts";
import { fixture } from "./fixture.ts";

const skillMd = "skills/orchestration/run-sprint/SKILL.md";

describe("SK008: orchestrators set disable-model-invocation: true", () => {
  it("reports a missing disable-model-invocation at the start of the frontmatter", () => {
    expect(validate(fixture("sk008/fail-missing"))).toEqual([
      { rule: "SK008", path: skillMd, line: 1, message: expect.stringContaining("disable-model-invocation: true") },
    ]);
  });

  it("reports disable-model-invocation: false on its line", () => {
    expect(validate(fixture("sk008/fail-false"))).toEqual([
      { rule: "SK008", path: skillMd, line: 4, message: expect.stringContaining("disable-model-invocation: true") },
    ]);
  });

  it("accepts orchestrators with true and leaves other categories alone", () => {
    expect(validate(fixture("sk008/pass"))).toEqual([]);
  });
});
