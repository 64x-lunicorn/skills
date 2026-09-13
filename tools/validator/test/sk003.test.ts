import { describe, expect, it } from "vitest";
import { validate } from "../src/validate.ts";
import { fixture } from "./fixture.ts";

const skillMd = "skills/engineering/write-commit-message/SKILL.md";

describe("SK003: description present, not empty, at least 60 characters", () => {
  it("reports a missing description at the start of the frontmatter", () => {
    expect(validate(fixture("sk003/fail-missing"))).toEqual([
      { rule: "SK003", path: skillMd, line: 1, message: expect.stringContaining("missing") },
    ]);
  });

  it("reports an empty description on its line", () => {
    expect(validate(fixture("sk003/fail-empty"))).toEqual([
      { rule: "SK003", path: skillMd, line: 3, message: expect.stringContaining("empty") },
    ]);
  });

  it("reports a description under 60 characters", () => {
    expect(validate(fixture("sk003/fail-too-short"))).toEqual([
      { rule: "SK003", path: skillMd, line: 3, message: expect.stringContaining("60") },
    ]);
  });

  it("accepts a multi-line description as a YAML block scalar", () => {
    expect(validate(fixture("sk003/pass"))).toEqual([]);
  });
});
