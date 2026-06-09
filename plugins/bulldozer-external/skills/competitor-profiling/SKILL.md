---
name: competitor-profiling
description: Research and profile competitors from their URLs — positioning, pricing, SEO strength, and product gaps. Triggers on 'competitor profile,' 'competitive intelligence,' 'competitor analysis,' 'profile this competitor,' 'competitive audit,' or 'competitor dossier.' For comparison landing pages, see competitor-alternatives. For sales battle cards, see sales-enablement.
when-to-use: Research and profile competitors from their URLs — positioning, pricing, SEO strength, and product gaps. Triggers on 'competitor profile,' 'competitive intelligence,' 'competitor analysis,' 'profile this competitor,' 'competitive audit,' or 'competitor dossier.' For comparison landing pages, see competitor-alternatives. For sales battle cards, see sales-enablement.
argument-hint: https://competitor.com https://competitor2.com — deep profile, focus on pricing and positioning
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# Competitor Profiling

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on competitive intelligence. Your goal is to take a list of competitor URLs and produce structured competitor profiles by combining live site research with SEO and market data.

## Input

`$ARGUMENTS` — competitor URLs and depth level (e.g., "https://competitor.com — deep profile, focus on pricing and SEO"). If not provided, ask for URLs. Only ask for depth if not specified — default is quick scan.

## Output

One `competitor-profiles/{competitor-slug}.md` per competitor + a `competitor-profiles/_summary.md` cross-competitor summary. Each profile follows the standard template below. Raw scraped data saved to `competitor-profiles/raw/{slug}/{YYYY-MM-DD}/`.

**Produce profiles on first invocation. Default to quick scan. Only ask for URLs if completely absent.**

---

## Quick Scan vs. Deep Profile

### Quick Scan (default)

- Pages: homepage + pricing
- SEO: domain overview + top keywords
- Skip: reviews, backlink details, changelog
- Output: abbreviated profile (At a Glance + Positioning + Pricing + SEO summary)

### Deep Profile

- Pages: all key pages + review sites (G2, Capterra)
- SEO: full backlink analysis + keyword intelligence + competitor discovery
- Output: full profile template below

Default to **quick scan** unless the user specifies deep profiling or provides ≤3 competitors.

---

## Research Process

### Phase 1 — Site Scraping

For each competitor, scrape and extract from:

| Page | Key Extractions |
|------|----------------|
| Homepage | Headline, subheadline, primary CTA, social-content proof claims, target audience |
| Pricing | Tiers, prices, feature breakdown, billing options, free tier/trial |
| Features | Core capabilities, how they describe each, differentiators |
| About | Team size, funding, founding story |
| Customers | Named logos, industries, case study themes |
| Changelog | Release velocity, recent product direction |

For review sites (deep profile only): G2, Capterra, Product Hunt. Extract overall rating, review count, top praise themes, top complaint themes, 3–5 representative quotes.

### Phase 2 — SEO & Market Data

Pull via DataForSEO or equivalent:

- **Domain rank / authority** — backlinks summary, referring domains count
- **Organic traffic estimate** — ranked keywords, traffic value
- **Top pages by traffic** — their highest-value content
- **Competitor discovery** — who else competes for the same keywords

### Phase 3 — Synthesis

Combine site + SEO data. Cross-reference claims (e.g., "10,000 customers" — does their traffic profile support that scale?). Label inferences clearly.

---

## Profile Template

```markdown
# [Competitor Name] — Competitor Profile

**URL**: [website]
**Generated**: [date]
**Depth**: [quick scan / deep profile]

---

## At a Glance

| Metric | Value |
|--------|-------|
| Tagline | [from homepage] |
| Founded | [year] |
| Headquarters | [location] |
| Team size | [estimate] |
| Funding | [if known] |
| Domain rank | [from SEO tool] |
| Est. organic traffic | [monthly] |
| Referring domains | [count] |
| Organic keywords | [count] |

---

## Positioning & Messaging

**Primary value proposition**: [headline + subheadline]
**Target audience**: [who they're speaking to]
**Positioning angle**: [simplicity-first / enterprise-grade / all-in-one / etc.]

**Key messaging themes**:
- [theme 1]
- [theme 2]
- [theme 3]

---

## Product & Features

**Core capabilities**: [list with brief descriptions]

**Notable differentiators**: [what they emphasize as unique]

**Integration count**: [number], key: [top 5]

**Product direction signals**: [from changelog / recent releases]

---

## Pricing

| Tier | Price | Key Inclusions |
|------|-------|---------------|
| [Starter] | [price] | [inclusions] |
| [Pro] | [price] | [inclusions] |
| [Enterprise] | [price/custom] | [inclusions] |

**Billing**: [monthly/annual, annual discount %]
**Free trial**: [yes/no, duration]
**Notable**: [pricing quirks — per-seat, usage-based, hidden costs]

---

## SEO & Content

**Est. monthly organic traffic**: [number]
**Organic keywords (top 10)**: [count]
**Top organic pages**: [list 3 with keywords]
**Content strategy**: [blog frequency, primary types, focus topics]
**Backlink profile**: [referring domains, top referring sites]

---

## Customer Reviews (deep profile only)

**G2**: [rating] ([count] reviews)
**Capterra**: [rating] ([count] reviews)

**Top praise themes**: [list]
**Top complaint themes**: [list]
**Representative quotes**: [3–5 verbatim]

---

## Strengths & Weaknesses

**Strengths**: [with evidence source]
**Weaknesses**: [with evidence source]

---

## Competitive Implications

**Where they're strong vs. us**: [areas where this competitor has an advantage]
**Where we're strong vs. them**: [areas where you have an advantage]
**Opportunities**: [gaps in their offering or positioning to exploit]
**Threats**: [areas where they're gaining ground]
```

---

## Summary Document

After profiling all competitors, produce `competitor-profiles/_summary.md` with:

1. Competitive landscape overview (1 paragraph)
2. Comparison table — key metrics side by side
3. Positioning map — where each competitor sits
4. Key takeaways — 3–5 strategic observations
5. Gaps and opportunities — where the market is underserved

---

## Handling Multiple Competitors

- Parallelize scraping — scrape all homepages simultaneously, then pricing pages
- Use consistent metrics across all profiles so they're comparable
- Build the summary last, after all individual profiles are complete
- If 10+ competitors: suggest profiling the top 5 first by market relevance

---

## Updating Profiles

Profiles are snapshots. When updating: check pricing pages first (most volatile), re-pull SEO metrics, scan changelog for product changes, note what changed in a `## Change Log` section.