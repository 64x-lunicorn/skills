---
name: resolve-merge
description: Brings the default branch into the current branch by merging, resolves each merge conflict keeping the intent of both sides and inventing no behaviour, stops on incompatible intents with both sides' sources quoted, and records the merge only after the project's checks passed, never pushing. Use when a branch is to be brought up to date with the default branch or main, when merge conflicts are to be resolved, or when a pull request is behind or cannot merge because of merge conflicts.
---

Input: the intent of this side, what the current branch set out to achieve, as text from the caller, such as its ticket, Spec and scenarios. Output: `merged`, `stopped: incompatible intents` or `stopped: checks failed`, as in step 6.

A merge conflict is where both sides changed the same lines. Resolving it by taste loses one side's work or adds behaviour nobody asked for, and both slip past review because a merge commit looks like bookkeeping. So every line of the result is traced to one of the two sides, and where both cannot stand, Daniel decides.

Never push, never run `git merge --abort`, never rebase and never edit issues. Pushing belongs to the caller; an aborted merge throws away the state Daniel needs to decide; a rebase rewrites commits a review already saw.

## 1. Read the marker and the intent of this side

Read `.claude/64x-lunicorn.yml` for `default_branch`, `ci.command`, `forge` and the tracker. Take the intent of this side from the caller's text and the sources it names, never from the branch name, which is a guess.

**Done when** the default branch, `ci.command` and the intent of this side are known.

## 2. Start the merge

With a remote, `git fetch origin` and `git merge --no-ff --no-commit origin/<default_branch>`; without one, `git merge --no-ff --no-commit <default_branch>`. Together they hold the merge open, with or without merge conflicts and also when the branch has no commits of its own, so the checks in step 5 run before anything is recorded; `--no-commit` alone cannot stop a fast-forward.

When git reports that the branch is already up to date, return `merged` with no resolved files and stop here.

**Done when** `.git/MERGE_HEAD` exists and `git diff --name-only --diff-filter=U` lists the conflicting files, possibly none, or git reported the branch already up to date.

## 3. Read the intent of the default branch

For each conflicting file, read what the default branch set out to achieve, from its primary sources:

- `git log <merge-base>..<default> -- <file>`, with `<merge-base>` from `git merge-base HEAD MERGE_HEAD`, and each commit's message and diff for that file.
- A squash commit subject ends in `(#<pr>)`. With `forge: github`, `gh pr view <pr> --json title,body` gives its `Closes #<ticket>`; read that ticket and its Spec.
- Without a forge, or with local issues, read every issue a commit message references (`#<n>`, `Closes #<n>`, `Refs #<n>`) from `issues.path`, the file whose name starts with the number zero-padded to four digits, and the Spec it names.

Read both sides of the file too: `git show :2:<file>` is this side, `git show :3:<file>` the default branch, `git show :1:<file>` the merge-base.

**Done when** each conflicting file has the intent of both sides, each with the passage it comes from.

## 4. Resolve or stop

For each conflicting file, decide whether one result can keep both intents:

- **Both can be kept:** write the result from the lines of the two sides. A line comes from this side, from the default branch, or combines a change of each on the same line. Add nothing else: no new condition, option, fallback, comment or test that neither side wrote. When combining needs a line neither side wrote beyond joining their changes, both intents cannot be kept that way. Stage the file.
- **Both cannot be kept:** the intents contradict, for example one side makes a case succeed and the other makes the same case fail. Choosing either one, or a compromise, decides the product for Daniel. Leave the merge open with the file unresolved and go to step 6 with `stopped: incompatible intents`.

Merge conflict markers left in a file count as unresolved. Files git merged without a merge conflict stay as git merged them.

**Done when** every conflicting file is resolved and staged with no merge conflict marker left, or the run stops.

## 5. Run the project's checks

Run `ci.command` on the merged tree while the merge is still open. The checks prove the combination works before the merge is recorded; a merge commit that breaks the build is harder to take back than an open merge.

When they fail, leave the merge open, record nothing, and go to step 6 with `stopped: checks failed`. Fixing the failure is new behaviour, which a merge does not add.

**Done when** `ci.command` passed, or the run stops.

## 6. Record the merge and report

After the checks passed, draft the message with `write-commit-message` from the staged merge: `chore: merge <default_branch> into <branch>`, and a body naming each resolved file with the intent kept from each side. The merge is one change: `write-commit-message` checks only the format of this subject and body, and its rule to split unrelated changes does not apply. Commit with that message, never with git's default text, which hides what was resolved. Do not push.

Return exactly one of:

- **`merged`**: the merge commit, and per resolved file what was kept from this side and from the default branch.
- **`stopped: incompatible intents`**: per file, the intent of each side with its source quoted verbatim (file or issue, and the passage), and that the merge is left open for Daniel to decide. This is not a review finding and gets no class.
- **`stopped: checks failed`**: the failing output of `ci.command`, and that the merge is left open.

**Done when** the merge is committed and `merged` is returned, or a stop is returned with the merge still open.
