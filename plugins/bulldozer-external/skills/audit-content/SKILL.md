---
name: |-
  audit-content
description: |-
  Full audit of a content library — blog, resources, case studies — against traffic, conversion, and pipeline contribution. Triggers on 'content audit,' 'audit our blog,' 'which content is working,' 'content is not converting,' 'what to do with old content,' or 'content strategy audit.' For SEO specifically, see seo-audit. For editorial production, see content-strategy.
when-to-use: |-
  Full audit of a content library — blog, resources, case studies — against traffic, conversion, and pipeline contribution. Triggers on 'content audit,' 'audit our blog,' 'which content is working,' 'content is not converting,' 'what to do with old content,' or 'content strategy audit.' For SEO specifically, see seo-audit. For editorial production, see content-strategy.
argument-hint: |-
  Acme SaaS blog — 340 posts, traffic flat for 6 months, only 5% of posts drive 80% of leads
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - mcp__plugin_bulldozer_bulldozer__bdzGetSeoGscDomains
  - mcp__plugin_bulldozer_bulldozer__bdzGetGscDomainAnalytics
  - mcp__plugin_bulldozer_bulldozer__bdzGetGscDomainAnalyticsSummary
  - mcp__plugin_bulldozer_bulldozer__bdzGetSeoDomains
  - mcp__plugin_bulldozer_bulldozer__bdzGetSeoBacklinksOverview
  - mcp__plugin_bulldozer_bulldozer__bdzGetSeoDomainKeywords
  - mcp__plugin_bulldozer_bulldozer__bdzListSeoDataSources
  - mcp__plugin_bulldozer_bulldozer__bdzListCmsSites
  - mcp__plugin_bulldozer_bulldozer__bdzListCmsPages
  - mcp__plugin_bulldozer_bulldozer__bdzGetCmsTrafficReport
  - mcp__plugin_bulldozer_bulldozer__bdzGetCmsTopPagesReport
  - mcp__plugin_bulldozer_bulldozer__bdzApplyGoogleAnalyticsTemplatePreset
  - mcp__plugin_bulldozer_bulldozer__bdzRunGoogleAnalyticsReportTemplate
  - mcp__plugin_bulldozer_bulldozer__bdzGetGoogleAnalyticsReport
  - mcp__plugin_bulldozer_bulldozer__bdzListGoogleAnalyticsConversionEvents
  - mcp__plugin_bulldozer_bulldozer__bdzGetProjectToneOfVoice
effort: |-
  high
---

# Content Audit

> This is a Bulldozer skill. A content audit is a revenue diagnostic — not a spring clean. Every decision traces back to pipeline, not aesthetics or word count.

You are a Bulldozer content operator. Your job is to evaluate a content library against what it actually does for the business (traffic, pipeline, conversion) and produce a decision for every piece: Keep, Update, Consolidate, Redirect, or Remove.

## Input

`$ARGUMENTS` — domain or content URL, library size and type, primary concern (traffic, conversions, cannibalization, outdated content). If not provided, read any available context files first. Ask once if you cannot identify the site and the pain point.

## Output

An `audit-content-{client}.md` file with: executive summary (key findings in 3 bullets), two-axis performance map (visibility vs. conversion), piece-by-piece decision table, and a prioritized action plan. Each decision includes rationale and exact next step.

**Produce on first invocation. Do not ask for a content inventory — derive it from what's provided.**

---

## Audit Logic

A content audit answers three questions in order:
1. **What does this piece do for the business today?** (traffic, pipeline contribution, backlinks)
2. **Is it better, worse, or the same as what's ranking above it?** (quality check)
3. **What is the highest-leverage action?** (one decision per URL, no "maybe")

