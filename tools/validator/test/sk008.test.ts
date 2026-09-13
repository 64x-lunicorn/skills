import { describe, expect, it } from "vitest";
import { validate } from "../src/validate.ts";
import { fixture } from "./fixture.ts";

const skillMd = "skills/orchestration/run-sprint/SKILL.md";

describe("SK008: Orchestratoren setzen disable-model-invocation: true", () => {
  it("meldet ein fehlendes disable-model-invocation am Frontmatter-Anfang", () => {
    expect(validate(fixture("sk008/fail-missing"))).toEqual([
      { rule: "SK008", path: skillMd, line: 1, message: expect.stringContaining("disable-model-invocation: true") },
    ]);
  });

  it("meldet disable-model-invocation: false an seiner Zeile", () => {
    expect(validate(fixture("sk008/fail-false"))).toEqual([
      { rule: "SK008", path: skillMd, line: 4, message: expect.stringContaining("disable-model-invocation: true") },
    ]);
  });

  it("akzeptiert Orchestratoren mit true und lässt andere Kategorien in Ruhe", () => {
    expect(validate(fixture("sk008/pass"))).toEqual([]);
  });
});
