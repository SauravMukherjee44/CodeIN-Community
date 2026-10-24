import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
const root = resolve("."),
  dest = join(root, "artifacts");
await mkdir(dest, { recursive: true });
const checks = [];
for (const name of ["toolkit", "cli"]) {
  execFileSync("pnpm", ["pack", "--pack-destination", dest], {
    cwd: join(root, "packages", name),
    stdio: "inherit",
  });
  const file = `codein-community-${name}-0.1.0.tgz`;
  const path = join(dest, file);
  const bytes = await readFile(path);
  checks.push(createHash("sha256").update(bytes).digest("hex") + "  " + file);
}
await writeFile(join(dest, "checksums.txt"), checks.join("\n") + "\n");
console.log("Release archives and checksums are in artifacts/.");
