import assert from "node:assert/strict";
import { test } from "node:test";
import { parseCsv } from "../src/parse.js";

test("An empty line is skipped", () => {
  assert.equal(parseCsv("a,b\n1,2\n\n3,4").length, 2);
});
