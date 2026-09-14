import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { expect, it } from "vitest";
import { repoRoot as root } from "./root.ts";

/** Name of the Spec #16 scenario this file automates, verbatim. */
const SCENARIO = "The wording is interview";

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

/** Lines of `text`, read from `file`, that use the word to avoid, as `<file>:<line> <content>`. */
function offendingLines(file: string, text: string): string[] {
  const checked = file === "CONTEXT.md" ? text.replaceAll(AVOID_CLAUSE, "") : text;
  return checked
    .split(/\r?\n/)
    .flatMap((line, index) => (FORBIDDEN.test(line) ? [`${file}:${index + 1} ${line.trim()}`] : []));
}

it("exempts the _Avoid_: clause of a term in CONTEXT.md", () => {
  expect(offendingLines("CONTEXT.md", "**Interview**:\nAsks one question at a time.\n_Avoid_: grill\n")).toEqual([]);
});

it("reports grill on a CONTEXT.md line without an _Avoid_: clause", () => {
  expect(offendingLines("CONTEXT.md", "**Interview**:\nNever grill the user.\n")).toEqual([
    "CONTEXT.md:2 Never grill the user.",
  ]);
});

it(SCENARIO, () => {
  const lines = trackedFiles().flatMap((file) => offendingLines(file, fs.readFileSync(path.join(root, file), "utf8")));
  expect(lines).toEqual([]);
});
