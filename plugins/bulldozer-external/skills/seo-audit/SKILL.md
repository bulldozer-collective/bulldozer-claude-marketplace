---
name: |
  seo-audit
description: |
  Audit a website's SEO and produce a prioritized action plan. Triggers on 'SEO audit,' 'technical SEO,' 'why am I not ranking,' 'my traffic dropped,' 'lost rankings,' or 'crawl errors.' Also triggers on vague 'my SEO is bad.' For pages at scale, see programmatic-seo. For structured data, see structured-data-schema. For AI search optimization, see seo-ai-search.
when-to-use: |
  Audit a website's SEO and produce a prioritized action plan. Triggers on 'SEO audit,' 'technical SEO,' 'why am I not ranking,' 'my traffic dropped,' 'lost rankings,' or 'crawl errors.' Also triggers on vague 'my SEO is bad.' For pages at scale, see programmatic-seo. For structured data, see structured-data-schema. For AI search optimization, see seo-ai-search.
argument-hint: |
  https://example.com — traffic dropped 40% last month
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |
  high
---

# SEO Audit

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on SEO audits. Your goal is to audit a website comprehensively and produce a prioritized action plan that drives ranking recovery or improvement.

## Input

`$ARGUMENTS` — domain or URL, optionally with context (e.g., "example.com — traffic dropped 40% in March"). If not provided, read any available context files before asking. Only ask if no site or URL has been identified.

## Output

An `seo-audit-{domain}.md` file with: executive summary (top 3–5 priority issues), technical SEO findings, on-page SEO findings, content quality assessment, and a prioritized action plan (critical fixes → high-impact → quick wins → long-term). Each finding includes: what's wrong, impact level, evidence, and specific fix.

**Produce on first invocation when a URL is given. Default to a full audit unless told otherwise. Only ask if no URL or site has been identified.**

---

## Priority Order

Audit in this order — highest leverage first:

1. **Crawlability & Indexation** — can Google find and index it?
2. **Technical Foundations** — is the site fast and functional?
3. **On-Page Optimization** — is content optimized?
4. **Content Quality** — does it deserve to rank?
5. **Authority & Links** — does it have credibility?

---

## Technical SEO Audit

### Crawlability

**Robots.txt**: Check for unintentional blocks on important pages. Verify sitemap reference is present.

**XML Sitemap**:
- Exists, accessible, submitted to Search Console
- Contains only canonical, indexable URLs (no 301s, 404s, noindex pages)
- Updated regularly

**Site Architecture**:
- Important pages within 3 clicks of homepage
- No orphan pages (zero internal links)

**Crawl Budget** (for large sites 10k+ pages):
- Parameterized URLs handled (canonical or robots exclusion)
- Faceted navigation under control
- No infinite scroll without pagination fallback

### Indexation

**Check**:
- `site:domain.com` in Google to estimate index size
- Search Console Coverage report for errors vs. expected pages
- Noindex tags on important pages (common CMS misconfiguration)
- Canonical tags pointing wrong direction
- Soft 404s (pages returning 200 with "not found" content)

**Canonicalization**:
- All pages have self-referencing canonical tags
- HTTP → HTTPS canonical consistency
- www vs. non-www consistency
- Trailing slash consistency across all pages

### Schema Markup Detection Limitation

`web_fetch` and `curl` cannot reliably detect schema markup. Many CMS plugins (AIOSEO, Yoast, RankMath) inject JSON-LD via JavaScript — it won't appear in static HTML.

**To accurately check schema**:
1. Google Rich Results Test: https://search.google.com/test/rich-results
2. Browser DevTools: `document.querySelectorAll('script[type="application/ld+json"]')`
3. Screaming Frog (if client provides an export)

Do not report "no schema found" based solely on web_fetch — this produces false audit findings.

### Core Web Vitals

| Metric | Target | What it measures |
|--------|--------|-----------------|
| LCP (Largest Contentful Paint) | < 2.5s | Loading performance |
| INP (Interaction to Next Paint) | < 200ms | Responsiveness |
| CLS (Cumulative Layout Shift) | < 0.1 | Visual stability |

Check via PageSpeed Insights and Search Console Core Web Vitals report.

**Common LCP killers**: unoptimized hero images, render-blocking JavaScript, slow server response (TTFB > 600ms).

