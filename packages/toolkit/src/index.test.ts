import { describe, it, expect } from "vitest";
import {
  auditRepository,
  auditMarkdown,
  parseRepository,
  generateContributionFiles,
  createCredits,
  creditsMarkdown,
  mergeContributorBaseline,
  type Contributor,
} from "./index";
const person = (
  id: number,
  login: string,
  contributions = 1,
  type = "User",
): Contributor => ({
  id,
  login,
  contributions,
  type,
  avatar_url: "https://avatars.githubusercontent.com/u/" + id,
  html_url: "https://github.com/" + login,
});
describe("repository readiness", () => {
  it("reports all nine checks with concrete evidence", () => {
    const report = auditRepository({
      repository: "sample",
      files: [
        "README.md",
        "LICENSE",
        "docs/CONTRIBUTING.md",
        ".github/CODE_OF_CONDUCT.md",
        "SECURITY.md",
        ".github/ISSUE_TEMPLATE/bug.yml",
        ".github/PULL_REQUEST_TEMPLATE.md",
        ".github/workflows/check.yml",
        "src/example.test.ts",
      ],
    });
    expect(report.summary).toEqual({ present: 9, missing: 0, unknown: 0 });
    expect(report.findings.find((x) => x.id === "tests")?.evidence).toEqual([
      "src/example.test.ts",
    ]);
    expect(auditMarkdown(report)).toContain("README.md");
  });
  it("distinguishes a missing file from an incomplete inventory", () => {
    expect(
      auditRepository({ repository: "sample", files: [] }).summary.missing,
    ).toBe(9);
    const report = auditRepository({
      repository: "sample",
      files: ["README.md"],
      incomplete: true,
    });
    expect(report.summary).toEqual({ present: 1, missing: 0, unknown: 8 });
  });
  it("recognizes real manifest test commands but not npm placeholder scripts", () => {
    const run = (text: string) =>
      auditRepository({
        repository: "sample",
        files: ["package.json"],
        fileContents: { "package.json": text },
      }).findings.find((x) => x.id === "tests")?.status;
    expect(run('{"scripts":{"test":"vitest run"}}')).toBe("present");
    expect(run('{"scripts":{"test":"echo \\"no test specified\\""}}')).toBe(
      "missing",
    );
    expect(run("not json")).toBe("missing");
  });
});
describe("repository identifiers", () => {
  it.each([
    "octocat/Hello-World",
    "https://github.com/octocat/Hello-World",
    "https://github.com/octocat/Hello-World.git/",
  ])("normalizes %s", (input) =>
    expect(parseRepository(input).fullName).toBe("octocat/Hello-World"),
  );
  it.each([
    "https://evil.com/a/b",
    "https://github.com.evil.com/a/b",
    "http://github.com/a/b",
    "https://user@github.com/a/b",
    "https://github.com/a/b?token=x",
    "https://github.com/a/b/issues",
    "a/..",
    "../b",
    "a/b/c",
    "https://github.com/a%2fb/c",
  ])("rejects %s", (input) => expect(() => parseRepository(input)).toThrow());
});
describe("contribution files", () => {
  const config = {
    repository: "owner/project",
    defaultBranch: "trunk",
    installCommand: "uv sync",
    testCommand: "uv run pytest",
    lintCommand: "uv run ruff check .",
  };
  it("generates four distinct files with the selected workflow", () => {
    const files = generateContributionFiles(config);
    expect(files.map((f) => f.path)).toEqual([
      "CONTRIBUTING.md",
      ".github/PULL_REQUEST_TEMPLATE.md",
      ".github/ISSUE_TEMPLATE/bug.yml",
      ".github/ISSUE_TEMPLATE/feature.yml",
    ]);
    expect(files[0].content).toContain("`trunk`");
    expect(files[0].content).toContain("uv run pytest");
    expect(files[2].content).toContain("required: true");
  });
  it.each(["test\nrm -rf /", "`command`", "", String.fromCharCode(0)])(
    "rejects unsafe command interpolation",
    (testCommand) =>
      expect(() =>
        generateContributionFiles({ ...config, testCommand }),
      ).toThrow(),
  );
});
describe("contributor credits", () => {
  it("deduplicates stable IDs, sorts and excludes bots only when requested", () => {
    const people = [
      person(1, "zeta", 2),
      person(1, "zeta", 3),
      person(2, "alpha", 1),
      person(3, "bot[bot]", 10, "Bot"),
    ];
    const all = createCredits("owner/repo", people);
    expect(all.contributors.map((c) => c.id)).toEqual([3, 1, 2]);
    const humans = createCredits("owner/repo", people, {
      includeBots: false,
      order: "alphabetical",
    });
    expect(humans.contributors.map((c) => c.login)).toEqual(["alpha", "zeta"]);
    expect(creditsMarkdown({ ...humans, incomplete: true })).toContain(
      "Partial result",
    );
  });
  it("retains baseline credits on empty or partial refreshes and recognizes renamed users", () => {
    const old = [person(1, "old"), person(2, "retained")];
    const latest = [person(1, "renamed"), person(3, "new")];
    expect(mergeContributorBaseline(old, latest).map((c) => c.login)).toEqual([
      "renamed",
      "retained",
      "new",
    ]);
    expect(mergeContributorBaseline(old, [])).toEqual(old);
  });
  it("does not emit arbitrary links or malformed identities", () => {
    const doc = createCredits("owner/repo", [
      { ...person(1, "safe"), html_url: "javascript:alert(1)" },
      person(2, "<script>"),
    ]);
    expect(doc.contributors).toHaveLength(1);
    expect(creditsMarkdown(doc)).toContain("https://github.com/safe");
    expect(creditsMarkdown(doc)).not.toContain("javascript:");
  });
});
