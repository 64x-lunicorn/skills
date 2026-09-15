---
"64x-lunicorn-skills": minor
---

Add `interview-user`: when a skill needs a series of decisions from Daniel, the interview asks one question at a time, each with a line `Open decisions: <n>` before it and a line `Recommended answer: <answer>. <reason>` after it, in English whatever the conversation language. Facts that can be looked up in the repository are looked up instead of asked, a question whose wording the calling skill fixes is asked word for word, and questions and recommendations contain no emojis. The validator accepts `interview` as a skill name verb.
