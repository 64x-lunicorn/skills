// Converts CSV text into an array of objects keyed by the header, reading the lines one by one.
export function parseCsv(text) {
  const [headerLine, ...lines] = text.split("\n");
  const header = headerLine.split(",");
  const rows = [];
  for (const line of lines) {
    const fields = line === "" ? [] : line.split(",");
    const row = {};
    for (let index = 0; index < fields.length && index < header.length; index++) {
      row[header[index]] = fields[index];
    }
    rows.push(row);
  }
  return rows;
}
