import { loadRepo } from "./repo.ts";
import type { Rule } from "./rules/rule.ts";
import { sk001 } from "./rules/sk001.ts";
import { sk002 } from "./rules/sk002.ts";
import { sk003 } from "./rules/sk003.ts";
import { sk004 } from "./rules/sk004.ts";

export interface Finding {
  rule: string;
  /** Pfad relativ zur Repo-Wurzel, mit `/` getrennt. */
  path: string;
  line?: number;
  message: string;
}

const rules: Rule[] = [sk001, sk002, sk003, sk004];

export function validate(root: string): Finding[] {
  const repo = loadRepo(root);
  return rules.flatMap((rule) => rule(repo));
}
