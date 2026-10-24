import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";
import { unzipSync, strFromU8 } from "fflate";
const person = (id: number, login: string, type = "User") => ({
  id,
  login,
  type,
  contributions: 10,
  html_url: "https://github.com/" + login,
  avatar_url: "https://avatars.githubusercontent.com/u/" + id,
});
test("auditor exports evidence and handles validation, rate limits and partial results", async ({
  page,
}) => {
  await page.route("**/api/github?**", (route) =>
    route.fulfill({
      json: {
        data: {
          repository: "sample/project",
          files: ["README.md", "LICENSE"],
          incomplete: true,
        },
      },
    }),
  );
  await page.goto("/tools/repository-audit");
  await page.getByLabel("GitHub repository").fill("sample/project");
  await page.getByRole("button", { name: "Check repository" }).click();
  await expect(page.getByText("2 present")).toBeVisible();
  await expect(page.getByText("7 unknown")).toBeVisible();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download JSON" }).click();
  const file = await (await download).path();
  expect(JSON.parse(await readFile(file!, "utf8")).summary.unknown).toBe(7);
  await page.route("**/api/github?**", (route) =>
    route.fulfill({
      status: 429,
      json: { error: "GitHub rate limit reached. Please try again." },
    }),
  );
  await page.getByRole("button", { name: "Check repository" }).click();
  await expect(page.locator(".tool-input [role=alert]")).toContainText(
    "rate limit",
  );
  await expect(page.getByText("Readiness report", { exact: true })).toHaveCount(
    0,
  );
});
test("template builder previews all files, rejects malformed input and downloads a valid ZIP", async ({
  page,
}) => {
  await page.goto("/tools/contribution-templates");
  await page.getByLabel("GitHub repository").fill("bad input");
  await page.getByRole("button", { name: "Generate my templates" }).click();
  await expect(page.locator(".tool-input [role=alert]")).toBeVisible();
  await page.getByLabel("GitHub repository").fill("sample/project");
  await page.getByLabel("Test command").fill("npm test");
  await page.getByRole("button", { name: "Generate my templates" }).click();
  await expect(page.getByLabel("Generated file preview")).toContainText(
    "npm test",
  );
  await page
    .getByRole("button", {
      name: ".github/ISSUE_TEMPLATE/bug.yml",
      exact: true,
    })
    .click();
  await expect(page.getByLabel("Generated file preview")).toContainText(
    "required: true",
  );
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download ZIP" }).click();
  const files = unzipSync(await readFile((await (await download).path())!));
  expect(Object.keys(files)).toHaveLength(4);
  expect(strFromU8(files["CONTRIBUTING.md"])).toContain("sample/project");
});
test("credits supports sorting, bots, safe links, partial warnings and Markdown downloads", async ({
  page,
}) => {
  await page.route("**/api/github?**", (route) =>
    route.fulfill({
      json: {
        data: {
          repository: "sample/project",
          contributors: [
            person(1, "zeta"),
            person(2, "alpha"),
            person(3, "helper[bot]", "Bot"),
          ],
          incomplete: true,
        },
      },
    }),
  );
  await page.goto("/tools/contributor-credits");
  await page.getByLabel("GitHub repository").fill("sample/project");
  await page
    .getByRole("button", { name: "Generate contributor credits" })
    .click();
  await expect(page.getByText("3 people. A shared project.")).toBeVisible();
  await expect(
    page.getByText("Partial result:", { exact: false }),
  ).toBeVisible();
  await page.getByLabel("Include bot contributors").uncheck();
  await page.getByLabel("Sort contributors").selectOption("alphabetical");
  await expect(page.locator(".credits-preview a").first()).toContainText(
    "alpha",
  );
  await expect(page.locator(".credits-preview a")).toHaveCount(2);
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download Markdown" }).click();
  expect(await readFile((await (await download).path())!, "utf8")).toContain(
    "Partial result",
  );
});
test("contributor search retains all 150 baseline identities on GitHub failure", async ({
  page,
}) => {
  await page.route("**/api/github?**", (route) =>
    route.fulfill({ status: 503, json: { error: "Unavailable" } }),
  );
  await page.goto("/contributors");
  await expect(page.locator(".contributor-card")).toHaveCount(150);
  await page.getByLabel("Find a contributor").fill("Saurav");
  await expect(page.locator(".contributor-card")).toHaveCount(1);
  await expect(page.locator(".contributor-card")).toContainText(
    "SauravMukherjee44",
  );
});
test("responsive navigation, theme persistence, keyboard skip link and no horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Tools", exact: true })
    .click();
  await expect(page).toHaveURL(/\/tools$/);
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("legacy URLs redirect permanently while unknown pages return 404", async ({
  request,
}) => {
  const routes: Record<string, string> = {
    "/index.html": "/",
    "/benefit.html": "/community#benefits",
    "/opportunity.html": "/resources#opportunities",
    "/blog.html": "/resources#articles",
    "/open-source-contributions.html": "/contribute",
    "/teamMembers.html": "/heritage#team",
    "/100daysofcode.html": "/events/100-days-of-code",
    "/giveaway.html": "/events/giveaway",
    "/hacktoberfest2022.html": "/events/hacktoberfest-2022",
    "/Privacy%20Policy%20Page/policy.html": "/privacy",
    "/preloader/index.html": "/heritage",
  };
  for (const [from, to] of Object.entries(routes)) {
    const response = await request.get(from, { maxRedirects: 0 });
    expect(response.status(), from).toBe(308);
    expect(response.headers().location, from).toBe(to);
  }
  expect((await request.get("/this-page-does-not-exist")).status()).toBe(404);
});
for (const path of [
  "/",
  "/community",
  "/tools/repository-audit",
  "/tools/contribution-templates",
  "/tools/contributor-credits",
  "/contributors",
  "/heritage",
  "/contribute",
  "/docs",
])
  test("accessibility " + path, async ({ page }) => {
    await page.route("**/api/github?**", (route) =>
      route.fulfill({ status: 503, json: { error: "Unavailable" } }),
    );
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    const result = await new AxeBuilder({ page }).analyze();
    expect(
      result.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      ),
    ).toEqual([]);
  });
for (const path of [
  "/",
  "/tools/repository-audit",
  "/tools/contribution-templates",
  "/tools/contributor-credits",
])
  test("dark theme accessibility " + path, async ({ page }) => {
    await page.addInitScript(() =>
      localStorage.setItem("codein-theme", "dark"),
    );
    await page.goto(path);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    const result = await new AxeBuilder({ page }).analyze();
    expect(
      result.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      ),
    ).toEqual([]);
  });
test("original practice tracks, tasks and saved checklist progress survive migration", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "osc_pr_checklist_v1",
      JSON.stringify({ "read-guidelines": true, "forked-repo": true }),
    ),
  );
  await page.goto("/contribute");
  await expect(page.getByRole("status")).toContainText("2 of 7");
  await expect(page.locator("#mission-tracks article")).toHaveCount(3);
  await expect(page.locator("#practice-tasks article")).toHaveCount(6);
  await page
    .getByText("View steps and repositories", { exact: true })
    .first()
    .click();
  await expect(
    page.getByText(
      "Rewrite for first-time contributors with better steps and examples.",
    ),
  ).toBeVisible();
  await page
    .getByLabel("I created a feature branch with a meaningful name.")
    .check();
  await page.reload();
  await expect(page.getByRole("status")).toContainText("3 of 7");
});
