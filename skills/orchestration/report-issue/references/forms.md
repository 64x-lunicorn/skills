# Report forms

Read in steps 3, 4 and 6. Copied from `.github/ISSUE_TEMPLATE/bug.yml` and `.github/ISSUE_TEMPLATE/request.yml` of `64x-lunicorn/skills`; the installed plugin does not ship `.github/`, so these tables are the only copy a reporter's session can read. When the forms change, this file changes with them.

## Bug

Something does not work as expected. Form file `bug.yml`.

| Field id | Label, the draft's heading | Required | Form description | Concrete when |
|---|---|---|---|---|
| `what-happened` | What happened | yes | What did you do, and what did you see? | It names what the reporter ran or did, and what happened as a result. |
| `expected` | What you expected | yes | | It names what the reporter expected instead. |
| `environment` | Version or environment | yes | The version you use, and your operating system or browser when it matters. | |

## Request

A problem you would like solved, or an idea. Form file `request.yml`.

| Field id | Label, the draft's heading | Required | Form description | Concrete when |
|---|---|---|---|---|
| `problem` | Which problem | yes | What are you trying to do, and what gets in the way? | It names the task and what gets in the way. |
| `idea` | How you imagine it | no | Optional. | |

The Request form has no version field; the draft adds `### Plugin version` after the form's fields.
