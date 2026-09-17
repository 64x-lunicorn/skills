import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { removeRepos, repoWith } from "./repo.ts";

const shim = path.join(import.meta.dirname, "..", "bin", "gh");

afterEach(removeRepos);

function run(cwd: string, args: string[]) {
  return spawnSync(shim, args, { cwd, encoding: "utf8" });
}

function seed(issues: unknown[], labels: unknown[] = []) {
  return repoWith({
    ".gh/issues.json": JSON.stringify(issues),
    ".gh/labels.json": JSON.stringify(labels),
  });
}

const openBug = {
  number: 201,
  title: "Export does nothing",
  body: "Clicking export produces no file.",
  state: "OPEN",
  stateReason: "",
  labels: [{ name: "bug" }, { name: "needs-triage" }],
  comments: [],
};

const closedNotPlanned = {
  number: 206,
  title: "Add CSV export",
  body: "Please export as CSV.",
  state: "CLOSED",
  stateReason: "NOT_PLANNED",
  labels: [],
  comments: [],
  closedAt: "2026-08-20T09:00:00Z",
};

describe("issue list", () => {
  it("defaults to open issues and projects the requested --json fields", () => {
    const root = seed([openBug, closedNotPlanned]);

    const result = run(root, ["issue", "list", "--json", "number,title"]);

    expect(JSON.parse(result.stdout)).toEqual([{ number: 201, title: "Export does nothing" }]);
  });

  it("filters by --label", () => {
    const root = seed([openBug, { ...openBug, number: 202, labels: [] }]);

    const result = run(root, ["issue", "list", "--label", "bug", "--json", "number"]);

    expect(JSON.parse(result.stdout)).toEqual([{ number: 201 }]);
  });

  it("filters by --search with a reason qualifier and keywords", () => {
    const root = seed([openBug, closedNotPlanned]);

    const result = run(root, ["issue", "list", "--state", "closed", "--search", 'reason:"not planned" CSV', "--json", "number"]);

    expect(JSON.parse(result.stdout)).toEqual([{ number: 206 }]);
  });

  it("filters by the no:label qualifier", () => {
    const root = seed([openBug, { ...openBug, number: 202, labels: [] }]);

    const result = run(root, ["issue", "list", "--search", "no:label", "--json", "number"]);

    expect(JSON.parse(result.stdout)).toEqual([{ number: 202 }]);
  });

  it("returns an empty list when no .gh/issues.json fixture exists", () => {
    const root = repoWith({ "README.md": "x" });

    const result = run(root, ["issue", "list", "--json", "number"]);

    expect(JSON.parse(result.stdout)).toEqual([]);
  });
});

describe("issue view, edit and comment", () => {
  it("projects the requested fields for one issue", () => {
    const root = seed([openBug]);

    const result = run(root, ["issue", "view", "201", "--json", "number,labels"]);

    expect(JSON.parse(result.stdout)).toEqual({ number: 201, labels: [{ name: "bug" }, { name: "needs-triage" }] });
  });

  it("fails naming the issue when it is not in the fixture", () => {
    const root = seed([openBug]);

    const result = run(root, ["issue", "view", "999"]);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("issue #999 not found");
  });

  it("adds and removes labels without duplicating an existing one", () => {
    const root = seed([openBug]);

    run(root, ["issue", "edit", "201", "--add-label", "needs-info", "--remove-label", "needs-triage"]);
    run(root, ["issue", "edit", "201", "--add-label", "needs-info"]);
    const result = run(root, ["issue", "view", "201", "--json", "labels"]);

    expect(JSON.parse(result.stdout)).toEqual({ labels: [{ name: "bug" }, { name: "needs-info" }] });
  });

  it("appends a comment whose author is a login object, the shape gh itself returns", () => {
    const root = seed([openBug]);
    fs.writeFileSync(path.join(root, "body.md"), "Can you share repro steps? Written by Claude during triage, reviewed by Daniel.");

    run(root, ["issue", "comment", "201", "--body-file", "body.md"]);
    const result = run(root, ["issue", "view", "201", "--json", "comments"]);

    const { comments } = JSON.parse(result.stdout);
    expect(comments).toHaveLength(1);
    expect(comments[0].author).toEqual({ login: "64x-lunicorn" });
    expect(comments[0].body).toContain("Written by Claude during triage, reviewed by Daniel.");
  });
});

