---
name: |
  bulldozer-seo-api
description: |
  Fetch and analyze SEO data — domain overviews, organic keywords, and backlinks — for companies via the Bulldozer SEO MCP, including async analysis orchestration and multi-source result merging.
when-to-use: |
  When the user asks about SEO metrics, organic traffic, keyword rankings, backlinks, domain authority, or competitive SEO data for a specific company or website tracked in Bulldozer.
allowed-tools:
  - mcp__plugin_bulldozer_bulldozer__bdzListCompanies
  - mcp__plugin_bulldozer_bulldozer__bdzGetSeoAnalysis
  - mcp__plugin_bulldozer_bulldozer__bdzCreateSeoAnalysis
  - mcp__plugin_bulldozer_bulldozer__bdzCreateSeoDomain
  - mcp__plugin_bulldozer_bulldozer__bdzGetSeoDomains
  - mcp__plugin_bulldozer_bulldozer__bdzGetSeoDomainOverview
  - mcp__plugin_bulldozer_bulldozer__bdzGetSeoDomainKeywords
  - mcp__plugin_bulldozer_bulldozer__bdzGetSeoBacklinksOverview
  - mcp__plugin_bulldozer_bulldozer__bdzGetSeoGscDomains
  - mcp__plugin_bulldozer_bulldozer__bdzGetGscDomainAnalytics
  - mcp__plugin_bulldozer_bulldozer__bdzGetGscDomainInspections
  - mcp__plugin_bulldozer_bulldozer__bdzGetGscDomainSitemaps
model: |
  sonnet
effort: |
  medium
---

# Bulldozer SEO API

The SEO API is divided in two parts: **public data** and **private data**.
- **Public data** contains aggregated, third-party-estimated data for a domain. It is not precise and is updated only monthly.
- **Private data** comes from Google Search Console (GSC). It is very precise but only available for domains the user has connected.

Use the fully-qualified MCP tool names as listed in `allowed-tools` (e.g. `mcp__plugin_bulldozer_bulldozer__bdzListCompanies`). Do not add or strip prefixes.

## How to Choose Which Data to Use

1. Call `bdzGetSeoGscDomains` and check whether any returned domain matches the one requested by the user.
2. If a GSC domain matches → use the **private (GSC) workflow** below.
3. If no GSC domain matches → use the **public workflow** below.
4. If the user explicitly asks for a comparison or both, you may run both workflows and label results by source.

---

## Private (GSC) Workflow

The private workflow uses precise first-party data and does **not** require async analyses, polling, or desktop/mobile merging — GSC returns aggregated data directly.

### Tools
- `bdzGetGscDomainAnalytics` — clicks, impressions, CTR, position, broken down by chosen dimensions.
- `bdzGetGscDomainInspections` — URL inspection / indexing status.
- `bdzGetGscDomainSitemaps` — submitted sitemaps and their status.

The `gscDomainId` is the id returned by `bdzGetSeoGscDomains`.

### Steps
1. Call `bdzGetSeoGscDomains` and identify the matching `gscDomainId`. If multiple match, ask the user to confirm.
2. Resolve the date range:
   - If the user specified a range, use it.
   - Otherwise default to the last completed month.
   - Note: GSC typically has a 2–3 day publication lag for the most recent days; avoid querying through "today".
3. Pick the tool that matches the user's question:
   - Traffic / keywords / pages / countries / devices → `bdzGetGscDomainAnalytics` (choose appropriate dimensions: `query`, `page`, `country`, `device`, `date`).
   - Indexing status of a specific URL → `bdzGetGscDomainInspections`.
   - Sitemap submission / coverage → `bdzGetGscDomainSitemaps`.
4. Present results, explicitly labeling the data as **Google Search Console (private)**.

**Device merging does NOT apply to GSC.** If the user wants a desktop+mobile breakdown, request the `device` dimension in `bdzGetGscDomainAnalytics` and present the split directly.

---

## Public Workflow

### SEO Domain
A `SeoDomain` represents the logical link between a `Company` and a web domain. To get a company's domain(s), use `bdzGetSeoDomains` with the `companyId` parameter.

### SEO Analysis
A `SeoAnalysis` represents the high-level operation to fetch SEO data for a `SeoDomain`. It is **asynchronous** — once started, its status must be polled until completion.

### SEO Data Sources
Public SEO data is fetched from a **source** (also called a database), passed as the `source` parameter to the public data tools. A source is always a country code, optionally device-qualified.

| Intent | `source` value |
|---|---|
| United States — desktop | `US` |
| United States — mobile | `MOBILE_US` |
| France — desktop | `FR` |
| France — mobile | `MOBILE_FR` |
| Any country `XX` — desktop | `XX` |
| Any country `XX` — mobile | `MOBILE_XX` |

**Rule:** whenever you fetch from a country source, also fetch from `MOBILE_${country}` and merge the results as described in "Merging Desktop and Mobile".

### Step 1 — Resolve the Company ID
Call `bdzListCompanies` and match against the user's input (website or company name) to obtain a `companyId`.
- If matching is ambiguous, **prompt the user** to confirm.
- The `companyId` must be unambiguous before proceeding.

