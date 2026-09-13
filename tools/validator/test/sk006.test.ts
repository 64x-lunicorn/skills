import { describe, expect, it } from "vitest";
import { validate } from "../src/validate.ts";
import { fixture } from "./fixture.ts";

describe("SK006: Skill-Name kleingeschrieben, mit Bindestrichen, Verb-Substantiv", () => {
  it("meldet Großbuchstaben", () => {
    expect(validate(fixture("sk006/fail-uppercase"))).toEqual([
      {
        rule: "SK006",
        path: "skills/engineering/Write-Commit-Message",
        message: expect.stringContaining("kleingeschrieben"),
      },
    ]);
  });

  it("meldet einen Namen ohne Substantiv", () => {
    expect(validate(fixture("sk006/fail-single-segment"))).toEqual([
      {
        rule: "SK006",
        path: "skills/engineering/write",
        message: expect.stringContaining("Verb-Substantiv"),
      },
    ]);
  });

  it("meldet ein Verb außerhalb der Allowlist", () => {
    expect(validate(fixture("sk006/fail-unknown-verb"))).toEqual([
      {
        rule: "SK006",
        path: "skills/engineering/commit-message",
        message: expect.stringContaining("„commit“"),
      },
    ]);
  });

  it("akzeptiert Verb aus der Allowlist mit mehrteiligem Substantiv", () => {
    expect(validate(fixture("sk006/pass"))).toEqual([]);
  });
});
