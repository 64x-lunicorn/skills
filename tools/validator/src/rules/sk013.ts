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
        message: `${MANIFEST_PATH} is missing. Without a manifest listing skills, Claude Code loads no skill under skills/<category>/.`,
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
      message: `Skill is not listed in skills of ${MANIFEST_PATH}. Claude Code only loads skills under skills/<category>/ when they are listed there; otherwise they silently do not load.`,
    }));

  const dangling = manifest.skills
    .filter((entry) => !skills.includes(normalize(entry)))
    .map((entry): Finding => {
      const index = manifest.lines.findIndex((line) => line.includes(JSON.stringify(entry)));
      return {
        rule: "SK013",
        path: MANIFEST_PATH,
        ...(index >= 0 ? { line: index + 1 } : {}),
        message: `Entry "${entry}" does not point to a skill directory with SKILL.md.`,
      };
    });

  return [...unregistered, ...dangling];
};
