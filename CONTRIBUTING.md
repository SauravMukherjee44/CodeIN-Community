# Contributing to CodeIN Community

Welcome! Contributions to the website, toolkit, CLI, documentation, and accessibility are useful. Read our [code of conduct](CODE_OF_CONDUCT.md). For larger changes, open an issue describing the problem, scope, and expected behavior first.

## Local setup

Use Node.js 24 and pnpm 11.25.0. Fork this repository, create a focused branch from `main`, and run `pnpm install --frozen-lockfile` followed by `pnpm dev`. The website runs at `http://127.0.0.1:3100`. Accounts and GitHub tokens are not required for development.

## Choose an area

- `apps/web`: semantic React components, App Router pages, MDX documentation, typed community data, accessible responsive CSS. Use server components unless interaction requires a client component.
- `packages/toolkit`: deterministic TypeScript functions with no React, filesystem, or networking dependencies. Public GitHub transport lives in the separate `/github` entry point.
- `packages/cli`: filesystem and terminal adapters around the shared engine. Protect existing files and document exit codes.
- `tests`: behavior, regressions, downloads, accessibility, and release-installation coverage.

Preserve the existing Git history, historical credits, and all baseline contributor IDs. Do not edit `legacy/website` or its inventory to make verification pass. Add new material outside the archive. Do not describe historical events, sponsors, or volunteer roles as current.

## Verification

Run `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm build`. For interface changes, install Chromium using `pnpm exec playwright install chromium`, then run `pnpm test:e2e`. For package changes, run `pnpm pack:release` and `node scripts/smoke-package.mjs`. Include a regression test when fixing behavior; include screenshots for visual changes.

Open a pull request using the template. Explain the user-visible problem, the final change, and the checks you actually ran. Keep unrelated refactors out of the change. The maintainer may push reviewed maintenance and release changes directly; external contributions use pull requests.

## Community practice tracks

New to Git? Start with [the contribution guide](https://codeincommunity.com/contribute) and its checklist. Practice introducing yourself, documenting a resource, improving a small component, and checking your changes before submitting. Use the original practice material in `legacy/website/open-source-contributions.html` for historical context; do not add personal details to the archived source.
