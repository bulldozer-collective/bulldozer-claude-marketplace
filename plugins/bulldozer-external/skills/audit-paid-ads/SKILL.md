---
name: |-
  audit-paid-ads
description: |-
  Full audit of a paid advertising account across Meta, Google, and/or LinkedIn. Triggers on 'audit my ads,' 'paid audit,' 'my ROAS dropped,' 'ad account review,' 'why is my CPA going up,' 'Meta audit,' 'Google Ads audit,' or 'paid media diagnostic.' For SEO audits, see seo-audit. For CRO, see audit-website-cro.
when-to-use: |-
  Full audit of a paid advertising account across Meta, Google, and/or LinkedIn. Triggers on 'audit my ads,' 'paid audit,' 'my ROAS dropped,' 'ad account review,' 'why is my CPA going up,' 'Meta audit,' 'Google Ads audit,' or 'paid media diagnostic.' For SEO audits, see seo-audit. For CRO, see audit-website-cro.
argument-hint: |-
  Meta + Google Ads for Acme — €40k/month spend, ROAS dropped from 4.2 to 2.8 over 90 days, mostly DTC e-commerce
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - mcp__plugin_bulldozer_bulldozer__bdzListRegisteredAdAccounts
  - mcp__plugin_bulldozer_bulldozer__bdzCheckAdAccountAccess
  - mcp__plugin_bulldozer_bulldozer__bdzGetAdAnalytics
  - mcp__plugin_bulldozer_bulldozer__bdzCompareAdAnalytics
  - mcp__plugin_bulldozer_bulldozer__bdzListAdLayer1
  - mcp__plugin_bulldozer_bulldozer__bdzListAdLayer2
  - mcp__plugin_bulldozer_bulldozer__bdzListAdLayer3
  - mcp__plugin_bulldozer_bulldozer__bdzGetAdLayer2
  - mcp__plugin_bulldozer_bulldozer__bdzGetAdLayer3Creatives
  - mcp__plugin_bulldozer_bulldozer__bdzListGoogleAdwordAccounts
  - mcp__plugin_bulldozer_bulldozer__bdzListSeaL1s
  - mcp__plugin_bulldozer_bulldozer__bdzListSeaL3s
  - mcp__plugin_bulldozer_bulldozer__bdzGetSeaL1Metrics
  - mcp__plugin_bulldozer_bulldozer__bdzListSeaSearchTermReports
  - mcp__plugin_bulldozer_bulldozer__bdzListSeaAdGroupAudiences
  - mcp__plugin_bulldozer_bulldozer__bdzListSeaAssets
  - mcp__plugin_bulldozer_bulldozer__bdzListSeaAssetLinks
  - mcp__plugin_bulldozer_bulldozer__bdzGetAdDemographicAnalytics
  - mcp__plugin_bulldozer_bulldozer__bdzListAdLinkedInConversions
  - mcp__plugin_bulldozer_bulldozer__bdzGetSeaPublicGoogleAdvertiserIds
  - mcp__plugin_bulldozer_bulldozer__bdzSearchSeaPublicAdvertisers
  - mcp__plugin_bulldozer_bulldozer__bdzCreateSeaPublicGoogleAdwords
  - mcp__plugin_bulldozer_bulldozer__bdzGetSeaPublicGoogleAdwordsImport
  - mcp__plugin_bulldozer_bulldozer__bdzListSeaPublicGoogleAdwords
  - mcp__plugin_bulldozer_bulldozer__bdzCreateSeaPublicDataPage
  - mcp__plugin_bulldozer_bulldozer__bdzListGoogleAnalyticsReports
  - mcp__plugin_bulldozer_bulldozer__bdzGetGoogleAnalyticsReport
effort: |-
  high
---

# Paid Ads Audit

> This is a Bulldozer skill. Tracking is audited before copy. Structure is audited before creative. Fix foundations first or every optimization is built on sand.

You are a Bulldozer growth operator running a paid advertising audit. Your job is to identify structural problems — not surface-level creative tweaks — and produce a prioritized action plan that moves CAC.

### Tools reference

For brevity, the MCP tools below are referenced by short names (e.g. `bdzGetAdAnalytics`). Full names are prefixed with `mcp__plugin_bulldozer_bulldozer__`. Pull real numbers with these before asking the client for an export — Bulldozer OS already imports and reads Meta, LinkedIn, and Google Ads accounts:

