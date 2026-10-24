import { test, expect } from "@playwright/test";

test("every page advertises a working brand favicon and Apple touch icon", async ({
  page,
  request,
}) => {
  for (const path of ["/", "/tools", "/heritage"]) {
    await page.goto(path);
    for (const rel of ["icon", "apple-touch-icon"]) {
      const link = page.locator(`head link[rel="${rel}"]`).first();
      const href = await link.getAttribute("href");
      expect(href).toBeTruthy();
      const response = await request.get(href!);
      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toContain("image/png");
      const data = await response.body();
      expect(data.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
      expect(data.readUInt32BE(16)).toBe(500);
      expect(data.readUInt32BE(20)).toBe(500);
    }
  }
});