**Rule this out before you start scoring individual pieces.** A sudden, broad drop — many URLs losing traffic in the same day or two — is not what this audit fixes. That shape points to a manual action, a de-indexation, a confirmed Google update, or a technical break (a bad deploy, a robots/canonical mistake shipped site-wide), and the first move is Google's own Search Status Dashboard (status.search.google.com), not a piece-by-piece review. Reserve the six phases below for what they're built for: a gradual decline you can trace to specific URLs, or a library that's simply never been triaged. If the drop is sudden and site-wide, say so in the output and stop — recommend the technical/incident check instead of producing Keep/Update/Remove verdicts on pages that didn't individually cause the drop.

---

## Phase 1: Inventory

Pull all content URLs. Sources in order:
- **Bulldozer OS, when the site is connected**: `bdzListCmsSites` for the `siteId`, then `bdzListCmsPages` — it returns every page's title, slug, published path, and SEO/OG metadata straight from the CMS, which also seeds part of Phase 4's Accuracy and Brand Alignment scoring later. No sitemap fetch or crawl needed.
- Sitemap (`domain.com/sitemap.xml`) when the CMS isn't connected in Bulldozer OS.
- Screaming Frog or Ahrefs export if provided.
- Manual list if provided in arguments.

For each URL record: URL, title, publish date, last updated, content type (blog, case study, landing page, resource).

Exclude: pages published in the last 60 days (insufficient data), product/pricing pages (separate CRO audit), documentation.

---

## Phase 2: Performance Data

For each URL, pull:

**Organic performance** (Google Search Console):
- Impressions, clicks, CTR and average position, per URL, last 90 days. In Bulldozer OS: resolve the `gscDomainId` via `bdzGetSeoGscDomains`, then call `bdzGetGscDomainAnalytics` with `dimension: PAGE` for the full per-URL table — see `bulldozer-seo-api` for the full domain-resolution workflow (private vs. public data path). Data is refreshed daily by a background scheduler, not on demand: you're reading the latest stored snapshot, not triggering a fresh pull.
- **For the library-wide trend or total that goes in the Executive Summary, use `bdzGetGscDomainAnalyticsSummary` instead of paginating and summing the raw endpoint.** The raw endpoint's own description warns that sampling its rows for a total is wrong, not just slow — a documented example reads 3,000 rows out of 50,094 as 122 clicks against 431 on the full read. The summary tool aggregates server-side (a daily series plus a total per dimension) and is built exactly for "is traffic up or down." It is not, however, a substitute for the per-URL table above on a library of any real size: each dimension's breakdown is a top list capped at 100 rows, so a 340-post blog still needs the paginated per-URL pull for anything past the top 100 pages. **Have a fallback ready.** Three real calls to this tool timed out at 60 seconds on one project — a 30-day window, a 4-day window, and even a single-day window — while the raw endpoint answered normally on the same domain the same day. Treat a timeout as a signal to fall back to the paginated raw endpoint for the total (sum PAGE rows only, never mix dimensions) rather than retrying the same call or blocking the audit on it.
- **Search Console data traps** — the unreliable `dimension` parameter, the normal 2–3 day freshness lag versus a real incident, the 2025 Google-side impressions logging bug, and the newer Search Generative AI performance report this stack can't reach yet. Read `references/gsc-data-pitfalls.md` before pulling or interpreting any Search Console data.
- No GSC domain connected to the project → fall back to a manual Search Console export.

**Engagement** (GA4):
- Engaged sessions, engagement rate, average engagement time. In Bulldozer OS: `bdzApplyGoogleAnalyticsTemplatePreset` with `presetId: seo_performance` gives a ready-made report template for exactly this; run it with `bdzRunGoogleAnalyticsReportTemplate` and read the rows with `bdzGetGoogleAnalyticsReport`.
- Key event completions (leads, trials, demo requests) — Google renamed "conversions" to "key events" in the GA4 UI, same underlying metric. `bdzListGoogleAnalyticsConversionEvents` lists which events are configured as key events on the property; their counts come back in the same report.
- If the Webflow site carries the Analyze add-on, `bdzGetCmsTrafficReport` / `bdzGetCmsTopPagesReport` add a native session/user/pageview cross-check — they don't expose engagement rate or key events, so they complement GA4 rather than replace it. Call Analyze reports one at a time; the tool itself warns against running several in parallel. A 409 on either call is not automatically "add-on not purchased" — the real error text bundles two distinct causes, entitlement and connector: it can also mean the Webflow credential itself needs reconnecting with the right OAuth scopes. Check both before telling the client to buy Analyze.

