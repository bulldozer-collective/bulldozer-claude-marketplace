---
name: bulldozer-sea
description: Query Google Ads campaigns, ad groups, keywords, and their metrics (impressions, clicks, cost, conversions, quality score), and generate new keyword ideas with search volumes and CPC ranges (Keyword Planner), via the Bulldozer SEA MCP tools.
when-to-use: |
  Use this skill whenever the user requests data about one of their Google Adwords accounts. Google ads, Google Adwords, and SEA are synonyms. The user may just use the word "keywords" to refer to their Google Adwords keywords. Some examples of requests: "what are my best keywords for last month", "list all the google ads campaigns running at the moment", "show me ad group performance", "which campaigns spent the most this week".
  Also use it for keyword *ideation* (Keyword Planner) requests: "find new keyword ideas for X", "what's the search volume for these keywords", "how much would this keyword cost / what's the CPC", "suggest keywords for this landing page", "keyword planner". Note the distinction: the reporting tools (bdzListSeaL1s/L2s/L3s, bdzGetSeaL*Metrics) describe keywords/campaigns **already running and imported**; the keyword-ideas tool (bdzGenerateSeaKeywordIdeas) discovers **candidate** keywords not yet in a campaign.
user-invocable: false
allowed-tools:
  - mcp__plugin_bulldozer_bulldozer__bdzListGoogleAdwordAccounts
  - mcp__plugin_bulldozer_bulldozer__bdzSearchAvailableGoogleAdwordAccounts
  - mcp__plugin_bulldozer_bulldozer__bdzAddGoogleAdwordAccount
  - mcp__plugin_bulldozer_bulldozer__bdzListSeaL1s
  - mcp__plugin_bulldozer_bulldozer__bdzListSeaL2s
  - mcp__plugin_bulldozer_bulldozer__bdzListSeaL3s
  - mcp__plugin_bulldozer_bulldozer__bdzGetSeaL1Metrics
  - mcp__plugin_bulldozer_bulldozer__bdzGetSeaL2Metrics
  - mcp__plugin_bulldozer_bulldozer__bdzGetSeaL3Metrics
  - mcp__plugin_bulldozer_bulldozer__bdzGenerateSeaKeywordIdeas
  - Read
  - Write
  - Edit
effort: medium
paths:
  - **/bulldozer.json
---

# Bulldozer SEA services

## Rules

Every call to Bulldozer SEA MCP tools requires:
- a valid Bulldozer `customerId`
- a valid Bulldozer `projectId`
- a valid Google Ad Account tuple (`adwordLoginId`, `adwordCustomerId`)

All three are read from a `bulldozer.json` file located at the root of the project. The Bulldozer `customerId` and `projectId` define the owner of the data and are independent from the Google Ad Account `adwordCustomerId`.

The Bulldozer `customerId` and `projectId` are resolved by the sibling skills `bulldozer:choose-customer-id` and `bulldozer:choose-project-id`. Those skills read/write `.customerId` and `.projectId` at the top level of `bulldozer.json` and prompt the user when missing. If those skills are not available in the current session, fall back to reading `.customerId` and `.projectId` directly from `bulldozer.json` and abort the request with a clear error if either is missing — do not invent values.

## Expected `bulldozer.json` shape

```json
{
  "customerId": "<bulldozer-customer-id>",
  "projectId": "<bulldozer-project-id>",
  "sea": {
    "adAccount": {
      "adwordLoginId": "<google-login-id-or-empty>",
      "adwordCustomerId": "<google-customer-id>"
    }
  }
}
```

Notes:
- `adwordLoginId` is optional (manager account); `adwordCustomerId` is required.
- Do **not** confuse the Google `adwordCustomerId` with the Bulldozer `customerId`.

## Config file handling

1. If `bulldozer.json` does **not exist** at the project root, abort the request and tell the user the file is missing. Do not create it from this skill.
2. If `bulldozer.json` exists but `.sea.adAccount` is missing or incomplete, run the **Google Ad Account resolution** flow below and write the result back into the file, preserving all existing keys (read → merge → write). Never overwrite or drop unrelated keys.

## Data Model

There are two independent data domains: **private Google Ads data** and **public Semrush data**. This skill covers the private Google Ads domain.

### Google Ad Account

A Google Ad account is a tuple: an `adwordLoginId` and an `adwordCustomerId` (not to be confused with the Bulldozer `customerId`). Multiple `adwordCustomerId`s can be linked to the same `adwordLoginId`. If the user declines to choose a tuple, abort the request.

### Private Google Ads hierarchy

```
GoogleAdwordAccount          <- registered account (adwordCustomerId, optional adwordLoginId)
  |
  |__ GoogleAdwordImport     <- one import job per date range (state, importFrom/importTo)
        |
        |__ SeaL1            <- Campaign       (l1Id, name, type)
              |
              |__ SeaL2      <- Ad Group       (l2Id, name, type, headlines, descriptions, redirections)
                    |
                    |__ SeaL3  <- Keyword      (l3Id, keyword, active, qualityScore)
                          |
                          |__ SeaL3Metric (one row per date)
                                  date, impressions, clicks, cost, conversions,
                                  qualityScore, searchImpressionShare
```

**Key relationships:**

- An `Account` can have many `Import`s (different date ranges, re-imports, etc.).
- An `Import` produces one set of `L1/L2/L3` entities. Each `L1/L2/L3` carries a direct FK to its owning `Account` (not just through `Import`), enabling efficient account-scoped queries.
- `SeaL3Metric` has **denormalized FKs** to `L1`, `L2`, `L3`, and `Import` — this allows aggregating metrics at any level without joins through the full hierarchy.
- `L3.qualityScore` is the last-known value (updated after import). `SeaL3Metric.qualityScore` is the per-day Google-reported value.

