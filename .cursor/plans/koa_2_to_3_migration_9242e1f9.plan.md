---
name: Koa 2 to 3 migration
overview: Bump Koa to 3.1.2 and align TypeScript types; resolve the inevitable npm peer conflict with `apollo-server-koa` (still Koa 2–only on paper); verify the app boots with `npm start`.
todos:
  - id: bump-deps
    content: Set koa to 3.1.2 and @types/koa to 3.0.x in package.json
    status: completed
  - id: install-resolve-peers
    content: Run npm install with legacy-peer-deps (or add .npmrc) to satisfy apollo-server-koa peer
    status: completed
  - id: boot-verify
    content: Run npm start; confirm server log and optional health URL
    status: completed
isProject: false
---

# Migrate Koa 2.13.4 → 3.1.2

## Current stack (relevant)

- Entry: [`index.js`](index.js) — `new Koa()`, `apollo-server-koa` (`applyMiddleware`), [`koa-bodyparser`](index.js), [`@koa/router`](index.js). All middleware in-repo is already modern (async IIFE, no generator middleware).
- [`graphql/artifactsLoader.js`](graphql/artifactsLoader.js) only imports `gql` from `apollo-server-koa` (no Koa coupling).
- Node is already pinned for Koa 3: [`package.json`](package.json) `engines.node` is `>=18.0.0` and Volta uses 18.20.8.

## Koa 3 behavior changes (from [official migration doc](https://github.com/koajs/koa/blob/HEAD/docs/migration-v2-to-v3.md))

| Area | Action for this repo |
|------|----------------------|
| Node | Already ≥ 18 |
| Generator middleware | None in codebase (grep clean) |
| `ctx.throw(status, message, props)` | None in codebase |
| `redirect('back')` | None in codebase |
| Query parsing (`URLSearchParams`) | No custom `querystring` usage |

**Conclusion:** No application source edits are required for Koa 3 semantics in the current codebase.

## Dependency updates

1. **Runtime:** Set `koa` to **`3.1.2`** in [`package.json`](package.json).

2. **Dev types:** Bump **`@types/koa`** from `2.13.5` to **`3.0.x`** (e.g. `3.0.2`) — DefinitelyTyped now publishes a 3.x line aligned with Koa 3 ([`@types/koa` on npm](https://www.npmjs.com/package/@types/koa)).

3. **Leave unless issues arise:** `apollo-server-koa@3.10.0`, `@koa/router@13.1.1`, `koa-bodyparser@4.3.0`. Apollo’s own [`ApolloServer.ts` for 3.13.0](https://github.com/apollographql/apollo-server/blob/apollo-server%403.13.0/packages/apollo-server-koa/src/ApolloServer.ts) uses async middleware, `koa-compose`, `@koa/cors`, and `koa-bodyparser` — structurally compatible with Koa 3 even though the package metadata has not been updated.

## npm peer dependency conflict (expected)

[`apollo-server-koa` declares `peerDependencies.koa: ^2.13.1`](https://registry.npmjs.org/apollo-server-koa/3.10.0). Installing **Koa 3** next to it will trigger **`ERESOLVE`** under default npm peer rules.

**Practical resolution (pick one for the implementation phase):**

- Run install with **`npm install --legacy-peer-deps`**, or  
- Add a project **`.npmrc`** with `legacy-peer-deps=true` so CI/local installs stay consistent.

Document in a short comment or team note that this is intentional until you migrate off deprecated `apollo-server-koa` (e.g. to `@apollo/server` + a Koa integration) — **not** required to satisfy “Koa 3.1.2” if runtime checks pass.

## Verification (after user approves execution)

1. Clean install (with legacy peer deps as above).
2. **`npm start`** (runs `node index.js`) — expect log: `Server up!!!` with configured port ([`config/serverConfiguration.js`](config/serverConfiguration.js) defaults to `3000` or `PORT`).
3. Optional smoke check: `GET http://localhost:<port>/.well-known/apollo/server-health` (Apollo registers this in `apollo-server-koa`).

If boot fails, first capture the stack trace; likely causes would be a transitive package assuming Koa 2-only APIs (rare) or an outdated middleware — then narrow to the package named in the error.

## Out of scope (unless boot fails)

- Replacing `apollo-server-koa` with Apollo Server 4 + `@as-integrations/koa` (larger migration; current integration still lists Koa `^2` peers on npm).
- Switching `koa-bodyparser` → `@koa/bodyparser` (nice follow-up; not required for Koa 3 if current parser works).
