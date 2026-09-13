import { MANIFEST_PATH } from "../repo.ts";
import type { Finding } from "../validate.ts";
import type { Rule } from "./rule.ts";

const normalize = (entry: string) => entry.replace(/^\.\//, "").replace(/\/+$/, "");

export const sk013: Rule = ({ manifest, skillDirs }) => {
  if (!manifest) {
    return [
      {
        rule: "SK013",
        path: MANIFEST_PATH,
        message: `${MANIFEST_PATH} fehlt. Ohne Manifest mit skills-Liste lädt Claude Code keinen Skill unter skills/<kategorie>/.`,
      },
    ];
  }

  const skills = skillDirs.filter((dir) => dir.skillMd).map((dir) => dir.path);
  const registered = new Set(manifest.skills.map(normalize));

  const unregistered = skills
    .filter((skill) => !registered.has(skill))
    .map((skill) => ({
      rule: "SK013",
      path: skill,
      message: `Skill fehlt in skills von ${MANIFEST_PATH}. Skills unter skills/<kategorie>/ lädt Claude Code nur, wenn sie dort eingetragen sind, sonst stillschweigend nicht.`,
    }));

  const dangling = manifest.skills
    .filter((entry) => !skills.includes(normalize(entry)))
    .map((entry): Finding => {
      const index = manifest.lines.findIndex((line) => line.includes(JSON.stringify(entry)));
      return {
        rule: "SK013",
        path: MANIFEST_PATH,
        ...(index >= 0 ? { line: index + 1 } : {}),
        message: `Eintrag „${entry}“ zeigt auf kein Skill-Verzeichnis mit SKILL.md.`,
      };
    });

  return [...unregistered, ...dangling];
};
