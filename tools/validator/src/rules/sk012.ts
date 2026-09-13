import fs from "node:fs";
import path from "node:path";
import type { Finding } from "../validate.ts";
import type { Rule } from "./rule.ts";

/** Dateien, an denen `claude plugin eval` einen Case erkennt. */
const CASE_FILES = new Set(["prompt.md", "case.yaml"]);

export const sk012: Rule = (repo) =>
  repo.skillDirs.flatMap(({ path: dir, name, skillMd }): Finding[] => {
    if (!skillMd) return [];
    const evalDir = path.join(repo.root, "evals", name);
    if (hasCase(evalDir)) return [];

    return [
      {
        rule: "SK012",
        path: dir,
        message: `Keine Eval unter evals/${name}/. Lege mindestens einen Case mit prompt.md oder case.yaml an.`,
      },
    ];
  });

function hasCase(dir: string): boolean {
  if (!fs.existsSync(dir)) return false;
  return fs
    .readdirSync(dir, { recursive: true, encoding: "utf8" })
    .some((entry) => CASE_FILES.has(path.basename(entry)));
}
