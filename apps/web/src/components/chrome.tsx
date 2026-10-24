"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { community } from "@/lib/community";
export function Header() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.dataset.theme === "dark");
  }, []);
  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try {
      localStorage.setItem("codein-theme", next ? "dark" : "light");
    } catch {
      /* Theme still works if storage is disabled. */
    }
  }
  return (
    <header className="site-header">
      <div className="container nav">
        <Link href="/" className="brand">
          <Image src="/images/logo.png" alt="" width={42} height={42} />
          <span>
            Code<span className="brand-in">IN</span>
            <small>COMMUNITY</small>
          </span>
        </Link>
        <button
          className="mobile-menu"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="main-navigation"
        >
          {open ? "Close menu" : "Menu"}
        </button>
        <nav
          id="main-navigation"
          className={open ? "navigation open" : "navigation"}
          aria-label="Main navigation"
        >
          {[
            ["Community", "/community"],
            ["Tools", "/tools"],
            ["Events", "/events"],
            ["Contribute", "/contribute"],
          ].map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
          <Link href="/contributors" onClick={() => setOpen(false)}>
            Our people
          </Link>
        </nav>
        <div className="nav-actions">
          <button
            className="theme-toggle"
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            onClick={toggle}
          >
            {dark ? "☀" : "☾"}
          </button>
          <a className="button small" href={community.discord}>
            Join the community <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Link href="/" className="footer-brand">
              CodeIN Community<span className="gold">.</span>
            </Link>
            <p>
              Good things happen when
              <br />
              developers build together.
            </p>
          </div>
          <div>
            <h2>Explore</h2>
            <Link href="/tools">Developer tools</Link>
            <Link href="/resources">Resources</Link>
            <Link href="/docs">CLI & libraries</Link>
          </div>
          <div>
            <h2>Community</h2>
            <a href={community.discord}>Discord ↗</a>
            <a href={community.linkedin}>LinkedIn ↗</a>
            <Link href="/contributors">Contributors</Link>
          </div>
          <div>
            <h2>Our story</h2>
            <Link href="/heritage">Community heritage</Link>
            <a href={community.repositoryUrl}>GitHub ↗</a>
            <Link href="/contact">Get in touch</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} CodeIN Community contributors · MIT
            licensed
          </span>
          <span>
            <Link href="/privacy">Privacy</Link>
            <a href="https://www.netlify.com">Hosted on Netlify ↗</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
