---
"64x-lunicorn-skills": minor
---

`report-issue` now looks for similar reports in the plugin project before showing the draft, from 3 to 5 distinctive words in the reporter's answers, open and closed together. It shows at most three, each with its number, title, state and link, and asks whether the problem is one of them. On a match, no new report is filed: adding a comment to the existing report is offered instead, shown and posted with `gh issue comment` only after the reporter confirms it, or its link is given when the reporter cannot file directly.
