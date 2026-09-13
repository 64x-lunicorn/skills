import { describe, expect, it } from "vitest";
import { validate } from "../src/validate.ts";
import { fixture } from "./fixture.ts";

const skillMd = "skills/engineering/write-commit-message/SKILL.md";

describe("SK005: name ist identisch mit dem Verzeichnisnamen", () => {
  it("meldet einen abweichenden name an seiner Zeile", () => {
    expect(validate(fixture("sk005/fail-mismatch"))).toEqual([
      { rule: "SK005", path: skillMd, line: 2, message: expect.stringContaining("write-commit-message") },
    ]);
  });

  it("meldet einen fehlenden name am Frontmatter-Anfang", () => {
    expect(validate(fixture("sk005/fail-missing"))).toEqual([
      { rule: "SK005", path: skillMd, line: 1, message: expect.stringContaining("fehlt") },
    ]);
  });

  it("akzeptiert name gleich Verzeichnisname", () => {
    expect(validate(fixture("sk005/pass"))).toEqual([]);
  });
});
