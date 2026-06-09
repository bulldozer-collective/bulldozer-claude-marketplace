---
name: bulldozer-ads-management
description: |
  Guidance for managing LinkedIn and Meta ads through the Bulldozer MCP server, covering ad account resolution (persisted to bulldozer.json), platform-specific hierarchy nomenclature, and ad import workflows.
when-to-use: |
  Use when the user asks to import, list, search, analyze, or otherwise manage LinkedIn or Meta ads via Bulldozer — including any operation that requires resolving an ad account, creating an ad import, or referencing campaigns/ad sets/ads.
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - mcp__plugin_bulldozer_bulldozer__listRegisteredAdAccounts
  - mcp__plugin_bulldozer_bulldozer__searchAdAccounts
  - mcp__plugin_bulldozer_bulldozer__createAdAccount
  - mcp__plugin_bulldozer_bulldozer__createAdImport
  - mcp__plugin_bulldozer_bulldozer__startAdImport
  - mcp__plugin_bulldozer_bulldozer__listAdImports
  - mcp__plugin_bulldozer_bulldozer__listAds
effort: medium
paths:
  - bulldozer.json
  - "**/bulldozer.json"
---

# Bulldozer Ads Management

This skill explains how to interact with the Bulldozer MCP server for all operations related to ads on LinkedIn and Meta. It also persists ad account configuration to `bulldozer.json`.

## Tools reference

For brevity, the MCP tools are referenced below by short names. Their full names are all prefixed with `mcp__plugin_bulldozer_bulldozer__`:

| Short name | Full tool name |
|---|---|
| `listRegisteredAdAccounts` | `mcp__plugin_bulldozer_bulldozer__listRegisteredAdAccounts` |
| `searchAdAccounts` | `mcp__plugin_bulldozer_bulldozer__searchAdAccounts` |
| `createAdAccount` | `mcp__plugin_bulldozer_bulldozer__createAdAccount` |
| `listAdImports` | `mcp__plugin_bulldozer_bulldozer__listAdImports` |
| `createAdImport` | `mcp__plugin_bulldozer_bulldozer__createAdImport` |
| `startAdImport` | `mcp__plugin_bulldozer_bulldozer__startAdImport` |
| `listAds` | `mcp__plugin_bulldozer_bulldozer__listAds` |

When these tools accept a platform filter, pass it as the `platform` parameter with the value `LINKEDIN` or `META` (uppercase). If a tool's actual schema differs, follow the schema returned by the MCP server and adapt accordingly.

## Determining the target platform

Before any ad operation, the target platform (`LINKEDIN` or `META`) must be known. Determine it in this order:

1. From the user's explicit request (e.g., "import my LinkedIn ads").
2. From `bulldozer.json` if a single platform is configured under `.ads.adAccount`.
3. If still ambiguous, ask the user to choose between LinkedIn and Meta.

# Ad account management

Every ad-related tool call must be associated with an ad account. Some tools accept the ad account as a direct parameter; others infer it from configuration. When an explicit ad account is needed, follow the resolution flow below.

## `bulldozer.json`

The ad account for a given platform is stored in `bulldozer.json`, usually at the project root. The relevant key is `.ads.adAccount.${PLATFORM}` where `${PLATFORM}` is `LINKEDIN` or `META`.

Example structure:

```json
{
  "ads": {
    "adAccount": {
      "LINKEDIN": "<linkedin-ad-account-id>",
      "META": "<meta-ad-account-id>"
    }
  }
}
```

### Locating the file

Use `Glob` (or `Read` if the path is known) to find `bulldozer.json`. Search upward from the current working directory toward the repository root, taking the **nearest** (deepest, closest to CWD) `bulldozer.json` as authoritative — this matches typical monorepo conventions where a nested project overrides a parent config.

If multiple `bulldozer.json` files are found and it's unclear which applies (e.g., the user is operating across multiple workspaces), list the candidate paths to the user and ask which one to use before reading or writing.

### Handling edge cases

- **File not found:** search upward from the working directory; if none exists, create a new `bulldozer.json` at the project root once an account has been resolved.
- **File malformed:** report the parse error to the user and ask whether to repair or recreate it. Do not silently overwrite.
- **Key missing for the target platform:** trigger the ad account resolution flow below, then write the result back.

## Ad account resolution flow

If the ad account for the target platform is not present in `bulldozer.json`:

