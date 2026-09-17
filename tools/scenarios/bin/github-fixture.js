// What the `gh` shim and the `curl` stand-in share (architecture issue #101, Q1): the JSON
// fixtures under `.gh/` in the run's workspace, the call log graders read, and the subset of
// GitHub search both answer from `.gh/issues.json`.

import fs from "node:fs";
import path from "node:path";

export const GH_DIR = path.resolve(".gh");
export const ISSUES_FILE = path.join(GH_DIR, "issues.json");
const LOG_FILE = path.resolve("gh-calls.log");

/** Appends one invocation of `tool` to `gh-calls.log`, quoting an argument that contains whitespace. */
export function logCall(tool, argv) {
  const line = argv.map((arg) => (/\s/.test(arg) ? JSON.stringify(arg) : arg)).join(" ");
  fs.appendFileSync(LOG_FILE, `${tool} ${line}\n`);
}

export function readJson(file, fallback) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

/** `gh issue close --reason` values, as the state reason fixtures and `--json stateReason` use. */
export const REASON_CODES = { "not planned": "NOT_PLANNED", completed: "COMPLETED", duplicate: "DUPLICATE" };

/**
 * A pragmatic subset of GitHub search: the `reason:"…"` and `no:label` qualifiers this project's
 * skills use, `in:title,body`, `repo:<owner>/<name>` and `is:issue` accepted and ignored (the
 * fixture holds only the plugin project's issues, and title and body are already what is
 * searched), and every remaining word required as a case-insensitive substring of title or body.
 */
export function matchesSearch(issue, search) {
  let text = search;
  const reason = text.match(/reason:"([^"]+)"/);
  if (reason) {
    if (issue.stateReason !== REASON_CODES[reason[1].toLowerCase()]) return false;
    text = text.replace(reason[0], "");
  }
  if (/\bno:label\b/.test(text)) {
    if ((issue.labels ?? []).length > 0) return false;
    text = text.replace(/\bno:label\b/, "");
  }
  text = text
    .replace(/\bin:title,body\b/, "")
    .replace(/\brepo:\S+/, "")
    .replace(/\bis:issue\b/, "")
    .trim();
  const haystack = `${issue.title}\n${issue.body ?? ""}`.toLowerCase();
  return text
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word.toLowerCase()));
}
