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
    // Zu kurze oder leere descriptions meldet SK003.
    if (text.length < MIN_DESCRIPTION_LENGTH) return [];

    const start = FORBIDDEN_DESCRIPTION_STARTS.find((s) => text.toLowerCase().startsWith(s));
    if (start) {
      return [
        {
          rule: "SK004",
          path: skillMd.path,
          line: field.line,
          message: `description beginnt mit „${text.slice(0, start.length).trim()}“. Sie muss in dritter Person mit dem Anwendungsfall führen, z. B. „Drafts … Use when …“.`,
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
          message: `description hat ${words} Wörter, verlangt sind mindestens ${MIN_DESCRIPTION_WORDS}. Nenne den Anwendungsfall und konkrete Auslöse-Formulierungen.`,
        },
      ];
    }

    return [];
  });
