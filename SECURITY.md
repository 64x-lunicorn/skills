# Security policy

Skills in this plugin are instructions that an assistant follows with access to
your files, tools and shell. Please keep security reports confidential until a
fix or mitigation can be coordinated.

## Reporting a vulnerability

Use GitHub's **[Report a vulnerability](https://github.com/64x-lunicorn/skills/security/advisories/new)**
form for a private report to the repository maintainers.

**Do not disclose vulnerabilities in public issues or pull requests.**
If you cannot access the private form, open a public issue asking only for a
private contact channel. Do not include vulnerability details there.

Reports that matter here include:

- A skill that can lead an assistant to run destructive commands without
  confirmation, leak secrets, or act on instructions from untrusted content.
- An `allowed-tools` entry broader than the skill needs.
- A weakness in the validator, CI or release workflows that lets unchecked
  content reach a release.

Include in the private report:

- The affected version or commit.
- A description of the impact and prerequisites.
- Minimal reproduction steps using synthetic data.
- A proposed mitigation or fix, if available.

Never include real passwords, access tokens, SSH private keys or personal data.

## Maintenance scope

skills is an early-stage, single-maintainer project. Fixes are developed against
the current `main` branch; there is no long-term-support or backport policy.
This project does not offer a guaranteed security response time.

## Using skills safely

- Read a skill before installing it or a new version of it. Skills change what
  the assistant does.
- Check `allowed-tools` in the frontmatter: tools listed there run without a
  permission prompt while the skill is active.
- Keep secrets out of skill files, eval cases and validator fixtures.
