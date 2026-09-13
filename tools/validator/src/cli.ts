import path from "node:path";
import { validate } from "./validate.ts";

const root = path.resolve(process.argv[2] ?? ".");
const findings = validate(root);

for (const { rule, path: file, line, message } of findings) {
  console.log(`${rule} ${file}${line ? `:${line}` : ""} ${message}`);
}

if (findings.length > 0) {
  console.error(`\n${findings.length} Befund(e). Regeln: docs/adr/0002-eigene-konventionen-strenger-als-die-spec.md`);
  process.exitCode = 1;
}
