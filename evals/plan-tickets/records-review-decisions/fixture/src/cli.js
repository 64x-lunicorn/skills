#!/usr/bin/env node
// Reads a CSV file and writes its rows as JSON to stdout; problems go to stderr.
import { readFileSync } from "node:fs";
import { parseCsv } from "./parse.js";

const [file] = process.argv.slice(2);
if (!file) {
  process.stderr.write("Usage: csv2json <file.csv>\n");
  process.exit(1);
}
const rows = parseCsv(readFileSync(file, "utf8"));
process.stdout.write(`${JSON.stringify(rows, null, 2)}\n`);
