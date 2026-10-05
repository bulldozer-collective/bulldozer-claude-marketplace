---
name: bulldozer-app-creator-frontend
description: Build the screen of a Bulldozer App — an Angular front end, signed in against Bulldozer, scoped to the project the user picks, calling the Bulldozer API and the app's own service.
when-to-use: |
  Called by `bulldozer-app-creator`. Not invoked on its own.
user-invocable: false
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - WebFetch
effort: medium
metadata:
  forge: disabled
---

# The screen

You already have, from the router: the name, the subdomain, the client id, the `publicUrl`, whether
this is an internal tool, and — if the app has one — the routes its service exposes.

The rules below are not preferences. Each one exists because its absence produced a broken app.

## 1. Angular, and nothing else

Angular, scaffolded with the CLI (`ng new`). **No React, no Vue, no Vercel**, no other framework or
host.

**Hash routing is mandatory** — `provideRouter(routes, withHashLocation())`. The app is served from
a sub-path with no deep-link fallback, so path routing 404s on the first refresh.

**`api` is a reserved word in the app's address.** `…/{subdomain}/api/…` always belongs to the app's
service, for every app. So the compiled screen must contain **no folder named `api`** — an asset
placed there is uploaded and never served, silently. Name it `assets/`, `data/`, anything else.

Sign-in setup — `app.config.ts`, `environment.ts`, `silent-check-sso.html`, the dependencies to add
— is in **`references/oauth-boilerplate.md`**. Server `https://auth.bulldozer-collective.fr`, realm
`bdz-saas-dev`, client id the one the router gave you.

## 2. The Bulldozer API documentation is the source of truth

Fetch `https://docs.bulldozer-collective.fr/v2/index.md` and build against it. If the user asks for
data the documentation does not cover, **tell them it is not available** — never invent an endpoint.

**The Admin API is for internal tools only.** If, and only if, the router said this app is for the
Bulldozer team, also fetch `https://docs.bulldozer-collective.fr/v2/ADMIN_API.md` (it is not linked
from `index.md`). Otherwise do not fetch it and do not call `/admin/**`: those endpoints answer
`403` to anyone without a Bulldozer role, so in a customer-facing app they are dead weight. If the
user needs something only they provide, say so rather than working around it.

## 3. The project the user picks decides everything

Almost every Bulldozer endpoint needs `X-Bdz-Customer-Id` and `X-Bdz-Project-Id`, both derived from
the membership the user selects. In order:

1. once signed in, fetch the user's memberships (`GET /project-memberships`);
2. let them **choose a project** — this is the first screen after sign-in, before any other call;
3. take `customerId` and `projectId` from the chosen membership. Never hardcode them;
4. keep the choice in a signal and inject the two headers from an HTTP interceptor that reads it at
   request time, so changing project changes every subsequent call.

Two traps here fail **silently** — the app renders and the data is simply wrong. Both are worked
through in **`references/project-context.md`** (§3, §4):

- **never bind `[value]` on the project `<select>`** — carry the selection on the `<option>`s with
  `[selected]`, or the user's first switch emits no event at all;
- **gate tenant-scoped calls on `activeProject()`, not `activeProjectId()`** — the id is restored
  from `localStorage` before the memberships arrive, so keying on it fires calls with no headers.

`/admin/**` is realm-scoped and needs neither header, which exempts nothing: an internal tool still
calls tenant-scoped endpoints, so keep the picker and the interceptor. Sending the headers to
`/admin/**` anyway is harmless.

## 4. Calling the app's own service

Only when the app has one. The service lives at `{publicUrl}api/…` — same address as the screen, so
the browser sends its cookies and its sign-in token without any extra setup.

Copy **`assets/bulldozer-app.service.ts`** into the project as-is and use it. It knows the address,
attaches the token, and implements the one pattern a long task needs. Read
**`references/calling-the-app-backend.md`** before wiring a screen to a long task — getting it
wrong produces a spinner that never stops.

## Checklist

- [ ] Angular, hash routing, sign-in wired per `references/oauth-boilerplate.md`
- [ ] Built against `index.md`; anything undocumented reported to the user, not invented
- [ ] `ADMIN_API.md` fetched **only** if this is an internal tool
- [ ] Memberships → project picker → headers from an interceptor, reactive to changes
- [ ] `[selected]` on the options, tenant calls gated on `activeProject()`
- [ ] If the app has a service: `bulldozer-app.service.ts` copied in and used, not reinvented