**Authority**:
- Referring domains — `bdzGetSeoBacklinksOverview` (`whenLatest: true`) on the project's SEO domain replaces a manual Ahrefs export once the domain is registered in Bulldozer OS. **It's a monthly photo, not a live number.** A real call on one project returned its only available snapshot dated four months before the audit — `whenLatest: true` wasn't broken, that snapshot was simply the newest one that exists for that domain. Read the response's `metadata.month`/`metadata.year` and compare it to the audit date before presenting `authorityScore` or the referring-domains count as a current measure, or the whole audit gets silently dated on stale authority numbers without saying so.
- Internal links pointing to the page — no Bulldozer OS tool returns this directly; keep it as a manual check (Ahrefs/Screaming Frog export, or reading suspected linking pages with `bdzGetCmsPageContent`).

If no analytics access is available — in Bulldozer OS or as a manual export — ask once. Proceed with whatever data is available — a partial audit with real data beats a complete audit with invented data.

---

## Phase 3: Two-Axis Performance Map

The two-axis map (visibility against conversion) and the action attached to each quadrant are in `references/performance-map-and-cannibalization.md` (section "Phase 3: Two-Axis Performance Map"). Read it when plotting the URLs.

---

## Phase 4: Qualitative Assessment

For each piece NOT in the Protect & Compound quadrant, score 1–3 on:

| Criterion | Score |
|-----------|-------|
| **Accuracy** — still correct? No outdated stats, deprecated features, wrong pricing? | |
| **Depth** — fully answers the question for the target reader vs. what's ranking page 1? | |
| **Unique Value** — says something the top 3 Google results don't? | |
| **Intent Match** — does the content match what a searcher expects to find? | |
| **CTA Quality** — clear next step that makes sense for the reader's stage? | |
| **Brand Alignment** — matches current voice, positioning, and narrative? | |

Ground **Brand Alignment** against the project's stored tone of voice (`bdzGetProjectToneOfVoice`) rather than the auditor's memory of "how we sound" — on a library spanning several writers and years, the two drift apart fast.

Score ≤10: Remove or Redirect candidate. Score 11–15: Update candidate. Score 16–18: Keep as-is.

**A low Depth and Unique Value score together means the piece never had an idea — it had a keyword.** No amount of refreshed statistics or a new intro fixes that; updating it produces the same empty piece with a newer date. If both score 1, route it to Remove (or treat it as a full rewrite scoped as new content, not a patch) even when traffic or backlinks would otherwise argue for Update. Reserve Update for pieces where the underlying idea holds and only the execution has aged.

---

## Phase 5: Cannibalization Check

How to detect cannibalization (where the data comes from, the `sources` argument that is easy to miss, and how to flag competing URLs) is in `references/performance-map-and-cannibalization.md` (section "Phase 5: Cannibalization Check"). Read it before running the check.

---

## Phase 6: Decision Table

Every URL gets exactly one of five verdicts:

| Verdict | Criteria | Action |
|---------|----------|--------|
| **Keep** | Protect & Compound quadrant, score ≥16, no cannibalization | Refresh quarterly, protect internal links |
| **Update** | Has traffic or backlinks but score <16, or >12 months without a refresh | Rewrite thin sections, update stats, fix CTA, re-optimize title |
| **Consolidate** | Cannibalizes another URL, or two low-performers cover the same topic | Merge best content into one page, 301 redirect loser |
| **Redirect** | Has backlinks but content is unsalvageable or off-brand | 301 to most relevant existing page (not the homepage) |
| **Remove** | Zero traffic for 12+ months, no backlinks, no conversion, not worth redirecting | Delete the page (returns 404 on Webflow hosting) or set it to noindex — never redirect to the homepage (Google treats it as a soft 404) |

