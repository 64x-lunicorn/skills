import { MAX_BODY_LINES } from "../conventions.ts";
import type { Finding } from "../validate.ts";
import type { Rule } from "./rule.ts";

export const sk009: Rule = (repo) =>
  repo.skillDirs.flatMap(({ skillMd }): Finding[] => {
    if (!skillMd?.fields) return [];
    const { body } = skillMd;
    // A trailing newline produces an empty last line when splitting.
    const lineCount = body.at(-1) === "" ? body.length - 1 : body.length;
    if (lineCount <= MAX_BODY_LINES) return [];

    return [
      {
        rule: "SK009",
        path: skillMd.path,
        line: skillMd.bodyStartLine + MAX_BODY_LINES,
        message: `Body has ${lineCount} lines, ${MAX_BODY_LINES} are allowed. Move content that is not needed on every invocation into a reference file next to SKILL.md.`,
      },
    ];
  });
