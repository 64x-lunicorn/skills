import { describe, expect, it } from "vitest";
import { validate } from "../src/validate.ts";
import { fixture } from "./fixture.ts";

const skillMd = "skills/engineering/write-commit-message/SKILL.md";

describe("SK010: every file referenced in the body exists", () => {
  it("reports a link to a missing file on its line", () => {
    expect(validate(fixture("sk010/fail"))).toEqual([
      { rule: "SK010", path: skillMd, line: 8, message: expect.stringContaining("references/examples.md") },
    ]);
  });

  it("ignores URLs, anchors, fragments and links in code", () => {
    expect(validate(fixture("sk010/pass"))).toEqual([]);
  });
});
