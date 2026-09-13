import { describe, expect, it } from "vitest";
import { validate } from "../src/validate.ts";
import { fixture } from "./fixture.ts";

const manifest = ".claude-plugin/plugin.json";

describe("SK013: jeder Skill ist in plugin.json registriert und jeder Eintrag existiert", () => {
  it("meldet einen Skill, der nicht in plugin.json steht", () => {
    expect(validate(fixture("sk013/fail-unregistered"))).toEqual([
      {
        rule: "SK013",
        path: "skills/engineering/write-commit-message",
        message: expect.stringContaining("plugin.json"),
      },
    ]);
  });

  it("meldet einen Eintrag ohne Skill an seiner Zeile", () => {
    expect(validate(fixture("sk013/fail-dangling"))).toEqual([
      { rule: "SK013", path: manifest, line: 5, message: expect.stringContaining("./skills/engineering/review-diff") },
    ]);
  });

  it("meldet ein fehlendes plugin.json", () => {
    expect(validate(fixture("sk013/fail-no-manifest"))).toEqual([
      { rule: "SK013", path: manifest, message: expect.stringContaining("fehlt") },
    ]);
  });

  it("akzeptiert Einträge mit und ohne ./ und abschließendem /", () => {
    expect(validate(fixture("sk013/pass"))).toEqual([]);
  });
});
