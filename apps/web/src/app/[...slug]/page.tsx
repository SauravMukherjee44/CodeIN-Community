import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageIntro, ToolCards, Eyebrow } from "@/components/ui";
import { ToolWorkbench } from "@/components/tool-workbench";
import { Contributors } from "@/components/contributors";
import { ContributionGuide } from "@/components/contribution-guide";
import { community, events, programs, tools } from "@/lib/community";
import team from "@/data/historical-team.json";
import Docs from "@/content/docs.mdx";
const definitions: Record<string, [string, string]> = {
  community: [
    "Good company. Shared possibility.",
    "A place to ask questions, meet other developers, and make useful things together.",
  ],
  tools: [
    "Small tools. Meaningful progress.",
    "A practical workbench for open-source maintainers. Use it in your browser, terminal, or TypeScript projects.",
  ],
  events: [
    "The conversations live on.",
    "Recorded sessions and historical programs from the CodeIN community. Every event on this page is part of our archive.",
  ],
  resources: [
    "A little direction goes a long way.",
    "Learning resources and contribution pathways collected by the community.",
  ],
  contribute: [
    "Your first contribution starts here.",
    "Choose a track, learn the workflow, and turn curiosity into a focused, thoughtful change.",
  ],
  contributors: [
    "Every contribution has a name.",
    "The people who shaped CodeIN, one commit and one idea at a time. Original credits are preserved as the community grows.",
  ],
  heritage: [
    "A new chapter, with our history intact.",
    "We are building on years of community contributions. The original website, its people, and its source remain part of this project.",
  ],
  docs: [
    "From the workbench to your workflow.",
    "Install the CLI, import the library, or understand how the tools work.",
  ],
  contact: [
    "Good things start with a hello.",
    "Join the conversation, share an idea, or explore a collaboration.",
  ],
  privacy: [
    "Your data, plainly explained.",
    "How CodeIN’s community site and maintainer tools handle information.",
  ],
};
function definition(slug: string): [string, string] | undefined {
  if (slug.startsWith("tools/")) {
    const t = tools.find((t) => "tools/" + t.slug === slug);
    if (t) return [t.title, t.description];
  }
  if (slug.startsWith("events/")) {
    const p = programs.find((p) => "events/" + p.slug === slug);
    if (p) return [p.title, p.description];
  }
  return definitions[slug];
}
export function generateStaticParams() {
  return [
    ...Object.keys(definitions),
    ...tools.map((t) => "tools/" + t.slug),
    ...programs.map((p) => "events/" + p.slug),
  ].map((slug) => ({ slug: slug.split("/") }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const slug = (await params).slug.join("/");
  const d = definition(slug);
  return d
    ? { title: d[0], description: d[1], alternates: { canonical: "/" + slug } }
    : { title: "Page not found", robots: { index: false } };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const slug = (await params).slug.join("/");
  const d = definition(slug);
  if (!d) notFound();
  return (
    <>
      <PageIntro
        eyebrow={
          slug.startsWith("tools/")
            ? "THE CODEIN WORKBENCH"
            : slug === "heritage"
              ? "PRESERVED. CREDITED. CARRIED FORWARD."
              : "CODEIN COMMUNITY"
        }
        title={d[0]}
        description={d[1]}
      />
      <div className="container page-content">
        {slug === "tools" ? (
          <>
            <ToolCards />
            <div className="info-grid subsection">
              <article className="info-card">
                <h2>Yours to use. Yours to improve.</h2>
                <p>
                  All three tools share portable, tested TypeScript engines.
                  Bring them into your own workflow under the MIT license.
                </p>
                <Link className="text-link" href="/docs">
                  CLI & libraries →
                </Link>
              </article>
              <article className="info-card">
                <h2>Built in the open.</h2>
                <p>
                  Have a useful edge case, a clearer error, or an idea for a
                  tool? Start a discussion and help shape what comes next.
                </p>
                <a className="text-link" href={community.repositoryUrl}>
                  Explore the source ↗
                </a>
              </article>
            </div>
          </>
        ) : slug.startsWith("tools/") ? (
          <ToolWorkbench
            kind={
              slug.split("/")[1] as
                | "repository-audit"
                | "contribution-templates"
                | "contributor-credits"
            }
          />
        ) : slug === "contributors" ? (
          <Contributors />
        ) : slug === "docs" ? (
          <div className="prose">
            <Docs />
          </div>
        ) : slug === "community" ? (
          <>
            <div className="info-grid" id="benefits">
              {[
                [
                  "Learn together",
                  "Ask questions, exchange ideas, and learn through practical projects and shared experience.",
                ],
                [
                  "Contribute with confidence",
                  "Find approachable ways to improve documentation, accessibility, and open-source tools.",
                ],
                [
                  "Share your experience",
                  "Support other contributors, give thoughtful feedback, and turn what you know into someone else’s starting point.",
                ],
                [
                  "Build useful things",
                  "Help maintain the tools and community resources that other developers rely on.",
                ],
              ].map(([title, body]) => (
                <article className="info-card" key={title}>
                  <h2>{title}</h2>
                  <p>{body}</p>
                </article>
              ))}
            </div>
            <section className="subsection prose">
              <h2>Join the conversation.</h2>
              <p>
                Our community lives across Discord, Telegram, and LinkedIn. Pick
                the space that works for you.
              </p>
              <div className="inline-links">
                <a href={community.discord}>Discord ↗</a>
                <a href={community.telegram}>Telegram ↗</a>
                <a href={community.linkedin}>LinkedIn ↗</a>
              </div>
              <h2>Current maintainer</h2>
              <p>
                <a href="https://github.com/SauravMukherjee44">
                  Saurav Mukherjee
                </a>{" "}
                is CodeIN’s founder and the owner of this repository. Historical
                volunteer teams are acknowledged in our{" "}
                <Link href="/heritage#team">community heritage</Link>.
              </p>
            </section>
          </>
        ) : slug === "events" ? (
          <>
            <p className="notice">
              Historical archive: these are past sessions and programs, not open
              registrations.
            </p>
            <div className="event-grid">
              {events.map((e) => (
                <article className="event-card" key={e.slug}>
                  <Image
                    src={e.image}
                    alt={e.title + " artwork"}
                    width={480}
                    height={270}
                  />
                  <div>
                    <p className="eyebrow">PAST SESSION · {e.date}</p>
                    <h2 style={{ fontSize: 23 }}>{e.title}</h2>
                    <p>{e.speaker}</p>
                    {e.url ? (
                      <a className="text-link" href={e.url}>
                        Watch recording ↗
                      </a>
                    ) : (
                      <p>Recording unavailable</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
            <section className="subsection">
              <h2>Programs & milestones</h2>
              <div className="info-grid">
                {programs.map((p) => (
                  <article className="info-card" key={p.slug}>
                    <Eyebrow>{p.date}</Eyebrow>
                    <h3>{p.title}</h3>
                    <p>{p.description}</p>
                    <Link className="text-link" href={"/events/" + p.slug}>
                      Explore the archive →
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          </>
        ) : slug.startsWith("events/") ? (
          <Program slug={slug.split("/")[1]} />
        ) : slug === "resources" ? (
          <>
            <div className="info-grid" id="articles">
              {[
                [
                  "Your first open-source contribution",
                  "A guide to the first contribution workflow.",
                  "https://medium.com/betafactory/first-contribution-to-open-source-9057794620b7",
                ],
                [
                  "Learning by building",
                  "A community-collected article on beginning through practice.",
                  "https://www.chasejarvis.com/blog/begin-by-doing/",
                ],
                [
                  "Programming resources",
                  "Explore learning sites collected by community contributors.",
                  "https://dev.to/albericojr/best-sites-to-learn-programming-4igl",
                ],
                [
                  "Practical contribution tracks",
                  "Start with documentation, accessibility, or a focused issue.",
                  "/contribute",
                ],
              ].map(([title, body, href]) => (
                <article className="info-card" key={title}>
                  <h2>{title}</h2>
                  <p>{body}</p>
                  <a className="text-link" href={href}>
                    Explore resource ↗
                  </a>
                </article>
              ))}
            </div>
            <section className="subsection prose" id="opportunities">
              <h2>Find your next opportunity.</h2>
              <p>
                Explore official program sites for current dates and
                eligibility. CodeIN’s historical announcements do not imply that
                applications are open today.
              </p>
              <ul>
                <li>
                  <a href="https://summerofcode.withgoogle.com/">
                    Google Summer of Code
                  </a>
                </li>
                <li>
                  <a href="https://fellowship.mlh.io/">MLH Fellowship</a>
                </li>
                <li>
                  <a href="https://hacktoberfest.com/">Hacktoberfest</a>
                </li>
              </ul>
              <Link className="text-link" href="/events">
                Past CodeIN programs →
              </Link>
            </section>
          </>
        ) : slug === "contribute" ? (
          <ContributionGuide />
        ) : slug === "heritage" ? (
          <>
            <div className="notice">
              All 406 original tracked files are archived with SHA-256
              verification. The full Git history remains in this same
              repository.
            </div>
            <Image
              className="heritage-screenshot"
              src="/images/heritage.png"
              alt="The original gold CodeIN Community homepage, preserved as part of our history"
              width={1863}
              height={932}
            />
            <div className="info-grid">
              <article className="info-card">
                <h2>Same repository. Same history.</h2>
                <p>
                  The modern site is a continuation of the original community
                  project. Previous commits, authorship, and source are
                  preserved, including third-party license notices.
                </p>
                <a
                  className="text-link"
                  href={community.repositoryUrl + "/tree/main/legacy/website"}
                >
                  Browse original source ↗
                </a>
              </article>
              <article className="info-card">
                <h2>Every contributor carried forward.</h2>
                <p>
                  Our baseline includes 150 GitHub contributor records. Complete
                  pagination and stable IDs help preserve credits as the
                  community grows.
                </p>
                <Link className="text-link" href="/contributors">
                  See the contributors →
                </Link>
              </article>
            </div>
            <section className="subsection" id="team">
              <h2>The people behind the early chapters.</h2>
              <p>
                Historical roles from the original website, preserved here as
                acknowledgement. They do not imply current staff or maintainer
                status.
              </p>
              <ul className="team-list">
                <li>
                  <strong>Saurav Mukherjee</strong>
                  <small>Founder</small>
                </li>
                {team.map((person, i) => (
                  <li key={person.name + i}>
                    <strong>{person.name}</strong>
                    <small>{person.role}</small>
                  </li>
                ))}
              </ul>
            </section>
            <section className="subsection prose">
              <h2>Milestones worth remembering.</h2>
              <p>
                From 2021 learning sessions to Winter Fest, 100 Days of Code,
                Hacktoberfest 2022, and the 2024 giveaway, the archive records
                years of community effort.
              </p>
              <Link className="text-link" href="/events">
                Explore the event archive →
              </Link>
            </section>
          </>
        ) : slug === "contact" ? (
          <div className="info-grid">
            <article className="info-card">
              <h2>Talk to the community.</h2>
              <div className="contact-options">
                <a href={community.discord}>
                  Discord community <span>↗</span>
                </a>
                <a href={community.telegram}>
                  Telegram group <span>↗</span>
                </a>
                <a href={community.linkedin}>
                  LinkedIn <span>↗</span>
                </a>
              </div>
            </article>
            <article className="info-card">
              <h2>Collaborate with CodeIN.</h2>
              <p>
                For mentorship, workshops, community partnerships, and
                sponsorship conversations, reach out by email.
              </p>
              <a className="text-link" href={"mailto:" + community.email}>
                {community.email} ↗
              </a>
              <p style={{ marginTop: 25 }}>
                For repository bugs and improvements, use{" "}
                <a
                  className="text-link"
                  href={community.repositoryUrl + "/issues"}
                >
                  GitHub Issues ↗
                </a>
                .
              </p>
            </article>
          </div>
        ) : slug === "privacy" ? (
          <div className="prose">
            <h2>No member account is required.</h2>
            <p>
              CodeIN does not require sign-in to browse the site or use its
              tools. We do not operate a member database.
            </p>
            <h2>Repository lookups</h2>
            <p>
              When you use the auditor or credits generator, your repository
              identifier is sent to this site’s server, which reads public
              GitHub API data. Successful public responses may be cached for one
              hour; previously successful responses may be served for up to one
              day during an outage. This service does not request access to
              private repositories.
            </p>
            <h2>Browser storage</h2>
            <p>
              Your theme preference and contribution checklist are saved locally
              in your browser. Template-builder input is processed in the
              browser and is not sent to our server. Downloads are generated
              when you request them.
            </p>
            <h2>External services</h2>
            <p>
              GitHub hosts contributor avatars and profiles. Netlify hosts this
              website and may process request logs under its own service
              policies. Following community links takes you to services with
              their own privacy policies.
            </p>
            <h2>Contact</h2>
            <p>
              Questions can be sent to{" "}
              <a href={"mailto:" + community.email}>{community.email}</a>. Email
              and community services process communications under their own
              policies.
            </p>
          </div>
        ) : null}
      </div>
    </>
  );
}
function Program({ slug }: { slug: string }) {
  const p = programs.find((p) => p.slug === slug)!;
  return (
    <div className="prose">
      <p className="notice">Historical program · {p.date}</p>
      <h2>Part of the CodeIN story.</h2>
      <p>{p.description}</p>
      {p.url && (
        <p>
          <a className="button" href={p.url}>
            Watch the recap ↗
          </a>
        </p>
      )}
      <h2>Original records</h2>
      <p>
        Original announcements, participant recognition, and winner details are
        preserved in the archived page, with their original source and
        attribution.
      </p>
      <a
        className="text-link"
        href={community.repositoryUrl + "/blob/main/legacy/website/" + p.source}
      >
        Read the original {p.title} page ↗
      </a>
      <p style={{ marginTop: 30 }}>
        <Link href="/events">← Back to all historical events</Link>
      </p>
    </div>
  );
}
