import fs from "node:fs";
import path from "node:path";
import { LineCounter, isMap, isScalar, parseDocument } from "yaml";

/** Ein Verzeichnis `skills/<kategorie>/<name>/`, mit oder ohne SKILL.md. */
export interface SkillDir {
  /** Pfad relativ zur Repo-Wurzel, z. B. `skills/engineering/write-commit-message`. */
  path: string;
  category: string;
  name: string;
  skillMd?: SkillMd;
}

export interface SkillMd {
  path: string;
  /** Fehlt, wenn das Frontmatter nicht wirkt. Dann ist `frontmatterError` gesetzt. */
  fields?: Map<string, Field>;
  frontmatterError?: { line: number; message: string };
  body: string[];
  /** Zeilennummer (1-basiert) der ersten Body-Zeile in der Datei. */
  bodyStartLine: number;
}

export interface Field {
  value: unknown;
  line: number;
}

export interface Repo {
  root: string;
  /** `name` aus `.claude-plugin/plugin.json`, das Präfix der Kommandos. */
  pluginName?: string;
  skillDirs: SkillDir[];
}

export function loadRepo(root: string): Repo {
  return { root, pluginName: readManifest(root)?.name, skillDirs: findSkillDirs(root) };
}

/** user-invoked heißt: das Modell darf den Skill nicht selbst ziehen. */
export function isUserInvoked(skillMd: SkillMd): boolean {
  return skillMd.fields?.get("disable-model-invocation")?.value === true;
}

function readManifest(root: string): { name?: string } | undefined {
  const file = path.join(root, ".claude-plugin", "plugin.json");
  if (!fs.existsSync(file)) return undefined;
  return JSON.parse(fs.readFileSync(file, "utf8"));
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
          "Das öffnende --- muss in Zeile 1 stehen. Sonst behandelt Claude Code die ganze Datei als Inhalt und das Frontmatter wirkt nicht.",
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
        message: "Das schließende --- des Frontmatters fehlt. Das Frontmatter wirkt nicht.",
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
        // +1, weil das YAML in Zeile 2 der Datei beginnt.
        line: (error.linePos?.[0].line ?? 1) + 1,
        message: `Frontmatter ist kein gültiges YAML: ${error.message.split("\n")[0]}`,
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