1. Call `listRegisteredAdAccounts` with the target platform (e.g., `{ platform: "META" }`).
   - **If one or more accounts are returned:** present them as a numbered list showing, for each account, its `id`, `name`, and `platform`. Ask the user to choose one.
2. **If `listRegisteredAdAccounts` returns 0:**
   - Call `searchAdAccounts` with the target platform (e.g., `{ platform: "META" }`).
   - **If one or more accounts are returned:** present a numbered list (`id`, `name`, `platform`) and ask the user to choose one. Then call `createAdAccount` with the chosen account to register it.
   - **If `searchAdAccounts` also returns 0:** stop and inform the user that no ad account is available for the platform; ask them to grant access or create one on the platform side, then retry. Do not proceed with any ad operation.
3. Persist the resolved ad account into `bulldozer.json` under `.ads.adAccount.${PLATFORM}` (creating the file or keys as needed).
4. Use the resolved ad account for subsequent calls.

# Ad hierarchy and nomenclature

Bulldozer uses a generic 3-layer model internally. When communicating with the user, always use the platform-specific terms below — never "Layer 1/2/3".

| Bulldozer | LinkedIn | Meta |
|---|---|---|
| Layer 1 (top) | Campaign Group | Campaign |
| Layer 2 (middle, child of Layer 1) | Campaign | Ad Set |
| Layer 3 (leaf, child of Layer 2; the actual ad) | Creative / Ad | Ad |

Notes:
- LinkedIn's hierarchy is **Campaign Group → Campaign → Creative (Ad)**.
- Meta's hierarchy is **Campaign → Ad Set → Ad** (note the space in "Ad Set").
- Each Layer 2 belongs to exactly one Layer 1; each Layer 3 belongs to exactly one Layer 2.
- If the user uses a different convention (e.g., "ads" generically), mirror their term but stay consistent within the platform.

# Ad import

Ads from platforms are only stored as part of an `AdImport`. Each `AdImport` targets:
- a specific platform,
- a time range (start and end dates),
- an ad account.

## Time range conventions

- If the user is vague ("last week", "this month"), **ask for explicit start and end dates** rather than assuming. When proposing a default for clarification, use ISO 8601 dates and the **user's local timezone** if known; otherwise propose UTC and state that explicitly.
- For week-based ranges, default to ISO weeks (Monday–Sunday) unless the user specifies otherwise.
- Always confirm the date range and timezone back to the user before creating the import, since ad reporting is timezone-sensitive.

## Workflow

1. **Check existing data first.** Before creating a new import, call:
   - `listAdImports` for the target ad account to see whether prior imports already cover the requested time range (this is the primary coverage check).
   - Optionally, `listAds` if the user wants to verify that specific ads/content are already present, not just that an import ran.
   If existing coverage is found, surface it to the user and confirm before proceeding.
2. **Get explicit user agreement** before creating or starting any new import.
3. Once agreed, call `createAdImport` then immediately `startAdImport` in sequence, without further user interaction between the two calls.
4. **Report status after `startAdImport`.** Imports are asynchronous: `startAdImport` typically returns immediately with an import identifier and an initial status (e.g., `PENDING` / `RUNNING`). To check progress:
   - Re-call `listAdImports` (filtered to the ad account) and locate the import by its id.
   - Report the current status to the user. Avoid tight polling loops; check once after starting and again only if the user asks for an update or before performing a follow-up operation that depends on the import being complete.
   - If the import fails or stalls, surface the error and ask the user how to proceed (retry, narrow the time range, etc.).

# Layer 3 (Ad) rules

- When the user asks for the URL of the creative of a Layer 3 ad (i.e., an `Ad` / `Creative`), return the **complete, unmodified URL**. Do not truncate, normalize, or rewrite query parameters.

# Example

**User:** "Import last week's Meta ads."

1. Target platform: `META` (from the request).
2. Locate and read `bulldozer.json` (searching upward from CWD). If `.ads.adAccount.META` is missing, run the ad account resolution flow and persist the result.
3. Confirm the time range with the user — e.g., "Last week = Mon YYYY-MM-DD to Sun YYYY-MM-DD in your local timezone, OK?" — before proceeding.
4. Call `listAdImports` for the resolved Meta ad account; if an import already covers that range, tell the user and ask whether to skip or re-import.
5. With explicit agreement, call `createAdImport` then `startAdImport`.
6. Re-call `listAdImports` to fetch the new import's status and report it to the user using Meta nomenclature (Campaign / Ad Set / Ad).
