---
name: bulldozer-app-creator
description: Build a "Bulldozer App" — a custom tool/app developed in Angular, wired to the Bulldozer REST API, compiled, and published as a public static site via Bulldozer Hosting.
when-to-use: |
  Use whenever the user wants to create a "tool", an "app", an "application", a "mini-app", a
  "web app", a "dashboard", a "widget", or anything similar. Always first ask if they want to
  create a "Bulldozer App"; if yes, follow this skill.
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - WebFetch
  - mcp__plugin_bulldozer_bulldozer__bdzCreateHosting
  - mcp__plugin_bulldozer_bulldozer__bdzReplaceHostingContent
  - mcp__plugin_bulldozer_bulldozer__bdzRequestFridgeCode
  - mcp__plugin_bulldozer_bulldozer__bdzExploreHosting
effort: medium
---

# Bulldozer App

A **Bulldozer App** is a custom tool/application built on the Bulldozer stack: an **Angular**
front end that talks to the **Bulldozer REST API**, compiled to a static bundle and published
as a **public static site** via **Bulldozer Hosting**.

## Prerequisite — customer/project context

Every MCP call in this skill (`bdzCreateHosting`, `bdzRequestFridgeCode`,
`bdzReplaceHostingContent`) needs a `customerId` and a `projectId`. Before anything else, ensure
both are available via the **`bulldozer-project-chooser`** skill / **`bulldozer.json`** (same
pattern as `bulldozer-hosting`). Do not hardcode them.

## Step 0 — Confirm intent (MANDATORY)

Whenever the user asks to create a **tool**, **app**, **application**, **web app**, **dashboard**,
**widget**, or any related word, **first ask**:

> "Do you want to create a **Bulldozer App**?"

- If **no** → do not apply this skill; help them the normal way.
- If **yes** → also ask the following, then enforce the rules below (they are non-negotiable):
  - **Name of the application** — a human-readable name.
  - **Subdomain** — explain that this is the part **at the end of the URL**: the app will be
    served at `https://{customerSlug}.bulldozer-os.fr/{subdomain}/`. Must be a valid DNS label
    (lowercase letters/digits/hyphens, max 63) and unique per customer.
  - **Is this an internal tool?** — i.e. a tool for the **Bulldozer team itself** (admin / ops /
    sales operators), as opposed to an app built for a customer. Explain that this single answer
    decides whether the **Admin API** is available (see Rule 2.b) — it changes nothing else.

## Step 0.b — Generate a client id and prepare the hosting

Once you have the name and subdomain:

1. **Generate a client id** with a **random suffix** to prevent duplication, e.g.
   `bdz-app-{subdomain}-{random}` (the random part guarantees the Keycloak client id is unique).
2. **Prepare the hosting** (reserve the site + provision OAuth **before** building the app):
   call **`bdzCreateHosting`** with:
   - `type = HOSTING_TYPE_STATIC_SITE`
   - `name` = the application name
   - `subdomain` = the chosen subdomain
   - `clientId` = the generated client id
   - **omit `fridgeId` and `url`** — this "prepare" mode reserves the subdomain/URL and
     provisions the public Keycloak OAuth client (redirect URIs / web origins are configured
     server-side against `publicUrl` — no manual Keycloak step), returning `clientId`, `subdomain`,
     `publicUrl` (and the hosting `id`). You upload the compiled code later (Rule 4).
   - On a **re-publish**, reuse the **same `clientId`** and hosting `id` — `bdzReplaceHostingContent`
     keeps the hosting and its OAuth client; a new client id would require a new hosting.
3. **Use the response to set up Keycloak OAuth** in the Angular app:
   - **Server**: `https://auth.bulldozer-collective.fr`
   - **realm**: `bdz-saas-dev`
   - **client-id**: the one you generated (returned in the response)
   - See the reference file **`references/oauth-boilerplate.md`** for the exact `app.config.ts`,
     `environment.ts`, `silent-check-sso.html`, and the `package.json` dependencies to add.

## Rule 1 — Angular only

- The app **must** be developed in **Angular**.
- **No React. No Vue. No Vercel.** No other framework or hosting platform.
- Scaffold with the Angular CLI (`ng new`), build a normal Angular project.
- The app **must use hash routing** — `provideRouter(routes, withHashLocation())`. It is served
  from a sub-path (`…/{subdomain}/`) on a static host with no SPA deep-link fallback, so path
  routing would 404 on refresh. See `references/oauth-boilerplate.md`.

## Rule 2 — Use the Bulldozer REST API documentation

- The Bulldozer REST API documentation is fetched from:
  **`https://docs.bulldozer-collective.fr/v2/index.md`**
- Fetch this doc (WebFetch) and use it as the **source of truth** to build whatever the user
  asked for — endpoints, request/response shapes, auth.
- If the user requests a feature or data that is **not available in the docs**, **warn the user**
  clearly that it is not supported by the Bulldozer API, and do not silently invent an endpoint.

## Rule 2.b — Admin API: internal tools only

The **Admin API** (`/admin/**`) is reserved for tools built for the Bulldozer team. Whether it is in
scope depends entirely on the internal-tool answer from Step 0:

- **Internal tool → the Admin API doc is in scope.** Fetch it from:
  **`https://docs.bulldozer-collective.fr/v2/ADMIN_API.md`**
  It is **not listed in the chapter table** of `index.md`, so it will not be discovered by following
  Rule 2 — use that direct URL. It covers `/admin/users`, `/admin/customers`,
  `/admin/customers/{customerId}/projects`, and `/admin/commands`.
