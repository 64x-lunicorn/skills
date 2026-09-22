---
"64x-lunicorn-skills": minor
---

`report-issue` now checks the plugin project's latest release after determining the installed version. When the reporter runs an older version, it names the latest version and how to update, then asks whether to report anyway; declining files nothing, and reporting anyway keeps stating the installed version, never the latest one. A failed lookup goes on silently.
