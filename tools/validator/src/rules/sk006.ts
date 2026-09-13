import { SKILL_NAME_VERBS } from "../conventions.ts";
import type { Finding } from "../validate.ts";
import type { Rule } from "./rule.ts";

export const sk006: Rule = (repo) =>
  repo.skillDirs.flatMap(({ path, name }): Finding[] => {
    const finding = (message: string): Finding[] => [{ rule: "SK006", path, message }];

    if (!/^[a-z0-9-]+$/.test(name)) {
      return finding(
        `Skill name "${name}" must be lowercase and may only contain a-z, 0-9 and hyphens.`,
      );
    }

    const segments = name.split("-");
    if (segments.length < 2 || segments.includes("")) {
      return finding(`Skill name "${name}" does not follow the verb-noun scheme, e.g. write-commit-message.`);
    }

    const verb = segments[0]!;
    if (!SKILL_NAME_VERBS.includes(verb)) {
      return finding(
        `Verb "${verb}" is not in the allowlist (${SKILL_NAME_VERBS.join(", ")}). Add a new verb only through TDD in tools/validator/src/conventions.ts.`,
      );
    }

    return [];
  });