describe("issue close and create", () => {
  it("closes with a reason code and records duplicate-of", () => {
    const root = seed([openBug]);

    run(root, ["issue", "close", "201", "--reason", "duplicate", "--duplicate-of", "90"]);
    const result = run(root, ["issue", "view", "201", "--json", "state,stateReason,duplicateOf"]);

    expect(JSON.parse(result.stdout)).toEqual({ state: "CLOSED", stateReason: "DUPLICATE", duplicateOf: 90 });
  });

  it("creates an issue numbered one past the highest existing number, with object-shaped labels", () => {
    const root = seed([openBug, closedNotPlanned]);
    fs.writeFileSync(path.join(root, "body.md"), "Diagnosis body");

    const result = run(root, ["issue", "create", "--title", "A new bugfix", "--body-file", "body.md", "--label", "bugfix"]);

    expect(JSON.parse(result.stdout)).toEqual({ number: 207, url: "https://github.com/64x-lunicorn/skills/issues/207" });
    const view = run(root, ["issue", "view", "207", "--json", "title,labels,state"]);
    expect(JSON.parse(view.stdout)).toEqual({ title: "A new bugfix", labels: [{ name: "bugfix" }], state: "OPEN" });
  });
  it("records the repository an issue is created in from --repo", () => {
    const root = seed([openBug]);

    run(root, ["issue", "create", "--repo", "64x-lunicorn/skills", "--title", "Report", "--body", "What happened"]);
    const view = run(root, ["issue", "view", "202", "--json", "title,repo"]);

    expect(JSON.parse(view.stdout)).toEqual({ title: "Report", repo: "64x-lunicorn/skills" });
  });
});

describe("auth status", () => {
  it("fails with gh's not-logged-in message when .gh/auth.json says loggedIn false", () => {
    const root = repoWith({ ".gh/auth.json": JSON.stringify({ loggedIn: false }) });

    const result = run(root, ["auth", "status", "--hostname", "github.com"]);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("You are not logged into any GitHub hosts.");
  });

  it("succeeds when no .gh/auth.json fixture exists", () => {
    const root = repoWith({ "README.md": "x" });

    const result = run(root, ["auth", "status", "--hostname", "github.com"]);

    expect(result.status).toBe(0);
  });
});

describe("label list", () => {
  it("projects the requested fields from .gh/labels.json", () => {
    const root = seed([], [{ name: "bugfix", description: "x", color: "b60205" }]);

    const result = run(root, ["label", "list", "--json", "name"]);

    expect(JSON.parse(result.stdout)).toEqual([{ name: "bugfix" }]);
  });
});

describe("api (blocked_by dependency relation)", () => {
  it("records a blocked_by relation on POST and lists it on GET", () => {
    const root = seed([openBug, { ...openBug, number: 221, labels: [{ name: "bugfix" }] }]);

    const post = run(root, ["api", "repos/64x-lunicorn/skills/issues/201/dependencies/blocked_by", "-X", "POST", "-F", "issue_id=221"]);
    expect(JSON.parse(post.stdout)).toEqual({ issue_id: 221 });

    const get = run(root, ["api", "repos/64x-lunicorn/skills/issues/201/dependencies/blocked_by"]);
    expect(JSON.parse(get.stdout).map((issue: { number: number }) => issue.number)).toEqual([221]);
  });

  it("fails naming the route for anything other than blocked_by", () => {
    const root = seed([openBug]);

    const result = run(root, ["api", "repos/64x-lunicorn/skills/pulls/1"]);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("unsupported route");
  });
});

describe("unsupported commands and the call log", () => {
  it("fails naming the command instead of a silent no-op", () => {
    const root = seed([]);

    const result = run(root, ["pr", "list"]);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("unsupported command for the scenario gh shim: pr list");
  });

  it("logs every invocation, quoting an argument that contains whitespace", () => {
    const root = seed([openBug]);

    run(root, ["issue", "list", "--search", 'reason:"not planned" CSV']);
    const log = fs.readFileSync(path.join(root, "gh-calls.log"), "utf8");

    expect(log).toBe('gh issue list --search "reason:\\"not planned\\" CSV"\n');
  });
});
