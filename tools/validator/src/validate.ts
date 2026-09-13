export interface Finding {
  rule: string;
  /** Pfad relativ zur Repo-Wurzel, mit `/` getrennt. */
  path: string;
  line?: number;
  message: string;
}

export function validate(_root: string): Finding[] {
  return [];
}
