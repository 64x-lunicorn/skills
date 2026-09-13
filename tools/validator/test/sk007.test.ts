import { describe, expect, it } from "vitest";
import { validate } from "../src/validate.ts";
import { fixture } from "./fixture.ts";

const skillMd = "skills/engineering/write-commit-message/SKILL.md";

describe("SK007: only allowlisted fields", () => {
  it("reports an unknown field on its line", () => {
    expect(validate(fixture("sk007/fail-unknown-field"))).toEqual([
      { rule: "SK007", path: skillMd, line: 4, message: expect.stringContaining('"version"') },
    ]);
  });

  it("reports deliberately excluded Claude Code fields individually", () => {
    expect(validate(fixture("sk007/fail-excluded-fields"))).toEqual([
      { rule: "SK007", path: skillMd, line: 4, message: expect.stringContaining('"when_to_use"') },
      { rule: "SK007", path: skillMd, line: 5, message: expect.stringContaining('"hooks"') },
    ]);
  });

  it("accepts allowed fields and arbitrary keys under metadata", () => {
    expect(validate(fixture("sk007/pass"))).toEqual([]);
  });
});
