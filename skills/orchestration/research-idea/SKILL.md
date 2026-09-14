---
name: research-idea
description: Creates or continues a research object under research/ and leads the discussion of an idea toward a documented conclusion, without implementing it.
argument-hint: "[idea, or number/slug of an existing research object]"
disable-model-invocation: true
---

Holds one idea, domain or technical, in `research/NNNN-<slug>/` of the repo it belongs to and develops it with Daniel. The idea may never be built; the record is the product. A research object is never implemented directly: it reaches implementation only through promotion past quality gates, which is not part of this skill.

## 0. Check project setup

Read `.claude/64x-lunicorn.yml` in the project root, then go on with step 1 in every case; the notice informs, it does not block:

- File missing: print `Project setup missing. Run /64x-lunicorn:setup-project.`
- `setup_version` below 2: print `Project setup outdated. Re-run /64x-lunicorn:setup-project.`

## 1. Find or create the object

List `research/`. When the argument names an existing object or an object already asks the same question, continue that one; two objects for one question split the discussion.

Otherwise create the next number with `README.md`, `sources.md` and `discussion.md` from [the object template](references/object-template.md). Set `status: seed`. Choose `kind` from the idea: `domain` when it is about a problem, users or value, `technical` when it is about how, `both` when both matter.

The `question` is one sentence. When Daniel's idea does not yield one, ask for it before writing anything else, because every later step is measured against it.

**Done when** exactly one object is open and its frontmatter carries a one-sentence question.

## 2. Record what Daniel says

Append each substantial statement of Daniel's to `discussion.md` under a dated heading, **verbatim** and in the language he used. Mark every idea of your own as `Proposal (Claude):`. The record has to sound like Daniel years later, and a smoothed paraphrase loses what he actually meant.

**Done when** every decision or opinion Daniel voiced this session is in `discussion.md` in his words.

## 3. Challenge the idea

Aim for the best possible product, not agreement.

- Ask one question at a time and wait for the answer; a list of ten questions gets skimmed.
- Put "do nothing" and at least one real alternative next to the idea.
- For `domain`: who has the problem, how often, what it costs them today, what exists already.
- For `technical`: constraints, options, trade-offs, risks, what would prove an option wrong.
- Every factual claim (an API's behaviour, a market fact, a standard, a law) goes through `verify-claims` before it enters `README.md`. A fact from memory that turns out wrong carries straight into the spec.

**Done when** the open questions in `README.md` reflect what is actually still unknown.

## 4. Update the object

Rewrite the sections of `README.md` to the current state; history lives in `discussion.md`, so the README stays readable. Move the status only as Daniel's decisions allow:

- `seed → exploring` once the first finding or option is recorded.
- `exploring → concluded` when Daniel agrees a recommendation stands and open questions are resolved or explicitly accepted.
- `parked` or `rejected` whenever Daniel says so, with his reason in `README.md`. Both are kept; the reason why not is what stops the same idea coming back unexamined.
- `promoted` is never set here.

**Done when** the frontmatter status matches the last decision in `discussion.md`.

## 5. Stay out of implementation

During a run, change files only inside the research object. When Daniel asks to build it ("bau das", "implement this", "mach ein Ticket draus"), say that the object has to be promoted first, name its status and what is still open, and keep `implementable: false`. Code written from an unpromoted idea skips exactly the gates this skill exists for.

**Done when** `git status` shows changes only under `research/NNNN-<slug>/`.
