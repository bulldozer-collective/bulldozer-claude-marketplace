---
name: |-
  programmatic-seo
description: |-
  Build SEO-optimized pages at scale using templates and data — location pages, integration pages, comparison pages, glossary terms, and persona pages. Triggers on 'programmatic SEO,' 'pages at scale,' 'location pages,' 'integration pages,' or 'generate 100 pages.' For auditing existing SEO, see seo-audit. For content planning, see content-strategy.
when-to-use: |-
  Build SEO-optimized pages at scale using templates and data — location pages, integration pages, comparison pages, glossary terms, and persona pages. Triggers on 'programmatic SEO,' 'pages at scale,' 'location pages,' 'integration pages,' or 'generate 100 pages.' For auditing existing SEO, see seo-audit. For content planning, see content-strategy.
argument-hint: |-
  Build integration pages for our Zapier, Slack, and HubSpot integrations — B2B SaaS
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - mcp__plugin_bulldozer_bulldozer__bdzGetSeoDomains
  - mcp__plugin_bulldozer_bulldozer__bdzListSeoDataSources
  - mcp__plugin_bulldozer_bulldozer__bdzGetSeoDomainKeywords
  - mcp__plugin_bulldozer_bulldozer__bdzListCmsSites
  - mcp__plugin_bulldozer_bulldozer__bdzListCmsCollections
  - mcp__plugin_bulldozer_bulldozer__bdzGetCmsCollection
  - mcp__plugin_bulldozer_bulldozer__bdzCreateCmsCollection
  - mcp__plugin_bulldozer_bulldozer__bdzCreateCmsCollectionField
  - mcp__plugin_bulldozer_bulldozer__bdzListCmsItems
  - mcp__plugin_bulldozer_bulldozer__bdzCreateCmsItem
  - mcp__plugin_bulldozer_bulldozer__bdzPublishCmsItems
  - mcp__plugin_bulldozer_bulldozer__bdzPublishCmsSite
  - mcp__plugin_bulldozer_bulldozer__bdzGetCmsRobotsTxt
  - mcp__plugin_bulldozer_bulldozer__bdzReplaceCmsRobotsTxt
  - mcp__plugin_bulldozer_bulldozer__bdzGetSeoGscDomains
  - mcp__plugin_bulldozer_bulldozer__bdzPutGscInspectionUrls
  - mcp__plugin_bulldozer_bulldozer__bdzGetGscInspectionUrls
  - mcp__plugin_bulldozer_bulldozer__bdzGetGscDomainInspections
  - mcp__plugin_bulldozer_bulldozer__bdzGetGscDomainSitemaps
  - mcp__plugin_bulldozer_bulldozer__bdzGetGscDomainAnalytics
effort: |-
  high
---

# Programmatic SEO

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on programmatic SEO — building SEO-optimized pages at scale using templates and data. Your goal is to create pages that rank, provide genuine value, and avoid thin content penalties.

## Input

`$ARGUMENTS` — the keyword pattern or page type to build (e.g., "integration pages for Slack, HubSpot, Salesforce" or "location pages for 50 US cities"). If not provided, read any available context files before asking. Only ask if the keyword pattern or page type is completely absent.

## Output

A `pseo-strategy-{keyword-pattern}.md` file with: playbook selection rationale, keyword validation, data source plan, URL structure, page template (with all sections and variable placeholders), internal linking architecture, indexation strategy, and quality checklist. Optionally produces 2–3 example page drafts from the template.

**Produce output on first invocation. Read available context before asking. Only ask if the primary input is completely absent.**

---

## Core Principles

### 1. Unique Value Per Page
Not just swapped variables. Every page must provide value specific to that page. The more differentiated, the better. "Best project management software in Austin" that's identical to "Best project management software in Denver" except for the city name = thin content = penalty risk.

### 2. Proprietary Data Wins

Data defensibility hierarchy:
1. **Proprietary** — you created it (highest quality, hardest to replicate)
2. **Product-derived** — from your own users or product usage
3. **User-generated** — from your community
4. **Licensed** — exclusive access deal
5. **Public** — anyone can use (weakest, commoditized)

Programmatic pages built on public data (Wikipedia, open datasets) are the riskiest. Build on data only you have when possible.

### 3. Subfolders, Not Subdomains
Subfolders consolidate domain authority. Subdomains split it.
- Correct: `yoursite.com/integrations/slack/`
- Avoid: `integrations.yoursite.com/slack/`

### 4. Intent Match Above All
Pages must actually answer what the searcher wants. A "Slack integration" page that explains how to set up the integration serves the query; a page that just says "We integrate with Slack" does not.

