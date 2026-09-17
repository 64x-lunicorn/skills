import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { removeRepos, repoWith } from "./repo.ts";

const curl = path.join(import.meta.dirname, "..", "bin", "curl");

afterEach(removeRepos);

function run(cwd: string, args: string[]) {
  return spawnSync(curl, args, { cwd, encoding: "utf8" });
}

const release = {
  tag_name: "v99.0.0",
  name: "v99.0.0",
  html_url: "https://github.com/64x-lunicorn/skills/releases/tag/v99.0.0",
};

describe("releases/latest", () => {
  it("serves the first release of .gh/releases.json", () => {
    const root = repoWith({ ".gh/releases.json": JSON.stringify([release]) });

    const result = run(root, ["-fsS", "https://api.github.com/repos/64x-lunicorn/skills/releases/latest"]);

    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual(release);
  });

  it("exits 22 like curl -f on a 404 when the fixture holds no release", () => {
    const root = repoWith({ "README.md": "x" });

    const result = run(root, ["-fsS", "https://api.github.com/repos/64x-lunicorn/skills/releases/latest"]);

    expect(result.status).toBe(22);
    expect(result.stderr).toContain("404");
  });

  it("exits 22 for the latest release of any repository other than the plugin project", () => {
    const root = repoWith({ ".gh/releases.json": JSON.stringify([release]) });

    const result = run(root, ["-fsS", "https://api.github.com/repos/acme/shop/releases/latest"]);

    expect(result.status).toBe(22);
    expect(result.stdout).toBe("");
  });
});

describe("search/issues", () => {
  const issues = [
    { number: 71, title: "report-issue asks for the version twice", body: "The version question repeats.", state: "OPEN", labels: [] },
    { number: 72, title: "Version shown in the draft is wrong", body: "Draft names an old version.", state: "CLOSED", labels: [] },
    { number: 73, title: "Version question in setup", body: "Unrelated.", state: "OPEN", labels: [] },
    { number: 74, title: "Export does nothing", body: "No file.", state: "OPEN", labels: [] },
  ];

  it("returns open and closed issues matching every keyword, capped at per_page, in the REST shape", () => {
    const root = repoWith({ ".gh/issues.json": JSON.stringify(issues) });

    const result = run(root, [
      "-fsS",
      "-G",
      "https://api.github.com/search/issues",
      "--data-urlencode",
      "q=repo:64x-lunicorn/skills is:issue version",
      "-d",
      "per_page=2",
    ]);

    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      total_count: 3,
      incomplete_results: false,
      items: [
        {
          number: 71,
          title: "report-issue asks for the version twice",
          body: "The version question repeats.",
          state: "open",
          labels: [],
          html_url: "https://github.com/64x-lunicorn/skills/issues/71",
        },
        {
          number: 72,
          title: "Version shown in the draft is wrong",
          body: "Draft names an old version.",
          state: "closed",
          labels: [],
          html_url: "https://github.com/64x-lunicorn/skills/issues/72",
        },
      ],
    });
  });

  it("reads the query from the URL's query string too", () => {
    const root = repoWith({ ".gh/issues.json": JSON.stringify(issues) });

    const result = run(root, ["-fsS", "https://api.github.com/search/issues?q=repo%3A64x-lunicorn%2Fskills+export"]);

    expect(JSON.parse(result.stdout).items.map((item: { number: number }) => item.number)).toEqual([74]);
  });

  it("exits 22 when data is given without -G, since curl would send it as a POST body", () => {
    const root = repoWith({ ".gh/issues.json": JSON.stringify(issues) });

    const result = run(root, [
      "-fsS",
      "https://api.github.com/search/issues",
      "--data-urlencode",
      "q=repo:64x-lunicorn/skills is:issue version",
    ]);

    expect(result.status).toBe(22);
    expect(result.stdout).toBe("");
  });
});

describe("anything else and the call log", () => {
  it("exits 22 naming the URL it does not serve", () => {
    const root = repoWith({ "README.md": "x" });

    const result = run(root, ["-fsS", "https://example.com/"]);

    expect(result.status).toBe(22);
    expect(result.stderr).toContain("https://example.com/");
  });

  it("logs every invocation to gh-calls.log prefixed curl, quoting an argument that contains whitespace", () => {
    const root = repoWith({ "README.md": "x" });

    run(root, ["-fsS", "-G", "https://api.github.com/search/issues", "--data-urlencode", "q=is:issue version"]);
    const log = fs.readFileSync(path.join(root, "gh-calls.log"), "utf8");

    expect(log).toBe('curl -fsS -G https://api.github.com/search/issues --data-urlencode "q=is:issue version"\n');
  });
});
