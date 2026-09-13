import { SKILL_NAME_VERBS } from "../conventions.ts";
import type { Finding } from "../validate.ts";
import type { Rule } from "./rule.ts";

export const sk006: Rule = (repo) =>
  repo.skillDirs.flatMap(({ path, name }): Finding[] => {
    const finding = (message: string): Finding[] => [{ rule: "SK006", path, message }];

    if (!/^[a-z0-9-]+$/.test(name)) {
      return finding(
        `Skill-Name „${name}“ muss kleingeschrieben sein und darf nur a-z, 0-9 und Bindestriche enthalten.`,
      );
    }

    const segments = name.split("-");
    if (segments.length < 2 || segments.includes("")) {
      return finding(
        `Skill-Name „${name}“ folgt nicht dem Schema Verb-Substantiv, z. B. write-commit-message.`,
      );
    }

    const verb = segments[0]!;
    if (!SKILL_NAME_VERBS.includes(verb)) {
      return finding(
        `Verb „${verb}“ steht nicht in der Allowlist (${SKILL_NAME_VERBS.join(", ")}). Neues Verb nur per TDD in tools/validator/src/conventions.ts aufnehmen.`,
      );
    }

    return [];
  });
