import Link from "next/link";
import { tools } from "@/lib/community";
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="eyebrow">
      <span aria-hidden="true" /> {children}
    </p>
  );
}
export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="page-intro container">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1>{title}</h1>
      <p className="lede">{description}</p>
    </section>
  );
}
export function ToolCards() {
  return (
    <div className="tool-grid">
      {tools.map((t) => (
        <Link className="tool-card" key={t.slug} href={"/tools/" + t.slug}>
          <div className="tool-top">
            <span className="tool-icon" aria-hidden="true">
              {t.icon}
            </span>
            <span className="muted mono">{t.number} / OPEN SOURCE</span>
          </div>
          <h3>
            {t.title} <span aria-hidden="true">↗</span>
          </h3>
          <p>{t.description}</p>
          <code>{t.command}</code>
        </Link>
      ))}
    </div>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  description,
  link,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  link?: { href: string; label: string };
}) {
  return (
    <div className="section-heading">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {link && (
        <Link className="text-link" href={link.href}>
          {link.label} <span aria-hidden="true">↗</span>
        </Link>
      )}
    </div>
  );
}
export function DownloadLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="button secondary"
      target="_blank"
      rel="noreferrer"
    >
      {children} ↗
    </a>
  );
}
