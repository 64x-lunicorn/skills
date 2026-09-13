// Copies the version Changesets set in package.json into .claude-plugin/plugin.json.
// Claude Code only ships updates when the version in the manifest changes.
import fs from "node:fs";

const manifestPath = ".claude-plugin/plugin.json";
const { version } = JSON.parse(fs.readFileSync("package.json", "utf8")) as { version: string };
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as Record<string, unknown>;

manifest.version = version;
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`${manifestPath}: version ${version}`);
