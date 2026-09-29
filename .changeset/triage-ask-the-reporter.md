---
"64x-lunicorn-skills": minor
---

`/64x-lunicorn:triage-issues` asks the reporter when an issue cannot be routed without their information: it drafts one specific question, posts it as a comment once Daniel has approved it, and labels the issue `needs-info` instead of `needs-triage`. Every comment triage posts on a reporter's Bug or Request ends with the line "Written by Claude during triage, reviewed by Daniel."; the texts for questions, rejections, duplicates, bugfix links and "Fixed by" live in `references/comments.md`. Adds the terms External issue and Internal issue.
