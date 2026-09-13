import { proseLines } from "../markdown.ts";
import { isUserInvoked } from "../repo.ts";
import type { Finding } from "../validate.ts";
import type { Rule } from "./rule.ts";

/** `/name` oder `/plugin:name`, nur am Zeilenanfang, nach Leerraum oder Klammer. Pfade wie `docs/x` zählen nicht. */
const COMMAND = /(?<=^|[\s([])\/(?:([a-z0-9-]+):)?([a-z0-9-]+)(?![\w/.-])/g;

export const sk011: Rule = (repo) => {
  const userInvoked = new Set(
    repo.skillDirs.filter((d) => d.skillMd && isUserInvoked(d.skillMd)).map((d) => d.name),
  );

  return repo.skillDirs.flatMap(({ name: source, skillMd }): Finding[] => {
    if (!skillMd || !isUserInvoked(skillMd)) return [];
    return proseLines(skillMd).flatMap(({ text, line }) =>
      [...text.matchAll(COMMAND)]
        .filter(([, prefix, target]) => prefix === undefined || prefix === repo.pluginName)
        .filter(([, , target]) => target !== source && userInvoked.has(target!))
        .map(([command, , target]) => ({
          rule: "SK011",
          path: skillMd.path,
          line,
          message: `„${command}“ referenziert den user-invoked Skill ${target}. User-invoked Skills dürfen nur model-invoked Skills referenzieren.`,
        })),
    );
  });
};
