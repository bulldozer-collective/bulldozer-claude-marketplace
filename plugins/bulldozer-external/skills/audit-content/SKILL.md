---
name: |
  audit-content
description: |
  Full audit of a content library — blog, resources, case studies — against traffic, conversion, and pipeline contribution. Triggers on 'content audit,' 'audit our blog,' 'which content is working,' 'content is not converting,' 'what to do with old content,' or 'content strategy audit.' For SEO specifically, see seo-audit. For editorial production, see content-strategy.
when-to-use: |
  Full audit of a content library — blog, resources, case studies — against traffic, conversion, and pipeline contribution. Triggers on 'content audit,' 'audit our blog,' 'which content is working,' 'content is not converting,' 'what to do with old content,' or 'content strategy audit.' For SEO specifically, see seo-audit. For editorial production, see content-strategy.
argument-hint: |
  Acme SaaS blog — 340 posts, traffic flat for 6 months, only 5% of posts drive 80% of leads
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
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

---

## Phase 1: Inventory

Pull all content URLs. Sources in order:
- Sitemap (`domain.com/sitemap.xml`)
- Screaming Frog or Ahrefs export if provided
- Manual list if provided in arguments

For each URL record: URL, title, publish date, last updated, content type (blog, case study, landing page, resource).

Exclude: pages published in the last 60 days (insufficient data), product/pricing pages (separate CRO audit), documentation.

---

## Phase 2: Performance Data

For each URL, pull:

**Organic performance** (Google Search Console):
- Impressions (last 90 days)
- Clicks / organic sessions
- Average position for primary keyword
- CTR

**Engagement** (GA4):
- Engaged sessions
- Engagement rate
- Average engagement time
- Key event completions (leads, trials, demo requests)

**Authority**:
- Referring domains (Ahrefs or provided export)
- Internal links pointing to page

If no analytics access is provided, ask once. Proceed with whatever data is available — a partial audit with real data beats a complete audit with invented data.

---

## Phase 3: Two-Axis Performance Map

Plot every URL on two axes:

| | **High Conversion** | **Low Conversion** |
|---|---|---|
| **High Visibility** | Protect & Compound | Fix Discovery → Conversion path |
| **Low Visibility** | Fix SEO / distribution | Consolidate or Remove |

**Threshold definitions:**
- High visibility = top 50th percentile by organic clicks in the library
- High conversion = top 50th percentile by key event completions

This produces four segments with clear actions:

1. **Protect & Compound** (high/high): Keep fresh. Add internal links from new content. Strengthen CTAs and conversion pathways. Do not rewrite — refine.
2. **Fix CTA/UX** (high visibility, low conversion): Traffic exists but isn't converting. Audit the CTA, the offer alignment, and whether the page addresses the right intent.
3. **Fix SEO** (low visibility, high conversion): Converts well but nobody finds it. Improve keyword targeting, add internal links from high-traffic pages, update the title tag.
4. **Cut or Consolidate** (low/low): No traffic, no conversions. Unless it has significant backlinks, this is a removal or redirect candidate.

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

Score ≤10: Remove or Redirect candidate. Score 11–15: Update candidate. Score 16–18: Keep as-is.

---

## Phase 5: Cannibalization Check

Pull all target keywords from the inventory. Flag any where 2+ URLs are getting impressions for the same query in Search Console.

**Cannibalization diagnostic:**
- Two pages ranking positions 8–20 for the same keyword = likely cannibalizing each other
- One page at position 3 and another at position 15 for the same query = the weaker one is suppressing the stronger
- Fix: choose the winner (usually the one with more backlinks + higher engagement), consolidate content from the loser into the winner, redirect loser to winner

Do not split cannibalization fixes across multiple pages. One URL wins per keyword cluster. That's it.

---

## Phase 6: Decision Table

Every URL gets exactly one of five verdicts:

| Verdict | Criteria | Action |
|---------|----------|--------|
| **Keep** | Protect & Compound quadrant, score ≥16, no cannibalization | Refresh quarterly, protect internal links |
| **Update** | Has traffic or backlinks but score <16, or >12 months without a refresh | Rewrite thin sections, update stats, fix CTA, re-optimize title |
| **Consolidate** | Cannibalizes another URL, or two low-performers cover the same topic | Merge best content into one page, 301 redirect loser |
| **Redirect** | Has backlinks but content is unsalvageable or off-brand | 301 to most relevant existing page (not the homepage) |
| **Remove** | Zero traffic for 12+ months, no backlinks, no conversion, not worth redirecting | 410 or noindex — do not redirect to homepage (Google treats this as a soft 404) |

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