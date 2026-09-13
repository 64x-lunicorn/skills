import { describe, expect, it } from "vitest";
import { validate } from "../src/validate.ts";
import { fixture } from "./fixture.ts";

const manifest = ".claude-plugin/plugin.json";

describe("SK013: every skill is registered in plugin.json and every entry exists", () => {
  it("reports a skill missing from plugin.json", () => {
    expect(validate(fixture("sk013/fail-unregistered"))).toEqual([
      {
        rule: "SK013",
        path: "skills/engineering/write-commit-message",
        message: expect.stringContaining("plugin.json"),
      },
    ]);
  });

  it("reports an entry without a skill on its line", () => {
    expect(validate(fixture("sk013/fail-dangling"))).toEqual([
      { rule: "SK013", path: manifest, line: 5, message: expect.stringContaining("./skills/engineering/review-diff") },
    ]);
  });

  it("reports a missing plugin.json", () => {
    expect(validate(fixture("sk013/fail-no-manifest"))).toEqual([
      { rule: "SK013", path: manifest, message: expect.stringContaining("missing") },
    ]);
  });

  it("accepts entries with and without ./ and a trailing /", () => {
    expect(validate(fixture("sk013/pass"))).toEqual([]);
  });
});
