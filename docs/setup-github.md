# GitHub einrichten

Diese Schritte führt Daniel selbst aus. Sie betreffen Auth und Repo-Einstellungen. Das Repo liegt noch privat und leer unter `Lunicorn-lab/skills` und zieht zum öffentlichen Account `64x-lunicorn` um. Alle Befehle ab Schritt 2 gehen vom Ziel `64x-lunicorn/skills` aus.

## 0. Repo übertragen und öffentlich machen

Öffentliche Repos bekommen Rulesets und Branch Protection auch ohne bezahlten Plan.

```bash
gh api -X POST repos/Lunicorn-lab/skills/transfer -f new_owner=64x-lunicorn
```

Die Übertragung muss im Ziel-Account bestätigt werden. Danach:

```bash
gh repo edit 64x-lunicorn/skills --visibility public --accept-visibility-change-consequences
```

```bash
git remote set-url origin git@github.com:64x-lunicorn/skills.git
```

## 1. Signierschlüssel bei GitHub hinterlegen

Lokal ist SSH-Signierung schon aktiv (`commit.gpgsign=true`, `gpg.format=ssh`). Damit GitHub die Commits als *Verified* anzeigt, muss derselbe öffentliche Schlüssel als **Signing Key** hinterlegt sein:

```bash
gh ssh-key add ~/.ssh/<signierschluessel>.pub --type signing --title "commit signing"
```

## 2. Bestehende Commits pushen, bevor die Protection greift

```bash
git push -u origin main
```

## 3. Merge-Einstellungen

Nur Squash-Merge. GitHub signiert Squash-Commits aus der Web-Oberfläche selbst. Rebase-Merges kann GitHub nicht signieren, sie würden an der Signaturpflicht scheitern.

```bash
gh repo edit 64x-lunicorn/skills --enable-squash-merge --enable-merge-commit=false --enable-rebase-merge=false --delete-branch-on-merge
```

## 4. Ruleset für `main`

Keine Direct Pushes, PR erforderlich, kein Force-Push, kein Löschen, lineare History, nur signierte Commits, Status-Checks `validate` und `test` erforderlich.

`required_approving_review_count` steht auf 0: Im Repo gibt es genau einen Menschen, und GitHub lässt niemanden den eigenen PR approven. Der PR ist trotzdem Pflicht, damit der Validator läuft.

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

Die Checks `validate` und `test` kann GitHub erst zuordnen, wenn `ci.yml` einmal gelaufen ist. Das passiert mit dem Push aus Schritt 2.

## 5. Prüfen

```bash
gh api repos/64x-lunicorn/skills/rulesets --jq '.[].name'
git switch -c chore/protection-check && git commit --allow-empty -m "chore: check branch protection" && git push -u origin HEAD
git push origin HEAD:main
```

Der letzte Push muss abgelehnt werden. Danach den Branch wieder löschen:

```bash
git switch main && git branch -D chore/protection-check && git push origin --delete chore/protection-check
```

## Release-Ablauf

Der Workflow `release.yml` braucht kein Secret und keinen PAT:

1. Auf einem Branch `npm run version` ausführen. Das verbraucht die Changesets, schreibt `CHANGELOG.md` und setzt die Version in `package.json` und `.claude-plugin/plugin.json`.
2. PR öffnen, CI grün, Squash-Merge.
3. `release.yml` sieht auf `main` eine Version ohne Tag und legt Tag `v<version>` und GitHub-Release an.
