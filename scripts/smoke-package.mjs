import { mkdtemp, mkdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import assert from "node:assert/strict";
const temp = await mkdtemp(join(tmpdir(), "codein-install-"));
try {
  execFileSync(
    "npm",
    [
      "install",
      "--prefix",
      temp,
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
      resolve("artifacts/codein-community-cli-0.1.0.tgz"),
    ],
    { stdio: "inherit" },
  );
  const bin = join(temp, "node_modules/@codein-community/cli/dist/index.js");
  assert.match(
    execFileSync(process.execPath, [bin, "--help"], { encoding: "utf8" }),
    /codein audit/,
  );
  const empty = join(temp, "empty");
  await mkdir(empty);
  const audit = spawnSync(
    process.execPath,
    [bin, "audit", empty, "--format", "json"],
    { encoding: "utf8" },
  );
  assert.equal(audit.status, 1);
  assert.equal(JSON.parse(audit.stdout).summary.missing, 9);
  const out = join(temp, "kit");
  execFileSync(
    process.execPath,
    [bin, "templates", "--repo", "example/project", "--out", out],
    { stdio: "inherit" },
  );
  assert.match(
    await readFile(join(out, "CONTRIBUTING.md"), "utf8"),
    /example\/project/,
  );
  execFileSync(
    "npm",
    [
      "install",
      "--prefix",
      temp,
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
      resolve("artifacts/codein-community-toolkit-0.1.0.tgz"),
    ],
    { stdio: "inherit" },
  );
  const module = await import(
    join(temp, "node_modules/@codein-community/toolkit/dist/index.js")
  );
  assert.equal(
    module.auditRepository({ repository: "fixture", files: [] }).summary
      .missing,
    9,
  );
  console.log(
    "Installed release archives: CLI commands and ESM library passed.",
  );
} finally {
  await rm(temp, { recursive: true, force: true });
}
