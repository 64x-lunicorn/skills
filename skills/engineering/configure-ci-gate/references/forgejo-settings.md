# Forgejo settings templates

Read when planning and applying remote settings for `forge: forgejo`. Verified 2026-09-14 against Forgejo 16.0.4.

## Access

- `<<host>>`, `<<owner>>` and `<<repo>>` come from the `origin` remote.
- Calls use `FORGEJO_TOKEN` from the environment, with repository write access: `curl --fail-with-body -sS --header "Authorization: token ${FORGEJO_TOKEN}" "https://<<host>>/api/v1/..."`. When it is not set, ask Daniel to export it in his shell and continue once he has; never ask for the token in the conversation. Without a token, the remote settings are a gap.

## Branch protection

Target, as JSON:

```json
{
  "rule_name": "<<default_branch>>",
  "enable_push": false,
  "enable_status_check": true,
  "status_check_contexts": ["CI / CI gate (pull_request)"],
  "require_signed_commits": <<signed>>,
  "block_on_outdated_branch": true,
  "required_approvals": 0,
  "apply_to_admins": true
}
```

- `enable_push: false` rejects every push to the branch: "Not allowed to push to protected branch".
- `status_check_contexts` is the exact status name the CI workflow reports for `CI gate`. A pull request without that status cannot merge: "Not all required status checks successful".
- `block_on_outdated_branch` is GitHub's strict status check policy: a branch behind the base has to be updated and pass again.
- `<<signed>>` is `true` only when `GET https://<<host>>/api/v1/signing-key.gpg` returns a key. Forgejo signs a merge commit with the instance key; without one, every merge into a branch that requires signatures fails with "won't sign: nokey". An instance without a key makes signed commits a gap.

| Operation | Command |
|---|---|
| Read | `GET /repos/<<owner>>/<<repo>>/branch_protections/<<default_branch>>` |
| Create | `POST /repos/<<owner>>/<<repo>>/branch_protections` with the target |
| Update | `PATCH /repos/<<owner>>/<<repo>>/branch_protections/<<default_branch>>` with the target without `rule_name` |

Compare only the keys of the target.

## Merge settings and metadata

Target, as JSON for `PATCH /repos/<<owner>>/<<repo>>`:

```json
{
  "allow_merge_commits": false,
  "allow_rebase": false,
  "allow_rebase_explicit": false,
  "allow_squash_merge": true,
  "allow_fast_forward_only_merge": false,
  "default_merge_style": "squash",
  "default_delete_branch_after_merge": true,
  "has_wiki": false,
  "description": "<<description>>"
}
```

`default_delete_branch_after_merge` is the default of the merge dialog; a merge through the API keeps the branch unless the call asks to delete it. Without a description from the caller, leave `description` out and keep the current one.

Topics: read with `GET /repos/<<owner>>/<<repo>>/topics`, apply with `PUT /repos/<<owner>>/<<repo>>/topics` and `{"topics": [...]}`. Topics not passed are listed as drift and removed only after Daniel confirms.
