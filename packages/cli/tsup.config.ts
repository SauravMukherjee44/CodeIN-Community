import { defineConfig } from "tsup";
export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node24",
  clean: true,
  noExternal: [/^@codein-community\/toolkit(?:\/.*)?$/],
});
