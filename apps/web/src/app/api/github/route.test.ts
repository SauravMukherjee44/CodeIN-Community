import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
const mock = vi.hoisted(() => ({ audit: vi.fn(), credits: vi.fn() }));
vi.mock("@codein-community/toolkit/github", () => ({
  fetchRepository: mock.audit,
  fetchContributors: mock.credits,
  GitHubError: class extends Error {
    constructor(
      message: string,
      public kind: string,
    ) {
      super(message);
    }
  },
}));
import { GitHubError } from "@codein-community/toolkit/github";
import { GET } from "./route";
const request = (repository: string, kind = "audit") =>
  new NextRequest(
    "https://codeincommunity.com/api/github?" +
      new URLSearchParams({ repository, kind }),
  );
describe("public lookup route", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-24T00:00:00Z"));
    mock.audit.mockReset();
    mock.credits.mockReset();
  });
  afterEach(() => vi.useRealTimers());
  it("validates identifiers and lookup kind before networking", async () => {
    expect((await GET(request("https://evil.com/a/b"))).status).toBe(400);
    expect((await GET(request("owner/repo", "write"))).status).toBe(400);
    expect(mock.audit).not.toHaveBeenCalled();
  });
  it("caches complete successful public results", async () => {
    mock.audit.mockResolvedValue({
      repository: "owner/cache",
      files: ["README.md"],
      incomplete: false,
    });
    await GET(request("owner/cache"));
    const response = await GET(request("owner/cache"));
    expect((await response.json()).cached).toBe(true);
    expect(mock.audit).toHaveBeenCalledTimes(1);
  });
  it("does not cache incomplete contributor pages", async () => {
    mock.credits.mockResolvedValue({
      repository: "owner/partial",
      contributors: [],
      incomplete: true,
    });
    await GET(request("owner/partial", "credits"));
    await GET(request("owner/partial", "credits"));
    expect(mock.credits).toHaveBeenCalledTimes(2);
  });
  it("serves a labelled last successful result during a temporary outage", async () => {
    mock.audit
      .mockResolvedValueOnce({
        repository: "owner/stale",
        files: [],
        incomplete: false,
      })
      .mockRejectedValue(new Error("network"));
    await GET(request("owner/stale"));
    vi.advanceTimersByTime(3600001);
    const result = await (await GET(request("owner/stale"))).json();
    expect(result.stale).toBe(true);
    expect(result.data.repository).toBe("owner/stale");
    vi.advanceTimersByTime(86400000);
    expect((await GET(request("owner/stale"))).status).toBe(503);
  });
  it("preserves rate-limit and unavailable error states", async () => {
    mock.audit
      .mockRejectedValueOnce(new GitHubError("Limit reached", "rate-limit"))
      .mockRejectedValueOnce(new Error("offline"));
    expect((await GET(request("owner/rate"))).status).toBe(429);
    expect((await GET(request("owner/offline"))).status).toBe(503);
  });
});
