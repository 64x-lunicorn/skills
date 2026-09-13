import { describe, expect, it } from "vitest";
import { validate } from "../src/validate.ts";
import { fixture } from "./fixture.ts";

const skillDir = "skills/engineering/write-commit-message";

describe("SK012: every skill has an eval under evals/<skill-name>/", () => {
  it("reports a skill without an eval directory", () => {
    expect(validate(fixture("sk012/fail-missing"))).toEqual([
      { rule: "SK012", path: skillDir, message: expect.stringContaining("evals/write-commit-message/") },
    ]);
  });

  it("reports an eval directory without prompt.md or case.yaml", () => {
    expect(validate(fixture("sk012/fail-no-case"))).toEqual([
      { rule: "SK012", path: skillDir, message: expect.stringContaining("evals/write-commit-message/") },
    ]);
  });

  it("accepts a grouped case with case.yaml", () => {
    expect(validate(fixture("sk012/pass"))).toEqual([]);
  });
});
