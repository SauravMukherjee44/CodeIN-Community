import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";
test("tool directory exposes all six working tools in clear groups", async ({
  page,
}) => {
  await page.goto("/tools");
  await expect(page.locator("#developer-tools .tool-card")).toHaveCount(3);
  await expect(page.locator("#maintainer-tools .tool-card")).toHaveCount(3);
  await page.getByRole("link", { name: /JSON formatter/ }).click();
  await expect(page).toHaveURL(/\/tools\/json-formatter$/);
});
test("JSON formatter validates, preserves large numeric literals, minifies and downloads", async ({
  page,
}) => {
  const sent: string[] = [];
  page.on("request", (r) => {
    if (r.url().includes("/api/")) sent.push(r.url());
  });
  await page.goto("/tools/json-formatter");
  const input = page.getByLabel("JSON input");
  await input.fill('{"id":9007199254740993,"tags":["React","TypeScript"]}');
  await page.getByRole("button", { name: "Format JSON" }).click();
  await expect(page.getByLabel("Formatted JSON")).toHaveValue(
    /9007199254740993/,
  );
  await page.getByLabel("Operation").selectOption("compact");
  await page.getByRole("button", { name: "Minify JSON" }).click();
  await expect(page.getByLabel("Formatted JSON")).toHaveValue(
    '{"id":9007199254740993,"tags":["React","TypeScript"]}',
  );
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download JSON" }).click();
  expect(await readFile((await (await download).path())!, "utf8")).toContain(
    "9007199254740993",
  );
  await input.fill("{broken");
  await page.getByRole("button", { name: "Minify JSON" }).click();
  await expect(page.locator(".developer-input [role=alert]")).toContainText(
    "Invalid JSON",
  );
  await expect(page.getByLabel("Formatted JSON")).toHaveCount(0);
  expect(sent).toEqual([]);
});
test("Base64 converter round trips Unicode and rejects malformed input", async ({
  page,
}) => {
  await page.goto("/tools/base64");
  const input = page.getByLabel("Text or Base64 input");
  const text = "नमस्ते CodeIN 👋";
  await input.fill(text);
  await page.getByRole("button", { name: "Encode text" }).click();
  const encoded = await page.getByLabel("Converted text").inputValue();
  await page.getByLabel("Operation").selectOption("decode");
  await input.fill(encoded);
  await page.getByRole("button", { name: "Decode Base64" }).click();
  await expect(page.getByLabel("Converted text")).toHaveValue(text);
  await input.fill("invalid%%%");
  await page.getByRole("button", { name: "Decode Base64" }).click();
  await expect(page.locator(".developer-input [role=alert]")).toContainText(
    "valid standard Base64",
  );
});
test("URL inspector keeps duplicate parameters and supports percent encoding without navigation", async ({
  page,
}) => {
  await page.goto("/tools/url-inspector");
  const input = page.getByLabel("URL or text input");
  await input.fill(
    "https://example.com:8443/path?tag=react&tag=next&q=hello+world#top",
  );
  await page.getByRole("button", { name: "Inspect URL", exact: true }).click();
  await expect(page.locator(".url-details tbody tr")).toHaveCount(3);
  await expect(page.locator(".url-details")).toContainText("hello world");
  await expect(page.locator(".url-details")).toContainText("8443");
  await page.getByLabel("Operation").selectOption("encode");
  await input.fill("a+b/👋");
  await page
    .getByRole("button", { name: "Encode component", exact: true })
    .click();
  await expect(page.getByLabel("Converted text")).toHaveValue(
    "a%2Bb%2F%F0%9F%91%8B",
  );
  await page.getByLabel("Operation").selectOption("decode");
  await input.fill("%E0%A4");
  await page
    .getByRole("button", { name: "Decode component", exact: true })
    .click();
  await expect(page.locator(".developer-input [role=alert]")).toContainText(
    "Invalid percent",
  );
});
for (const width of [320, 390, 768, 1024, 1280, 1440, 1920])
  test(`homepage layout keeps contribution panels and complete posters within bounds at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const terminal = await page.locator(".terminal").boundingBox();
    const copy = await page
      .locator(".contribution-section > div")
      .last()
      .boundingBox();
    expect(terminal).not.toBeNull();
    expect(copy).not.toBeNull();
    if (width > 900) {
      expect(terminal!.x + terminal!.width).toBeLessThan(copy!.x);
      expect(
        Math.abs(
          terminal!.y + terminal!.height / 2 - (copy!.y + copy!.height / 2),
        ),
      ).toBeLessThan(8);
    } else expect(copy!.y + copy!.height).toBeLessThan(terminal!.y);
    for (const selector of [
      ".contribution-section",
      ".tool-card",
      ".event-card",
      ".sponsor-logo",
    ])
      for (const box of await page.locator(selector).evaluateAll((elements) =>
        elements.map((el) => {
          const r = el.getBoundingClientRect();
          return { left: r.left, right: r.right };
        }),
      )) {
        expect(box.left, selector).toBeGreaterThanOrEqual(-1);
        expect(box.right, selector).toBeLessThanOrEqual(width + 1);
      }
    const gap = await page.evaluate(() => {
      const footer = document
        .querySelector(".site-footer")!
        .getBoundingClientRect();
      const buttons = [
        ...document.querySelectorAll(".join-section .actions a"),
      ].map((el) => el.getBoundingClientRect().bottom);
      return footer.top - Math.max(...buttons);
    });
    expect(
      gap,
      "Joining buttons need visible breathing room above the footer",
    ).toBeGreaterThanOrEqual(60);
    await expect(page.locator(".event-artwork img")).toHaveCount(3);
    for (const image of await page.locator(".event-artwork img").all())
      expect(await image.evaluate((el) => getComputedStyle(el).objectFit)).toBe(
        "contain",
      );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
test("original community milestones and every sponsor logo remain visible on the homepage", async ({
  page,
}) => {
  await page.goto("/");
  for (const value of ["15,000+", "45+", "300+"])
    await expect(
      page.locator(".community-numbers").getByText(value, { exact: true }),
    ).toBeVisible();
  await expect(page.locator(".sponsor-logo")).toHaveCount(5);
  for (const image of await page.locator(".sponsor-logo img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect(image).toBeVisible();
    await expect
      .poll(() => image.evaluate((el) => (el as HTMLImageElement).naturalWidth))
      .toBeGreaterThan(0);
  }
});
for (const theme of ["light", "dark"])
  for (const path of [
    "/tools",
    "/tools/json-formatter",
    "/tools/base64",
    "/tools/url-inspector",
  ])
    test(`${theme} accessibility for ${path}`, async ({ page }) => {
      await page.addInitScript(
        (theme) => localStorage.setItem("codein-theme", theme),
        theme,
      );
      await page.goto(path);
      if (path !== "/tools") {
        await page.getByRole("button", { name: "Use example" }).click();
        await page.locator("button[type=submit]").click();
      }
      const result = await new AxeBuilder({ page }).analyze();
      expect(
        result.violations.filter(
          (v) => v.impact === "serious" || v.impact === "critical",
        ),
      ).toEqual([]);
    });
test("official Netlify community-partner badge remains visible and links from the footer", async ({
  page,
  request,
}) => {
  await page.goto("/");
  const badge = page.locator(".site-footer .netlify-badge");
  await badge.scrollIntoViewIfNeeded();
  await expect(badge).toBeVisible();
  await expect(badge).toHaveAttribute("href", "https://www.netlify.com");
  await expect(
    badge.getByRole("img", { name: "Deploys by Netlify" }),
  ).toBeVisible();
  expect((await request.get("/images/netlify-badge.svg")).status()).toBe(200);
});

test("original 100 Days of Code, Winter Fest and Spark-a-thon banners link to their programs", async ({
  page,
}) => {
  await page.goto("/");
  const cards = page.locator("#programs .program-card");
  await expect(cards).toHaveCount(3);
  for (const title of [
    "100 Days of Code",
    "Winter Fest 2022",
    "Spark-a-thon",
  ]) {
    const image = page.getByRole("img", {
      name: "Original " + title + " community banner",
      exact: true,
    });
    await image.scrollIntoViewIfNeeded();
    await expect(image).toBeVisible();
    await expect
      .poll(() => image.evaluate((el) => (el as HTMLImageElement).naturalWidth))
      .toBeGreaterThan(0);
    expect(await image.evaluate((el) => getComputedStyle(el).objectFit)).toBe(
      "contain",
    );
  }
  await cards
    .first()
    .getByRole("link", { name: "Explore the program" })
    .click();
  await expect(
    page.getByRole("heading", { name: "100 Days of Code", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".program-detail-banner")).toBeVisible();
});
