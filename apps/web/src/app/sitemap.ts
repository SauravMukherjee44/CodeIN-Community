import type { MetadataRoute } from "next";
import { tools, programs, community } from "@/lib/community";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    ...[
      "community",
      "tools",
      "events",
      "resources",
      "contribute",
      "contributors",
      "heritage",
      "docs",
      "contact",
      "privacy",
    ],
    ...tools.map((t) => "tools/" + t.slug),
    ...programs.map((p) => "events/" + p.slug),
  ].map((path) => ({ url: community.site + "/" + path }));
}
