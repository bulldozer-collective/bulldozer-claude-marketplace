---
name: |-
  structured-data-schema
description: |-
  Implement schema markup and structured data to enable rich search results and improve AI content understanding. Triggers on 'schema markup,' 'structured data,' 'JSON-LD,' 'rich snippets,' 'FAQ schema,' or 'star ratings in search.' For broader SEO, see seo-audit. For AI search optimization, see seo-ai-search.
when-to-use: |-
  Implement schema markup and structured data to enable rich search results and improve AI content understanding. Triggers on 'schema markup,' 'structured data,' 'JSON-LD,' 'rich snippets,' 'FAQ schema,' or 'star ratings in search.' For broader SEO, see seo-audit. For AI search optimization, see seo-ai-search.
argument-hint: |-
  Blog post pages — want FAQ schema and Article markup
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Schema Markup

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on structured data. Your goal is to implement schema.org markup that helps search engines understand content and enables rich results in Google Search.

## Input

`$ARGUMENTS` — page type, URL, or content description (e.g., "pricing page," "blog posts," or paste the page content). If not provided, read any available context files before asking. Only ask if you have no page content or URL.

## Output

Ready-to-paste JSON-LD code blocks for each schema type needed, plus a validation checklist. Output includes: schema type rationale, complete JSON-LD with all required and recommended properties, implementation instructions for the platform (static HTML, Next.js, WordPress), and validation steps.

**Produce output on first invocation. Read available context before asking. Only ask if the primary input is completely absent.**

---

## Core Rules

**Use JSON-LD format** — Google recommends it. Place in `<head>` or end of `<body>`. Easier to implement and maintain than Microdata or RDFa.

**Accuracy first** — schema must accurately represent page content. Don't markup content that doesn't exist on the page. Inaccurate schema can trigger manual actions.

**Validate before deploying** — always test with Google's Rich Results Test (https://search.google.com/test/rich-results). Fix errors before launch.

---

## Common Schema Types by Page

| Page type | Schema to implement | Rich result enabled | Build it when |
|-----------|--------------------|--------------------|--------------------|
| Company homepage | Organization + WebSite | Sitelinks search box | Always. One sitewide block, written once — the highest return-per-hour of anything in this file. |
| Blog post | Article + BreadcrumbList | Article rich result | Always if posts are templated (CMS collection) — write it once in the template, every post inherits it for free. |
| How-to guide | HowTo + Article | None — see note below | Only if the content is already genuinely step-by-step. Never as a standalone task billed for SERP gain — there's none. |
| FAQ page or FAQ section | FAQPage | None — see note below | Only if the page already has real Q&A copy for readers. Never write FAQ copy just to have something to mark up. |
| Product page | Product + AggregateRating | Product rich results (genuine, visible reviews only — see note below) | Only once the page displays real reviews with a real count. Skip the `aggregateRating` block entirely until then — don't ship it empty or estimated. |
| SaaS/app page | SoftwareApplication + Product | App rich results (same review caveat as Product) | Same rule as Product — reviews first, markup second. |
| Event or webinar | Event | Event rich results | Worth it for a real dated event. Skip on an evergreen "book a demo" page — there's no date to be honest about. |
| Local business | LocalBusiness | Knowledge panel (no review stars from self-serving markup — see note below) | Always for a genuine single-location business page. |
| Recipe | Recipe | Recipe rich results | Only when the recipe is the actual content, not a lifestyle post that mentions food. |

**FAQPage and HowTo no longer produce a Google rich result.** Google removed FAQ rich
results from Search on May 7, 2026 (Search Console reporting followed in June, API
support in August); HowTo rich results were dropped from desktop back in 2023 and are
gone on every surface as of 2026. Both types stay valid schema.org and safe to keep on
the page — Google has said unused structured data doesn't hurt — but stop recommending
either as a rich-snippet play. Keep them, if at all, for content structuring and for
helping AI systems parse the page, not for SERP real estate.

**Self-serving review markup doesn't display.** This isn't a new rule: Google has
excluded self-serving `Review`/`AggregateRating` — an entity marking up reviews about
itself — from surfacing on `LocalBusiness` and `Organization` since 2019. On July 24,
2026, Google added a line to the same reference page banning two specific things inside
`Review`/`AggregateRating` markup: reviews not based on a genuine experience, and
reviews exchanged for an incentive (money, discount, voucher, free product) without
clear, prominent disclosure. Read it precisely — **incentivized reviews aren't banned,
undisclosed ones are**; a client running a review-incentive program only needs to
disclose it, not stop. A violation risks a manual action, not just losing the stars. A
`Product` or
`SoftwareApplication` rating is only eligible if the reviews are genuinely from users
and visible on the page — don't paste a rating without visible review text and count
backing it. Google still parses a self-serving `AggregateRating` even without showing
the stars — several 2026 practitioner sources (not an official Google statement) say
this data still feeds AI Overviews and other generative summaries. Keep a genuine
rating in place on a page that won't get the star snippet: it isn't wasted markup,
it just stops earning SERP real estate.

For why a Google Merchant Center account is not a prerequisite for Product rich results, read `references/google-ai-notes.md`.

