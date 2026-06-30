---
name: |
  programmatic-seo
description: |
  Build SEO-optimized pages at scale using templates and data — location pages, integration pages, comparison pages, glossary terms, and persona pages. Triggers on 'programmatic SEO,' 'pages at scale,' 'location pages,' 'integration pages,' or 'generate 100 pages.' For auditing existing SEO, see seo-audit. For content planning, see content-strategy.
when-to-use: |
  Build SEO-optimized pages at scale using templates and data — location pages, integration pages, comparison pages, glossary terms, and persona pages. Triggers on 'programmatic SEO,' 'pages at scale,' 'location pages,' 'integration pages,' or 'generate 100 pages.' For auditing existing SEO, see seo-audit. For content planning, see content-strategy.
argument-hint: |
  Build integration pages for our Zapier, Slack, and HubSpot integrations — B2B SaaS
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |
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
100 great pages > 10,000 thin ones. Google's scaled content abuse policy targets low-value programmatic content explicitly.

---

## The 12 Playbooks

| Playbook | Keyword pattern | Example | Data needed |
|----------|----------------|---------|-------------|
| **Templates** | "[type] template" | "invoice template" | Your own templates |
| **Curation** | "best [category]" | "best CRM for startups" | Product/review data |
| **Conversions** | "[X] to [Y]" | "EUR to USD converter" | Rate/conversion data |
| **Comparisons** | "[X] vs [Y]" | "HubSpot vs Salesforce" | Feature/pricing data |
| **Examples** | "[type] examples" | "landing page examples" | Curated examples |
| **Locations** | "[service] in [location]" | "accountants in Austin" | Location + provider data |
| **Personas** | "[product] for [audience]" | "CRM for real estate" | Use case data |
| **Integrations** | "[A] + [B] integration" | "Slack Asana integration" | Integration docs |
| **Glossary** | "what is [term]" | "what is churn rate" | Definition + context |
| **Translations** | Content in multiple languages | Localized features pages | Translation system |
| **Directory** | "[category] tools list" | "AI writing tools" | Tool database |
| **Profiles** | "[entity name] profile" | "Brian Chesky CEO" | Entity data |

**Layering**: You can combine playbooks ("Best CRM for real estate in New York" = personas + locations). Each additional dimension multiplies pages but also requires more unique data per combination.

---

## Choosing Your Playbook

| If you have... | Best playbook(s) |
|----------------|-----------------|
| Product with integrations | Integrations, Comparisons |
| Multi-segment audience | Personas |
| Local/geographic presence | Locations |
| Design or creative product | Templates, Examples |
| Tool or utility product | Conversions, Directory |
| Content/expertise business | Glossary, Curation |
| Strong SEO + competitor landscape | Comparisons |

---

## Implementation Framework

### Step 1: Keyword Pattern Validation

Before building, validate the pattern has search demand:
- What is the repeating structure? (e.g., "[Product] integration with [Tool]")
- What are the variable values? (list of tools)
- How many unique combinations exist?
- What's the estimated aggregate search volume?
- Is there page-1 competition you can realistically beat?

**Red flags**: Pattern with <100 monthly searches total, keyword cannibalization with existing pages, pattern where intent is served by one authoritative page (not a list of individual pages).

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

### Step 4: Internal Linking Architecture

Hub-and-spoke model:
- **Hub**: Main category page (e.g., `/integrations/`)
- **Spokes**: Individual programmatic pages (e.g., `/integrations/slack/`)
- **Cross-links**: Related spokes link to each other (e.g., Slack page → Notion page)

Every spoke page must be reachable from the site (no orphan pages). XML sitemap for all pages. Breadcrumbs with structured data.

### Step 5: Indexation Strategy

- Submit dedicated sitemap for programmatic pages (`/sitemap-integrations.xml`)
- Noindex combinations with very thin data (e.g., an integration that barely exists)
- Monitor crawl budget — limit the number of low-value pages Google crawls
- Prioritize high-volume combinations in internal link frequency

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
- [ ] Schema markup implemented (Article, Product, FAQPage as appropriate)
- [ ] Page speed acceptable (<3 sec LCP)

**Internal linking**:
- [ ] Connected to hub pages
- [ ] No orphan pages
- [ ] Related pages cross-linked

**Indexation**:
- [ ] In XML sitemap
- [ ] No conflicting noindex
- [ ] Canonical tags self-referencing

---

## Post-Launch Monitoring

Track monthly:
- Indexation rate (how many pages got indexed)
- Rankings for target keywords
- Organic traffic per page group
- Engagement metrics (bounce rate, time on page)

Watch for:
- Google Search Console coverage errors (crawl anomalies)
- Ranking drops across the page group (thin content signal)
- Manual action notices in GSC
- Pages de-indexed after being indexed (quality signal failure)

---

## Common Mistakes

- **Thin content**: Swapping only city/tool names with identical surrounding text
- **Over-generation**: Creating combinations with zero search demand
- **No data quality check**: Publishing incorrect or outdated data at scale (100x the damage of a single page error)
- **Ignoring UX**: Pages exist for Google, not for users — leads to high bounce rates that suppress rankings
- **Keyword cannibalization**: Multiple templates targeting the same queries