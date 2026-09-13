import { ALLOWED_FRONTMATTER_FIELDS } from "../conventions.ts";
import type { Rule } from "./rule.ts";

export const sk007: Rule = (repo) =>
  repo.skillDirs.flatMap(({ skillMd }) =>
    [...(skillMd?.fields ?? [])]
      .filter(([key]) => !ALLOWED_FRONTMATTER_FIELDS.includes(key))
      .map(([key, field]) => ({
        rule: "SK007",
        path: skillMd!.path,
        line: field.line,
        message: `Feld „${key}“ steht nicht in der Allowlist. Erlaubt sind: ${ALLOWED_FRONTMATTER_FIELDS.join(", ")}. Siehe ADR 0002.`,
      })),
  );
