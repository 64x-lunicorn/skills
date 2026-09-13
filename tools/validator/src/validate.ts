import { loadRepo } from "./repo.ts";
import type { Rule } from "./rules/rule.ts";
import { sk001 } from "./rules/sk001.ts";
import { sk002 } from "./rules/sk002.ts";
import { sk003 } from "./rules/sk003.ts";
import { sk004 } from "./rules/sk004.ts";
import { sk005 } from "./rules/sk005.ts";
import { sk006 } from "./rules/sk006.ts";
import { sk007 } from "./rules/sk007.ts";
import { sk008 } from "./rules/sk008.ts";
import { sk009 } from "./rules/sk009.ts";

export interface Finding {
  rule: string;
  /** Pfad relativ zur Repo-Wurzel, mit `/` getrennt. */
  path: string;
  line?: number;
  message: string;
}

const rules: Rule[] = [sk001, sk002, sk003, sk004, sk005, sk006, sk007, sk008, sk009];

export function validate(root: string): Finding[] {
  const repo = loadRepo(root);
  return rules.flatMap((rule) => rule(repo));
}
