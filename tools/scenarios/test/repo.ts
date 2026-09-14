import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const tempRoots: string[] = [];

/** Creates a temporary repo holding `files`, keyed by path relative to its root. */
export function repoWith(files: Record<string, string>): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "scenarios-"));
  tempRoots.push(root);
  for (const [rel, text] of Object.entries(files)) {
    const file = path.join(root, rel);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, text);
  }
  return root;
}

/** Removes every repo `repoWith` created; call it in `afterEach`. */
export function removeRepos(): void {
  for (const root of tempRoots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
}
