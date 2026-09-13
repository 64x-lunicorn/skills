import type { Rule } from "./rule.ts";

export const sk001: Rule = (repo) =>
  repo.skillDirs
    .filter((dir) => !dir.skillMd)
    .map((dir) => ({
      rule: "SK001",
      path: dir.path,
      message:
        "Skill-Verzeichnis ohne SKILL.md. Jedes Verzeichnis unter skills/<kategorie>/ ist ein Skill und braucht eine SKILL.md.",
    }));
