import { MIN_DESCRIPTION_LENGTH } from "../conventions.ts";
import type { Finding } from "../validate.ts";
import type { Rule } from "./rule.ts";

export const sk003: Rule = (repo) =>
  repo.skillDirs.flatMap(({ skillMd }): Finding[] => {
    if (!skillMd?.fields) return [];
    const path = skillMd.path;
    const field = skillMd.fields.get("description");

    if (!field) {
      return [
        {
          rule: "SK003",
          path,
          line: 1,
          message:
            "description is missing. It is the skill's only API: the only part that stays in context permanently.",
        },
      ];
    }

    const text = typeof field.value === "string" ? field.value.trim() : "";
    if (text === "") {
      return [{ rule: "SK003", path, line: field.line, message: "description is empty or not text." }];
    }

    if (text.length < MIN_DESCRIPTION_LENGTH) {
      return [
        {
          rule: "SK003",
          path,
          line: field.line,
          message: `description has ${text.length} characters, at least ${MIN_DESCRIPTION_LENGTH} are required. A vague description is the most common reason a skill never fires.`,
        },
      ];
    }

    return [];
  });
