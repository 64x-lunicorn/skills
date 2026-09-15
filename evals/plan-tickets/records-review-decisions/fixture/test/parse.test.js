import assert from "node:assert/strict";
import { test } from "node:test";
import { parseCsv } from "../src/parse.js";

test("A row becomes an object keyed by the header", () => {
  assert.deepEqual(parseCsv("a,b\n1,2"), [{ a: "1", b: "2" }]);
});

test("Every row becomes its own object", () => {
  assert.equal(parseCsv("a,b\n1,2\n3,4").length, 2);
});
