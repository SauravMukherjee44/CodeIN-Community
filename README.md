# CodeIN Community

[![Community CI](https://github.com/SauravMukherjee44/CodeIN-Community/actions/workflows/ci.yml/badge.svg)](https://github.com/SauravMukherjee44/CodeIN-Community/actions/workflows/ci.yml)

A community for developers to learn, contribute, and build together — with open-source tools that make repository maintenance easier.

[Website](https://codeincommunity.com) · [Tools](https://codeincommunity.com/tools) · [Documentation](https://codeincommunity.com/docs) · [Contributors](https://codeincommunity.com/contributors) · [Our history](https://codeincommunity.com/heritage)

## What is here?

| Workspace          | Purpose                                                                                  |
| ------------------ | ---------------------------------------------------------------------------------------- |
| `apps/web`         | Next.js App Router community website and interactive developer tools                     |
| `packages/toolkit` | Framework-independent, typed ESM audit, template, and credits engines                    |
| `packages/cli`     | Bundled `codein` command-line interface                                                  |
| `legacy/website`   | Complete original website, preserved with its assets, documentation, and license notices |

The three tools are a Repository Readiness Auditor, Contribution Template Builder, and Contributor Credits Generator. The website supports public GitHub repositories; the auditor CLI also supports local directories. File presence checks are guidance, not certification of a repository's quality or security.

## Develop

Use Node.js 24 and pnpm 11.25.0 (the version pinned in `packageManager`).

```sh
corepack enable
corepack prepare pnpm@11.25.0 --activate
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://127.0.0.1:3100`. No token is required. An optional server-only `CODEIN_GITHUB_TOKEN` improves the GitHub rate limit; never prefix it with `NEXT_PUBLIC_`. The CLI separately reads `GITHUB_TOKEN`. Only public repositories are accepted, even when a token can access private ones.

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
pnpm pack:release
node scripts/smoke-package.mjs
```

Browser tests cover tool results and downloads, validation, themes, keyboard navigation, responsive layout, redirects, contributor fallback, and automated accessibility. Their GitHub fixtures make failures reproducible without an API token. Run against a deployed preview with `PLAYWRIGHT_BASE_URL=https://your-preview.netlify.app pnpm test:e2e`.

## Use the CLI or library

Download the `.tgz` archives and `checksums.txt` from [GitHub Releases](https://github.com/SauravMukherjee44/CodeIN-Community/releases). npm publication is deferred.

```sh
npm install -g ./codein-community-cli-0.1.0.tgz
codein audit ./my-repo --format json
codein templates --repo owner/repo --out ./contribution-kit
codein credits owner/repo --format markdown --exclude-bots
```

The CLI is bundled and does not require an unpublished npm dependency. Audit exits: **0** all checks present, **1** missing/unknown findings, **2** execution or input error. Credits exit **1** for a partial list; do not treat it as complete. Templates refuse to replace existing files without `--overwrite`.

```ts
import {
  auditRepository,
  generateContributionFiles,
  createCredits,
} from "@codein-community/toolkit";
import {
  fetchRepository,
  fetchContributors,
} from "@codein-community/toolkit/github";

const report = auditRepository(await fetchRepository("owner/repo"));
```

See the [toolkit README](packages/toolkit/README.md), [CLI README](packages/cli/README.md), and [online documentation](https://codeincommunity.com/docs) for interfaces and limitations.

## History and credit

This is the same repository and Git history as CodeIN-Community-Website. The original 406 tracked files are preserved under `legacy/website`, with SHA-256 hashes in `legacy/manifest.json` and the original commit tagged `legacy-website-2026-10-24`. Run `node scripts/verify-legacy.mjs` to verify the archive. Legacy scripts and dependencies are excluded from the modern workspaces and deployment.

All 150 GitHub contributor identities captured across both API pages are retained in `apps/web/src/data/contributors.json`. Successful complete refreshes can add or update identities by stable GitHub ID; outages and partial responses cannot erase the baseline. Historical volunteer roles are recorded separately in `historical-team.json` and are not presented as current maintainer appointments. Thank you to everyone who built CodeIN.

## Contribute and deploy

Read [CONTRIBUTING.md](CONTRIBUTING.md), [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md), and [SECURITY.md](SECURITY.md). The repository owner is [Saurav Mukherjee](https://github.com/SauravMukherjee44). See [deployment and rollback instructions](docs/DEPLOYMENT.md) before changing production. Netlify serves the Next.js application at the existing domain.

MIT licensed. Third-party notices remain alongside the original assets in the legacy archive.
