import type { Repo } from "../repo.ts";
import type { Finding } from "../validate.ts";

export type Rule = (repo: Repo) => Finding[];
