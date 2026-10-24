import type { IconName } from "@/components/icon";
interface ToolDefinition {
  group: "developer" | "maintainer";
  slug: string;
  number: string;
  title: string;
  short: string;
  description: string;
  command: string;
  icon: IconName;
}
export const community = {
  name: "CodeIN Community",
  repository: "SauravMukherjee44/CodeIN-Community",
  repositoryUrl: "https://github.com/SauravMukherjee44/CodeIN-Community",
  toolProposalUrl:
    "https://github.com/SauravMukherjee44/CodeIN-Community/issues/new?template=tool.yml",
  site: "https://codeincommunity.com",
  discord: "https://discord.com/invite/sqFRzrj7f3",
  telegram: "https://t.me/CodeINCommunity",
  linkedin: "https://www.linkedin.com/company/codein-community/",
  email: "codeincommunity@gmail.com",
  youtube: "https://www.youtube.com/channel/UCjzAiV0IpFJ45UgnHnc_4ug",
};
export const tools = [
  {
    group: "maintainer",
    slug: "repository-audit",
    number: "01",
    title: "Repository readiness",
    short: "A clearer starting point.",
    description:
      "See what your repository offers contributors, find the gaps, and leave with a practical checklist.",
    command: "codein audit owner/repo",
    icon: "shield",
  },
  {
    group: "maintainer",
    slug: "contribution-templates",
    number: "02",
    title: "Contribution templates",
    short: "Make the first PR easier.",
    description:
      "Create contribution guidance, issue forms, and a PR template that fit how your project works.",
    command: "codein templates --repo owner/repo",
    icon: "file",
  },
  {
    group: "maintainer",
    slug: "contributor-credits",
    number: "03",
    title: "Contributor credits",
    short: "Give everyone their flowers.",
    description:
      "Turn your public GitHub contributor history into a shareable, exportable acknowledgement.",
    command: "codein credits owner/repo",
    icon: "people",
  },
] satisfies ToolDefinition[];
export const developerTools = [
  {
    group: "developer",
    slug: "json-formatter",
    number: "01",
    title: "JSON formatter",
    short: "Make sense of your data.",
    description:
      "Validate, format, and minify JSON with readable output and clear syntax errors.",
    command: "Format · validate · minify",
    icon: "braces",
  },
  {
    group: "developer",
    slug: "base64",
    number: "02",
    title: "Base64 converter",
    short: "Text in. Encoded text out.",
    description:
      "Encode and decode UTF-8 text, including emoji and multilingual content.",
    command: "UTF-8 · encode · decode",
    icon: "code",
  },
  {
    group: "developer",
    slug: "url-inspector",
    number: "03",
    title: "URL & query inspector",
    short: "Untangle that URL.",
    description:
      "Inspect URL components and repeated query parameters, or encode and decode text.",
    command: "Inspect · encode · decode",
    icon: "link",
  },
] as const satisfies readonly ToolDefinition[];
export const allTools = [...developerTools, ...tools];
export type DeveloperToolKind = (typeof developerTools)[number]["slug"];
export const communityMilestones = [
  { value: "15,000+", label: "Community members", icon: "people" },
  { value: "45+", label: "Events hosted", icon: "calendar" },
  { value: "300+", label: "Opportunities shared", icon: "rocket" },
] as const;
export const sponsors = [
  {
    name: "GeeksforGeeks",
    image: "/images/sponsors/geeks.webp",
    url: "https://www.geeksforgeeks.org/",
  },
  {
    name: "Azure Developer Community",
    image: "/images/sponsors/azure.webp",
    url: "https://www.azdev.community/",
  },
  {
    name: "Give My Certificate",
    image: "/images/sponsors/gmc.webp",
    url: "https://givemycertificate.com/",
  },
  {
    name: "Newton School",
    image: "/images/sponsors/newton.png",
    url: "https://www.newtonschool.co/",
  },
  {
    name: "Coding Minutes",
    image: "/images/sponsors/coding-minutes.png",
    url: "https://www.codingminutes.com/",
  },
] as const;
export const events = [
  {
    slug: "full-stack-development",
    title: "Full Stack Development",
    date: "2022-01-15",
    speaker: "Praveen Kumar Purushothaman & Ashtja Prasad",
    url: "https://youtu.be/7aS6ru6Omts",
    image: "/images/event-web.webp",
  },
  {
    slug: "machine-learning",
    title: "Get Started With Machine Learning",
    date: "2021-09-21",
    speaker: "Saurav Mukherjee",
    url: "https://youtu.be/lUSixxX9pK4",
    image: "/images/event-ml.webp",
  },
  {
    slug: "crowdsource",
    title: "Google CrowdSource Contributions",
    date: "2021-12-30",
    speaker: "Sowmya V & Saurav Mukherjee",
    url: null,
    image: "/images/event-crowdsource.webp",
  },
  {
    slug: "hacktoberfest-2021",
    title: "Introduction to Hacktoberfest 2021",
    date: "2021-10-11",
    speaker: "Praveen Kumar Purushothaman",
    url: "https://youtu.be/fmDYVtInswU",
    image: "/images/event-hacktoberfest.webp",
  },
];
export const programs = [
  {
    slug: "100-days-of-code",
    title: "100 Days of Code",
    image: "/images/programs/100-days-of-code.png",
    date: "Started July 2022",
    description:
      "A community challenge to learn consistently and build in public. Original winners and recognition remain in the source archive.",
    url: "https://youtu.be/pio5kkDFNi8",
    source: "100daysofcode.html",
  },
  {
    slug: "winter-fest",
    title: "Winter Fest 2022",
    image: "/images/programs/winter-fest.webp",
    date: "February 19, 2022",
    description:
      "A day of sessions and community learning. Revisit the recording and the people who made it possible.",
    url: "https://youtu.be/aY39biCqcZU",
    source: "opportunity.html",
  },
  {
    slug: "spark-a-thon",
    title: "Spark-a-thon",
    image: "/images/programs/spark-a-thon.webp",
    date: "Historical program",
    description:
      "An augmented-reality hackathon built around learning, experimentation, and community.",
    url: "https://youtu.be/ricDQbQ_mYc",
    source: "opportunity.html",
  },
  {
    slug: "hacktoberfest-2022",
    title: "Hacktoberfest 2022",
    date: "October 2022",
    description:
      "Our historical open-source project and contribution archive. The original project listings remain available.",
    url: null,
    source: "hacktoberfest2022.html",
  },
  {
    slug: "giveaway",
    title: "Community giveaway winners",
    date: "February 2024",
    description:
      "Preserving the original community winner announcements and recognition.",
    url: null,
    source: "giveaway.html",
  },
];

export const featuredPrograms = programs.filter(
  (program): program is (typeof programs)[number] & { image: string } =>
    typeof program.image === "string",
);
