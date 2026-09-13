import type { Rule } from "./rule.ts";

export const sk001: Rule = (repo) =>
  repo.skillDirs
    .filter((dir) => !dir.skillMd)
    .map((dir) => ({
      rule: "SK001",
      path: dir.path,
      message:
        "Skill directory without SKILL.md. Every directory under skills/<category>/ is a skill and needs a SKILL.md.",
    }));
