import { describe, expect, it } from "vitest";
import { validate } from "../src/validate.ts";
import { fixture } from "./fixture.ts";

const skillDir = "skills/engineering/write-commit-message";

describe("SK012: zu jedem Skill existiert eine Eval unter evals/<skill-name>/", () => {
  it("meldet einen Skill ohne Eval-Verzeichnis", () => {
    expect(validate(fixture("sk012/fail-missing"))).toEqual([
      { rule: "SK012", path: skillDir, message: expect.stringContaining("evals/write-commit-message/") },
    ]);
  });

  it("meldet ein Eval-Verzeichnis ohne prompt.md oder case.yaml", () => {
    expect(validate(fixture("sk012/fail-no-case"))).toEqual([
      { rule: "SK012", path: skillDir, message: expect.stringContaining("evals/write-commit-message/") },
    ]);
  });

  it("akzeptiert einen gruppierten Case mit case.yaml", () => {
    expect(validate(fixture("sk012/pass"))).toEqual([]);
  });
});
