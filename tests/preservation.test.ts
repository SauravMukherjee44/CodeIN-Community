import { it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { mergeContributorBaseline } from "../packages/toolkit/src/index";
it("retains all 150 baseline contributor identities across refresh failures", async () => {
  const baseline = JSON.parse(
    await readFile("apps/web/src/data/contributors.json", "utf8"),
  );
  expect(baseline.contributors).toHaveLength(150);
  expect(
    new Set(baseline.contributors.map((c: { id: number }) => c.id)).size,
  ).toBe(150);
  expect(mergeContributorBaseline(baseline.contributors, [])).toEqual(
    baseline.contributors,
  );
});
it("preserves 44 historical team records separately from current maintainer status", async () => {
  const team = JSON.parse(
    await readFile("apps/web/src/data/historical-team.json", "utf8"),
  );
  expect(team).toHaveLength(44);
  expect(team.map((p: { name: string }) => p.name)).toContain("David Leal");
});

it("retains the original ancestry and the full dated repository history", async () => {
  const history = JSON.parse(
    await readFile("docs/repository-history.json", "utf8"),
  );
  const commit = execFileSync(
    "git",
    ["rev-parse", history.sourceTag + "^{commit}"],
    { encoding: "utf8" },
  ).trim();
  expect(commit).toBe(history.sourceCommit);
  expect(
    Number(
      execFileSync("git", ["rev-list", "--count", history.sourceTag], {
        encoding: "utf8",
      }).trim(),
    ),
  ).toBe(928);
  execFileSync("git", [
    "merge-base",
    "--is-ancestor",
    history.sourceCommit,
    "HEAD",
  ]);
  const dates = execFileSync(
    "git",
    ["log", history.sourceTag, "--format=%ad", "--date=format:%Y"],
    { encoding: "utf8" },
  )
    .trim()
    .split("\n");
  const counts: Record<string, number> = {};
  for (const year of dates) counts[year] = (counts[year] ?? 0) + 1;
  expect(counts).toEqual(history.commitsByAuthorYear);
  expect(history.firstAuthorDate).toBe("2021-09-28");
});
it("keeps README screenshots, original partner badges, and all 150 contributor avatars available", async () => {
  for (const file of [
    "docs/images/website.png",
    "docs/images/developer-tools.png",
    "docs/images/repository-history.svg",
    "apps/web/public/images/netlify-badge.svg",
  ])
    expect((await readFile(file)).length).toBeGreaterThan(100);
  const wall = await readFile("docs/images/contributors.svg", "utf8");
  expect(wall.match(/<image[\s>]/g)).toHaveLength(150);
});