**Executing this in Bulldozer OS.** `bdzCreateCmsRedirect` / `bdzListCmsRedirects` manage 301s directly in Webflow, but only on a Webflow **Enterprise** workspace — on any other plan they return a 403 naming the plan limit, and the redirect has to be set by hand in Webflow's site settings. Robots.txt (`bdzReplaceCmsRobotsTxt`) is Enterprise-only too, and it's the wrong tool for "Remove" anyway: a robots.txt disallow blocks crawling, which stops Google from ever seeing a noindex tag or a 410 — it doesn't deindex a page already in the index. `bdzDeleteCmsItem` followed by a site publish (`bdzPublishCmsSite`, capped at one successful publish per minute) removes the page; on Webflow's native hosting that resolves as a 404, since Webflow has no way to set a custom 410 status. A genuine noindex needs the manual per-page toggle in Webflow's page settings — Bulldozer OS doesn't expose one.

---

## Prioritization Framework

Score each action on: Impact (traffic/pipeline potential) × Effort (time to implement). Execute in this order:

1. **Fix broken CTAs on high-traffic pages** — low effort, immediate conversion impact
2. **Consolidate cannibalizing pairs** — medium effort, ranking improvement within 30–60 days
3. **Update high-traffic, low-quality pages** — medium effort, protects existing rankings
4. **Remove/redirect zero-value pages** — low effort, cleans crawl budget and index bloat
5. **Create content for identified gaps** — high effort, plan for next quarter

Do not create new content until cannibalization and high-traffic update priorities are addressed. Adding to a leaky bucket does not fix the leak.

---

## Output: Prioritized Action Plan

Structure:

```
## Executive Summary
- [Finding 1: the single biggest problem]
- [Finding 2: the biggest quick win]
- [Finding 3: the structural pattern to fix]

## Performance Map
[Quadrant summary with counts per segment]

## Decision Table
| URL | Title | Verdict | Reason | Owner | Deadline |
|-----|-------|---------|--------|-------|----------|

## Action Plan
### Immediate (This Week)
### Month 1
### Quarter Plan
```

---

## Rules

- **Pipeline contribution beats traffic.** A post with 500 visits and 10 leads beats a post with 5,000 visits and 0 leads. Prioritize accordingly.
- **Never redirect to the homepage.** It's a soft 404 in Google's eyes. Always redirect to a topically relevant page.
- **Never update a page without checking cannibalization first.** Improving a page that cannibalizes a stronger one makes the problem worse.
- **A content audit that produces a 40-slide deck with no owner and no deadline produces no change.** Every action gets an owner and a deadline or it doesn't ship.
- **Do not audit pages published in the last 60 days.** Insufficient data — you'll make wrong decisions.
- **An Update that ships silently doesn't move the needle.** Re-share it wherever the piece already had distribution (LinkedIn, newsletter) once it's live — refreshing a page nobody revisits changes nothing. Reserve this for substantive updates — a new data point, a changed recommendation, a rewritten section. A typo fix or a metadata tweak earns nothing by being re-announced, and re-sharing every minor edit trains your audience to stop opening the link.
- **Resolve cannibalization before you trust any other number on a URL.** A page's traffic and conversion figures are unreliable while it's splitting demand with another page for the same query — run Phase 5 across the whole library before scoring Phase 4 or assigning verdicts elsewhere. A Remove candidate that turns out to be cannibalizing a stronger page needs a redirect, not a deletion; a Keep candidate that's quietly cannibalizing a weaker one is masking a problem the weaker page's own numbers would otherwise expose.
- **An Update with no measurable movement on the next pass isn't a page that needs updating again.** Re-run this audit on the same cadence as the Keep quadrant's refresh (quarterly) and compare each Update verdict's engagement rate and key events against its pre-update numbers. No movement means the fix wasn't the actual problem — move it to Consolidate or Remove instead of scheduling a second update on the same page. A plan with no re-measurement date is a plan that never corrects itself.