---
name: |
  bulldozer-ads-management
description: |
  Guidance for managing LinkedIn and Meta ads through the Bulldozer MCP server, covering ad account resolution (persisted to bulldozer.json), platform-specific hierarchy nomenclature, and ad import workflows.
when-to-use: |
  Use when the user asks to import, list, search, analyze, or otherwise manage LinkedIn or Meta ads via Bulldozer — including any operation that requires resolving an ad account, creating an ad import, or referencing campaigns/ad sets/ads.
allowed-tools:
  - mcp__plugin_bulldozer_bulldozer__bdzListRegisteredAdAccounts
  - mcp__plugin_bulldozer_bulldozer__bdzSearchAdAccounts
  - mcp__plugin_bulldozer_bulldozer__bdzCreateAdAccount
  - mcp__plugin_bulldozer_bulldozer__bdzCreateAdImport
  - mcp__plugin_bulldozer_bulldozer__bdzStartAdImport
  - mcp__plugin_bulldozer_bulldozer__bdzListAdImports
  - mcp__plugin_bulldozer_bulldozer__bdzListPublicAds
  - Read
  - Write
  - Edit
effort: |
  medium
paths:
  - "bulldozer.json"
  - "**/bulldozer.json"
---

# Bulldozer Ads Management

This skill explains how to interact with the Bulldozer MCP server for all operations related to ads on LinkedIn and Meta. It also persists ad account configuration to `bulldozer.json`.

## Tools reference

For brevity, the MCP tools are referenced below by short names (e.g., `bdzListRegisteredAdAccounts`). Their full names are all prefixed with `mcp__plugin_bulldozer_bulldozer__` — for example, `mcp__plugin_bulldozer_bulldozer__bdzListRegisteredAdAccounts`.

## Time range conventions

- If the user is vague ("last week", "this month"), **ask for explicit start and end dates** rather than assuming. When proposing a default for clarification, use ISO 8601 dates and the **user's local timezone** if known; otherwise propose UTC and state that explicitly.
- For week-based ranges, default to ISO weeks (Monday–Sunday) unless the user specifies otherwise.
- Always confirm the date range and timezone back to the user before creating the import, since ad reporting is timezone-sensitive.

## Multiple data types

Bulldozer manages both public and private data. Private data are data collected from the user account directly, whereas public data are collected using less precise public sources.
When the user requests data for their own company, always use private data. If not, use public data. When in doubt, *always ask the user if they want to use private or public data*.

## Public data

Public data is available using the tool `bdzListPublicAds`, while providing a valid `companyId` and an optional time frame and pagination.

## Private data

### Determining the target platform

Before any ad operation, the target platform (`LINKEDIN` or `META`) must be known. Determine it in this order:

1. From the user's explicit request (e.g., "import my LinkedIn ads").
2. From `bulldozer.json`:
   - If exactly one platform is configured under `.ads.adAccount`, use it.
   - If both `LINKEDIN` and `META` are configured and the request is ambiguous, list the configured platforms back to the user and ask which one to target. Do not silently pick one.
3. If still ambiguous (no config, or the user hasn't specified), ask the user to choose between LinkedIn and Meta.

### Ad account management

Every private ad-related tool call must be associated with an ad account. Some tools accept the ad account as a direct parameter; others infer it from configuration. When an explicit ad account is needed, follow the resolution flow below.

### `bulldozer.json`

The ad account for a given platform is stored in `bulldozer.json`, usually at the project root. The relevant key is `.ads.adAccount.${PLATFORM}` where `${PLATFORM}` is `LINKEDIN` or `META`.

**Discovery:** Locate `bulldozer.json` by searching upward from the current working directory until one is found or the filesystem root is reached. If none exists, create one at the project root (CWD) when persisting the resolved ad account.

**Malformed file:** If `bulldozer.json` exists but is not valid JSON, stop and report the parse error to the user. Do not attempt to overwrite it — ask the user to fix or delete the file before retrying.

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

### Ad account resolution flow

If the ad account for the target platform is not present in `bulldozer.json`:

1. Call `bdzListRegisteredAdAccounts` with the target platform (e.g., `{ platform: "META" }`).
   - **If one or more accounts are returned:** present them as a numbered list showing, for each account, its `id`, `name`, and `platform`. Ask the user to choose one.
2. **If `bdzListRegisteredAdAccounts` returns 0:**
   - Call `bdzSearchAdAccounts` with the target platform (e.g., `{ platform: "META" }`).
   - **If one or more accounts are returned:** present a numbered list (`id`, `name`, `platform`) and ask the user to choose one. Then call `bdzCreateAdAccount` with the chosen account to register it.
   - **If `bdzSearchAdAccounts` also returns 0:** stop and inform the user that no ad account is available for the platform; ask them to grant access or create one on the platform side, then retry. Do not proceed with any ad operation.
3. Persist the resolved ad account into `bulldozer.json` under `.ads.adAccount.${PLATFORM}` (creating the file or keys as needed, preserving any existing unrelated keys).
4. Use the resolved ad account for subsequent calls.

### Ad hierarchy and nomenclature

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

### Ad import

Ads from platforms are only stored as part of an `AdImport`. Each `AdImport` targets:
- a specific platform,
- a time range (start and end dates),
- an ad account.

**Canonical import flow:**

1. Resolve the target platform and ad account (per the sections above).
2. Confirm the explicit time range and timezone with the user.
3. Call `bdzListAdImports` for the resolved ad account and **check for an existing import covering the requested range**. If one exists, tell the user and ask whether to skip or re-import before proceeding.
4. With explicit agreement, call `bdzCreateAdImport`, then `bdzStartAdImport`.
5. Call `bdzListAdImports` again to fetch the new import's status and report it back using platform-specific nomenclature.

**Tool parameter hints** (verify against tool schemas at call time):
- `bdzCreateAdImport`: typically requires `platform` (`LINKEDIN` | `META`), `adAccountId`, `startDate` (ISO 8601), and `endDate` (ISO 8601). It returns an import identifier.
- `bdzStartAdImport`: typically requires the import identifier returned by `bdzCreateAdImport`.
- `bdzListAdImports`: typically accepts at least the `adAccountId` and returns imports with their status and covered time range.

### Layer 3 (Ad) rules

- When the user asks for the URL of the creative of a Layer 3 ad (i.e., an `Ad` / `Creative`), return the **complete, unmodified URL**. Do not truncate, normalize, or rewrite query parameters.

## Example

**User:** "Import last week's Meta ads."

1. Target platform: `META` (from the request).
2. Locate `bulldozer.json` by searching upward from CWD. If `.ads.adAccount.META` is missing, run the ad account resolution flow and persist the result.
3. Confirm the time range with the user — e.g., "Last week = Mon YYYY-MM-DD to Sun YYYY-MM-DD in your local timezone, OK?" — before proceeding.
4. Call `bdzListAdImports` for the resolved Meta ad account; if an import already covers that range, tell the user and ask whether to skip or re-import.
5. With explicit agreement, call `bdzCreateAdImport` then `bdzStartAdImport`.
6. Re-call `bdzListAdImports` to fetch the new import's status and report it to the user using Meta nomenclature (Campaign / Ad Set / Ad).