### 5. Quality Over Quantity
100 great pages > 10,000 thin ones. Google's "scaled content abuse" spam policy — in force since March 2024 — named programmatic-style page generation its top enforcement priority in the March 2026 spam update: sites that published hundreds or thousands of AI-generated pages without editorial review reportedly saw 50–80% traffic drops. Google kept coming back to the same policy through the rest of 2026: a June 2026 spam update again enforced scaled content abuse (alongside cloaking and keyword stuffing, as an improvement to the detection systems rather than a new rule), and an August 18–21, 2026 update hit it again harder — SEO press coverage pointed to a site with over 1.3 million programmatically-generated URLs losing most of its visibility as one concrete case, and across that update 16.71% of URLs that had been ranking in the top 10 fell beyond position 100 for the same keyword. A fourth spam update rolled out September 24, 2026 without naming any new target. Four enforcement passes in one year, three of them touching this same policy, is itself the signal: this isn't a one-off scare, it's a standing risk for anything built at scale without review. The policy itself hasn't changed since 2024 — it still doesn't ban AI or templates, it targets pages that add no real value for users, however they were produced at scale.

**The risk compounds at the site level, not just the page level.** Google's own John Mueller said in September 2026 that a pattern of low-value programmatic pages can lead Google's systems to "lose faith" in the *site* providing good value to users — not just flag the individual pages. In the case he was responding to, the offending pages had already been set to noindex, and the site's other, unrelated pages still hadn't recovered; he described recovery as needing sustained time and demonstrated value, not a quick fix. This was said in a Bluesky reply, reported by multiple SEO outlets (Search Engine Journal, Search Engine Roundtable) — not a Google Search Central blog post, so treat it as a strong Google-sourced signal rather than written policy. Practical consequence: noindexing or deleting a failed batch is not an undo button for site-wide trust once it's lost — one more reason to validate a small batch before committing to the full set, rather than treating "we can always take it down" as a safety net.

**Launch pace is itself a signal.** Publishing a thousand near-identical new pages in one day reads as scaled content regardless of quality; the same volume rolled out in batches over weeks, with indexation checked between batches, reads as a real publication. Ship in phases — a first batch of the highest-priority combinations, confirm indexation and impressions on that batch, then expand — rather than generating the full set and publishing it all at once.

---

## The 12 Playbooks

For the table of the 12 programmatic playbooks (keyword pattern, example, data needed per playbook) and the layering rule, read `references/playbooks-catalog.md` when selecting or combining playbooks.

---

## Choosing Your Playbook

For the "If you have... best playbook(s)" selection table, read `references/playbooks-catalog.md` (same file) when matching a playbook to the client's assets.

---

## Implementation Framework

### Step 1: Keyword Pattern Validation

Before touching volume, name the searcher: who is behind this pattern, at what point in
their decision are they, and what do they need to find to move forward? "Integrations for
[Tool]" searched by someone mid-evaluation needs proof the integration is real and how it
works — not a marketing page that says "We integrate with Tool." A pattern with volume but
no clear buyer intent behind it (a curiosity search, a one-off lookup) is a pattern that
won't convert even if it ranks.

Once the intent is named, validate the pattern has search demand:
- What is the repeating structure? (e.g., "[Product] integration with [Tool]")
- What are the variable values? (list of tools)
- How many unique combinations exist?
- What's the estimated aggregate search volume?
- Is there page-1 competition you can realistically beat?

