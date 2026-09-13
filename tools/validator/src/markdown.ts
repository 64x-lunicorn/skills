import type { SkillMd } from "./repo.ts";

export interface ProseLine {
  text: string;
  /** 1-based line number in SKILL.md. */
  line: number;
}

/**
 * Body lines without code: lines inside ``` or ~~~ blocks are dropped,
 * inline code is removed. Examples in code are not references.
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
