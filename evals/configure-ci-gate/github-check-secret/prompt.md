Richte das CI-Gate für dieses Node-Repo auf GitHub ein. In .claude/64x-lunicorn.yml steht jetzt ein zweiter Check, der Evals-Check braucht den API-Key aus den Repo-Secrets, die Tests nicht:

```yaml
setup_version: 3
forge: github
default_branch: main
research:
  path: research/
  tracked: false  # false = gitignored, local only
issues:
  tracker: forge
  path: null
ci:
  command: npm run ci
  runtime: { stack: node, node: ">=24" }
  runner: null
  checks:
    - { name: Tests, run: npm test, required: true }
    - { name: Evals, run: npm run evals, required: false, secrets: [ANTHROPIC_API_KEY] }
```
