# License templates

Read when generating or checking the license file. These are the licenses Daniel's repositories use; another license gets a template when a project needs it.

| Key | `<<license_name>>` | Text |
| :--- | :--- | :--- |
| `mit` | `MIT License` | The MIT block below |
| `gpl-3.0` | `GNU General Public License v3.0` | [The GPL-3.0 text](license-gpl-3.0.txt), copied byte for byte |

Both texts are the ones `gh api licenses/<key> --jq .body` returned on 2026-09-14, ending with exactly one newline.

## Which file

- `<<license_file>>` is `COPYING` when a `COPYING` file exists at the root and no `LICENSE` does, otherwise `LICENSE`. GitHub detects both, and renaming a license file breaks links to it.
- An existing file is the license of a key when its text equals that key's text after trimming trailing whitespace on every line. For `gpl-3.0`, the older FSF text with `http://` instead of `https://` in its two URLs counts as the same license and is `unchanged`.
- An existing file with any other text is left untouched and reported with what it appears to be.

## MIT

`<<year>>` and `<<holder>>`: in an existing MIT license, the year and holder of its copyright line, so a re-run never moves the year. Otherwise the year and holder the caller passed.

```text
MIT License

Copyright (c) <<year>> <<holder>>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