## Google Ad Account resolution flow

When `.sea.adAccount` is missing or incomplete in `bulldozer.json`:

1. **List registered accounts** with `mcp__plugin_bulldozer_bulldozer__bdzListGoogleAdwordAccounts`.
   - If it returns one or more accounts, present a **numbered list** showing for each entry the index, `adwordLoginId`, `adwordCustomerId`, and any human-readable label, then ask the user to pick one by number.
   - If it returns zero accounts:
     - Call `mcp__plugin_bulldozer_bulldozer__bdzSearchAvailableGoogleAdwordAccounts`.
     - Present the results as a numbered list (index, `adwordLoginId`, `adwordCustomerId`, label) and ask the user to pick one.
     - Register it with `mcp__plugin_bulldozer_bulldozer__bdzAddGoogleAdwordAccount`.
     - If the search also returns nothing, abort and explain that no Google Ad accounts are accessible.
2. **Persist the choice** by writing `.sea.adAccount = { adwordLoginId, adwordCustomerId }` into `bulldozer.json`. Read the existing JSON, merge the new key, and write it back. Preserve every other key (including `customerId`, `projectId`, and any non-SEA sections). Create the `sea` object if it does not exist.
3. **Return** the resolved `{ adwordLoginId, adwordCustomerId }` and continue with the user's original request.

## Operations

All operations require `customerId`, `projectId`, `adwordLoginId`, and `adwordCustomerId` as inputs.

### Listing entities

- `mcp__plugin_bulldozer_bulldozer__bdzListSeaL1s` — campaigns
- `mcp__plugin_bulldozer_bulldozer__bdzListSeaL2s` — ad groups (filter by `l1Id` when possible)
- `mcp__plugin_bulldozer_bulldozer__bdzListSeaL3s` — keywords (filter by `l1Id` and/or `l2Id` when possible)

**Volume guidance:** L3 (keyword) lists can be very large. Always prefer to:
- Filter by `l1Id` or `l2Id` before listing L3s.
- For "top keywords" type questions, query metrics first (which are aggregable) and only resolve L3 details for the top N.
- Summarize rather than dump full lists when the result exceeds ~50 rows.

### Getting metrics

- `mcp__plugin_bulldozer_bulldozer__bdzGetSeaL1Metrics`
- `mcp__plugin_bulldozer_bulldozer__bdzGetSeaL2Metrics`
- `mcp__plugin_bulldozer_bulldozer__bdzGetSeaL3Metrics`

**Date range guidance:** Metrics tools require an explicit date range. Translate natural-language ranges into explicit `from`/`to` ISO dates (`YYYY-MM-DD`) before calling:
- "last month" → first to last day of the previous calendar month.
- "this month" → first day of the current month to today.
- "last 7 days" / "last week" → today minus 7 days to today (state which convention you used).
- "yesterday" → yesterday's date for both `from` and `to`.

Use the user's local timezone when known; otherwise assume the account's timezone and state the assumption in the answer. When the user is ambiguous, briefly state the resolved range you used.

### Keyword ideation (Keyword Planner)

`mcp__plugin_bulldozer_bulldozer__bdzGenerateSeaKeywordIdeas` — generate **new** keyword ideas (search volumes and CPC
bid ranges) for candidate keywords not yet in a campaign. This is distinct from the listing/metrics tools above, which
only report on already-imported keywords.

Inputs (in addition to the resolved `customerId` / `projectId`):

- `accountId` — the registered Google Ad account (resolve it first via the Google Ad Account resolution flow).
- **At least one** of:
  - `keywords` — a list of seed keywords, or
  - `pageUrl` — a landing page URL to derive ideas from.
  (Providing both uses a combined keyword+URL seed. Supplying neither is an error.)
- Optional `geoTargetConstantIds` — numeric Google geo target constant ids (e.g. `2250` = France); omitted → all locations.
- Optional `languageConstantId` — numeric Google language constant id (e.g. `1000` = English, `1002` = French); omitted → all languages.
- Optional `includeSearchPartners` — include the Search Partners network (default `false`, Google Search only).
- Optional `limit` — cap the number of ideas returned.

Each returned idea carries: `keyword`, `avgMonthlySearches`, `competition` (`LOW`/`MEDIUM`/`HIGH`), `competitionIndex`
(0–100), and `lowTopOfPageBidMicros` / `highTopOfPageBidMicros`.

**Workflow:** resolve the account → call `bdzGenerateSeaKeywordIdeas` with seed keywords and/or a page URL (and geo/
language filters when the user specifies a market) → summarize the top ideas by average monthly searches, and report CPC
ranges. **Bid values are in micros — divide by 1,000,000 to show a currency amount** (e.g. `1_200_000` → 1.20). When
listing many ideas, summarize the top ~20 by search volume rather than dumping the full list.

## Error handling

- **Tool call fails:** report the error verbatim to the user, do not retry silently more than once.
- **Empty result for metrics:** check whether an `Import` covering the requested range exists for the account (via the most recent listing tool's import metadata if available). If the data appears stale or no import covers the range, tell the user that no import covers that period rather than reporting "zero performance".
- **User declines a choice (account, customer, project):** abort the request cleanly and explain what input is still needed.
- **`bulldozer.json` missing:** abort and instruct the user to create one (or run the appropriate setup skill); do not auto-create it from this skill.