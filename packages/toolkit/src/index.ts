export type FindingStatus = "present" | "missing" | "unknown";
export interface RepositorySnapshot {
  repository: string;
  files: string[];
  fileContents?: Record<string, string>;
  incomplete?: boolean;
}
export interface AuditFinding {
  id: string;
  title: string;
  status: FindingStatus;
  evidence: string[];
  recommendation: string;
}
export interface AuditReport {
  repository: string;
  findings: AuditFinding[];
  summary: Record<FindingStatus, number>;
}
const checks = [
  [
    "readme",
    "README",
    /(^|\/)readme(?:\.[^/]+)?$/i,
    "Introduce the project, installation, usage, and support channels.",
  ],
  [
    "license",
    "License",
    /(^|\/)(licen[cs]e|copying)(?:\.[^/]+)?$/i,
    "Add a license file describing how the project can be used.",
  ],
  [
    "contributing",
    "Contribution guide",
    /(^|\/)contributing(?:\.[^/]+)?$/i,
    "Document setup, development commands, and the review process.",
  ],
  [
    "conduct",
    "Code of conduct",
    /(^|\/)code_of_conduct(?:\.[^/]+)?$/i,
    "Explain expected community conduct and reporting channels.",
  ],
  [
    "security",
    "Security policy",
    /(^|\/)security(?:\.[^/]+)?$/i,
    "Document supported versions and a private reporting channel.",
  ],
  [
    "issues",
    "Issue templates",
    /^\.github\/ISSUE_TEMPLATE\/[^/]+\.(md|ya?ml)$/i,
    "Add useful bug report and feature request forms.",
  ],
  [
    "pull-request",
    "Pull request template",
    /(^|\/)(pull_request_template(?:\.md)?|pull_request_template\/[^/]+\.md)$/i,
    "Give reviewers a summary, related issue, and verification steps.",
  ],
  [
    "ci",
    "Continuous integration",
    /(^\.github\/workflows\/[^/]+\.ya?ml$|^\.gitlab-ci\.yml$|^\.circleci\/config\.yml$)/i,
    "Add CI that checks the project using documented commands.",
  ],
  [
    "tests",
    "Tests",
    /(^|\/)(__tests__|tests?|spec)(\/|\.)|(^|\/)test_[^/]+\.py$|(_test\.go|\.(test|spec)\.[cm]?[jt]sx?)$/i,
    "Add reproducible tests and document how contributors can run them.",
  ],
] as const;
export function auditRepository(snapshot: RepositorySnapshot): AuditReport {
  const findings: AuditFinding[] = checks.map(
    ([id, title, pattern, recommendation]) => {
      const evidence = snapshot.files.filter((file) => pattern.test(file));
      if (id === "tests" && !evidence.length) {
        for (const [file, text] of Object.entries(
          snapshot.fileContents ?? {},
        )) {
          if (file === "package.json") {
            try {
              const pkg = JSON.parse(text);
              if (
                typeof pkg.scripts?.test === "string" &&
                !pkg.scripts.test.includes("no test specified")
              )
                evidence.push("package.json: scripts.test");
            } catch {
              /* A malformed manifest is not evidence of a test command. */
            }
          }
        }
      }
      return {
        id,
        title,
        status: evidence.length
          ? "present"
          : snapshot.incomplete
            ? "unknown"
            : "missing",
        evidence,
        recommendation,
      };
    },
  );
  return {
    repository: snapshot.repository,
    findings,
    summary: findings.reduce(
      (s, f) => ({ ...s, [f.status]: s[f.status] + 1 }),
      { present: 0, missing: 0, unknown: 0 },
    ),
  };
}
export function auditMarkdown(report: AuditReport): string {
  return (
    `# Repository readiness: ${escapeMarkdown(report.repository)}\n\nThese checks describe repository setup; inspect each linked file before relying on its contents.\n\n` +
    report.findings
      .map(
        (f) =>
          `- **${f.title}**: ${f.status}${f.evidence.length ? " (" + f.evidence.map((x) => "`" + x.replaceAll("`", "") + "`").join(", ") + ")" : ""}\n  ${f.recommendation}`,
      )
      .join("\n") +
    "\n"
  );
}
export function parseRepository(input: string): {
  owner: string;
  repo: string;
  fullName: string;
} {
  let value = input.trim();
  if (/^https?:\/\//i.test(value)) {
    let u: URL;
    try {
      u = new URL(value);
    } catch {
      throw new Error(
        "Enter owner/repository or a public https://github.com/owner/repository URL.",
      );
    }
    if (
      u.protocol !== "https:" ||
      u.hostname !== "github.com" ||
      u.port ||
      u.username ||
      u.password ||
      u.search ||
      u.hash
    )
      throw new Error(
        "Use a public HTTPS github.com repository URL without a query or fragment.",
      );
    value = u.pathname.replace(/^\/|\/$/g, "");
  }
  value = value.replace(/\.git$/, "");
  const match = /^([a-z\d](?:[a-z\d-]{0,38}))\/([a-z\d._-]{1,100})$/i.exec(
    value,
  );
  if (!match || match[2] === "." || match[2] === "..")
    throw new Error(
      "Enter a repository as owner/repository, for example octocat/Hello-World.",
    );
  return {
    owner: match[1],
    repo: match[2],
    fullName: match[1] + "/" + match[2],
  };
}
export interface ContributionConfig {
  repository: string;
  defaultBranch: string;
  installCommand: string;
  testCommand: string;
  lintCommand: string;
  preferences?: string;
}
export interface GeneratedFile {
  path: string;
  content: string;
}
function safeLine(value: string, name: string): string {
  const s = value.trim();
  // Control characters must not enter generated command documentation.
  // eslint-disable-next-line no-control-regex
  if (!s || s.length > 500 || /[\r\n\x00-\x1f`]/.test(s))
    throw new Error(
      `${name} must be one non-empty line, without control characters or backticks.`,
    );
  return s;
}
export function generateContributionFiles(
  config: ContributionConfig,
): GeneratedFile[] {
  const repo = parseRepository(config.repository).fullName;
  const branch = safeLine(config.defaultBranch, "Default branch");
  if (!/^[\w./-]+$/.test(branch) || branch.includes(".."))
    throw new Error("Enter a valid default branch name.");
  const install = safeLine(config.installCommand, "Install command"),
    test = safeLine(config.testCommand, "Test command"),
    lint = safeLine(config.lintCommand, "Lint command");
  const preferences = (
    config.preferences ??
    "Keep changes focused, explain the problem, and include verification steps."
  ).trim();
  if (
    preferences.length > 2000 ||
    // eslint-disable-next-line no-control-regex -- Reject control characters in generated content.
    /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(preferences)
  )
    throw new Error(
      "Contribution preferences must be plain text under 2,000 characters.",
    );
  return [
    {
      path: "CONTRIBUTING.md",
      content: `# Contributing to ${repo}\n\nThank you for helping improve this project. Check existing issues before starting, and discuss larger changes with the maintainers.\n\n## Development\n\nFork the repository, clone your fork, and create a feature branch from \`${branch}\`.\n\n\`\`\`sh\n${install}\n${test}\n${lint}\n\`\`\`\n\n## Pull requests\n\n${preferences}\n\nDescribe the problem and solution, link the related issue, and explain what you verified. Reply to review feedback and keep unrelated changes separate.\n\n## Community\n\nRead the repository's code of conduct, if present. Report security concerns through its private security reporting channel rather than public issues.\n`,
    },
    {
      path: ".github/PULL_REQUEST_TEMPLATE.md",
      content:
        "# Summary\n\nDescribe the problem and the resulting behavior.\n\n## Related issue\n\nCloses #\n\n## Verification\n\nDescribe the commands or scenarios you actually ran and the results you observed.\n\n## Screenshots\n\nInclude before/after images for visible changes, when useful.\n",
    },
    {
      path: ".github/ISSUE_TEMPLATE/bug.yml",
      content:
        "name: Bug report\ndescription: Report a reproducible problem\nbody:\n  - type: textarea\n    id: problem\n    attributes:\n      label: What happened?\n    validations:\n      required: true\n  - type: textarea\n    id: reproduction\n    attributes:\n      label: Steps to reproduce\n    validations:\n      required: true\n  - type: textarea\n    id: expected\n    attributes:\n      label: Expected behavior\n    validations:\n      required: true\n  - type: textarea\n    id: environment\n    attributes:\n      label: Version and environment\n",
    },
    {
      path: ".github/ISSUE_TEMPLATE/feature.yml",
      content:
        "name: Feature request\ndescription: Propose an improvement\nbody:\n  - type: textarea\n    id: problem\n    attributes:\n      label: What problem would this solve?\n    validations:\n      required: true\n  - type: textarea\n    id: proposal\n    attributes:\n      label: Proposed behavior and acceptance criteria\n    validations:\n      required: true\n  - type: textarea\n    id: alternatives\n    attributes:\n      label: Alternatives considered\n",
    },
  ];
}
export interface Contributor {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: string;
}
export interface CreditsDocument {
  repository: string;
  contributors: Contributor[];
  incomplete: boolean;
}
export function createCredits(
  repository: string,
  contributors: Contributor[],
  options: {
    includeBots?: boolean;
    order?: "contributions" | "alphabetical";
    incomplete?: boolean;
  } = {},
): CreditsDocument {
  const unique = new Map<number, Contributor>();
  for (const c of contributors) {
    if (!Number.isSafeInteger(c.id) || c.id < 0 || !/^[-\w[\]]+$/.test(c.login))
      continue;
    if (
      options.includeBots === false &&
      (c.type === "Bot" || c.login.endsWith("[bot]"))
    )
      continue;
    const previous = unique.get(c.id);
    if (!previous || c.contributions > previous.contributions)
      unique.set(c.id, {
        ...c,
        html_url: "https://github.com/" + encodeURIComponent(c.login),
      });
  }
  const list = [...unique.values()].sort(
    options.order === "alphabetical"
      ? (a, b) => a.login.localeCompare(b.login)
      : (a, b) =>
          b.contributions - a.contributions || a.login.localeCompare(b.login),
  );
  return {
    repository: parseRepository(repository).fullName,
    contributors: list,
    incomplete: options.incomplete ?? false,
  };
}
export function creditsMarkdown(doc: CreditsDocument): string {
  return (
    `# Contributors to ${escapeMarkdown(doc.repository)}\n\n${doc.incomplete ? "Partial result: this list may be incomplete.\n\n" : ""}Thank you to everyone who contributes. Counts are reported by GitHub.\n\n` +
    doc.contributors
      .map(
        (c) =>
          `- [${escapeMarkdown(c.login)}](${c.html_url}) - ${c.contributions} contributions`,
      )
      .join("\n") +
    "\n"
  );
}
export function mergeContributorBaseline(
  baseline: Contributor[],
  latest: Contributor[],
): Contributor[] {
  const map = new Map(baseline.map((c) => [c.id, c]));
  for (const c of latest) map.set(c.id, c);
  return [...map.values()];
}
function escapeMarkdown(text: string): string {
  return text.replace(/[\\`*_{}[\]<>()!|]/g, "\\$&");
}
