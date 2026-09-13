# Setting up GitHub

Daniel runs these steps; they touch authentication and repo settings. The repo still sits private and empty at `Lunicorn-lab/skills` and moves to the public account `64x-lunicorn`. Every command from step 1 on targets `64x-lunicorn/skills`.

## 0. Transfer the repo and make it public

Public repos get rulesets and branch protection without a paid plan.

```bash
gh api -X POST repos/Lunicorn-lab/skills/transfer -f new_owner=64x-lunicorn
```

The transfer has to be accepted in the target account. Then:

```bash
gh repo edit 64x-lunicorn/skills --visibility public --accept-visibility-change-consequences
```

```bash
git remote set-url origin git@github.com:64x-lunicorn/skills.git
```

## 1. Register the signing key with GitHub

SSH signing is already active locally (`commit.gpgsign=true`, `gpg.format=ssh`). For GitHub to show commits as *Verified*, the same public key must be registered as a **signing key**:

```bash
gh ssh-key add ~/.ssh/<signing-key>.pub --type signing --title "commit signing"
```

## 2. Push the existing commits before protection applies

```bash
git push -u origin main
```

## 3. Merge settings

Squash merge only. GitHub signs squash commits made in the web UI itself. It cannot sign rebase merges, which would fail the signature requirement.

```bash
gh repo edit 64x-lunicorn/skills --enable-squash-merge --enable-merge-commit=false --enable-rebase-merge=false --delete-branch-on-merge
```

## 4. Ruleset for `main`

No direct pushes, PR required, no force push, no deletion, linear history, signed commits only, status checks `validate` and `test` required.

`required_approving_review_count` is 0: the repo has exactly one human, and GitHub does not let anyone approve their own PR. The PR is still mandatory so the validator runs.

```bash
gh api -X POST repos/64x-lunicorn/skills/rulesets --input - <<'EOF'
{
  "name": "main",
  "target": "branch",
  "enforcement": "active",
  "conditions": { "ref_name": { "include": ["~DEFAULT_BRANCH"], "exclude": [] } },
  "rules": [
    { "type": "deletion" },
    { "type": "non_fast_forward" },
    { "type": "required_linear_history" },
    { "type": "required_signatures" },
    {
      "type": "pull_request",
      "parameters": {
        "required_approving_review_count": 0,
        "dismiss_stale_reviews_on_push": false,
        "require_code_owner_review": false,
        "require_last_push_approval": false,
        "required_review_thread_resolution": false,
        "allowed_merge_methods": ["squash"]
      }
    },
    {
      "type": "required_status_checks",
      "parameters": {
        "strict_required_status_checks_policy": true,
        "required_status_checks": [{ "context": "validate" }, { "context": "test" }]
      }
    }
  ]
}
EOF
```

GitHub can only match the `validate` and `test` checks once `ci.yml` has run at least once. The push in step 2 takes care of that.

## 5. Verify

```bash
gh api repos/64x-lunicorn/skills/rulesets --jq '.[].name'
git switch -c chore/protection-check && git commit --allow-empty -m "chore: check branch protection" && git push -u origin HEAD
git push origin HEAD:main
```

The last push must be rejected. Then delete the branch again:

```bash
git switch main && git branch -D chore/protection-check && git push origin --delete chore/protection-check
```

## Release flow

`release.yml` needs no secret and no PAT:

1. On a branch, run `npm run version`. It consumes the changesets, writes `CHANGELOG.md` and sets the version in `package.json` and `.claude-plugin/plugin.json`.
2. Open a PR, wait for green CI, squash merge.
3. On `main`, `release.yml` sees a version without a tag and creates tag `v<version>` and the GitHub release.
