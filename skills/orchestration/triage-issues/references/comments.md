# Comment texts

Every comment triage posts on an external issue, a Bug or Request filed by a reporter, uses one of these texts. Fill the placeholders, keep the rest, and keep the writer line as the last line on its own: step 2 finds the last triage by it, and the reporter learns who wrote the comment.

Internal issues, which the project's own skills create, get none of these texts and never the writer line.

## Question

Step 4, when the issue cannot be routed without information from its reporter.

```
<one specific question about what is missing, for example the steps that show the bug, when it happens, or what was expected instead>

Written by Claude during triage, reviewed by Daniel.
```

## Rejection

When Daniel rejects the issue, posted before closing it as not planned.

```
Not planned: <the reason Daniel gave, in his words>

Written by Claude during triage, reviewed by Daniel.
```

## Duplicate

When the issue duplicates an existing one, posted before closing it as a duplicate.

```
Duplicate of #<existing issue>: <why both ask for the same>

Written by Claude during triage, reviewed by Daniel.
```

## Bugfix link

On the Bug, once its bugfix issue exists.

```
Bugfix: #<bugfix issue>.

Written by Claude during triage, reviewed by Daniel.
```

## Fixed by

On the Bug, when it is closed after its bugfix was merged.

```
Fixed by #<bugfix issue>.

Written by Claude during triage, reviewed by Daniel.
```
