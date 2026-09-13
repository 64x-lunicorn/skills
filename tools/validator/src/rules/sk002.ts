import type { Rule } from "./rule.ts";

export const sk002: Rule = (repo) =>
  repo.skillDirs.flatMap(({ skillMd }) =>
    skillMd?.frontmatterError
      ? [{ rule: "SK002", path: skillMd.path, ...skillMd.frontmatterError }]
      : [],
  );
