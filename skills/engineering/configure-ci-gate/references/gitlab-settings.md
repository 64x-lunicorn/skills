# GitLab settings templates

Read when planning and applying remote settings for `forge: gitlab`. Verified 2026-09-14 against GitLab CE 19.2.6, which has the features of GitLab Free.

## Access

- `<<host>>` and `<<project>>` come from the `origin` remote; `<<project>>` is the full path, such as `group/name`, URL-encoded as `<<project_id>>` (`group%2Fname`).
- Calls use `GITLAB_TOKEN` from the environment, with the `api` scope: `curl --fail-with-body -sS --header "PRIVATE-TOKEN: ${GITLAB_TOKEN}" "https://<<host>>/api/v4/..."`. When it is not set, ask Daniel to export it in his shell and continue once he has; never ask for the token in the conversation. Without a token, the remote settings are a gap.

## Protected branch

Target: the default branch, pushes by no one (`0`), merges by maintainers (`40`), force push off. A push straight to the branch is then rejected with "You are not allowed to push code to protected branches".

| Operation | Command |
|---|---|
| Read | `GET /projects/<<project_id>>/protected_branches/<<default_branch>>`, compare `push_access_levels[].access_level`, `merge_access_levels[].access_level` and `allow_force_push` |
| Apply | `DELETE /projects/<<project_id>>/protected_branches/<<default_branch>>`, then `POST /projects/<<project_id>>/protected_branches` with `name=<<default_branch>>`, `push_access_level=0`, `merge_access_level=40`, `allow_force_push=false` |

The access levels of an existing protection cannot be replaced in place, which is why apply deletes and recreates it. The two calls run directly after each other.

## Merge request settings and metadata

Target, as form fields of `PUT /projects/<<project_id>>`:

| Field | Value | Why |
|---|---|---|
| `only_allow_merge_if_pipeline_succeeds` | `true` | "Pipelines must succeed", the gate |
| `allow_merge_on_skipped_pipeline` | `false` | A skipped pipeline proves nothing |
| `squash_option` | `always` | Squash only |
| `merge_method` | `ff` | Linear history |
| `remove_source_branch_after_merge` | `true` | Head branches deleted after merge |
| `wiki_access_level` | `disabled` | Wiki off |
| `description` | as the caller passed it | Kept when none was passed |
| `topics` | comma-separated, as the caller passed them | Topics not passed are listed as drift and removed only after Daniel confirms |

Read with `GET /projects/<<project_id>>` and compare the same fields. There is no approval rule to set: approvals are 0, and merge request approval rules are a paid feature.
