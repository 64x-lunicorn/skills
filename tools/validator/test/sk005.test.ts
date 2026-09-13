import { describe, expect, it } from "vitest";
import { validate } from "../src/validate.ts";
import { fixture } from "./fixture.ts";

const skillMd = "skills/engineering/write-commit-message/SKILL.md";

describe("SK005: name matches the directory name", () => {
  it("reports a mismatching name on its line", () => {
    expect(validate(fixture("sk005/fail-mismatch"))).toEqual([
      { rule: "SK005", path: skillMd, line: 2, message: expect.stringContaining("write-commit-message") },
    ]);
  });

  it("reports a missing name at the start of the frontmatter", () => {
    expect(validate(fixture("sk005/fail-missing"))).toEqual([
      { rule: "SK005", path: skillMd, line: 1, message: expect.stringContaining("missing") },
    ]);
  });

  it("accepts name equal to the directory name", () => {
    expect(validate(fixture("sk005/pass"))).toEqual([]);
  });
});
