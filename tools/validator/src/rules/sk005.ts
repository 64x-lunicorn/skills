import type { Finding } from "../validate.ts";
import type { Rule } from "./rule.ts";

export const sk005: Rule = (repo) =>
  repo.skillDirs.flatMap(({ name, skillMd }): Finding[] => {
    if (!skillMd?.fields) return [];
    const field = skillMd.fields.get("name");

    if (!field) {
      return [
        {
          rule: "SK005",
          path: skillMd.path,
          line: 1,
          message: `name is missing. Set name: ${name} so the file yields the same command in every installation type.`,
        },
      ];
    }

    if (field.value !== name) {
      return [
        {
          rule: "SK005",
          path: skillMd.path,
          line: field.line,
          message: `name "${String(field.value)}" differs from the directory name "${name}". For personal and project skills the directory sets the command, in a plugin the name does.`,
        },
      ];
    }

    return [];
  });
