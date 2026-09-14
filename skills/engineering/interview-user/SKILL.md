---
name: interview-user
description: Interviews Daniel on the open decisions of a plan, one question at a time, each showing the number of open decisions and a recommended answer with its reason, and looks facts up instead of asking them. Use when a skill needs a series of decisions from Daniel, when a plan has several choices only he can make, or when about to ask him more than one question.
---

An interview gets Daniel's decisions without handing him work Claude can do itself. One question at a time keeps each answer considered, the recommended answer lets him decide with a short reply, and the count shows him how much is left.

Run it in the main conversation: only there can Daniel answer.

## 1. List the open decisions

Collect the choices in the plan at hand that Daniel has not answered yet: those the calling skill hands over, those the plan leaves open, minus those answered in earlier turns.

**Done when** every open question of the plan is on the list.

## 2. Look up facts

For each open question, check whether its answer is already in the repository or its tools: files, configuration, issues, git history. Look it up with Read, Grep and Glob and take it off the list; where the fact matters for a question, state it as found. Asking Daniel what the repository already says costs his time and invites a wrong answer from memory.

What only Daniel can choose stays a decision, even when a file suggests an answer; that suggestion becomes the recommended answer instead. A slow look-up may go to a subagent while questions that do not depend on it go on.

**Done when** the list holds only decisions.

## 3. Ask one question

Ask the next open decision in plain text and end the turn:

```
Open decisions: <n>
<question>
Recommended answer: <answer>. <reason>
```

- `<n>` counts the decisions still open, this one included.
- The two marker lines stay in English whatever language the conversation is in, so every calling skill and every check reads the same shape. The question, answer and reason follow the conversation.
- Ask exactly this one question. The next question comes after Daniel has answered, because his answer can change or remove it.
- The turn holds only this block, preceded at most by one line with a fact found in step 2 that this question depends on. That line states only this fact: it never names, lists or hints at another open decision, and it leaves out look-ups that found nothing, because every other open decision named in the turn reads as a second question. When no found fact bears on this question, the turn is the block alone.
- The recommended answer is one concrete choice, and the reason is one sentence he can disagree with.
- When the calling skill fixes the wording of a question, ask it word for word. Callers match their gates on the exact words.
- Ask in text, not with `AskUserQuestion`: Daniel answers in free text and often adds a reason or a correction.
- Write the question and the recommendation without emojis, even when Daniel uses them.

**Done when** the turn ends on exactly one question in this shape.

## 4. Take the answer

Keep Daniel's answer in his words and take the decision off the list. When the answer settles another question or opens a new one, update the list, then continue with step 2.

**Done when** the answered decision is off the list and the list reflects what the answer changed.
