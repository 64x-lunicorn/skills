---
"64x-lunicorn-skills": patch
---

`report-issue` reads the installed 64x-lunicorn plugin version from the plugin manifest and states it in the draft without asking; when it cannot be determined, the reporter is asked for it instead. New scenario cases `evals/report-issue/installed-version-filled-in-without-asking` and `evals/report-issue/reporter-asked-for-an-unknown-version`.
