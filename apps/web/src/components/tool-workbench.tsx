"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { zipSync, strToU8 } from "fflate";
import {
  auditRepository,
  auditMarkdown,
  generateContributionFiles,
  createCredits,
  creditsMarkdown,
  type AuditReport,
  type GeneratedFile,
  type CreditsDocument,
  type Contributor,
  type RepositorySnapshot,
} from "@codein-community/toolkit";
function save(name: string, content: string | Uint8Array, type = "text/plain") {
  const blob = new Blob(
    [typeof content === "string" ? content : new Uint8Array(content).buffer],
    { type },
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
async function load(repository: string, kind: "audit" | "credits") {
  const response = await fetch(
    "/api/github?" + new URLSearchParams({ repository, kind }),
  );
  const result = await response.json();
  if (!response.ok)
    throw new Error(result.error ?? "The repository could not be loaded.");
  return result;
}
function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="results-empty">
      <span aria-hidden="true">✳</span>
      <h2>Your next step, made clearer.</h2>
      <p>{children}</p>
    </div>
  );
}
export function ToolWorkbench({
  kind,
}: {
  kind: "repository-audit" | "contribution-templates" | "contributor-credits";
}) {
  const [repository, setRepository] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState<AuditReport | null>(null);
  const [files, setFiles] = useState<GeneratedFile[]>([]);
  const [active, setActive] = useState(0);
  const [credits, setCredits] = useState<CreditsDocument | null>(null);
  const [rawContributors, setRawContributors] = useState<Contributor[]>([]);
  const [includeBots, setIncludeBots] = useState(true);
  const [order, setOrder] = useState<"contributions" | "alphabetical">(
    "contributions",
  );
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState("");
  const templates = kind === "contribution-templates";
  const auditor = kind === "repository-audit";
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    setCopied("");
    setReport(null);
    setFiles([]);
    setCredits(null);
    try {
      if (templates) {
        const form = new FormData(event.currentTarget);
        setFiles(
          generateContributionFiles({
            repository,
            defaultBranch: String(form.get("branch")),
            installCommand: String(form.get("install")),
            testCommand: String(form.get("test")),
            lintCommand: String(form.get("lint")),
            preferences: String(form.get("preferences")),
          }),
        );
        setActive(0);
      } else {
        const result = await load(repository, auditor ? "audit" : "credits");
        if (result.stale)
          setNotice("Showing a cached result because GitHub is unavailable.");
        if (auditor)
          setReport(auditRepository(result.data as RepositorySnapshot));
        else {
          const data = result.data as {
            repository: string;
            contributors: Contributor[];
            incomplete: boolean;
          };
          setRawContributors(data.contributors);
          setCredits(
            createCredits(data.repository, data.contributors, {
              includeBots,
              order,
              incomplete: data.incomplete,
            }),
          );
          if (data.incomplete)
            setNotice(
              "Partial result: GitHub could not supply every page. Try again before using this as a complete contributor list.",
            );
        }
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "The tool could not finish. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  function updateCredits(
    bots: boolean,
    sort: "contributions" | "alphabetical",
  ) {
    setIncludeBots(bots);
    setOrder(sort);
    if (credits)
      setCredits(
        createCredits(credits.repository, rawContributors, {
          includeBots: bots,
          order: sort,
          incomplete: credits.incomplete,
        }),
      );
  }
  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied("Copied to clipboard.");
    } catch {
      setCopied("Clipboard unavailable. Use the download button instead.");
    }
  }
  return (
    <>
      <div className="tool-shell">
        <form className="tool-input" onSubmit={submit}>
          <h2>
            {templates ? "Make it your project." : "Start with a repository."}
          </h2>
          <p className="hint">
            {templates
              ? "Your answers stay in this browser. Download the files, review them, and add them to your repository."
              : "Enter owner/repository or a public GitHub URL. Read-only access. No account or installation required."}
          </p>
          <label>
            GitHub repository
            <input
              name="repository"
              value={repository}
              onChange={(e) => setRepository(e.target.value)}
              placeholder="octocat/Hello-World"
              required
              autoComplete="off"
              maxLength={240}
            />
          </label>
          {templates ? (
            <>
              <label>
                Default branch
                <input name="branch" defaultValue="main" required />
              </label>
              <label>
                Install command
                <input name="install" defaultValue="pnpm install" required />
              </label>
              <label>
                Test command
                <input name="test" defaultValue="pnpm test" required />
              </label>
              <label>
                Lint command
                <input name="lint" defaultValue="pnpm lint" required />
              </label>
              <label>
                Contribution preferences
                <textarea
                  name="preferences"
                  defaultValue="Keep changes focused, explain the problem, and include verification steps."
                  maxLength={2000}
                />
              </label>
            </>
          ) : !auditor ? (
            <>
              <label>
                Sort contributors
                <select
                  value={order}
                  onChange={(e) =>
                    updateCredits(includeBots, e.target.value as typeof order)
                  }
                >
                  <option value="contributions">Contribution count</option>
                  <option value="alphabetical">Alphabetical</option>
                </select>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={includeBots}
                  onChange={(e) => updateCredits(e.target.checked, order)}
                />{" "}
                Include bot contributors
              </label>
            </>
          ) : null}
          <button className="button" type="submit" disabled={busy}>
            {busy
              ? "Reading public GitHub data…"
              : templates
                ? "Generate my templates →"
                : auditor
                  ? "Check repository →"
                  : "Generate contributor credits →"}
          </button>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <p className="hint" style={{ marginTop: 18, marginBottom: 0 }}>
            {auditor
              ? "File presence is a starting point. Review the contents and suitability of each file before relying on it."
              : "All tools are open source under the MIT license."}
          </p>
        </form>
        <div className="tool-results" aria-live="polite" aria-busy={busy}>
          {notice && <p className="notice">{notice}</p>}
          {auditor && report ? (
            <>
              <h2>Readiness report</h2>
              <p className="pagination-note">{report.repository}</p>
              <div className="report-summary">
                <span>{report.summary.present} present</span>
                <span>{report.summary.missing} missing</span>
                <span>{report.summary.unknown} unknown</span>
              </div>
              {report.findings.map((f) => (
                <div className="finding" key={f.id}>
                  <div className="finding-head">
                    <span className={"badge " + f.status}>{f.status}</span>
                    {f.title}
                  </div>
                  {f.evidence.map((e) => (
                    <code key={e}>
                      {e}
                      <br />
                    </code>
                  ))}
                  <p>{f.recommendation}</p>
                </div>
              ))}
              <div className="result-actions">
                <button
                  className="button secondary"
                  type="button"
                  onClick={() =>
                    save("repository-audit.md", auditMarkdown(report))
                  }
                >
                  Download Markdown ↓
                </button>
                <button
                  className="button secondary"
                  type="button"
                  onClick={() =>
                    save(
                      "repository-audit.json",
                      JSON.stringify(report, null, 2),
                      "application/json",
                    )
                  }
                >
                  Download JSON ↓
                </button>
                <button
                  className="button secondary"
                  type="button"
                  onClick={() => copy(auditMarkdown(report))}
                >
                  Copy report
                </button>
              </div>
            </>
          ) : templates && files.length ? (
            <>
              <h2>Your contribution kit</h2>
              <p className="hint">Four files, ready for your review.</p>
              <div className="file-tabs" aria-label="Generated files">
                {files.map((file, i) => (
                  <button
                    type="button"
                    aria-pressed={active === i}
                    onClick={() => setActive(i)}
                    key={file.path}
                  >
                    {file.path}
                  </button>
                ))}
              </div>
              <pre
                className="output-preview"
                tabIndex={0}
                aria-label="Generated file preview"
              >
                {files[active].content}
              </pre>
              <div className="result-actions">
                <button
                  className="button"
                  type="button"
                  onClick={() => {
                    const archive = Object.fromEntries(
                      files.map((f) => [f.path, strToU8(f.content)]),
                    );
                    save(
                      "codein-contribution-kit.zip",
                      zipSync(archive),
                      "application/zip",
                    );
                  }}
                >
                  Download ZIP ↓
                </button>
                <button
                  className="button secondary"
                  type="button"
                  onClick={() => copy(files[active].content)}
                >
                  Copy current file
                </button>
              </div>
            </>
          ) : !auditor && !templates && credits ? (
            <>
              <h2>{credits.contributors.length} people. A shared project.</h2>
              <p className="pagination-note">
                {credits.repository} ·{" "}
                {credits.incomplete
                  ? "Partial contributor list"
                  : "All GitHub contributor pages fetched"}
              </p>
              <div className="credits-preview">
                {credits.contributors.map((c) => (
                  <a
                    href={c.html_url}
                    key={c.id}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {c.login}
                    <br />
                    <span className="muted">
                      {c.contributions} contributions
                    </span>
                  </a>
                ))}
              </div>
              <div className="result-actions">
                <button
                  type="button"
                  className="button secondary"
                  onClick={() =>
                    save("contributors.md", creditsMarkdown(credits))
                  }
                >
                  Download Markdown ↓
                </button>
                <button
                  type="button"
                  className="button secondary"
                  onClick={() =>
                    save(
                      "contributors.json",
                      JSON.stringify(credits, null, 2),
                      "application/json",
                    )
                  }
                >
                  Download JSON ↓
                </button>
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => copy(creditsMarkdown(credits))}
                >
                  Copy credits
                </button>
              </div>
            </>
          ) : (
            <Empty>
              {templates
                ? "Your generated contribution guide, PR template, and issue forms will appear here."
                : auditor
                  ? "Get a practical checklist covering documentation, community guidance, tests, and CI."
                  : "Make the people behind a project visible. Export credits for a README or documentation page."}
            </Empty>
          )}
          {copied && (
            <p className="pagination-note" role="status">
              {copied}
            </p>
          )}
        </div>
      </div>
      <div className="tool-docs">
        Prefer your terminal? The same engine powers the CLI.
        <code>
          {auditor
            ? "codein audit ./my-project --format json"
            : templates
              ? "codein templates --repo owner/repo --out ./contribution-kit"
              : "codein credits owner/repo --format markdown"}
        </code>
        <Link className="text-link" href="/docs" style={{ marginTop: 12 }}>
          CLI & library documentation →
        </Link>
      </div>
    </>
  );
}
