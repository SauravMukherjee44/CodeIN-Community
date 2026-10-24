import { test, expect } from "@playwright/test";

test("tool ideas reach the guided issue form from home and the catalog", async ({
  page,
}) => {
  for (const route of ["/", "/tools"]) {
    await page.goto(route);
    const submit = page.getByRole("link", { name: "Submit your own tool" });
    await expect(submit).toBeVisible();
    const destination = new URL((await submit.getAttribute("href"))!);
    expect(destination.origin).toBe("https://github.com");
    expect(destination.pathname).toBe(
      "/SauravMukherjee44/CodeIN-Community/issues/new",
    );
    expect(destination.searchParams.get("template")).toBe("tool.yml");
    await expect(
      page.getByText(/Sign in and submit to create a public issue/),
    ).toBeVisible();
    await page.setViewportSize({ width: 390, height: 844 });
    await submit.scrollIntoViewIfNeeded();
    await expect(submit).toBeInViewport();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});

test("heritage exposes immutable commits from 2021 and 2022", async ({
  page,
}) => {
  await page.goto("/heritage");
  await expect(
    page.getByRole("link", { name: "View the 2021 founding commit" }),
  ).toHaveAttribute(
    "href",
    /\/commit\/8600a7c8943d7a36e9fba696953ecd8aeacb34b2$/,
  );
  await expect(
    page.getByRole("link", { name: "View the 2022 contribution" }),
  ).toHaveAttribute(
    "href",
    /\/commit\/55f5bb3976d1c32a4b02475164cedef375eef6e3$/,
  );
});
