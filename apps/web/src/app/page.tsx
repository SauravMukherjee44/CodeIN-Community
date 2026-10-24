import Link from "next/link";
import Image from "next/image";
import { Eyebrow, ToolCards, SectionHeading } from "@/components/ui";
import { community, events } from "@/lib/community";
import baseline from "@/data/contributors.json";
export default function Home() {
  return (
    <>
      <span id="header-wrap" />
      <section className="hero container" id="hero-area">
        <div className="hero-copy">
          <Eyebrow>BUILT BY THE COMMUNITY. OPEN TO EVERYONE.</Eyebrow>
          <h1>
            Great code starts
            <br />
            with <span className="highlight">good company.</span>
          </h1>
          <p className="lede">
            Learn together. Build something useful. Give back to open source.
            Wherever you are in your developer journey, there’s a place for you
            here.
          </p>
          <div className="actions">
            <a className="button" href={community.discord}>
              Find your people <span aria-hidden="true">↗</span>
            </a>
            <Link href="/tools" className="button secondary">
              Explore the toolkit <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="hero-proof">
            <div className="avatar-stack">
              {baseline.contributors.slice(1, 6).map((c) => (
                <Image
                  unoptimized
                  key={c.id}
                  src={c.avatar_url}
                  alt=""
                  width={34}
                  height={34}
                />
              ))}
            </div>
            <span>
              <strong>{baseline.contributors.length} contributors</strong>
              <br />
              and a shared belief in building together
            </span>
          </div>
        </div>
        <div className="hero-art">
          <div className="art-caption">
            <span className="live-dot" /> Your next chapter starts here
          </div>
          <Image
            src="/images/hero.png"
            alt="Developers collaborating and sharing ideas"
            width={594}
            height={444}
            priority
            className="hero-illustration"
          />
          <div className="art-note">
            <span aria-hidden="true">✳</span> A little curiosity.
            <br />
            <strong>A lot of possibility.</strong>
          </div>
        </div>
      </section>
      <div className="principles-strip">
        <div className="container">
          <span>COMMUNITY, WITH PURPOSE</span>
          <span>↗ Learn by building</span>
          <span>⌘ Tools that give back</span>
          <span>✳ People before pull requests</span>
          <span>↔ Open source, always</span>
        </div>
      </div>
      <span id="services" />
      <section className="section container" id="about">
        <SectionHeading
          eyebrow="A PLACE TO START. ROOM TO GROW."
          title="Nobody builds great things alone."
          description="CodeIN began with a simple idea: make learning and contributing less intimidating. That idea still guides everything we do."
          link={{ href: "/community", label: "Meet the community" }}
        />
        <div className="values-grid">
          <article>
            <span className="number">01</span>
            <h3>Learn in good company</h3>
            <p>
              Ask the question. Share what you know. Find a community that makes
              the hard parts a little easier.
            </p>
          </article>
          <article>
            <span className="number">02</span>
            <h3>Make your first contribution</h3>
            <p>
              From a clearer README to a thoughtful bug fix, small contributions
              move real projects forward.
            </p>
          </article>
          <article>
            <span className="number">03</span>
            <h3>Build things people use</h3>
            <p>
              Explore practical, open-source tools. Help improve them. Leave
              something useful for the next developer.
            </p>
          </article>
        </div>
      </section>
      <span id="hacktoberfest" />
      <section className="section tool-section" id="open-source">
        <div className="container">
          <SectionHeading
            eyebrow="THE CODEIN TOOLKIT"
            title="A few good tools. A better starting point."
            description="Practical utilities for the people who keep open source moving. Free to use, open to improve."
            link={{ href: "/tools", label: "Open the workbench" }}
          />
          <ToolCards />
          <div className="tool-footnote">
            <span className="status-dot" /> Available in your browser, terminal,
            and TypeScript projects.<Link href="/docs">Read the docs →</Link>
          </div>
        </div>
      </section>
      <section
        className="section container contribution-section"
        id="opportunity"
      >
        <span id="open-source-contributions-home" />
        <div className="terminal">
          <div className="terminal-bar">
            <span />
            <span />
            <span />
            <small>your-first-contribution.sh</small>
          </div>
          <pre>
            <span className="terminal-comment">
              # Every contribution starts with a little curiosity.
            </span>
            {"\n\n"}
            <span className="terminal-prompt">$</span> git checkout -b
            my-first-contribution{"\n"}
            <span className="terminal-output">
              A clearer sentence. A fixed bug. A new possibility.
            </span>
            {"\n\n"}
            <span className="terminal-prompt">$</span> git commit -m &quot;make
            something better&quot;{"\n"}
            <span className="terminal-output">
              You’re part of the story now. ✳
            </span>
          </pre>
          <div className="terminal-bottom">SMALL CHANGES. REAL IMPACT.</div>
        </div>
        <div>
          <Eyebrow>YOUR FIRST PR BELONGS HERE</Eyebrow>
          <h2>You don’t need to know everything to get started.</h2>
          <p>
            Pick a contribution track, follow the steps, and build confidence
            one change at a time. Documentation, accessibility, and thoughtful
            questions all count.
          </p>
          <Link className="button" href="/contribute">
            Make your first contribution <span aria-hidden="true">→</span>
          </Link>
          <p className="micro">
            No perfect résumé required. Just a willingness to learn.
          </p>
        </div>
      </section>
      <span id="winterfest" />
      <section className="section events-section" id="events">
        <div className="container">
          <SectionHeading
            eyebrow="FROM THE COMMUNITY ARCHIVE"
            title="Good conversations keep giving."
            description="Revisit sessions from the developers and mentors who shared their time with CodeIN."
            link={{ href: "/events", label: "Explore the archive" }}
          />
          <div className="event-grid">
            {events.slice(0, 3).map((e) => (
              <article className="event-card" key={e.slug}>
                <Image
                  src={e.image}
                  alt={e.title + " session artwork"}
                  width={480}
                  height={270}
                />
                <div>
                  <span className="eyebrow">
                    PAST SESSION · {e.date.slice(0, 4)}
                  </span>
                  <h3>{e.title}</h3>
                  <p>{e.speaker}</p>
                  {e.url ? (
                    <a href={e.url} className="text-link">
                      Watch the recording ↗
                    </a>
                  ) : (
                    <span className="muted">Recording unavailable</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <span id="testimonial" />
      <section className="section container" id="testimonials">
        <SectionHeading
          eyebrow="PEOPLE MAKE THE DIFFERENCE"
          title="The first step can change a lot."
        />
        <div className="quote-grid">
          <blockquote>
            <span aria-hidden="true">“</span>
            <p>
              My journey in Open Source started with CodeIN Community. My first
              ever contribution here stirred such an interest in Open Source.
            </p>
            <footer>
              Aharna Haque{" "}
              <small>Community contributor · historical testimonial</small>
            </footer>
          </blockquote>
          <blockquote>
            <span aria-hidden="true">“</span>
            <p>
              Community based learning is just awesome. Mentors are really
              helpful and helped a lot during my coding journey.
            </p>
            <footer>
              Shikha Chaturvedi{" "}
              <small>Community contributor · historical testimonial</small>
            </footer>
          </blockquote>
        </div>
      </section>
      <section className="heritage-band" id="testimonial1">
        <div className="container heritage-inner">
          <div>
            <Eyebrow>NEW CHAPTER. SAME COMMUNITY.</Eyebrow>
            <h2>
              Built on every contribution
              <br />
              that came before.
            </h2>
            <p>
              The website has evolved. The people, the history, and the work
              that brought us here are part of everything we build next.
            </p>
            <Link href="/heritage" className="text-link">
              Explore our story →
            </Link>
          </div>
          <div className="heritage-people">
            {baseline.contributors.slice(0, 18).map((c) => (
              <Image
                unoptimized
                src={c.avatar_url}
                alt={c.login}
                width={54}
                height={54}
                key={c.id}
              />
            ))}
            <Link href="/contributors">
              Meet all {baseline.contributors.length} contributors ↗
            </Link>
          </div>
        </div>
      </section>
      <section className="section container faq-section" id="FAQs">
        <SectionHeading
          eyebrow="A FEW THINGS YOU MIGHT WONDER"
          title="Curiosity is welcome."
        />
        <div>
          {[
            [
              "Is CodeIN free to join?",
              "Yes. Join our Discord community, explore the resources, and start contributing. The toolkit is free and open source.",
            ],
            [
              "Do I need open-source experience?",
              "No. Our contribution tracks explain the workflow and offer approachable starting points. Read each project’s contribution rules before starting.",
            ],
            [
              "Can I use the tools in my own project?",
              "Yes. The toolkit and CLI are MIT licensed, with documented TypeScript interfaces and installable GitHub release artifacts.",
            ],
            [
              "What happened to the original website?",
              "Its source is preserved byte for byte in the same repository, alongside the complete Git history and historical credits. Visit our heritage page to explore it.",
            ],
          ].map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
      <span id="joinus" />
      <span id="joinushere" />
      <span id="community_partner" />
      <span id="contributor" />
      <section className="join-section" id="contact">
        <div className="container">
          <Eyebrow>YOUR NEXT GOOD THING STARTS WITH A HELLO</Eyebrow>
          <h2>
            Come for the code.
            <br />
            Stay for the community.
          </h2>
          <div className="actions">
            <a className="button" href={community.discord}>
              Join us on Discord ↗
            </a>
            <Link className="text-link" href="/contact">
              Let’s collaborate →
            </Link>
          </div>
          <div className="past-supporters" id="blog">
            <span>WITH GRATITUDE TO PAST SUPPORTERS</span>
            <p>
              GeeksforGeeks <b>·</b> Azure Developer Community <b>·</b> Coding
              Minutes <b>·</b> Newton School
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
