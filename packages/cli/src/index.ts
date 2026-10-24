#!/usr/bin/env node
import {
  readdir,
  readFile,
  mkdir,
  writeFile,
  lstat,
  realpath,
} from "node:fs/promises";
import { resolve, join, relative, dirname } from "node:path";
import {
  auditRepository,
  auditMarkdown,
  generateContributionFiles,
  createCredits,
  creditsMarkdown,
  type RepositorySnapshot,
} from "@codein-community/toolkit";
import {
  fetchRepository,
  fetchContributors,
} from "@codein-community/toolkit/github";
const args = process.argv.slice(2);
const value = (flag: string) => {
  const i = args.indexOf(flag);
  if (i >= 0 && (!args[i + 1] || args[i + 1].startsWith("--")))
    throw new Error("Missing value for " + flag);
  return i >= 0 ? args[i + 1] : undefined;
};
const help = `CodeIN Community maintainer toolkit\n\ncodein audit <directory|owner/repo|GitHub URL> [--format text|json|markdown]\ncodein templates --repo owner/repo --out directory [--branch main] [--install "pnpm install"] [--test "pnpm test"] [--lint "pnpm lint"] [--overwrite]\ncodein credits <owner/repo|GitHub URL> [--format markdown|json] [--order alphabetical|contributions] [--exclude-bots]\n\nAudit exits: 0 = all checks present; 1 = missing/unknown findings; 2 = invalid input or execution error.\nOnly public GitHub repositories are supported. GITHUB_TOKEN is optional and must only have read access.\n`;
async function localSnapshot(path: string): Promise<RepositorySnapshot> {
  const root = await realpath(path);
  if (!(await lstat(root)).isDirectory())
    throw new Error("Audit input must be a directory.");
  const files: string[] = [];
  let incomplete = false;
  async function walk(dir: string, depth: number) {
    if (depth > 16 || files.length >= 20000) {
      incomplete = true;
      return;
    }
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      if (files.length >= 20000) {
        incomplete = true;
        break;
      }
      if (
        [
          ".git",
          "node_modules",
          ".next",
          "dist",
          "legacy",
          ".netlify",
        ].includes(entry.name)
      )
        continue;
      const absolute = join(dir, entry.name);
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) await walk(absolute, depth + 1);
      else files.push(relative(root, absolute).replaceAll("\\", "/"));
    }
  }
  await walk(root, 0);
  const fileContents: Record<string, string> = {};
  if (files.includes("package.json"))
    fileContents["package.json"] = (
      await readFile(join(root, "package.json"), "utf8")
    ).slice(0, 100000);
  return { repository: root, files, fileContents, incomplete };
}
async function main() {
  if (!args.length || args.includes("--help") || args[0] === "help") {
    console.log(help);
    return;
  }
  const command = args[0],
    input = args[1],
    format = value("--format");
  const options = { token: process.env.GITHUB_TOKEN };
  if (command === "audit") {
    if (!input || input.startsWith("--"))
      throw new Error("Specify a directory or public repository.");
    if (format && !["text", "json", "markdown"].includes(format))
      throw new Error("Format must be text, json, or markdown.");
    let local = false;
    try {
      await lstat(resolve(input));
      local = true;
    } catch {
      /* Nonexistent paths are validated as repository identifiers. */
    }
    const snapshot = local
      ? await localSnapshot(resolve(input))
      : await fetchRepository(input, options);
    const report = auditRepository(snapshot);
    console.log(
      format === "json"
        ? JSON.stringify(report, null, 2)
        : auditMarkdown(report),
    );
    if (report.summary.missing || report.summary.unknown) process.exitCode = 1;
  } else if (command === "templates") {
    const repo = value("--repo"),
      out = value("--out");
    if (!repo || !out)
      throw new Error(
        "Templates require --repo owner/repo and --out directory.",
      );
    const files = generateContributionFiles({
      repository: repo,
      defaultBranch: value("--branch") ?? "main",
      installCommand: value("--install") ?? "pnpm install",
      testCommand: value("--test") ?? "pnpm test",
      lintCommand: value("--lint") ?? "pnpm lint",
    });
    const root = resolve(out);
    await mkdir(root, { recursive: true });
    const actual = await realpath(root);
    for (const file of files) {
      let current = actual;
      const segments = file.path.split("/");
      for (const segment of segments) {
        current = join(current, segment);
        try {
          const stat = await lstat(current);
          if (stat.isSymbolicLink())
            throw new Error(
              "Refusing to write through a symbolic link: " + file.path,
            );
          if (
            current === join(actual, file.path) &&
            !args.includes("--overwrite")
          )
            throw new Error(
              "File exists: " + file.path + ". Use --overwrite to replace it.",
            );
        } catch (e) {
          if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
        }
      }
    }
    for (const file of files) {
      const dest = join(actual, file.path);
      await mkdir(dirname(dest), { recursive: true });
      await writeFile(dest, file.content, {
        flag: args.includes("--overwrite") ? "w" : "wx",
      });
      console.log("Created " + file.path);
    }
  } else if (command === "credits") {
    if (!input || input.startsWith("--"))
      throw new Error("Specify a public repository.");
    if (format && !["markdown", "json"].includes(format))
      throw new Error("Credits format must be markdown or json.");
    const order = value("--order") ?? "contributions";
    if (!["alphabetical", "contributions"].includes(order))
      throw new Error("Order must be alphabetical or contributions.");
    const result = await fetchContributors(input, options);
    const doc = createCredits(result.repository, result.contributors, {
      includeBots: !args.includes("--exclude-bots"),
      order: order as "alphabetical" | "contributions",
      incomplete: result.incomplete,
    });
    console.log(
      format === "json" ? JSON.stringify(doc, null, 2) : creditsMarkdown(doc),
    );
    if (result.incomplete) {
      console.error(
        "Partial contributor list: GitHub could not supply every page.",
      );
      process.exitCode = 1;
    }
  } else throw new Error("Unknown command. Run codein --help.");
}
main().catch((error) => {
  console.error(error instanceof Error ? error.message : "The command failed.");
  process.exitCode = 2;
});
