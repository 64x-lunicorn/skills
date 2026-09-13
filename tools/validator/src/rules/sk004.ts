import {
  FORBIDDEN_DESCRIPTION_STARTS,
  MIN_DESCRIPTION_LENGTH,
  MIN_DESCRIPTION_WORDS,
} from "../conventions.ts";
import type { Finding } from "../validate.ts";
import type { Rule } from "./rule.ts";

export const sk004: Rule = (repo) =>
  repo.skillDirs.flatMap(({ skillMd }): Finding[] => {
    const field = skillMd?.fields?.get("description");
    if (!skillMd || !field || typeof field.value !== "string") return [];
    const text = field.value.trim();
    // Empty or too-short descriptions are reported by SK003.
    if (text.length < MIN_DESCRIPTION_LENGTH) return [];

    const start = FORBIDDEN_DESCRIPTION_STARTS.find((s) => text.toLowerCase().startsWith(s));
    if (start) {
      return [
        {
          rule: "SK004",
          path: skillMd.path,
          line: field.line,
          message: `description starts with "${text.slice(0, start.length).trim()}". It must lead with the use case in third person, e.g. "Drafts … Use when …".`,
        },
      ];
    }

    const words = text.split(/\s+/).length;
    if (words < MIN_DESCRIPTION_WORDS) {
      return [
        {
          rule: "SK004",
          path: skillMd.path,
          line: field.line,
          message: `description has ${words} words, at least ${MIN_DESCRIPTION_WORDS} are required. Name the use case and concrete trigger phrases.`,
        },
      ];
    }

    return [];
  });
