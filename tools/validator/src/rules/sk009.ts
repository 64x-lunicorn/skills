import { MAX_BODY_LINES } from "../conventions.ts";
import type { Finding } from "../validate.ts";
import type { Rule } from "./rule.ts";

export const sk009: Rule = (repo) =>
  repo.skillDirs.flatMap(({ skillMd }): Finding[] => {
    if (!skillMd?.fields) return [];
    const { body } = skillMd;
    // Der abschließende Zeilenumbruch erzeugt beim Split eine leere letzte Zeile.
    const lineCount = body.at(-1) === "" ? body.length - 1 : body.length;
    if (lineCount <= MAX_BODY_LINES) return [];

    return [
      {
        rule: "SK009",
        path: skillMd.path,
        line: skillMd.bodyStartLine + MAX_BODY_LINES,
        message: `Body hat ${lineCount} Zeilen, erlaubt sind ${MAX_BODY_LINES}. Lagere Inhalt, der nicht bei jedem Aufruf gebraucht wird, in eine Referenzdatei neben der SKILL.md aus.`,
      },
    ];
  });