### Step 2 — Resolve the Source (Country + Device)
- If the user specified a country, use it.
- Otherwise, infer from the company's primary market if obvious, or **ask the user**.
- Always plan to fetch both `${country}` and `MOBILE_${country}`.

### Step 3 — Resolve the Month/Year
- The **current month is never available**. Do not create analyses or fetch data for the current month.
- If the user did not specify, default to the most recently completed calendar month. Note that public providers may also have a few days of lag after month end before the previous month is fully available — if a fetch for the previous month returns no data, fall back to the month before.

### Step 4 — Unified Workflow to Get SEO Data
Execute these steps in order:

1. Call `bdzGetSeoDomains` with `companyId`. If no `SeoDomain` exists for the target domain, call `bdzCreateSeoDomain` to create it.
2. Attempt to fetch the desired data (`bdzGetSeoDomainOverview`, `bdzGetSeoDomainKeywords`, or `bdzGetSeoBacklinksOverview`) for the `(domain, month, year, source)` tuple.
3. If data is not available for that tuple, call `bdzCreateSeoAnalysis` for it.
4. Poll the analysis using the polling protocol below until it is `COMPLETED` (or fail).
5. Re-fetch the data after the analysis completes.
6. Repeat steps 2–5 for the `MOBILE_${country}` source.
7. Merge the desktop and mobile results (see below) before presenting to the user.

### Polling Protocol
Use `bdzGetSeoAnalysis` to poll the analysis status.
- **Expected statuses:** `PENDING`, `RUNNING`, `COMPLETED`, `FAILED` (treat any unknown non-terminal status as still running).
- **Interval:** wait ~10 seconds between polls.
- **Timeout:** stop polling after roughly 20 attempts (~3–4 minutes). If still not terminal, report a timeout to the user and stop — do not silently retry forever.
- **On `COMPLETED`:** proceed to fetch the data.
- **On `FAILED`:** report the failure (and any error detail returned) to the user and stop. Do not automatically recreate the analysis.

### Merging Desktop and Mobile Results
When combining a base country source (e.g. `US`) with its mobile counterpart (`MOBILE_US`):

- **Domain overview numeric metrics** (organic traffic, organic keyword count, organic cost, total backlinks count, referring domains count, etc.): **sum** the two values.
- **Rank, authority score, percentages** (branded traffic %, traffic %, traffic cost %): present **both values side by side** (desktop and mobile) — do not average, since they are not directly additive.
- **Keyword lists:** **deduplicate by keyword string**. When the same keyword appears in both sources, prefer the entry with the better (lower-numbered) position and annotate that it appears on both devices. Keep volume / CPC / difficulty from whichever source has them populated; if both, prefer the base country source.
- **Backlink lists:** **deduplicate by source URL** (the exact backlinking page URL). If the same source URL appears in both, keep one entry and annotate "desktop + mobile". For aggregated backlink counts (total backlinks, referring domains), **sum** them only when the underlying lists are deduplicated; otherwise present desktop and mobile counts side by side and clearly label them.
- Always disclose to the user that the reported figures combine desktop and mobile sources.

---

## Output Format

Present results in a consistent structure:

1. **Header** — company name, domain, period (month/year or date range), and data source label: `Google Search Console (private)` or `Public SEO (desktop + mobile, source: US + MOBILE_US)`.
2. **Summary table** — key metrics in a markdown table. For public data with side-by-side metrics, use columns for Desktop and Mobile.
3. **Detail sections** (only those relevant to the query):
   - Top keywords (table: keyword, position, volume, device(s)).
   - Backlinks overview (table: total backlinks, referring domains, top referring domains).
   - Trends or notes.
4. **Caveats** — explicitly note: data source, merging behavior (if applied), any timeouts or partial data, and that the current month is excluded.

---

## Worked Example (Public Data)

**User:** "Show me the SEO performance of acme.com for last month in the US."

1. Call `bdzGetSeoGscDomains` — no match for acme.com → use public workflow.
2. Call `bdzListCompanies`, find the entry matching "acme.com". If multiple match, ask the user to confirm. → obtain `companyId`.
3. Determine month/year = previous calendar month. Country = `US`. Sources to query: `US` and `MOBILE_US`.
4. Call `bdzGetSeoDomains(companyId)`. If no domain for acme.com, call `bdzCreateSeoDomain(companyId, "acme.com")`.
5. Try `bdzGetSeoDomainOverview` for (domain, month, year, `US`).
   - If unavailable: call `bdzCreateSeoAnalysis(...)`, then poll `bdzGetSeoAnalysis` every ~10s up to ~20 times until `COMPLETED`. Re-fetch.
6. Repeat step 5 for source `MOBILE_US`.
7. Merge the two overviews per the merging rules.
8. Present the consolidated results, labeling the source as `Public SEO (desktop + mobile, source: US + MOBILE_US)` and noting figures combine desktop and mobile.

## Worked Example (Private / GSC Data)

**User:** "What were the top queries driving traffic to acme.com last month?"

1. Call `bdzGetSeoGscDomains` — acme.com matches → use private workflow. Capture `gscDomainId`.
2. Date range = previous full calendar month.
3. Call `bdzGetGscDomainAnalytics(gscDomainId, dateRange, dimensions=["query"])`, sort by clicks desc.
4. Present top queries (clicks, impressions, CTR, avg. position), labeled `Google Search Console (private)`.
