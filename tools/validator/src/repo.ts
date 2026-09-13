import fs from "node:fs";
import path from "node:path";
import { LineCounter, isMap, isScalar, parseDocument } from "yaml";

/** A directory `skills/<category>/<name>/`, with or without SKILL.md. */
export interface SkillDir {
  /** Path relative to the repo root, e.g. `skills/engineering/write-commit-message`. */
  path: string;
  category: string;
  name: string;
  skillMd?: SkillMd;
}

export interface SkillMd {
  path: string;
  /** Absent when the frontmatter has no effect; `frontmatterError` is set instead. */
  fields?: Map<string, Field>;
  frontmatterError?: { line: number; message: string };
  body: string[];
  /** 1-based line number of the first body line in the file. */
  bodyStartLine: number;
}

export interface Field {
  value: unknown;
  line: number;
}

export const MANIFEST_PATH = ".claude-plugin/plugin.json";

export interface Manifest {
  /** Command prefix: `/<name>:<skill>`. */
  name?: string;
  /** Entries from `skills`, as written in the file. */
  skills: string[];
  lines: string[];
}

export interface Repo {
  root: string;
  manifest?: Manifest;
  skillDirs: SkillDir[];
}

export function loadRepo(root: string): Repo {
  return { root, manifest: readManifest(root), skillDirs: findSkillDirs(root) };
}

/** user-invoked means the model must not invoke the skill on its own. */
export function isUserInvoked(skillMd: SkillMd): boolean {
  return skillMd.fields?.get("disable-model-invocation")?.value === true;
}

function readManifest(root: string): Manifest | undefined {
  const file = path.join(root, MANIFEST_PATH);
  if (!fs.existsSync(file)) return undefined;
  const text = fs.readFileSync(file, "utf8");
  const data = JSON.parse(text) as { name?: string; skills?: unknown };
  const skills = Array.isArray(data.skills) ? data.skills : [data.skills];
  return {
    name: data.name,
    skills: skills.filter((entry): entry is string => typeof entry === "string"),
    lines: text.split(/\r?\n/),
  };
}

function findSkillDirs(root: string): SkillDir[] {
  const dirs: SkillDir[] = [];
  for (const category of subdirectories(path.join(root, "skills"))) {
    for (const name of subdirectories(path.join(root, "skills", category))) {
      const rel = `skills/${category}/${name}`;
      const file = path.join(root, rel, "SKILL.md");
      dirs.push({
        path: rel,
        category,
        name,
        skillMd: fs.existsSync(file)
          ? parseSkillMd(`${rel}/SKILL.md`, fs.readFileSync(file, "utf8"))
          : undefined,
      });
    }
  }
  return dirs;
}

function parseSkillMd(rel: string, text: string): SkillMd {
  const lines = text.split(/\r?\n/);
  if (lines[0] !== "---") {
    return {
      path: rel,
      frontmatterError: {
        line: 1,
        message:
          "The opening --- must be on line 1. Otherwise Claude Code treats the whole file as content and the frontmatter has no effect.",
      },
      body: lines,
      bodyStartLine: 1,
    };
  }

  const close = lines.indexOf("---", 1);
  if (close === -1) {
    return {
      path: rel,
      frontmatterError: {
        line: 1,
        message: "The closing --- of the frontmatter is missing. The frontmatter has no effect.",
      },
      body: lines,
      bodyStartLine: 1,
    };
  }

  const body = lines.slice(close + 1);
  const bodyStartLine = close + 2;
  const lineCounter = new LineCounter();
  const doc = parseDocument(lines.slice(1, close).join("\n"), { lineCounter });

  const error = doc.errors[0];
  if (error) {
    return {
      path: rel,
      frontmatterError: {
        // +1 because the YAML starts on line 2 of the file.
        line: (error.linePos?.[0].line ?? 1) + 1,
        message: `Frontmatter is not valid YAML: ${error.message.split("\n")[0]}`,
      },
      body,
      bodyStartLine,
    };
  }

  const fields = new Map<string, Field>();
  if (isMap(doc.contents)) {
    const values = doc.toJS() as Record<string, unknown>;
    for (const pair of doc.contents.items) {
      if (!isScalar(pair.key) || !pair.key.range) continue;
      const key = String(pair.key.value);
      fields.set(key, {
        value: values[key],
        line: lineCounter.linePos(pair.key.range[0]).line + 1,
      });
    }
  }
  return { path: rel, fields, body, bodyStartLine };
}

function subdirectories(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}
