# README template

Read when collecting project sections and generating `README.md`. The skeleton follows `64x-lunicorn/skills` and `64x-lunicorn/vigil`.

## Fill rules

- `<<name>>` and every other plain placeholder is replaced by its value alone.
- `<<keep:…>>` is a project section: the content collected in step 2, inserted unchanged. It may span several lines. On a line with fixed text around it, the section is the text between that fixed text.
- A placeholder that resolves to nothing is removed together with its whole line. Afterwards, outside code blocks, no blank line follows another blank line.
- The generated file ends with exactly one newline.
- Anchors use GitHub's heading slugs: lowercase, punctuation other than `-` and `_` removed, spaces replaced by `-`.

## Values

| Placeholder | Value |
| :--- | :--- |
| `<<name>>` | The repository name from `origin`, otherwise the project directory name |
| `<<tagline>>` | The H3 tagline, one line |
| `<<pitch_headline>>`, `<<pitch_paragraph>>`, `<<pitch_one_liner>>` | The pitch, the paragraph as one line |
| `<<license_badge>>`, `<<license_name>>` | From the license table |
| `<<stack_badge>>` | From the stack table |
| `<<nav_fixed>>` | GitHub: `[Contributing](CONTRIBUTING.md) &nbsp; / &nbsp;` and `[Report a bug](https://github.com/<owner>/<repo>/issues)` on two lines. No forge: `[Contributing](CONTRIBUTING.md)` |
| `<<doc_rows_fixed>>` | The Documentation rows below, in their order |
| `<<contributing_intro>>` | GitHub: `Bug reports and focused pull requests are welcome.` No forge: `Focused changes are welcome.` |
| `<<ci_command>>` | `ci.command` from the marker |
| `<<year>>`, `<<holder>>` | The copyright year and holder |
| `<<license_file>>` | `COPYING` when a `COPYING` file exists at the root and no `LICENSE` does, otherwise `LICENSE` |

Every line of `<<keep:nav_anchors>>` ends with ` &nbsp; / &nbsp;`, since `<<nav_fixed>>` always follows it.

### License

| Key | `<<license_badge>>` | `<<license_name>>` |
| :--- | :--- | :--- |
| `mit` | `[![License: MIT](https://img.shields.io/badge/license-MIT-22c55e?style=flat-square)](LICENSE)` | `MIT License` |
| `gpl-3.0` | `[![License: GPL-3.0](https://img.shields.io/badge/license-GPL--3.0-22c55e?style=flat-square)](LICENSE)` | `GNU General Public License v3.0` |

When `<<license_file>>` is `COPYING`, the badge links `COPYING` instead of `LICENSE`.

### Stack

| `ci.runtime.stack` | `<<stack_badge>>` |
| :--- | :--- |
| `node` with `tsconfig.json` at the root | `[![Built with TypeScript](https://img.shields.io/badge/built_with-TypeScript-3178c6?style=flat-square)](package.json)` |
| `node` without `tsconfig.json` | `[![Built with JavaScript](https://img.shields.io/badge/built_with-JavaScript-ca8a04?style=flat-square)](package.json)` |
| `elixir` | `[![Built with Elixir](https://img.shields.io/badge/built_with-Elixir-6e4a7e?style=flat-square)](mix.exs)` |
| `swift` | `[![Built with Swift](https://img.shields.io/badge/built_with-Swift-f05138?style=flat-square)](<path>)`, with `Package.swift` as the path when it exists, otherwise the `.xcodeproj` directory |
| `cpp-qt` | `[![Built with C++](https://img.shields.io/badge/built_with-C%2B%2B-00599c?style=flat-square)](CMakeLists.txt)` |

### Documentation rows

1. Only when `docs/ci-cd.md` exists: `| [CI/CD](docs/ci-cd.md) | Understand the gate, run it locally and see the rules on \`<<default_branch>>\`. |`
2. `| [Contributing](CONTRIBUTING.md) | Set up development, run the checks and submit a focused change. |`
3. `| [Security policy](SECURITY.md) | Report a vulnerability privately. |`

## Project sections

| Section | Holds | Drafted from |
| :--- | :--- | :--- |
| `banner_alt` | Alt text of the banner, `<name> - <what the banner says>` | Name and tagline |
| `lead` | One or two lines under the tagline, what the project is | Manifest description, existing docs |
| `project_badges` | 0 to 2 further badges, `flat-square` | Empty |
| `nav_anchors` | 2 to 3 links to sections of this README | The most important sections |
| `what_you_get_rows` | 4 to 6 rows `\| **<benefit>** \| <one or two sentences> \|` | What the code and docs show |
| `maturity_note` | Optional `> [!NOTE]` on maturity and limits | Empty |
| `how_it_works` | A `text` code block with a diagram, then optional prose | Entry points and components |
| `quickstart` | Numbered steps, one command per code block | Existing install and run commands |
| `project_sections` | Every further `##` section, in order | Content from an existing README that fits nowhere else |
| `contributing_notes` | What contributions this project asks for beyond the fixed text, such as how new features are proposed | Empty |
| `project_doc_rows` | Further Documentation rows, `\| [Guide](path) \| <start here when you want to...> \|` | Existing docs |
| `credits` | Lines after the copyright notice | Empty |

## `README.md`

````markdown
<div align="center">

# <<name>>

<img src="docs/assets/<<name>>-banner.svg" alt="<<keep:banner_alt>>" width="1200">

### <<tagline>>

<<keep:lead>>

<<license_badge>>
<<stack_badge>>
<<keep:project_badges>>

<<keep:nav_anchors>>
<<nav_fixed>>

</div>

---

## <<pitch_headline>>

<<pitch_paragraph>>

**<<pitch_one_liner>>**

| | What you get |
| :--- | :--- |
<<keep:what_you_get_rows>>

<<keep:maturity_note>>

## How it works

<<keep:how_it_works>>

## Quickstart

<<keep:quickstart>>

<<keep:project_sections>>

## Documentation

| Guide | Start here when you want to... |
| :--- | :--- |
<<keep:project_doc_rows>>
<<doc_rows_fixed>>

## Contributing

<<contributing_intro>> Run the whole gate locally before pushing:

```bash
<<ci_command>>
```

<<keep:contributing_notes>>

Use synthetic data in examples, tests and issues. See [CONTRIBUTING.md](CONTRIBUTING.md) for the checks and what a change needs.

## License and credits

<<name>> is licensed under the **[<<license_name>>](<<license_file>>)**.
The copyright notice is **Copyright (c) <<year>> <<holder>>**.
<<keep:credits>>
````
