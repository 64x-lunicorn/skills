import path from "node:path";

export function fixture(name: string): string {
  return path.join(import.meta.dirname, "..", "fixtures", name);
}
