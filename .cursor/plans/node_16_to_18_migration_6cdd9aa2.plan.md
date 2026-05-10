---
name: Node 16 to 18 migration
overview: Update toolchain declarations to Node 18, then validate installs and runtime behavior. Most application code should be unaffected; the main risks are OpenSSL 3 (TLS to legacy endpoints), DNS/localhost ordering for outbound HTTP, and keeping dependency versions aligned with the registry.
todos:
  - id: update-engines-volta
    content: Update package.json engines and volta to Node 18 (aligned with deploy/CI)
    status: completed
  - id: fix-install-pins
    content: Run npm install on Node 18; fix any bad version pins (e.g. @koa/router) or add lockfile
    status: completed
  - id: sync-ci-deploy
    content: Update any CI/Docker/host Node version to 18 (or chosen LTS)
    status: completed
  - id: smoke-test-runtime
    content: Smoke-test server + axios-backed env URLs; watch for TLS/DNS/localhost issues
    status: completed
isProject: false
---

# Node 16 → 18 migration review

## Current state

- Runtime pin: [`package.json`](package.json) has `"engines": { "node": "16" }` and Volta `16.20.2`.
- Stack: Koa 2, Apollo Server 3 (`apollo-server-koa`), GraphQL 15, axios, Winston, dynamic `require()` in [`config/configurationLoader.js`](config/configurationLoader.js) and [`graphql/artifactsLoader.js`](graphql/artifactsLoader.js). No TypeScript, no native addons in-repo.
- Your terminal error (`No matching version found for @koa/router@9.0.0`) does not match the current [`package.json`](package.json), which lists `@koa/router@15.5.0`. **Before** relying on Node 18, run a clean `npm install` and fix any `ETARGET` by using a version that exists on npm (your current pin is plausible).

## Changes to make in this repo (before / as part of the switch)

| Area | Action |
|------|--------|
| [`package.json`](package.json) `engines` | Set to Node 18, e.g. `"node": ">=18.0.0"` or pin `"18.x"` to match your deploy environment. |
| [`package.json`](package.json) `volta` | Bump to an 18 LTS patch you standardize on (e.g. `18.20.x` or whatever Volta supports today). |
| CI / deploy | Ensure images, `nvm`, asdf, or platform runtimes use Node 18 everywhere this app runs (no repo CI file was found; update any external config). |
| Lockfile | If you add or regenerate `package-lock.json`, commit it so installs are reproducible across Node 18 machines. |

No application source files **must** change solely for Node 18 if dependencies install and start cleanly.

## Node 18 breaking / behavioral changes to watch (after upgrading)

These are the items most likely to affect a small Koa + axios service:

1. **OpenSSL 3.0** (Node 17+; still in 18)  
   - Stricter TLS: very old servers or cipher suites can fail where they worked on Node 16 (OpenSSL 1.1.1).  
   - **Mitigation:** reproduce failing HTTPS calls with logging; upgrade remote endpoints or adjust TLS only if you hit a real failure (avoid turning off verification in production).

2. **DNS resolution order** (Node 17+ default: “verbatim” / not IPv4-first)  
   - Code that calls `axios` (or other HTTP clients) against **`localhost`** or dual-stack hostnames might prefer IPv6 first; if a service listens only on IPv4, you can see `ECONNREFUSED` on some machines.  
   - **Mitigation:** use `127.0.0.1`, set `NODE_OPTIONS=--dns-result-order=ipv4first` if needed, or fix the target URL/host configuration ([`config/postServiceConfiguration.js`](config/postServiceConfiguration.js) builds URLs from env).

3. **Global `fetch` / Web APIs**  
   - Node 18 exposes `fetch`, `Headers`, `Request`, `Response`. Unlikely to break existing CommonJS code unless you added polyfills that assume `fetch` is undefined.

4. **Tooling**  
   - ESLint 6 + `eslint-config-airbnb-base` 14 are old but usually still run on Node 18. If `npm run` scripts fail, upgrade ESLint in a **separate** change to keep the Node bump diff small.

## Dependencies (not strictly required for Node 18, but good to know)

- **Apollo Server 3** is deprecated; it still commonly runs on Node 18. A future migration would be Apollo Server 4 + `@apollo/server` + a Koa integration package—out of scope for “move to Node 18” unless you want to combine efforts.
- **`@types/axios`** is deprecated (axios ships its own types); optional cleanup later.

## Runtime calendar note (2026)

Node 18 may already be past its maintenance window depending on the exact date. If this project needs a **supported** LTS runtime in 2026, consider targeting **Node 20** (or current LTS) instead of stopping at 18—same class of checks (OpenSSL 3, DNS) still apply.

## Verification checklist (after Node 18 is active locally and in deploy)

1. `node -v` shows 18.x; `npm install` completes with no `ETARGET` / engine errors.  
2. Start the app (`npm start`); hit `/graphql` and exercise main queries.  
3. Confirm env-based HTTP calls to your posts/authors API succeed (catches TLS + DNS issues).  
4. If anything TLS-related fails, capture the endpoint and error; fix server/cert or client options deliberately.

No mermaid diagram is necessary: the migration is toolchain + validation, not an architecture change.
