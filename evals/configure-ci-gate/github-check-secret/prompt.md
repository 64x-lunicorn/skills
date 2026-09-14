Set up the CI gate for this Node repo on GitHub. .claude/64x-lunicorn.yml now has a second check: the Evals check needs the API key from the repo secrets, the tests don't:

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
