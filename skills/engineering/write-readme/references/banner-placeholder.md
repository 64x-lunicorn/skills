# Banner placeholder

Read when `docs/assets/<name>-banner.svg` does not exist. The placeholder keeps the README from showing a broken image until the real banner is drawn. It has the size of the house banners, 1200 by 340.

`<<name>>` is the project name, with `&`, `<` and `>` escaped as `&amp;`, `&lt;` and `&gt;`. The file is the content of the fenced block, ending with exactly one newline.

A banner that still contains the comment `write-readme placeholder` is the placeholder, and every run reports it as a gap. Replacing the file with the real banner removes the gap; the README does not change.

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="340" viewBox="0 0 1200 340" role="img" aria-labelledby="title">
  <!-- write-readme placeholder: replace this file with the project banner. -->
  <title id="title"><<name>> banner placeholder</title>
  <rect width="1200" height="340" fill="#1e293b"/>
  <text x="600" y="170" fill="#f8fafc" font-family="-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="64" font-weight="700" text-anchor="middle"><<name>></text>
  <text x="600" y="230" fill="#94a3b8" font-family="-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="24" text-anchor="middle">Banner placeholder</text>
</svg>
```
