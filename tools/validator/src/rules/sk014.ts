import { SETUP_MISSING_NOTICE, SETUP_SKILL_NAME, SETUP_STEP_HEADING, SETUP_VERSION } from "../conventions.ts";
import { isUserInvoked } from "../repo.ts";
import type { Finding } from "../validate.ts";
import type { Rule } from "./rule.ts";

const VERSION = /`setup_version` below (\d+)/;

export const sk014: Rule = (repo) =>
  repo.skillDirs.flatMap(({ name, skillMd }): Finding[] => {
    if (!skillMd || !isUserInvoked(skillMd) || name === SETUP_SKILL_NAME) return [];
    const finding = (line: number, message: string): Finding[] => [
      { rule: "SK014", path: skillMd.path, line, message },
    ];

    const start = skillMd.body.indexOf(SETUP_STEP_HEADING);
    if (start === -1) {
      return finding(
        1,
        `User-invoked skills start with a "${SETUP_STEP_HEADING}" section. Without it, a project that was never set up goes unnoticed.`,
      );
    }

    const next = skillMd.body.findIndex((text, index) => index > start && text.startsWith("## "));
    const section = skillMd.body.slice(start, next === -1 ? undefined : next);
    const headingLine = skillMd.bodyStartLine + start;

    if (!section.some((text) => text.includes(SETUP_MISSING_NOTICE))) {
      return finding(
        headingLine,
        `The step 0 section must print exactly "${SETUP_MISSING_NOTICE}", so every skill gives the same notice.`,
      );
    }

    const versionIndex = section.findIndex((text) => VERSION.test(text));
    if (versionIndex === -1) {
      return finding(
        headingLine,
        `The step 0 section must name the outdated case as "\`setup_version\` below ${SETUP_VERSION}".`,
      );
    }
    const found = Number(VERSION.exec(section[versionIndex]!)![1]);
    if (found !== SETUP_VERSION) {
      return finding(
        headingLine + versionIndex,
        `Step 0 checks setup_version below ${found}, the current setup_version is ${SETUP_VERSION}.`,
      );
    }
    return [];
  });
