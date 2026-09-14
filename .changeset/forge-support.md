---
"64x-lunicorn-skills": minor
---

Support GitLab and Forgejo in `setup-project`, `configure-ci-gate`, `write-issue-templates`, `write-community-files`, `write-readme` and `write-agent-docs`. GitLab gets one job per check with `CI gate` last under "Pipelines must succeed", the protected branch and merge request settings, Markdown issue templates and confidential security reports. Forgejo gets required and advisory matrices with `CI / CI gate (pull_request)` as the only required status, blocking actionlint, branch protection, issue forms and regex CODEOWNERS. Both use Renovate and read their API token from the environment. The marker gains `ci.runner`, so `setup_version` is now 3 and projects set up before are asked to re-run setup.