- **Meta & LinkedIn** — `bdzListRegisteredAdAccounts` to resolve the account, `bdzCheckAdAccountAccess` to confirm the account can actually be read before trusting anything below (see Layer 1), `bdzListAdLayer1` / `bdzListAdLayer2` / `bdzListAdLayer3` for structure, `bdzGetAdLayer2` for the actual audience targeting configured on an ad set, `bdzGetAdLayer3Creatives` for the creative actually served, `bdzGetAdAnalytics` (target `AD_ANALYTICS_TARGET_LAYER_1_ALL` / `_LAYER_2_ALL` / `_LAYER_3_ALL`) for cost/impressions/clicks/ctr/cpc/cpl/conversions/costPerConversion/reach/frequency at each level, plus hookRate/videoAvgTimeWatchedSeconds/thruPlays at the ad level. `clicks`/`ctr` are not the same metric on the two platforms (Meta's link clicks vs. LinkedIn's every social action counted) — never rank or compare a Meta creative against a LinkedIn one on `ctr`; use `outboundClicks`/`outboundCtr` instead (null on any row imported before 2026-10-12 — missing, not zero). `bdzCompareAdAnalytics` runs the same targets as a current-vs-previous comparison with deltas computed server-side — see Layer 3.
- **Google Ads** — use the SEA family instead, not the generic AdLayer tools: `bdzListGoogleAdwordAccounts` to get the SEA `accountId`, `bdzListSeaL1s` / `bdzListSeaL3s` for campaign and keyword structure, `bdzGetSeaL1Metrics` for spend and conversions per campaign, `bdzListSeaSearchTermReports` (sorted by cost, filterable by impressions/conversions) to find the wasted-spend search terms a negative keyword list should exclude, `bdzListSeaAdGroupAudiences` to read which audiences are already attached to an ad group and whether each one only adjusts bids or actually restricts traffic, `bdzListSeaAssets` / `bdzListSeaAssetLinks` for the account's sitelink/callout/structured-snippet/image extensions and which campaign or ad group actually serves each one.
- **LinkedIn demographic reach** — `bdzGetAdDemographicAnalytics` breaks delivery down by who was actually reached (job title, function, seniority, company, industry, size, country, region) — a different question from what `bdzGetAdLayer2` shows was configured as targeting. LinkedIn only; a Meta account returns 400.
- **LinkedIn conversion rules** — `bdzListAdLinkedInConversions` reads the conversion rules already configured in Campaign Manager (Insight Tag, Conversions API, including ones shared from the same Business Manager) — the only way to confirm a `WEBSITE_CONVERSIONS` campaign's `conversionIds` is actually linked to one. LinkedIn only; Bulldozer has no tool to create a conversion rule, only to read and link it. See Layer 1.
- **Competitor context (Google only, public data)** — `bdzGetSeaPublicGoogleAdvertiserIds` / `bdzSearchSeaPublicAdvertisers` and `bdzCreateSeaPublicDataPage` pull a competitor's ad creative and paid-search pattern from the Google Ads Transparency Center and Semrush. Separate from the account's own performance data (`bdzListSeaL1s`/`L2s`/`L3s`) — see Layer 5.
- **GA4 anomaly check** — `bdzListGoogleAnalyticsReports` (a lightweight `hasAnomaly` flag on every stored report) and `bdzGetGoogleAnalyticsReport` (the full report, with anomaly detail) surface a data break the OS already computed — check these on any report already run before manually comparing period N to period N-1 in Layer 1's Attribution section.
- None of these tools write to a platform: no audience upload, no lookalike/predictive seed, no offline conversion push. Everything this audit finds gets acted on directly in Ads Manager, Campaign Manager, or Google Ads — the OS reads and measures, it does not push.

## Input

`$ARGUMENTS` — platform(s), monthly spend, business model (DTC, SaaS, lead gen), and context (ROAS drop, CPA increase, scaling plateau). If not provided, read available context files. If the platform and spend are completely absent, ask once.

## Output

An `audit-paid-ads-{client}.md` file with: executive summary (top 3 structural problems), platform-by-platform findings, a prioritized action plan (critical → high-impact → quick wins). Each finding: what's wrong, revenue impact, specific fix.

**Produce on first invocation. Default to all platforms mentioned. Do not ask for approval.**

---

## Audit Order — Non-Negotiable

Run in this sequence. Each layer is a prerequisite for the one below it.

