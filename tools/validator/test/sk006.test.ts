import { describe, expect, it } from "vitest";
import { validate } from "../src/validate.ts";
import { fixture } from "./fixture.ts";

describe("SK006: skill name lowercase, hyphenated, verb-noun", () => {
  it("reports uppercase letters", () => {
    expect(validate(fixture("sk006/fail-uppercase"))).toEqual([
      {
        rule: "SK006",
        path: "skills/engineering/Write-Commit-Message",
        message: expect.stringContaining("lowercase"),
      },
    ]);
  });

  it("reports a name without a noun", () => {
    expect(validate(fixture("sk006/fail-single-segment"))).toEqual([
      {
        rule: "SK006",
        path: "skills/engineering/write",
        message: expect.stringContaining("verb-noun"),
      },
    ]);
  });

  it("reports a verb outside the allowlist", () => {
    expect(validate(fixture("sk006/fail-unknown-verb"))).toEqual([
      {
        rule: "SK006",
        path: "skills/engineering/commit-message",
        message: expect.stringContaining('"commit"'),
      },
    ]);
  });

  it("accepts an allowlisted verb with a multi-part noun", () => {
    expect(validate(fixture("sk006/pass"))).toEqual([]);
  });

  it("accepts harvest as the verb of the skill-creating orchestrator", () => {
    expect(validate(fixture("sk006/pass-harvest"))).toEqual([]);
  });

  it("accepts verify as the verb of the source-checking skill", () => {
    expect(validate(fixture("sk006/pass-verify"))).toEqual([]);
  });
});
