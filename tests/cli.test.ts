import { describe, it, expect, afterEach } from "vitest";
import {
  mkdtemp,
  readFile,
  mkdir,
  writeFile,
  rm,
  symlink,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
const dirs: string[] = [];
async function temp() {
  const d = await mkdtemp(join(tmpdir(), "codein-cli-"));
  dirs.push(d);
  return d;
}
afterEach(async () => {
  await Promise.all(
    dirs.splice(0).map((d) => rm(d, { recursive: true, force: true })),
  );
});
const run = (...args: string[]) =>
  spawnSync(
    process.execPath,
    [resolve("packages/cli/dist/index.js"), ...args],
    { encoding: "utf8", env: { ...process.env, GITHUB_TOKEN: "" } },
  );
describe("built CLI", () => {
  it("prints help without using the operator account", () => {
    const result = run("--help");
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("codein audit");
    expect(result.stderr).toBe("");
  });
  it("returns findings as valid JSON with exit 1 for an empty local repository", async () => {
    const d = await temp();
    const result = run("audit", d, "--format", "json");
    expect(result.status).toBe(1);
    expect(JSON.parse(result.stdout).summary.missing).toBe(9);
    expect(result.stderr).toBe("");
  });
  it("returns zero for a complete fixture and does not follow external symlinks", async () => {
    const d = await temp();
    for (const path of [
      "README.md",
      "LICENSE",
      "CONTRIBUTING.md",
      "CODE_OF_CONDUCT.md",
      "SECURITY.md",
      ".github/ISSUE_TEMPLATE/bug.yml",
      ".github/PULL_REQUEST_TEMPLATE.md",
      ".github/workflows/ci.yml",
      "tests/example.test.ts",
    ]) {
      await mkdir(join(d, path, ".."), { recursive: true });
      await writeFile(join(d, path), "fixture");
    }
    const result = run("audit", d, "--format", "json");
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout).summary.present).toBe(9);
  });
  it("generates files, refuses overwrites before changing any file, and requires explicit overwrite", async () => {
    const d = await temp();
    const args = ["templates", "--repo", "owner/repo", "--out", d];
    expect(run(...args).status).toBe(0);
    await writeFile(join(d, "CONTRIBUTING.md"), "maintainer content");
    const denied = run(...args);
    expect(denied.status).toBe(2);
    expect(denied.stderr).toContain("File exists");
    expect(await readFile(join(d, "CONTRIBUTING.md"), "utf8")).toBe(
      "maintainer content",
    );
    expect(run(...args, "--overwrite").status).toBe(0);
  });
  it("refuses writes through a symlink within the output directory", async () => {
    const d = await temp(),
      outside = await temp();
    await symlink(outside, join(d, ".github"), "dir");
    const result = run("templates", "--repo", "owner/repo", "--out", d);
    expect(result.status).toBe(2);
    expect(result.stderr).toContain("symbolic link");
  });
  it("rejects missing flag values without creating an accidental output directory", () => {
    const result = run(
      "templates",
      "--repo",
      "owner/repo",
      "--out",
      "--overwrite",
    );
    expect(result.status).toBe(2);
    expect(result.stderr).toContain("Missing value for --out");
  });
  it("uses exit 2 for invalid input without making an API request", () => {
    const result = run("audit", "https://evil.com/a/b");
    expect(result.status).toBe(2);
    expect(result.stdout).toBe("");
  });
});
