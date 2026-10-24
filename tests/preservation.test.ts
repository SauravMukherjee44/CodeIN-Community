import { it, expect } from "vitest";
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
