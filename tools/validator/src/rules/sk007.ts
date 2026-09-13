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
        message: `Field "${key}" is not in the allowlist. Allowed: ${ALLOWED_FRONTMATTER_FIELDS.join(", ")}. See ADR 0002.`,
      })),
  );
