---
"64x-lunicorn-skills": minor
---

Add `/64x-lunicorn:report-issue`: any user of the plugin reports a bug or a request to the plugin project `64x-lunicorn/skills` from inside their own session. They choose bug or request, answer one question per required field of the matching issue form and the plugin version, and see a draft that holds only their answers and the version. Only after they confirm it is the report filed with `gh issue create` in the plugin project, never in their own project, and they get its link; without a logged-in `gh`, nothing is filed yet.
