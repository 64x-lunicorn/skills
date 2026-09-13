import { describe, expect, it } from "vitest";
import { validate } from "../src/validate.ts";
import { fixture } from "./fixture.ts";

const skillMd = "skills/engineering/write-commit-message/SKILL.md";

describe("SK002: frontmatter starts on line 1 and takes effect", () => {
  it("reports an opening --- after a blank line", () => {
    expect(validate(fixture("sk002/fail-leading-blank-line"))).toEqual([
      { rule: "SK002", path: skillMd, line: 1, message: expect.stringContaining("line 1") },
    ]);
  });

  it("reports frontmatter without a closing ---", () => {
    expect(validate(fixture("sk002/fail-unclosed"))).toEqual([
      { rule: "SK002", path: skillMd, line: 1, message: expect.stringContaining("closing") },
    ]);
  });

  it("reports invalid YAML with the line in the file", () => {
    expect(validate(fixture("sk002/fail-invalid-yaml"))).toEqual([
      { rule: "SK002", path: skillMd, line: 3, message: expect.stringContaining("YAML") },
    ]);
  });

  it("accepts a horizontal rule --- in the body", () => {
    expect(validate(fixture("sk002/pass"))).toEqual([]);
  });
});
