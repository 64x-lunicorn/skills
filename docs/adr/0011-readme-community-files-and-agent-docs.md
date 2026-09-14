# 0011 — README, community files and agent docs

Status: accepted, 2026-09-14. Realises part of Spec #4 (project setup).

## Context

Spec #4 names `write-readme`, `write-community-files` and `write-agent-docs` as the remaining model-invoked skills of `setup-project`. ADR 0010 settled how the gate and the issue templates are generated: fixed templates, byte-for-byte comparison, `new`, `unchanged` or `drift`. A workflow is fully determined by the marker. A README, a CONTRIBUTING or a `CLAUDE.md` is not: its pitch, its setup instructions and its conventions belong to the project. Daniel confirmed the shape of the three skills on 2026-09-14.

## Decision

**Fixed parts and project sections.** Every template separates fixed text, filled from the marker and the interview, from project sections marked `<<keep:…>>`. A project section is drafted from what the repository shows, shown to Daniel, and kept word for word on every later run. A file in another shape is remapped into the sections, with everything that fits nowhere kept in `project_sections` in its original order. Same inputs and same sections give the same bytes, so the drift report stays meaningful for documents too.

**One line per paragraph** in the community file and agent doc templates, because wrapping depends on the length of filled values and a file that rewraps drifts. Existing wrapped files are reported as drift once and are stable after that.

**`write-readme`** fills the skeleton from Spec #4. License and stack badges come from fixed tables for the licenses and stacks in Daniel's repositories. A missing banner is generated as a marked placeholder SVG, so the README never shows a broken image, and every run reports the placeholder as a gap until the real banner replaces it.

**`write-community-files`** writes the pull request template, `.github/CODEOWNERS`, `SECURITY.md`, `CONTRIBUTING.md` and the license file. Licenses are `mit` and `gpl-3.0`, the ones Daniel's repositories use; an existing license file with another license is reported and never replaced, since that is a legal decision. `SECURITY.md` points to GitHub's private advisory form, so the skill also enables private vulnerability reporting after Daniel confirms. Without a forge there is no pull request template and no CODEOWNERS, and reports go to the maintainer directly.

**`write-agent-docs`** writes `CLAUDE.md`, `CONTEXT.md` and `docs/adr/README.md` with the ADR format and an index generated from the ADR files. Conventions and terms are never drafted, only recorded from what Daniel states or a document already holds. ADR files themselves are never changed. `AGENTS.md` and `docs/agents/` from `setup-matt-pocock-skills` are remapped and removed after Daniel confirms (ADR 0004).

**The marker does not change.** License, code owners, tagline and pitch are detected from the files they end up in, so `setup_version` stays 2.

**Order in `setup-project`:** gate, issue templates, agent docs, community files, README. Each later file links the earlier ones.

## Verification

On 2026-09-14 every template was filled for `64x-lunicorn/skills` itself, whose files are the reference, and the result compared with the files in the repository.

- **README:** the skeleton reproduced the structure; the differences were the remapped Install section, the one-line pitch paragraph and the Contributing text. The run surfaced two template defects, both fixed before shipping: the Contributing section had no project section, so project-specific contributing text would have been dropped, and the license link ignored a `COPYING` file. The anchor check caught the `#install` link that remapping renamed to Quickstart.
- **Community files:** the pull request template, `SECURITY.md` and `CONTRIBUTING.md` for GitHub and without a forge rendered with every project section in place. `CODEOWNERS` matched the repository byte for byte apart from the unwrapped comment.
- **Agent docs:** `CLAUDE.md` and `docs/adr/README.md` rendered with no blank-line runs and one final newline.

The skills were not yet run end to end by a separate agent, and no remote setting was applied.

## Consequences

- Every project gets the same README, community files and agent docs, and a re-run changes only the fixed parts.
- A project's own content can never be overwritten by a template, only moved into a project section with Daniel watching.
- Existing repositories see one round of whitespace drift in wrapped files.
- GitLab and Forgejo still stop with a gap in all three skills until the spike tasks are done.

## Alternatives

- **Fully generated documents from interview answers:** the interview would have to ask for every Quickstart step and every contributing rule.
- **Templates only for new files, existing files left alone:** the drift in Daniel's repositories that started Spec #4 would stay.
- **License, code owners and pitch in the marker:** a second copy of what the files already say, and a `setup_version` bump for every project.
- **Drafting conventions and terms from the code:** conventions nobody decided, followed by agents as if someone had.
