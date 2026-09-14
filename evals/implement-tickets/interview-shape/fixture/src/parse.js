import { readHeader } from "./header.js";

// Converts CSV text into an array of objects keyed by the header.
export function parseCsv(text) {
  const lines = text.split("\n");
  const header = readHeader(lines);
  const data = [];
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (l.trim().length === 0) continue;
    const tmp = l.split(",");
    const obj = {};
    for (let j = 0; j < header.length; j++) obj[header[j]] = tmp[j] ?? "";
    data.push(obj);
  }
  return data;
}