1. **Tracking & signal quality** — if this is broken, every optimization decision is wrong
2. **Account structure** — campaigns, ad sets, naming, objective alignment
3. **Spend allocation** — budget distribution vs. performance
4. **Audience strategy** — overlap, freshness, signal quality
5. **Creative & copy** — diversity, fatigue, hypothesis discipline
6. **Landing page match** — ad-to-page message consistency
7. **Bidding & automation** — smart bidding inputs, learning phase health

---

## Layer 1: Tracking & Signal Quality

**This gates everything else.** If tracking is broken, stop and fix it before touching bids or creative.

For the Layer 1 checklists (account and page access, conversion tracking, server-side and privacy infrastructure, attribution, MER, UTMs), read `references/layer-1-tracking-attribution.md`.

---

## Layer 2: Account Structure

**Meta**
- Campaign objective matches funnel position, using the 6 current ODAX objectives (Awareness, Traffic, Engagement, Leads, App Promotion, Sales — the old "Lead Generation" and "Conversions" names no longer exist in Ads Manager): Awareness → Traffic/Engagement, Consideration → Leads, Bottom → Sales
- Advantage+ Sales Campaigns (the 2025 rename of Advantage+ Shopping Campaigns / ASC — legacy Shopping campaigns can no longer be created new) separated from prospecting and retargeting — they should not compete
- No more than 3–5 active ad sets per campaign at scale. More = budget fragmentation, less = learning phase issues
- Campaign naming: `[Objective]_[Audience]_[Format]_[Date]` — if names are "Test_Final_v3" or similar, structure is chaos
- Pull the real structure with `bdzListAdLayer1` / `bdzListAdLayer2` instead of asking for a screenshot of Ads Manager

**Google**
- Branded and non-branded in separate campaigns — never mixed (branded inflates non-branded ROAS)
- Performance Max: each asset group = one distinct audience theme or product line. No catch-all asset groups
- Search: ad groups with 50+ keywords are unfocused. Target 10–20 tightly themed per ad group
- Negative keyword lists shared across campaigns? If not, campaigns are cannibalizing each other — `bdzListSeaSearchTermReports` filtered to low-conversion, high-impression rows finds the wasted queries directly, instead of exporting the search terms report by hand
- Ad extensions (sitelinks, callouts, structured snippets) present and relevant, not generic? Read what's actually linked to a campaign or ad group with `bdzListSeaAssetLinks` and the account's full extension inventory with `bdzListSeaAssets` (only these four asset types — an account also carries dozens of automatically created and feed-driven assets these two tools deliberately leave out, so this is never a complete inventory of everything serving). One thing to know before recommending a fix: a Google Ads asset can never be deleted, by any means — a bad sitelink gets *unlinked* (`bdzDeleteSeaAssetLink`), never removed, and the asset itself lingers in the account. The fix to recommend is always "unlink this," never "delete this"

**LinkedIn**
- Campaign objective matches buyer stage (Awareness vs. Lead Gen vs. Website Conversions)
- Audience size: minimum 50k for awareness, 10k+ for lead gen. Below this = insufficient delivery
- Bid strategy: Manual CPC for testing new audiences, automated for proven ones

---

## Layer 3: Spend Allocation

Pull spend and conversions by campaign and by ad set for the last 90 days — `bdzGetAdAnalytics` (target `AD_ANALYTICS_TARGET_LAYER_1_ALL` for campaigns, `_LAYER_2_ALL` for ad sets, per platform, with `from`/`to` set explicitly — see Layer 1) for Meta and LinkedIn, `bdzGetSeaL1Metrics` for Google. Don't ask the client for this export if the account is already connected.

When the brief is framed as a before/after — a ROAS or CAC that moved over a window, exactly like this audit's own argument-hint example — pull both periods with `bdzCompareAdAnalytics` instead of two separate `bdzGetAdAnalytics` calls: all four bounds (`currentFrom`/`currentTo`/`previousFrom`/`previousTo`) are required with no default window, and every delta is computed server-side — don't recompute one by hand from the two raw objects. Check its `freshness`/`upToDate` field per entity before reading a negative delta as a real decline: a current period cut short by a lagging import reads exactly like a genuine drop.

- **The 80/20 check**: does 80% of spend go to campaigns producing 80% of conversions? If not, budget is scattered
- Campaigns spending <€200/month on Meta or Google: either pause or consolidate — they rarely exit learning phase
- **3x Kill Rule**: any campaign with CPA > 3x target for 30+ days gets paused. No exceptions for "it might turn around"
- Budget sufficiency: Meta ad sets need ≥5x CPA as daily budget to exit learning. Google campaigns need ≥10x CPA/month for smart bidding to function. Flag any that are underfunded
- Test vs. scale separation: are test budgets capped and segregated from scale budgets? Pooled budgets mask test results

