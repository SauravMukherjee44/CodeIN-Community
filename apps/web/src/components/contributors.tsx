"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  mergeContributorBaseline,
  type Contributor,
} from "@codein-community/toolkit";
import snapshot from "@/data/contributors.json";
import { community } from "@/lib/community";
export function Contributors() {
  const [contributors, setContributors] = useState<Contributor[]>(
    snapshot.contributors,
  );
  const [query, setQuery] = useState("");
  const [state, setState] = useState(
    "Showing our preserved contributor baseline.",
  );
  useEffect(() => {
    const controller = new AbortController();
    fetch(
      "/api/github?" +
        new URLSearchParams({
          kind: "credits",
          repository: community.repository,
        }),
      { signal: controller.signal },
    )
      .then(async (r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((result) => {
        if (!result.data.incomplete) {
          setContributors(
            mergeContributorBaseline(
              snapshot.contributors,
              result.data.contributors,
            ),
          );
          setState(
            result.stale
              ? "Cached contributor data; all original credits retained."
              : "Updated from GitHub; all original credits retained.",
          );
        } else
          setState(
            "GitHub returned a partial list. Our complete baseline is still displayed.",
          );
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setState(
            "GitHub is unavailable. Our complete baseline is still displayed.",
          );
      });
    return () => controller.abort();
  }, []);
  const filtered = contributors.filter((c) =>
    c.login.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <div className="contributor-toolbar">
        <label className="field-label">
          Find a contributor
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search GitHub usernames"
            type="search"
          />
        </label>
        <p className="pagination-note" role="status">
          {filtered.length} of {contributors.length} contributors · {state}
        </p>
      </div>
      <div className="contributor-grid">
        {filtered.map((c) => (
          <a
            className="contributor-card"
            href={c.html_url}
            key={c.id}
            target="_blank"
            rel="noreferrer"
          >
            <Image
              unoptimized
              src={c.avatar_url}
              alt=""
              width={60}
              height={60}
            />
            <strong>{c.login}</strong>
            <span>
              {c.type === "Bot"
                ? "Bot contributor"
                : c.contributions + " contributions"}
            </span>
          </a>
        ))}
      </div>
      {!filtered.length && (
        <p role="status">No contributors match that search.</p>
      )}
    </>
  );
}
