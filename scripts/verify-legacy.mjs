import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
const manifest = JSON.parse(
  await readFile(new URL("../legacy/manifest.json", import.meta.url), "utf8"),
);
for (const file of manifest.files) {
  const bytes = await readFile(
    new URL("../legacy/website/" + file.path, import.meta.url),
  );
  if (createHash("sha256").update(bytes).digest("hex") !== file.sha256)
    throw new Error("Legacy file changed: " + file.path);
}
console.log(
  `Verified ${manifest.files.length} unchanged legacy files from ${manifest.sourceCommit}.`,
);