**In Bulldozer OS**: if the project has an SEO domain registered (`bdzGetSeoDomains`),
`bdzGetSeoDomainKeywords` returns volume, difficulty, and position per keyword for that
domain — call `bdzListSeoDataSources` first for the exact market enum (full names like
`UNITED_STATES`, `FRANCE`, not ISO codes) and pass it as `sources`. Use it to size the
pattern's aggregate volume against real numbers instead of a guess, and to see which
variable values already rank (skip building a page for a combination you already own).
**This is a monthly snapshot, not a live read** — each row's `metadata.month`/`metadata.year`
says which month it was taken, and that snapshot can sit months behind the call date (checked
on the internal Bulldozer project on 2026-10-11: latest available snapshot still dated June
2026). Read that field before quoting a position or a volume as current — a stale snapshot is
still useful to size the pattern, just not to claim a page "already ranks #2 today."
No SEO domain registered → say so and size the pattern qualitatively (a handful of
variable values worth a dedicated page vs. hundreds that aren't) rather than inventing a
volume figure.

**Red flags**: keyword cannibalization with existing pages; a pattern where intent is served by one authoritative page rather than a list of individual pages; aggregate volume so low it can't be measured or defended with a specific number — treat that as the actual warning sign, not a fixed cutoff like "under 100 searches." A pattern with 40 combinations at 15 searches each can be worth building if each combination is cheap to produce and maintain and the intent is bottom-of-funnel; a pattern with 3 combinations at 200 searches each usually isn't worth a template — write those 3 pages by hand instead. Size the decision on combinations × maintenance cost × intent, not on a single volume threshold.

**When to refuse the play entirely, not just flag a red flag**: when the only available data is public and identical to what every competitor's page would show (same source, same facts, no proprietary angle) — the differentiation problem is visible at design time, before a single page is built, and no template trick fixes it later. And when nobody on the client's side will own keeping the data current: a programmatic set built on data that goes stale is worse than not building it, because Google indexes it once accurate and then it silently degrades. Say no to the pattern, or say yes only on the subset with a real data source — don't build the full set and hope maintenance happens.

### Step 2: Data Requirements

Map exactly what data populates each page:
- What unique content goes on each page?
- Where does it come from?
- How is it maintained/updated?
- Is the data accurate enough to publish?

Build your data source before building templates. Stale or incorrect data undermines the entire program.

### Step 3: Template Design

Every page needs:

```
[Target keyword in H1]
[Unique intro — not just variables swapped — 100-150 words specific to this combination]

## What [Variable] does / How [Variable] works
[Data-driven explanation — unique per page]

## [Product] + [Variable] integration
[Integration-specific content]

## Key features
[Conditional: show different features based on use case]

## Who uses this
[Customer stories or use case examples]

## Get started
[CTA]
```

**Ensuring uniqueness**: Use conditional content blocks that change based on data attributes. Generate unique introductions from templates that combine multiple data points. Include actual customer examples or reviews where available.

**Writing the intro so 500 of them don't read as one.** "Not just variables swapped" is not
achieved by vocabulary rotation — a template that swaps synonyms around the same sentence
shape still reads as one voice repeated 500 times. What actually varies a template-written
paragraph: put the one fact specific to this combination first, in the opening sentence, not
buried after a generic setup shared by every page; write it as a claim, not a description
("Slack sends Asana task updates to the channel your team already watches" rather than "This
page covers the Slack and Asana integration"); and if a sentence would read exactly the same
on the page for a different variable value, cut it — it isn't unique, it's padding.

### Step 3 bis: Building It In Bulldozer OS (Webflow)

For the Webflow CMS build procedure through Bulldozer OS tools (checking existing collections, the one-way door of collection creation, staged items, two-step publishing, structured data in the CMS template), read `references/cms-build-bulldozer-os.md` before the first `bdzCreateCmsCollection` or `bdzCreateCmsItem` call.

### Step 4: Internal Linking Architecture

Hub-and-spoke model:
- **Hub**: Main category page (e.g., `/integrations/`)
- **Spokes**: Individual programmatic pages (e.g., `/integrations/slack/`)
- **Cross-links**: Related spokes link to each other (e.g., Slack page → Notion page)

Every spoke page must be reachable from the site (no orphan pages). XML sitemap for all pages. Breadcrumbs with structured data.

### Step 5: Indexation Strategy

For the indexation rules (dedicated sitemap, noindex on thin combinations, crawl budget guidance, internal link priority), read `references/indexation-strategy.md` before planning the indexation of a batch.

---

## Quality Checklist (Pre-Launch)

**Content quality**:
- [ ] Each page provides unique value specific to that combination
- [ ] Answers the search intent clearly
- [ ] Readable and useful to a human (not just keyword-populated)
- [ ] No exact duplicate blocks across pages

**Technical SEO**:
- [ ] Unique `<title>` and `<meta description>` per page
- [ ] Proper H1/H2 hierarchy with keyword
- [ ] Schema markup implemented (Article or Product as appropriate). Not FAQPage as a rich-result play: Google removed FAQ rich results from Search entirely on 2026-05-07 — the markup is still valid to keep for content understanding, but it earns no visual real estate in results anymore, on any site
- [ ] LCP ≤ 2.5s on mobile and desktop (Google's official Core Web Vitals "good" threshold, measured at the 75th percentile of page views — not a template rule of thumb). Worth checking on a programmatic template specifically because one slow shared component (a hero image, an embedded map) drags every page built from it at once. Core Web Vitals is a page-experience ranking factor, not the dominant one — don't sell it as the fix for a pattern that isn't ranking for intent reasons

**Internal linking**:
- [ ] Connected to hub pages
- [ ] No orphan pages
- [ ] Related pages cross-linked

**Indexation**:
- [ ] In XML sitemap
- [ ] No conflicting noindex — checked by hand in Webflow's per-item SEO panel, not by a Bulldozer OS tool
- [ ] Canonical tags self-referencing

---

## Post-Launch Monitoring

For the full post-launch monitoring procedure (indexation status via GSC inspection tools, rankings and traffic per page group, cannibalization checks, sitemap health, the stop-and-change criteria and the known GSC reporting incidents), read `references/post-launch-monitoring.md` before setting the monitoring cadence or reading any post-launch data.

---

## Common Mistakes

- **Thin content**: Swapping only city/tool names with identical surrounding text
- **Over-generation**: Creating combinations with zero search demand
- **No data quality check**: Publishing incorrect or outdated data at scale (100x the damage of a single page error)
- **Ignoring UX**: Pages exist for Google, not for users — leads to high bounce rates that suppress rankings
- **Keyword cannibalization**: Multiple templates targeting the same queries
- **Assuming the CMS automates what it doesn't**: on Webflow, per-item noindex and 301 redirects are manual settings (the latter gated behind an Enterprise plan) — plan for the manual step, don't discover it at launch
- **Publishing the whole set in one push**: generating the full batch and publishing it all at once is itself a signal scaled-content detection looks for, independent of per-page quality — stage the rollout and check indexation between batches instead