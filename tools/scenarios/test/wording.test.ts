import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { expect, it } from "vitest";
import { repoRoot as root } from "./root.ts";
import { SCENARIO } from "./wording.ts";

const ownFile = path.relative(root, import.meta.filename);

/** The word to avoid, in any of its forms. */
const FORBIDDEN = /grill/i;

/** CONTEXT.md names the word to avoid in the `_Avoid_:` clause of a term. */
const AVOID_CLAUSE = /_Avoid_:[^\n]*/g;

function trackedFiles(): string[] {
  return execFileSync("git", ["ls-files", "-z"], { cwd: root, encoding: "utf8" })
    .split("\0")
    .filter((file) => file !== "" && file !== ownFile && fs.existsSync(path.join(root, file)));
}

function offendingLines(file: string): string[] {
  let text = fs.readFileSync(path.join(root, file), "utf8");
  if (file === "CONTEXT.md") text = text.replaceAll(AVOID_CLAUSE, "");
  return text
    .split(/\r?\n/)
    .flatMap((line, index) => (FORBIDDEN.test(line) ? [`${file}:${index + 1} ${line.trim()}`] : []));
}

it(SCENARIO, () => {
  expect(trackedFiles().flatMap(offendingLines)).toEqual([]);
});
