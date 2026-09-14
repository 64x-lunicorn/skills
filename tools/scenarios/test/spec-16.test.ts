import fs from "node:fs";
import path from "node:path";
import { expect, it } from "vitest";
import { loadCases } from "../src/cases.ts";

const root = path.resolve(import.meta.dirname, "..", "..", "..");

/** The scenarios of Spec #16 that ticket #25 owns, verbatim. */
const SCENARIOS = [
  "A question carries a recommended answer",
  "A question shows the decisions still open",
  "One question at a time",
  "A fact that can be looked up is not asked",
  "The interview ends with confirmed decisions",
  "A rejected list reopens the interview",
  "The interview saves nothing",
  "Daniel starts an interview himself",
  "interview-me names the next command",
  "A question with fixed wording is asked word for word",
  "No emojis in questions",
  "The wording is interview",
];

/** Deterministic scenarios run as vitest tests instead of eval cases. */
const TEST_FILES = ["tools/scenarios/test/wording.test.ts"];

function testNames(file: string): string[] {
  const text = fs.readFileSync(path.join(root, file), "utf8");
  return [...text.matchAll(/\bit\(\s*"([^"]+)"/g)].map((match) => match[1] ?? "");
}

const tests = [...loadCases(root).map((c) => c.name), ...TEST_FILES.flatMap(testNames)];

it.each(SCENARIOS)("Spec #16 scenario has exactly one test: %s", (name) => {
  expect(tests.filter((test) => test === name)).toHaveLength(1);
});
