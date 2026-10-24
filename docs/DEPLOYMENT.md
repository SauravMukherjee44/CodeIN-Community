# Deployment, preservation, and rollback

## Production target

- Netlify site: `codeincommunity`
- Site ID: `2dfcf2fa-5ed0-484d-9094-af93c79956f8`
- Public domain: https://codeincommunity.com
- Production branch: `main`
- Workspace root build: `pnpm build`
- Next.js publish directory: `apps/web/.next`
- Node.js 24, pnpm 11.25.0; Netlify's OpenNext adapter handles routes and server functions.

Use the existing Netlify project. Never replace the live site with a static export of `.next`; the public GitHub API requires the Next.js server runtime. Configure the package directory as `apps/web` while retaining the repository root as the build base. `CODEIN_GITHUB_TOKEN` is optional and must remain server-side.

## Release gate

1. Verify `node scripts/verify-legacy.mjs`, all 150 baseline IDs, type checking, lint, unit/CLI tests, and a production build.
2. Run browser tests and visually inspect desktop/mobile and light/dark views. Serious and critical automated accessibility findings must be zero.
3. Pack the toolkit and CLI and install/run those exact `.tgz` artifacts in a temporary project. Publish those archives and `checksums.txt` in a GitHub Release.
4. Deploy a draft to the existing Netlify site, verify all three tools, old content redirects, and a genuine 404. Run the browser suite against its HTTPS URL.
5. Promote only the validated complete deployment. Verify the domain and read-only public GitHub endpoint afterward.

## Rollback

The validated v1.0 production deployment is **`6adcfc2e4c14db17a2a5c634`**. Retain it as the immediate rollback target for the v1.1 UI and developer tools release. Record the currently published successful deploy before every later cutover.

The last successful pre-migration production deployment is **`6a0bdb4cfc013000080fb312`**. Keep it available in Netlify's deployment history. In the existing site's Deploys view, select that deploy and use **Publish deploy** (restore a previous deploy). This restores the original published files without deleting new code or rewriting Git history. Pause automatic publishing if a newer failing build would otherwise replace the rollback.

The immutable source baseline is Git tag `legacy-website-2026-10-24`, commit `2e957ad7db868afbb793872cc3439edc5d1e3153`. The archive includes all 406 tracked files and license notices; hashes are in `legacy/manifest.json`.

## Repository rename

The approved name is `SauravMukherjee44/CodeIN-Community`. After renaming the existing repository, update the local origin, Netlify repository binding, badges, and references. Verify that the old repository URL redirects to the same repository and that the baseline tag is still reachable. Do not create a replacement repository or reinitialize Git.
