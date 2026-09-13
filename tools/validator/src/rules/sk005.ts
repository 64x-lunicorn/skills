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
          message: `name fehlt. Setze name: ${name}, damit die Datei in jeder Installationsart dasselbe Kommando ergibt.`,
        },
      ];
    }

    if (field.value !== name) {
      return [
        {
          rule: "SK005",
          path: skillMd.path,
          line: field.line,
          message: `name „${String(field.value)}“ weicht vom Verzeichnisnamen „${name}“ ab. Bei Personal- und Project-Skills bestimmt das Verzeichnis das Kommando, im Plugin der name.`,
        },
      ];
    }

    return [];
  });
