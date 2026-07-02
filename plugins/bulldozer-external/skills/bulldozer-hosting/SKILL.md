---
name: bulldozer-hosting
description: Host a static HTML page or zipped static site on Bulldozer — a private, project-scoped S3 upload  read back through short-lived presigned URLs
when-to-use: |
  Use when the user wants to durably host / publish / "put online" a static HTML page or a zipped  static site and get a link to view it, from a URL or a file they uploaded to the fridge. NOT for throwaway/scratch file drops (use the fridge) or generated project assets (use studio).
user-invocable: false
allowed-tools:
  - mcp__plugin_bulldozer_bulldozer__bdzCreateHosting
  - mcp__plugin_bulldozer_bulldozer__bdzExploreHosting
  - mcp__plugin_bulldozer_bulldozer__bdzListHostings
  - mcp__plugin_bulldozer_bulldozer__bdzGetHosting
  - mcp__plugin_bulldozer_bulldozer__bdzUpdateHosting
  - mcp__plugin_bulldozer_bulldozer__bdzDeleteHosting
  - mcp__plugin_bulldozer_bulldozer__bdzRequestFridgeCode
effort: low
---

# Bulldozer Hosting

**Hosting** stores a static HTML page or a `.zip` archive in a **private** S3 bucket and lets you read
it back via a **short-lived presigned URL**. It is project-scoped and durable (unlike the ephemeral
fridge).

## Core facts

- **Source of the content** — a hosting is created from exactly one of, in priority order
  **`fridgeId` > `url` > `file`**:
  - a **`fridgeId`** — a file previously dropped in the Bulldozer fridge (owner-only: only the user
    who uploaded the fridge file can host it);
  - a **`url`** — an `http(s)` link the server downloads (SSRF-guarded: no private/internal hosts);
  - a **`file`** — a direct multipart upload (browser/API only; **not** available over MCP).
  Content must be a single HTML page (`.html`/`.htm`) or a `.zip`, **≤ 25 MB**.
- **Private storage** — the object lives at S3 key `hostings/{id}`; it is **not** publicly served.
  The **only** way to read it is a presigned URL from **explore**.
- **Identified by `id`** — create returns the `Hosting` (with its `id`). Use that id for get / explore
  / update / delete / share.
- **Optional `validUntil`** — an expiry. After it passes, **explore returns 403** (get/list still show
  the hosting so you can extend it). Update can change or clear `validUntil`.
- **Sharing** — a hosting can be shared with other users (`share`); an active share lets that user
  get/explore it even if they are not a project member.
- **Access** — create/list/get need a project member (or customer/bdz admin); update/delete/share are
  restricted to the **author** (+ customer/bdz admin). All gated by the `BASICS` subscription.

## Workflow A — host from a URL

Use when the content is already reachable at a public `http(s)` URL.

1. Ensure a `customerId`/`projectId` are available (via `bulldozer-project-chooser` / `bulldozer.json`).
2. **Create**: call **`bdzCreateHosting`** with `url` (and optional `validUntil`). It returns the
   `Hosting` including its `id`.
3. **Explore**: call **`bdzExploreHosting`** with that `id` to get a presigned URL, and give it to the
   user to view the page.

## Workflow B — host a local file (via the fridge)

MCP cannot upload a file directly, so a local file is first parked in the fridge, then hosted by id.

1. **Drop the file in the fridge** — follow the **`bulldozer-fridge`** skill (mint a code with
   `bdzRequestFridgeCode`, upload with the script). Note the returned fridge file **`id`**.
2. **Create**: call **`bdzCreateHosting`** with `fridgeId` = that id (and optional `validUntil`).
   Only the user who uploaded the fridge file may host it (else 403). Do this within ~2h — fridge files
   auto-expire.
3. **Explore**: call **`bdzExploreHosting`** with the hosting `id` for a presigned URL to view it.

## How and when to explore

- **`bdzGetHosting` / `bdzListHostings`** return **metadata only** (id, author, validUntil, shares) —
  **not** a usable content link.
- **`bdzExploreHosting`** is what mints a **presigned GET URL** (valid **1 hour**) to actually open the
  hosted file. Call it whenever the user wants to *view/open* the content, and again once the previous
  URL expires (the link is temporary; re-explore for a fresh one — no state changes).
- Explore fails with **403** if the hosting has expired (`validUntil` in the past) — clear/extend it via
  `bdzUpdateHosting` first.

## Manage

- **`bdzUpdateHosting`** — set/clear `validUntil`.
- **`bdzDeleteHosting`** — delete the hosting, its shares, and the S3 object.
- **`bdzAddHostingShare` / `bdzRemoveHostingShare`** — grant/revoke access to another user.