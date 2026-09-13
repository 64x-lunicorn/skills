import type { SkillMd } from "./repo.ts";

export interface ProseLine {
  text: string;
  /** Zeilennummer (1-basiert) in der SKILL.md. */
  line: number;
}

/**
 * Body-Zeilen ohne Code: Zeilen in ``` oder ~~~ Blöcken entfallen,
 * Inline-Code wird entfernt. Beispiele in Code sind keine Referenzen.
 */
export function proseLines(skillMd: SkillMd): ProseLine[] {
  const result: ProseLine[] = [];
  let inFence = false;
  skillMd.body.forEach((raw, index) => {
    if (/^\s*(```|~~~)/.test(raw)) {
      inFence = !inFence;
      return;
    }
    if (inFence) return;
    result.push({ text: raw.replace(/`[^`]*`/g, ""), line: skillMd.bodyStartLine + index });
  });
  return result;
}
