# GitHub settings templates

Read when planning and applying remote settings in steps 4 and 5. `<<owner>>/<<repo>>` comes from the `origin` remote. Verified 2026-09-14 against the GitHub REST docs (API version `2026-03-10`) and `64x-lunicorn/skills`.

## Ruleset

Target, with `<<default_branch>>` from the marker. `integration_id` 15368 is GitHub Actions, so only a check reported by a workflow run satisfies `CI gate`, not a status set through the API. `required_approving_review_count` is 0 because GitHub does not let anyone approve their own pull request; the pull request stays mandatory so the gate runs.

```json
{
  "name": "<<default_branch>>",
  "target": "branch",
  "enforcement": "active",
  "bypass_actors": [],
  "conditions": { "ref_name": { "include": ["~DEFAULT_BRANCH"], "exclude": [] } },
  "rules": [
    { "type": "deletion" },
    { "type": "non_fast_forward" },
    { "type": "required_linear_history" },
    { "type": "required_signatures" },
    {
      "type": "pull_request",
      "parameters": {
        "allowed_merge_methods": ["squash"],
        "dismiss_stale_reviews_on_push": false,
        "require_code_owner_review": false,
        "require_extra_approval_for_unattributed_changes": true,
        "require_last_push_approval": false,
        "required_approving_review_count": 0,
        "required_review_thread_resolution": false,
        "required_reviewers": []
      }
    },
    {
      "type": "required_status_checks",
      "parameters": {
        "do_not_enforce_on_create": false,
        "required_status_checks": [{ "context": "CI gate", "integration_id": 15368 }],
        "strict_required_status_checks_policy": true
      }
    }
  ]
}
```

| Operation | Command |
|---|---|
| Find the ruleset | `gh api repos/<<owner>>/<<repo>>/rulesets --jq '.[] \| select(.name == "<<default_branch>>") \| .id'` |
| Read it | `gh api repos/<<owner>>/<<repo>>/rulesets/<id> --jq '{name,target,enforcement,bypass_actors,conditions,rules}'` |
| Create | `gh api -X POST repos/<<owner>>/<<repo>>/rulesets --input <file>` |
| Update | `gh api -X PUT repos/<<owner>>/<<repo>>/rulesets/<id> --input <file>` |

Compare current and target with `jq -S` on both sides, so key order does not count as drift. Any other ruleset that requires a status check is reported, because a second required check undoes "`CI gate` is the only one".

## Merge settings

Target: squash only, head branches deleted after merge. Squash is the only method GitHub signs in the web UI, which the signed-commits rule needs.

| Operation | Command |
|---|---|
| Read | `gh repo view <<owner>>/<<repo>> --json squashMergeAllowed,mergeCommitAllowed,rebaseMergeAllowed,deleteBranchOnMerge` |
| Apply | `gh repo edit <<owner>>/<<repo>> --enable-squash-merge --enable-merge-commit=false --enable-rebase-merge=false --delete-branch-on-merge` |

## Repo metadata

Target: the description and topics exactly as the caller passed them, wiki and discussions off. Their wording is shaped in the interview of `setup-project`, not here. Without a description from the caller, the current one is kept.

| Operation | Command |
|---|---|
| Read | `gh repo view <<owner>>/<<repo>> --json description,repositoryTopics,hasWikiEnabled,hasDiscussionsEnabled` |
| Apply | `gh repo edit <<owner>>/<<repo>> --description "<<description>>" --add-topic <<comma-separated topics>> --enable-wiki=false --enable-discussions=false` |

Topics that exist on the repo but were not passed are listed as drift and removed only with `--remove-topic` after Daniel confirms, since someone may have added them on purpose.
