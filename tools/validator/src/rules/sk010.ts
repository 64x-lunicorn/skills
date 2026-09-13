import fs from "node:fs";
import path from "node:path";
import { proseLines } from "../markdown.ts";
import type { Finding } from "../validate.ts";
import type { Rule } from "./rule.ts";

const LINK = /!?\[[^\]]*\]\(\s*([^)\s]+)(?:\s+"[^"]*")?\s*\)/g;
const EXTERNAL = /^[a-z][a-z0-9+.-]*:/i;

export const sk010: Rule = (repo) =>
  repo.skillDirs.flatMap(({ path: dir, skillMd }): Finding[] => {
    if (!skillMd?.fields) return [];
    return proseLines(skillMd).flatMap(({ text, line }) =>
      [...text.matchAll(LINK)]
        .map((match) => match[1]!.split(/[#?]/)[0]!)
        .filter((target) => target !== "" && !EXTERNAL.test(target))
        .filter((target) => !fs.existsSync(path.join(repo.root, dir, decodeURI(target))))
        .map((target) => ({
          rule: "SK010",
          path: skillMd.path,
          line,
          message: `Referenzierte Datei „${target}“ existiert nicht (relativ zu ${dir}/).`,
        })),
    );
  });
