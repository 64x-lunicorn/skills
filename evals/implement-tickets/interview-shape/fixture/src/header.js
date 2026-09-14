// Reads the header fields of a CSV file.
export function readHeader(lines) {
  return lines.shift().split(",");
}
