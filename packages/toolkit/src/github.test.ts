import { describe, it, expect, vi } from "vitest";
import { fetchContributors, fetchRepository } from "./github";
const response = (
  value: unknown,
  status = 200,
  headers?: Record<string, string>,
) => new Response(JSON.stringify(value), { status, headers });
const metadata = {
  full_name: "owner/repo",
  private: false,
  default_branch: "feature/main",
};
const person = (id: number) => ({
  id,
  login: "user" + id,
  html_url: "https://github.com/user" + id,
  avatar_url: "https://avatars.githubusercontent.com/u/" + id,
  type: "User",
  contributions: 1,
});
describe("public GitHub adapter", () => {
  it("fetches all contributor pages including a second page beyond the default thirty", async () => {
    const f = vi
      .fn()
      .mockResolvedValueOnce(response(metadata))
      .mockResolvedValueOnce(
        response(Array.from({ length: 100 }, (_, i) => person(i + 1))),
      )
      .mockResolvedValueOnce(
        response(Array.from({ length: 50 }, (_, i) => person(i + 101))),
      );
    const result = await fetchContributors("owner/repo", { fetcher: f });
    expect(result.contributors).toHaveLength(150);
    expect(result.incomplete).toBe(false);
    expect(f.mock.calls[2][0]).toBe(
      "https://api.github.com/repos/owner/repo/contributors?per_page=100&page=2",
    );
  });
  it("labels partial results when a subsequent page fails", async () => {
    const f = vi
      .fn()
      .mockResolvedValueOnce(response(metadata))
      .mockResolvedValueOnce(
        response(Array.from({ length: 100 }, (_, i) => person(i))),
      )
      .mockResolvedValueOnce(response({}, 429));
    expect(
      (await fetchContributors("owner/repo", { fetcher: f })).incomplete,
    ).toBe(true);
  });
  it("surfaces an initial rate limit and does not turn it into an empty list", async () => {
    const f = vi
      .fn()
      .mockResolvedValue(response({}, 403, { "x-ratelimit-remaining": "0" }));
    await expect(
      fetchContributors("owner/repo", { fetcher: f }),
    ).rejects.toMatchObject({ kind: "rate-limit" });
  });
  it("refuses private repositories before reading their contents", async () => {
    const f = vi
      .fn()
      .mockResolvedValue(response({ ...metadata, private: true }));
    await expect(
      fetchRepository("owner/repo", { fetcher: f }),
    ).rejects.toMatchObject({ kind: "not-found" });
    expect(f).toHaveBeenCalledTimes(1);
  });
  it("encodes branch refs, marks a truncated tree incomplete, and reads no repository code", async () => {
    const f = vi
      .fn()
      .mockResolvedValueOnce(response(metadata))
      .mockResolvedValueOnce(
        response({
          tree: [
            { path: "README.md", type: "blob" },
            { path: "tests", type: "tree" },
          ],
          truncated: true,
        }),
      );
    const result = await fetchRepository("owner/repo", { fetcher: f });
    expect(result.files).toEqual(["README.md"]);
    expect(result.incomplete).toBe(true);
    expect(f.mock.calls[1][0]).toContain(
      "/git/trees/feature%2Fmain?recursive=1",
    );
    expect(f).toHaveBeenCalledTimes(2);
  });
  it("retains evidence but marks unreadable manifest results unknown", async () => {
    const f = vi
      .fn()
      .mockResolvedValueOnce(response(metadata))
      .mockResolvedValueOnce(
        response({
          tree: [{ path: "package.json", type: "blob" }],
          truncated: false,
        }),
      )
      .mockResolvedValueOnce(response({}, 503));
    const result = await fetchRepository("owner/repo", { fetcher: f });
    expect(result.incomplete).toBe(true);
    expect(result.files).toEqual(["package.json"]);
  });
  it("rejects arbitrary hosts before any fetch", async () => {
    const f = vi.fn();
    await expect(
      fetchRepository("https://evil.com/a/b", { fetcher: f }),
    ).rejects.toThrow();
    expect(f).not.toHaveBeenCalled();
  });
});
