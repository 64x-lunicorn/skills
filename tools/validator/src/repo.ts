import fs from "node:fs";
import path from "node:path";

/** Ein Verzeichnis `skills/<kategorie>/<name>/`, mit oder ohne SKILL.md. */
export interface SkillDir {
  /** Pfad relativ zur Repo-Wurzel, z. B. `skills/engineering/write-commit-message`. */
  path: string;
  category: string;
  name: string;
  hasSkillMd: boolean;
}

export interface Repo {
  root: string;
  skillDirs: SkillDir[];
}

export function loadRepo(root: string): Repo {
  return { root, skillDirs: findSkillDirs(root) };
}

function findSkillDirs(root: string): SkillDir[] {
  const dirs: SkillDir[] = [];
  for (const category of subdirectories(path.join(root, "skills"))) {
    for (const name of subdirectories(path.join(root, "skills", category))) {
      const rel = `skills/${category}/${name}`;
      dirs.push({
        path: rel,
        category,
        name,
        hasSkillMd: fs.existsSync(path.join(root, rel, "SKILL.md")),
      });
    }
  }
  return dirs;
}

function subdirectories(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}
