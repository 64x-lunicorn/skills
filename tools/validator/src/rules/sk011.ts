import { proseLines } from "../markdown.ts";
import { isUserInvoked } from "../repo.ts";
import type { Finding } from "../validate.ts";
import type { Rule } from "./rule.ts";

/** `/name` or `/plugin:name`, only at line start, after whitespace or a bracket. Paths like `docs/x` do not count. */
const COMMAND = /(?<=^|[\s([])\/(?:([a-z0-9-]+):)?([a-z0-9-]+)(?![\w/.-])/g;

export const sk011: Rule = (repo) => {
  const userInvoked = new Set(
    repo.skillDirs.filter((d) => d.skillMd && isUserInvoked(d.skillMd)).map((d) => d.name),
  );

  return repo.skillDirs.flatMap(({ name: source, skillMd }): Finding[] => {
    if (!skillMd || !isUserInvoked(skillMd)) return [];
    return proseLines(skillMd).flatMap(({ text, line }) =>
      [...text.matchAll(COMMAND)]
        .filter(([, prefix]) => prefix === undefined || prefix === repo.manifest?.name)
        .filter(([, , target]) => target !== source && userInvoked.has(target!))
        .map(([command, , target]) => ({
          rule: "SK011",
          path: skillMd.path,
          line,
          message: `"${command}" references the user-invoked skill ${target}. User-invoked skills may only reference model-invoked skills.`,
        })),
    );
  });
};
