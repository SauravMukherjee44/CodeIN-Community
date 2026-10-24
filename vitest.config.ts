import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    include: [
      "packages/**/*.test.ts",
      "apps/**/*.test.ts",
      "tests/**/*.test.ts",
    ],
    environment: "node",
  },
  resolve: {
    alias: {
      "@codein-community/toolkit/github": new URL(
        "./packages/toolkit/src/github.ts",
        import.meta.url,
      ).pathname,
      "@codein-community/toolkit": new URL(
        "./packages/toolkit/src/index.ts",
        import.meta.url,
      ).pathname,
    },
  },
});
