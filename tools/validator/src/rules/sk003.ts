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
            "description fehlt. Sie ist die einzige API des Skills: nur sie steht permanent im Kontext.",
        },
      ];
    }

    const text = typeof field.value === "string" ? field.value.trim() : "";
    if (text === "") {
      return [{ rule: "SK003", path, line: field.line, message: "description ist leer oder kein Text." }];
    }

    if (text.length < MIN_DESCRIPTION_LENGTH) {
      return [
        {
          rule: "SK003",
          path,
          line: field.line,
          message: `description hat ${text.length} Zeichen, verlangt sind mindestens ${MIN_DESCRIPTION_LENGTH}. Eine vage description ist der häufigste Grund, warum ein Skill nie feuert.`,
        },
      ];
    }

    return [];
  });
