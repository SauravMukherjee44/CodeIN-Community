import { NextRequest, NextResponse } from "next/server";
import {
  fetchRepository,
  fetchContributors,
  GitHubError,
} from "@codein-community/toolkit/github";
import { parseRepository } from "@codein-community/toolkit";
export const runtime = "nodejs";
const cache = new Map<string, { data: unknown; at: number }>();
export async function GET(request: NextRequest) {
  const kind = request.nextUrl.searchParams.get("kind");
  let repo: string;
  try {
    repo = parseRepository(
      request.nextUrl.searchParams.get("repository") ?? "",
    ).fullName;
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
  if (kind !== "audit" && kind !== "credits")
    return NextResponse.json(
      { error: "Choose audit or credits." },
      { status: 400 },
    );
  const key = kind + ":" + repo.toLowerCase(),
    previous = cache.get(key);
  if (previous && Date.now() - previous.at < 3600000)
    return NextResponse.json({ data: previous.data, cached: true });
  try {
    const options = { token: process.env.CODEIN_GITHUB_TOKEN };
    const data = await (kind === "audit"
      ? fetchRepository(repo, options)
      : fetchContributors(repo, options));
    if (!data.incomplete) {
      if (cache.size >= 100) cache.delete(cache.keys().next().value!);
      cache.set(key, { data, at: Date.now() });
    }
    return NextResponse.json({ data, cached: false });
  } catch (error) {
    if (previous && Date.now() - previous.at < 86400000)
      return NextResponse.json({
        data: previous.data,
        cached: true,
        stale: true,
      });
    const known = error instanceof GitHubError;
    return NextResponse.json(
      {
        error: known
          ? error.message
          : "GitHub could not be reached. Please try again.",
        kind: known ? error.kind : "unavailable",
      },
      {
        status:
          known && error.kind === "not-found"
            ? 404
            : known && error.kind === "rate-limit"
              ? 429
              : 503,
      },
    );
  }
}
