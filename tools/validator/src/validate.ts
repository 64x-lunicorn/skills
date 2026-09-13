import { loadRepo } from "./repo.ts";
import type { Rule } from "./rules/rule.ts";
import { sk001 } from "./rules/sk001.ts";

export interface Finding {
  rule: string;
  /** Pfad relativ zur Repo-Wurzel, mit `/` getrennt. */
  path: string;
  line?: number;
  message: string;
}

const rules: Rule[] = [sk001];

export function validate(root: string): Finding[] {
  const repo = loadRepo(root);
  return rules.flatMap((rule) => rule(repo));
}
