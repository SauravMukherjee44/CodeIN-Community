import {
  parseRepository,
  type RepositorySnapshot,
  type Contributor,
} from "./index";
export class GitHubError extends Error {
  constructor(
    message: string,
    public kind:
      | "rate-limit"
      | "not-found"
      | "unavailable"
      | "invalid" = "unavailable",
  ) {
    super(message);
    this.name = "GitHubError";
  }
}
export interface GitHubOptions {
  token?: string;
  fetcher?: typeof fetch;
}
interface Metadata {
  private: boolean;
  default_branch: string;
  full_name: string;
}
async function read<T>(path: string, options: GitHubOptions): Promise<T> {
  const response = await (options.fetcher ?? fetch)(
    "https://api.github.com" + path,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2026-03-10",
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      },
      signal: AbortSignal.timeout(12000),
      redirect: "error",
    },
  );
  if (!response.ok) {
    if (response.status === 404)
      throw new GitHubError(
        "Public repository not found. Check the name and visibility.",
        "not-found",
      );
    if (
      response.status === 429 ||
      (response.status === 403 &&
        response.headers.get("x-ratelimit-remaining") === "0")
    )
      throw new GitHubError(
        "GitHub rate limit reached. Please try again after the limit resets.",
        "rate-limit",
      );
    throw new GitHubError(
      "GitHub is temporarily unavailable. Please try again.",
    );
  }
  return response.json() as Promise<T>;
}
async function metadata(
  input: string,
  options: GitHubOptions,
): Promise<{ path: string; meta: Metadata }> {
  const { owner, repo } = parseRepository(input);
  const path =
    "/repos/" + encodeURIComponent(owner) + "/" + encodeURIComponent(repo);
  const meta = await read<Metadata>(path, options);
  if (meta.private)
    throw new GitHubError(
      "Only public repositories are supported.",
      "not-found",
    );
  return { path, meta };
}
export async function fetchRepository(
  input: string,
  options: GitHubOptions = {},
): Promise<RepositorySnapshot> {
  const { path, meta } = await metadata(input, options);
  const tree = await read<{
    tree: { path: string; type: string }[];
    truncated: boolean;
  }>(
    path +
      "/git/trees/" +
      encodeURIComponent(meta.default_branch) +
      "?recursive=1",
    options,
  );
  const files = tree.tree.filter((x) => x.type === "blob").map((x) => x.path);
  const fileContents: Record<string, string> = {};
  let incomplete = tree.truncated;
  if (files.includes("package.json")) {
    try {
      const blob = await read<{ content: string; encoding: string }>(
        path +
          "/contents/package.json?ref=" +
          encodeURIComponent(meta.default_branch),
        options,
      );
      if (blob.encoding === "base64" && blob.content.length < 150000)
        fileContents["package.json"] = new TextDecoder().decode(
          Uint8Array.from(atob(blob.content.replace(/\s/g, "")), (c) =>
            c.charCodeAt(0),
          ),
        );
      else incomplete = true;
    } catch {
      incomplete = true;
    }
  }
  return { repository: meta.full_name, files, fileContents, incomplete };
}
export async function fetchContributors(
  input: string,
  options: GitHubOptions = {},
): Promise<{
  repository: string;
  contributors: Contributor[];
  incomplete: boolean;
}> {
  const { path, meta } = await metadata(input, options);
  const contributors: Contributor[] = [];
  for (let page = 1; page <= 50; page++) {
    try {
      const batch = await read<Contributor[]>(
        path + "/contributors?per_page=100&page=" + page,
        options,
      );
      contributors.push(...batch);
      if (batch.length < 100)
        return { repository: meta.full_name, contributors, incomplete: false };
    } catch (error) {
      if (!contributors.length) throw error;
      return { repository: meta.full_name, contributors, incomplete: true };
    }
  }
  return { repository: meta.full_name, contributors, incomplete: true };
}