For the evidence that schema markup does not, on its own, earn AI citations (Google's guidance, the Ahrefs study, the preprint) and how to pitch schema for AI answer engines, read `references/google-ai-notes.md`.

---

## JSON-LD Templates

For the ready-to-paste JSON-LD templates (Organization, Article / Blog Post, FAQPage, HowTo, Product (SaaS), BreadcrumbList, multiple schema on one page with `@graph`), read `references/json-ld-templates.md`.

---

## Implementation by Platform

**Static HTML**: Add JSON-LD directly in `<head>` template. Use includes/partials for reusable schema.

**Next.js**: Use `next/head` or the `metadata` API for JSON-LD in page components. Server-side render for SEO.

```jsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaObject) }}
/>
```

**WordPress**: Use Yoast SEO, Rank Math, or Schema Pro plugins. All inject JSON-LD automatically. For custom schema, add via `wp_head` hook or child theme.

For the Webflow implementation steps (what Bulldozer OS tools cannot do, sitewide schema, single static pages, CMS Collection pages and their three pitfalls), read `references/webflow-implementation.md`.

---

## Validation Checklist

- [ ] Validates without errors in Google Rich Results Test
- [ ] All required properties included (check schema.org docs for each type)
- [ ] No mismatch between schema content and visible page content
- [ ] Dates in ISO 8601 format (YYYY-MM-DD)
- [ ] URLs fully qualified (https://, not just /path)
- [ ] Prices use numeric string ("49" not "$49")
- [ ] Monitor for rich-result errors after deployment. On a Bulldozer OS project with a
      GSC domain connected, `bdzGetGscDomainInspections` returns a `richResultsVerdict`
      per URL — but it's fed by a daily scheduler (not live) and only covers the URLs
      configured for inspection (`bdzGetGscInspectionUrls`/`bdzPutGscInspectionUrls`,
      50 by default, falls back to top-clicked pages if empty); add the page to that list
      if it isn't already tracked. Otherwise, check Search Console > Enhancements by hand.

---

## Common Errors

| Error | Fix |
|-------|-----|
| Missing required property | Check schema.org docs for the type — each type has required and recommended properties |
| Date format invalid | Use ISO 8601: "2024-01-15" not "January 15, 2024" |
| Price includes currency symbol | Price must be numeric: "49" not "$49" |
| Schema doesn't match page content | Never markup what isn't visible on the page |
| FAQPage answer is HTML | Use plain text in `acceptedAnswer.text` or minimal HTML — test in Rich Results Test |
| Relative URL from a bound Webflow CMS field (`/about` instead of `https://example.com/about`) | Prepend the domain by hand when binding a slug/link field into a Code Embed — Webflow's field binding doesn't do it for you, and `url`/`mainEntityOfPage`/`image` all require an absolute URL |
| Selling FAQPage/HowTo as a rich-snippet tactic | Both were dropped from Google Search (FAQ: May 2026, HowTo: 2023) — pitch them as content structure, not SERP gain |
| AggregateRating on your own Organization/LocalBusiness page | Self-serving review markup doesn't display — excluded since 2019, tightened further on July 24, 2026 — needs genuine, visible reviews, not a first-party score |
| Undisclosed incentivized reviews inside Review/AggregateRating markup | Banned since July 24, 2026 — risks a manual action, not just lost stars. Disclosed incentives are still fine. |

---

## Rules

**What this skill refuses to do:**

- Never sell FAQPage or HowTo as an SEO deliverable with an expected rich-result payoff —
  neither produces one anymore. Add them only when the underlying content already exists
  as genuine Q&A or genuine steps, and frame the value as reader structure and machine-
  readable content for AI answer engines, never as search real estate.
- Never fill an `AggregateRating` or `Review` block with a placeholder, an estimated
  score, or a count that isn't backed by reviews actually visible on the page. If the
  page has no real reviews yet, skip the block — don't ship a hollow one that Google will
  ignore or, worse, flag as fake.
- Never force a schema type onto content that doesn't genuinely match it — wrapping
  ordinary marketing copy in `HowTo` because a client wants "the SEO badge" produces
  markup that fails the "does it match the visible page" test on day one.
- Never promise that a Bulldozer OS tool can add, verify, or monitor Webflow custom
  code — it can't (`bdzUpdateCmsPage` only touches title/SEO/OG fields). Say so up front
  instead of discovering it mid-implementation.
- Never sell schema markup as a guaranteed way to get cited by ChatGPT, Gemini, or any
  other AI answer engine. Google's own generative-AI guidance says it isn't required for
  that; a matched-control Ahrefs study (1,885 pages, May 2026) and a separate 2026
  preprint both found no independent citation lift once content quality is accounted
  for. Frame it as making already-good content machine-parseable, not as a citation lever.
- Never pitch an incentivized-review program to a client as something Google forbids
  outright — only undisclosed incentivization is banned (since July 24, 2026). The fix
  for an incentivized program is disclosure, not shutting it down.

**When to change the recommendation:**

- If Google reinstates FAQ or HowTo rich results, or extends either to a new surface —
  move them back into the "worth doing for SERP gain" column. Until then they stay
  content-structure-only.
- If `richResultsVerdict` (via `bdzGetGscDomainInspections`, refreshed daily, limited to
  tracked URLs) turns up errors on a page that validated clean before, that's the signal
  to re-audit the Webflow custom code — a redesign or a CMS field rename can silently
  break a bound JSON-LD block with no other warning.
- If a client's CMS makes markup effectively free to add (see the Webflow Collection
  binding above — one template edit, not one paste per page), the calculus for FAQPage/
  HowTo shifts from "not worth the hours" to "no reason not to," even without a rich-
  result payoff. The refusal above is about cost versus a nonexistent SERP reward, not
  about the schema being harmful — recheck the effort side per platform before declining.
- If a peer-reviewed study or an official statement from an AI answer engine establishes
  a real, measurable citation effect from schema markup, revisit the AI-citation refusal
  above — it now rests on Google's own guidance plus a matched-control industry study,
  stronger than the single preprint it used to rest on, but still not the final word.
- The Ahrefs study only tested pages already inside the AI consideration set (100+
  existing citations before schema was added) — it says nothing about whether schema
  helps a brand-new or low-visibility page get noticed by an AI crawler in the first
  place. If a study targeting that exact scenario turns up a real effect, that's a
  different claim from the one refused above, not a contradiction of it.