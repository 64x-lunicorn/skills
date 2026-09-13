import { ORCHESTRATION_CATEGORY } from "../conventions.ts";
import type { Finding } from "../validate.ts";
import type { Rule } from "./rule.ts";

export const sk008: Rule = (repo) =>
  repo.skillDirs.flatMap(({ category, skillMd }): Finding[] => {
    if (category !== ORCHESTRATION_CATEGORY || !skillMd?.fields) return [];
    const field = skillMd.fields.get("disable-model-invocation");
    if (field?.value === true) return [];

    return [
      {
        rule: "SK008",
        path: skillMd.path,
        line: field?.line ?? 1,
        message: `Skills unter skills/${ORCHESTRATION_CATEGORY}/ müssen disable-model-invocation: true setzen. Orchestratoren zieht nur Daniel, nie das Modell.`,
      },
    ];
  });