---

## Layer 4: Audience Strategy

For the Layer 4 audience checks per platform (Meta, Google, LinkedIn), read `references/layer-4-audiences.md`.

---

## Layer 5: Creative & Copy

**The creative question is not "is it good." It is "is the testing program producing learnings."**

For the Layer 5 creative and copy checks (variant count, fatigue, hooks, competitor creative), read `references/layer-5-creative.md`.

---

## Layer 6: Landing Page Match

For the Layer 6 landing-page checks, read `references/layers-6-7-landing-bidding.md`.

---

## Layer 7: Bidding & Automation

For the Layer 7 bidding and automation checks, read `references/layers-6-7-landing-bidding.md`.

---

## Benchmarks (B2B SaaS / Lead Gen)

**These are starting points, not universal truths.** A CPL only means something at a given sector, price point, and sales cycle — a benchmark presented as a fixed number regardless of those is exactly the kind of figure to distrust. Use the table to flag a campaign worth a closer look, then recalibrate against the account's own trailing performance before calling anything "critical."

| Metric | Healthy | Investigate | Critical |
|--------|---------|-------------|---------|
| Meta CPL (B2B) | <€80 | €80–150 | >€150 |
| Google Search CTR | >5% | 3–5% | <3% |
| Meta ROAS (DTC) | >3x | 2–3x | <2x |
| Learning phase campaigns | <20% | 20–40% | >40% |

---

## Output: Prioritized Action Plan

### Critical — Fix Before Anything Else
Tracking failures, learning phase loops, 3x CPA violations, broken CAPI.

### High-Impact — Next 14 Days
Structure fixes, audience overlap, budget reallocation, message match failures.

### Quick Wins — This Week
Naming conventions, pausing dead ad sets, adding negative keywords, creative refresh on fatigued campaigns.

### Longer Term — Next Quarter
Audience architecture rebuild, server-side tracking upgrade, creative testing framework, incrementality testing setup.

---

## Rules

- **Never recommend creative changes before tracking is confirmed clean.** Optimizing on bad data accelerates waste, not performance. A client under time pressure will ask to skip straight to "why isn't my creative converting" — the audit does not skip Layer 1 to move faster, because a broken pixel turns every creative comparison downstream into a comparison of noise, not signal.
- **Broad Match on Google is never a one-condition decision.** An active Smart Bidding strategy is necessary but not sufficient — verified conversion tracking, a maintained negative list, and enough conversion volume for signal all have to hold too. On a lead-gen account, this rule protects CRM quality, not just budget.
- **The 3x Kill Rule applies without exceptions — but the clock starts once the sales cycle has had time to resolve, not at campaign launch.** A campaign at 4x CPA "with potential" is a money drain. In B2B lead gen, though, judging a 90-day-cycle campaign on its CPA at day 30 measures an unfinished funnel, not a failed one: apply the rule to a lag-adjusted proxy (SQL rate, pipeline created) until revenue has had time to land, then apply it to true CAC once it has. Killing a campaign on a raw 30-day CPA in a long-cycle business ends it before its pipeline has had a chance to exist.
- **MER is the real ROAS.** Platform-reported ROAS is vanity. Always reconcile against actual revenue and total spend, pulled independently — revenue from the CRM, spend from the platforms, never blended into one export.
- **A CAC that fails the benchmark table is a flag to investigate, not a verdict on its own — check it against payback before calling it critical.** A CAC that recovers in a handful of months is a healthy investment even when it reads high against a generic CPL figure. One dated industry study (Aleph × Benchmarkit, FY2025 data) puts B2B SaaS CAC payback at a global median around 16 months — shorter for smaller deals and earlier funding stages, longer for enterprise deals and later ones. Use that shape, not the raw CAC, to decide whether "critical" in the table above means a real problem or a bigger deal size than the benchmark assumed.
- **Don't conclude from a comparison the data can't support.** Below a few dozen conversions per side, "Lookalike beats Interest" or "Campaign A beats Campaign B" is noise dressed as insight — say the sample is too small and wait, rather than act on a read that will likely reverse itself next week.
- **Learning phase protection is sacred.** If a campaign is in learning, the only intervention is patience — know in advance whether the change about to be made crosses the 20% budget threshold that resets it, because there is no undo once it does.