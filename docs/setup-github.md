# Setting up GitHub

Daniel runs these steps; they touch keys, authentication and repo settings. The repo lives at `64x-lunicorn/skills` (public). Commits use the identity `64x-lunicorn <248661140+64x-lunicorn@users.noreply.github.com>` from the repo-local git config.

## 1. Key for 64x-lunicorn

One Ed25519 key in 1Password serves as both authentication and signing key.

1. In 1Password: new item **SSH Key**, type Ed25519, title `GitHub 64x-lunicorn`.
2. Export its public key to `~/.ssh/github_64x-lunicorn.pub`.
3. Add a host alias to `~/.ssh/config`, so this account's key is used instead of the other GitHub keys:

   ```
   Host github-64x
     HostName github.com
     User git
     IdentityFile ~/.ssh/github_64x-lunicorn.pub
     IdentitiesOnly yes
   ```

4. Sign in with `gh` as `64x-lunicorn` and register the key twice:

   ```bash
   gh auth login
   ```

   ```bash
   gh ssh-key add ~/.ssh/github_64x-lunicorn.pub --type authentication --title "1Password"
   ```

   ```bash
   gh ssh-key add ~/.ssh/github_64x-lunicorn.pub --type signing --title "1Password signing"
   ```

5. Check the connection. The answer must greet `64x-lunicorn`:

   ```bash
   ssh -T github-64x
   ```

## 2. Create the repo and push

```bash
gh repo create 64x-lunicorn/skills --public
```

Description, topics and features match the other public repos on the account: one sentence ending in the stack, ten topics mixing domain and technology, no wiki, no discussions.

```bash
gh repo edit 64x-lunicorn/skills \
  --description "Claude Code plugin with agent skills harvested from real corrections, not invented — every SKILL.md passes a deterministic validator before it lands. Built in TypeScript." \
  --add-topic agent-skills,ai-agents,anthropic,claude,claude-code,claude-code-plugin,developer-tools,llm,prompt-engineering,typescript \
  --enable-wiki=false \
  --enable-discussions=false
```

Turn on private vulnerability reporting, which [SECURITY.md](../SECURITY.md) links to:

```bash
gh api -X PUT repos/64x-lunicorn/skills/private-vulnerability-reporting
```

```bash
git remote set-url origin git@github-64x:64x-lunicorn/skills.git
```

```bash
git push -u origin main
```

The push runs `ci.yml` once, so GitHub knows the `validate` and `test` checks, and `release.yml` creates tag and release `v0.1.0`.

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
