import path from "node:path";

/** Root of this repository, three levels above the scenario tests. */
export const repoRoot = path.resolve(import.meta.dirname, "..", "..", "..");