**Common CLS killers**: images without dimensions, ads/embeds without reserved space, web fonts causing layout shift.

### Mobile & Security

- Responsive design (same content as desktop — Google uses mobile-first indexing)
- HTTPS across entire site, valid SSL, no mixed content
- HTTP → HTTPS 301 redirects in place

---

## On-Page SEO Audit

### Title Tags

| Check | Issue if failing |
|-------|-----------------|
| Unique per page | Duplicate titles dilute relevance |
| Primary keyword near beginning | Buried keywords carry less weight |
| 50–60 characters | Longer = truncated in SERP |
| Compelling and click-worthy | Rankings mean nothing if nobody clicks |

### Meta Descriptions

- 150–160 characters, unique per page
- Includes primary keyword (not a ranking factor, but affects CTR)
- Clear value proposition with call to action
- Auto-generated descriptions are almost always worse than written ones

### Heading Structure

- One H1 per page, containing primary keyword
- Logical hierarchy: H1 → H2 → H3 (no skipping levels)
- Headings describe content (not just styled for aesthetics)

### Content Optimization

- Primary keyword in first 100 words
- Related semantic keywords naturally used throughout
- Content depth matches or exceeds what's ranking on page 1
- Search intent match: informational, navigational, commercial, transactional?

### Internal Linking

- Important pages well-linked from relevant content
- Descriptive anchor text (not "click here")
- No broken internal links
- Orphan pages identified and linked from relevant pages

---

## Content Quality Assessment

### E-E-A-T Signals

**Experience**: First-hand experience demonstrated, original insights, real examples
**Expertise**: Author credentials visible, accurate/detailed information, properly sourced claims
**Authoritativeness**: Cited by others, recognized in the space
**Trustworthiness**: Accurate info, transparent business info, contact details, HTTPS

### Common Content Quality Failures

- Thin pages: little unique content, mostly duplicated from elsewhere
- AI-generated content with no editing: lacks specificity, uses telltale patterns (em dashes everywhere, "delve," "landscape," excessive hedging)
- Outdated content not refreshed: stale dates, old statistics, deprecated information
- Keyword cannibalization: multiple pages targeting the same keyword and competing with each other

---

## International SEO (When Applicable)

### Hreflang Requirements

| Requirement | Why it matters |
|-------------|---------------|
| Self-referencing entry on every page | Without it, all hreflang ignored |
| Reciprocal links (A→B, B→A) | One-directional pairs are dropped |
| Valid language codes (e.g., `en-GB`, not `en-UK`) | Invalid codes cause the pair to be discarded |
| `x-default` for fallback URL | Required for proper locale routing |
| All target URLs return 200 and are indexable | Non-canonical targets invalidate the cluster |

**Common hreflang errors**: missing self-reference, no return tag, invalid region codes (en-UK instead of en-GB), hreflang target is 301 redirect.

### Canonicalization for Multilingual Sites

- Each locale page must self-canonical (`/fr/page` → canonical `/fr/page`)
- Never cross-locale canonical (French page canonical to English = French version suppressed entirely)
- Canonical must appear in hreflang set — if not, hreflang is silently ignored

---

## Common Issues by Site Type

**SaaS/Product Sites**: Thin feature pages, no comparison/alternative pages, blog not linked to product, missing glossary/educational content.

**E-commerce**: Thin category pages, duplicate product descriptions from manufacturer, faceted navigation creating duplicate URL crawl traps, out-of-stock pages mishandled (should 301 to category, not 404).

**Content/Blog Sites**: Keyword cannibalization, outdated content not refreshed, no topical clustering, weak internal linking structure.

**Local Business**: Inconsistent NAP (Name, Address, Phone) across directories, missing local schema, no Google Business Profile optimization.

---

## Output: Prioritized Action Plan

### Critical Fixes (Do First — Blocking Rankings)
Issues that prevent pages from being indexed or ranked. Fix before anything else.

### High-Impact Improvements (Next 30 Days)
Significant ranking/traffic improvements with medium effort.

### Quick Wins (This Week)
Low effort, immediate benefit. Titles, meta descriptions, internal links.

### Long-Term Recommendations (90+ Days)
Content creation, authority building, technical improvements requiring dev resources.