# @codein-community/toolkit

MIT-licensed ESM TypeScript libraries for public open-source maintenance. Install the `.tgz` from [CodeIN releases](https://github.com/SauravMukherjee44/CodeIN-Community/releases). TypeScript declarations are included. Node.js 24 is recommended; the pure entry point can also be bundled for browsers.

```ts
import {
  auditRepository,
  auditMarkdown,
  generateContributionFiles,
  createCredits,
  creditsMarkdown,
  mergeContributorBaseline,
} from "@codein-community/toolkit";
import {
  fetchRepository,
  fetchContributors,
  GitHubError,
} from "@codein-community/toolkit/github";

const snapshot = await fetchRepository("owner/repo");
const report = auditRepository(snapshot);
console.log(auditMarkdown(report));
```

`auditRepository(snapshot): AuditReport` consumes `{repository, files, fileContents?, incomplete?}`. Findings are `present`, `missing`, or `unknown` with file evidence and recommendations. Truncated inventories or unreadable manifests mark absent evidence unknown. Nine checks cover README, license, contribution guidance, conduct, security, issue/PR templates, CI, and tests. It detects presence and cannot validate legal sufficiency, file quality, or passing CI.

`generateContributionFiles(config): GeneratedFile[]` consumes repository, defaultBranch, installCommand, testCommand, lintCommand, and optional preferences. It returns four `{path,content}` files without writing or executing anything. Commands must be single-line without Markdown backticks or control characters.

`createCredits(repository, contributors, options?): CreditsDocument` deduplicates stable GitHub IDs and supports `order: 'alphabetical' | 'contributions'`, `includeBots`, and `incomplete`. Render via `creditsMarkdown(document)` or `JSON.stringify(document, null, 2)`. `mergeContributorBaseline(baseline, latest)` never removes historical baseline identities.

The separate `/github` adapter uses fixed GitHub API endpoints and validates owner/repository identifiers. It accepts `{token?,fetcher?}`, rejects private repositories, follows contributor pagination up to 50 pages, and reports partial results. `GitHubError.kind` distinguishes `rate-limit`, `not-found`, `unavailable`, and `invalid`. No downloaded code is executed. For current signatures consult the shipped `.d.ts` files or the source.

## Developer utilities

Version 0.2.0 also exports `@codein-community/toolkit/developer`: `formatJson(input, 'pretty' | 'compact')`, `convertBase64(input, 'encode' | 'decode')`, `inspectUrl(input)`, and `convertUrlComponent(input, 'encode' | 'decode')`. These browser-portable functions perform no network requests or filesystem access. JSON formatting preserves original numeric literals and key order; Base64 uses UTF-8; URL query entries preserve duplicate keys. Inputs are limited to 1,000,000 characters.
