# Verifying and closing a completed Spec

Read this in step 2 when every ticket in the wayfinder is checked off.

When every ticket is checked off, the Spec is built but not yet proven as a whole: each review saw one ticket. Invoke `verify-spec` with the Spec number from the wayfinder's reference line. It runs in a fresh subagent and returns completeness, findings and a closing summary without changing anything.

Present the result to Daniel, completeness first, then conflicts and hard findings. Record the missing terms, then interview him on the judgement findings with `interview-user`, one decision per finding, kept verbatim.

- **Missing terms** (hard findings naming a Spec term missing from `CONTEXT.md`): invoke `write-term` once with every missing term and the meaning from its line in the Spec's `## Terms`, before the judgement interview and before any other question. They never become follow-up tickets: a term line needs no implementer and no review. `write-term` ends the turn on its question, so the close question waits until every term is in `CONTEXT.md`. Go on with the judgement interview, the remaining bullets and step 3 once it has answered, whether it appended every line, some or none. A term still missing keeps the Spec open and is named in the step 7 report, with `write-term`'s pointer to `write-agent-docs` when the root `CONTEXT.md` is missing.
- **Work to do** (the other hard findings, and judgement findings Daniel accepts): ask "Cut follow-up tickets for these findings as sub-issues of Spec #<spec>?" On a yes, cut them with `design-ticket`, fill their implementation notes from the findings' locations and the architecture decisions they name, create them as sub-issues labelled `task`, and add them to the wayfinder under a new phase `Verification follow-ups`. They are chosen in step 3 like any other ticket; the Spec stays open and is verified again once they are merged.
- **Conflicts:** the Spec stays open. Which source gives way is Daniel's call, outside this run.
- **Nothing open** (every term in `CONTEXT.md`, no hard finding, no conflict, no accepted judgement finding): ask "Close Spec #<spec>, architecture issue #<architecture> and wayfinder #<wayfinder>?" On a yes, post the closing summary as a comment on the Spec and close all three.