- **Not an internal tool → ignore that doc entirely.** Do not fetch it, and do not use any `/admin/**`
  endpoint: those endpoints are dedicated to internal tools. If the user asks for something only the
  Admin API can provide, **warn them** that it is not available for a customer-facing app — same
  posture as Rule 2 takes for undocumented features. Do not work around it with another endpoint.
- **Roles**: every `/admin/**` endpoint requires the caller's JWT to carry `BULLDOZER_ADMINISTRATOR`,
  `BULLDOZER_OPS`, or `BULLDOZER_SALES` — and some are Admin/Ops only, so read the access rules per
  endpoint in the doc. A user without one of those roles gets `403`, which is exactly why these
  endpoints are useless in a customer-facing app.

## Rule 3 — Customer/project context is mandatory

**~99% of Bulldozer API endpoints require two headers** — `X-Bdz-Customer-Id` and
`X-Bdz-Project-Id` — both derived from the **project membership the user selects**. The app
must, in this order:

1. **After confirming the user is authenticated**, fetch the user's **project memberships**
   (`GET /project-memberships`).
2. Let the user **choose which project** to use (e.g. a `<select>` of their memberships). This is
   the **first screen after login**, before any other API call.
3. Once chosen, set **`customerId` and `projectId` from the selected membership** (the membership's
   `project.customerId` and `project.id`) — never hardcode them.
4. Be **reactive to active-project changes**: keep the selection in a signal and inject the two
   headers via an HTTP interceptor that reads it at request time. When the user changes the active
   membership in the `<select>`, the whole UI + every subsequent API call must use the new
   `customerId`/`projectId` pair automatically.

**Exception — `/admin/**`:** admin endpoints are **realm-scoped** and need neither
`X-Bdz-Customer-Id` nor `X-Bdz-Project-Id`. This does **not** exempt an internal tool from Rule 3: it
will normally also call tenant-scoped endpoints, so keep the membership fetch, the project `<select>`,
and the interceptor. Sending the two headers to `/admin/**` anyway is harmless.

See the reference file **`references/project-context.md`** for the exact `ProjectService`,
`customer-id.interceptor`, the project `<select>` picker, and the reactive `effect` pattern.

## Rule 4 — Compile, zip, and host as a static site

When the app is done:

1. **Compile** the Angular app with the **base href set to the sub-path** it will be served from
   (otherwise the app cannot load its own JS/CSS):
   ```bash
   ng build --base-href "/{subdomain}/"
   ```
2. **Zip the build output root** — the Angular application builder emits to
   `dist/<project-name>/browser/`, and `index.html` **must sit at the root of the archive**. Zip
   from that directory, not from `dist/`:
   ```bash
   cd dist/<project-name>/browser && zip -r ../../../app.zip .
   ```
3. **Upload the zip to the fridge** using the **`bulldozer-fridge`** skill (do not hand-roll the
   upload). The zip must be ≤ 25 MB:
   - Mint a code: **`bdzRequestFridgeCode`** (needs `customerId`).
   - Upload with the bundled script and take **`file.id`** from the response as the `fridgeId`:
     ```bash
     python skills/bulldozer-fridge/scripts/upload_fridge_file.py --file app.zip --code <code>
     ```
4. **Publish the content to the hosting prepared in Step 0.b** by calling
   **`bdzReplaceHostingContent`** with `customerId`, `projectId`, the prepared hosting `id`, and
   that `fridgeId` (endpoint `PUT /hostings/{id}/content`; content must be a single `.html`/`.zip`).
   Do this within ~2h — fridge files auto-expire.
   - The site is served publicly at `https://{customerSlug}.bulldozer-os.fr/{subdomain}/`
     (the `publicUrl` from Step 0.b). Give that URL to the user.

   > **Note:** `bdzReplaceHostingContent` may not resolve until it is deployed to the live MCP
   > server. If it is unavailable, and you did not need "prepare" mode, you can instead create the
   > hosting directly from the fridge zip: `bdzCreateHosting` with `type = HOSTING_TYPE_STATIC_SITE`,
   > `fridgeId`, `name`, `subdomain`, and the generated `clientId`.

## Summary checklist

- [ ] Ensured `customerId`/`projectId` via `bulldozer-project-chooser` / `bulldozer.json`
- [ ] Asked "Do you want to create a Bulldozer App?" and got a yes
- [ ] Asked for the application **name** and **subdomain** (explained subdomain = end of URL)
- [ ] Asked whether the app is an **internal tool** (decides whether the Admin API is available)
- [ ] Generated a **client id** with a random suffix
- [ ] Prepared the hosting (`bdzCreateHosting`, `HOSTING_TYPE_STATIC_SITE`, no fridgeId/url) → got publicUrl
- [ ] Wired Keycloak OAuth (`auth.bulldozer-collective.fr` / `bdz-saas-dev` / generated client id) per `references/oauth-boilerplate.md`
- [ ] Built in Angular (no React, no Vercel), using **hash routing**
- [ ] After login: fetched memberships → project `<select>` → derived `customerId`/`projectId`, reactive to changes (per `references/project-context.md`)
- [ ] Fetched & used `https://docs.bulldozer-collective.fr/v2/index.md`; warned on anything not in the docs
- [ ] Used `ADMIN_API.md` / `/admin/**` **only** if the app is an internal tool — otherwise ignored it entirely
- [ ] Built with `--base-href "/{subdomain}/"` and zipped from `dist/<project-name>/browser` (index.html at zip root)
- [ ] Uploaded the zip via the `bulldozer-fridge` script, published with `bdzReplaceHostingContent`, and shared the public URL
