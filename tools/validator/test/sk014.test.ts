import { describe, expect, it } from "vitest";
import { validate } from "../src/validate.ts";
import { fixture } from "./fixture.ts";

const skillMd = "skills/orchestration/run-sprint/SKILL.md";

describe("SK014: user-invoked skills check the project setup as step 0", () => {
  it("reports a user-invoked skill without the step 0 section", () => {
    expect(validate(fixture("sk014/fail-missing"))).toEqual([
      { rule: "SK014", path: skillMd, line: 1, message: expect.stringContaining("## 0. Check project setup") },
    ]);
  });

  it("reports a step 0 section without the exact setup-missing notice at its heading", () => {
    expect(validate(fixture("sk014/fail-notice"))).toEqual([
      { rule: "SK014", path: skillMd, line: 7, message: expect.stringContaining("Project setup missing. Run /64x-lunicorn:setup-project.") },
    ]);
  });

  it("reports an outdated setup_version on its line", () => {
    expect(validate(fixture("sk014/fail-version"))).toEqual([
      { rule: "SK014", path: skillMd, line: 12, message: expect.stringContaining("setup_version") },
    ]);
  });

  it("reports a step 0 section without the setup_version line at its heading", () => {
    expect(validate(fixture("sk014/fail-version-missing"))).toEqual([
      { rule: "SK014", path: skillMd, line: 7, message: expect.stringContaining("`setup_version` below 3") },
    ]);
  });

  it("accepts user-invoked skills with step 0 and leaves model-invoked skills alone", () => {
    expect(validate(fixture("sk014/pass"))).toEqual([]);
  });

  it("exempts setup-project, which the notice points to", () => {
    expect(validate(fixture("sk014/pass-setup-project"))).toEqual([]);
  });

  it("exempts report-issue, which runs in a plugin user's own project", () => {
    expect(validate(fixture("sk014/pass-report-issue"))).toEqual([]);
  });
});
