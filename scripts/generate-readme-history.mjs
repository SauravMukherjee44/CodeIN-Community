import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
const sourceTag = "legacy-website-2026-10-24";
const dates = execFileSync(
  "git",
  ["log", sourceTag, "--format=%ad", "--date=format:%Y-%m-%d"],
  { encoding: "utf8" },
)
  .trim()
  .split("\n");
const counts = new Map();
for (const date of dates) {
  const year = date.slice(0, 4);
  counts.set(year, (counts.get(year) ?? 0) + 1);
}
const entries = [...counts].sort(([a], [b]) => a.localeCompare(b));
const max = Math.max(...counts.values());
const contributors = JSON.parse(
  await readFile("apps/web/src/data/contributors.json", "utf8"),
).contributors.length;
const data = {
  sourceTag,
  sourceCommit: execFileSync("git", ["rev-parse", sourceTag + "^{commit}"], {
    encoding: "utf8",
  }).trim(),
  originalCommits: dates.length,
  contributorBaseline: contributors,
  firstAuthorDate: [...dates].sort()[0],
  lastAuthorDate: [...dates].sort().at(-1),
  commitsByAuthorYear: Object.fromEntries(entries),
};
await mkdir("docs/images", { recursive: true });
await writeFile(
  "docs/repository-history.json",
  JSON.stringify(data, null, 2) + "\n",
);
const bars = entries
  .map(([year, count], i) => {
    const x = 80 + i * 135,
      h = Math.max(4, Math.round((count / max) * 170));
    return `<g><rect x="${x}" y="${260 - h}" width="80" height="${h}" rx="4" fill="${year === "2022" ? "#e7af00" : "#315541"}"/><text x="${x + 40}" y="${248 - h}" text-anchor="middle" fill="#273b30" font-size="16" font-weight="700">${count}</text><text x="${x + 40}" y="286" text-anchor="middle" fill="#526359" font-size="14">${year}</text></g>`;
  })
  .join("");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 350" role="img" aria-labelledby="title desc"><title id="title">CodeIN repository history since 2021</title><desc id="desc">${dates.length} original commits, counted by author date: ${entries.map(([y, n]) => y + ": " + n).join(", ")}. Original authors and timestamps are preserved.</desc><rect width="960" height="350" rx="16" fill="#f7f5ec"/><g font-family="Arial, sans-serif"><text x="40" y="40" fill="#22382b" font-size="23" font-weight="700">Built in the open, since 2021.</text><text x="40" y="65" fill="#526359" font-size="13">${dates.length} original commits · ${contributors} preserved GitHub contributor identities</text><path d="M60 260H900" stroke="#d7ddd5"/>${bars}<text x="40" y="325" fill="#526359" font-size="11">Pre-migration history · original author dates · source tag: ${sourceTag}</text></g></svg>\n`;
await writeFile("docs/images/repository-history.svg", svg);
console.log(
  `Generated history chart from ${dates.length} original commits (${data.firstAuthorDate} to ${data.lastAuthorDate}).`,
);
