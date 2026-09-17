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

  it("accepts promote as the verb of the research-promoting orchestrator", () => {
    expect(validate(fixture("sk006/pass-promote"))).toEqual([]);
  });

  it("accepts setup as the verb of the project-setup orchestrator", () => {
    expect(validate(fixture("sk006/pass-setup"))).toEqual([]);
  });

  it("accepts configure as the verb of the CI gate skill", () => {
    expect(validate(fixture("sk006/pass-configure"))).toEqual([]);
  });

  it("accepts interview as the verb of the interview skill", () => {
    expect(validate(fixture("sk006/pass-interview"))).toEqual([]);
  });

  it("accepts report as the verb of the issue-reporting skill", () => {
    expect(validate(fixture("sk006/pass-report"))).toEqual([]);
  });
});
