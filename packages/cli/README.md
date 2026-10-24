# CodeIN CLI

A bundled ESM command-line toolkit for maintainers. Requires Node.js 24. Download and verify the archive with `checksums.txt` from [GitHub Releases](https://github.com/SauravMukherjee44/CodeIN-Community/releases), then install:

```sh
npm install -g ./codein-community-cli-0.1.1.tgz
codein --help
codein audit ./my-project --format json
codein audit owner/repo --format markdown
codein templates --repo owner/repo --out ./contribution-kit --branch main --test "pnpm test"
codein credits owner/repo --format markdown --order alphabetical --exclude-bots
```

Templates create CONTRIBUTING.md, a PR template, and bug/feature forms. `--out` is required; existing files and nested symbolic links are protected. Use `--overwrite` only after reviewing the destination. Commands are inserted as documentation and never executed.

Audit exits: **0** all nine checks present, **1** missing or unknown findings, **2** execution or input failure. The presence audit does not certify code quality, security, or license validity. The local walker skips dependency/build directories, symbolic links, and the legacy archive; inventories above depth 16 or 20,000 entries are incomplete.

Credits exits: **0** complete GitHub list, **1** partial list, **2** execution or input failure. The public GitHub contributors endpoint may omit identities according to GitHub's own rules; CodeIN's website separately retains its preserved baseline.

`GITHUB_TOKEN` is optional and remains in your local process. Only public repositories are supported, including with a token. Rate-limit and unavailable errors are reported rather than silently generating empty credits. No commands modify GitHub.
