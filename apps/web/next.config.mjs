import createMDX from "@next/mdx";
const redirects = [
  ["/index.html", "/"],
  ["/benefit.html", "/community#benefits"],
  ["/opportunity.html", "/resources#opportunities"],
  ["/blog.html", "/resources#articles"],
  ["/open-source-contributions.html", "/contribute"],
  ["/teamMembers.html", "/heritage#team"],
  ["/100daysofcode.html", "/events/100-days-of-code"],
  ["/giveaway.html", "/events/giveaway"],
  ["/hacktoberfest2022.html", "/events/hacktoberfest-2022"],
  ["/Privacy%20Policy%20Page/policy.html", "/privacy"],
  ["/preloader/index.html", "/heritage"],
];
export default createMDX()({
  pageExtensions: ["ts", "tsx", "mdx"],
  transpilePackages: ["@codein-community/toolkit"],
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  async redirects() {
    return redirects.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
});
