# Technical SEO Audit Details

## Technical SEO Audit

### Crawlability

**Robots.txt**: Read it with `bdzGetCmsRobotsTxt` when the site is a connected Webflow CMS site (`bdzListCmsSites` for the `siteId`) — it returns the allow/disallow paths per user agent and the sitemap URL directly, no fetch-and-parse needed. Note: the tool itself requires a Webflow ENTERPRISE workspace; on a lesser plan it 403s and robots.txt has to be read from the live URL instead. Either way, check for unintentional blocks on important pages and confirm the sitemap reference is present.

**XML Sitemap**:
- If a GSC domain is registered for the project, `bdzGetGscDomainSitemaps` gives the real submission status per sitemap — path, pending state, warnings, errors, last submitted/downloaded date — refreshed daily by Bulldozer's own scheduler. This replaces opening Search Console by hand.
- Contains only canonical, indexable URLs (no 301s, 404s, noindex pages)
- Updated regularly

**Site Architecture**:
- Important pages within 3 clicks of homepage
- No orphan pages (zero internal links) — cross-check the CMS's full page list (`bdzListCmsPages`) against pages that receive zero clicks/impressions in GSC (`bdzGetGscDomainAnalytics`, dimension `PAGE`) over a stable period. A page in the first list and absent or flat in the second is a real orphan/crawl-gap candidate, not a guess.

**Crawl Budget** (for large sites 10k+ pages):
- Parameterized URLs handled (canonical or robots exclusion)
- Faceted navigation under control
- No infinite scroll without pagination fallback

### Indexation

**Check**:
- `bdzGetGscDomainInspections` first, when a GSC domain is registered — it returns, per inspected URL, `coverageVerdict`, `indexingState`, `robotsTxtState`, `googleCanonical`, `userCanonical`, `mobileUsabilityVerdict` and `richResultsVerdict` from Google's own index, refreshed daily. This is the actual Coverage/canonical/rich-results check, not an approximation of it.
- That data only covers URLs the daily scheduler inspects: an empty configured list (`bdzGetGscInspectionUrls`) falls back to the domain's top pages by clicks, capped at 50 by default. To make sure specific priority pages are covered, push them explicitly with `bdzPutGscInspectionUrls` before relying on the results the next day — this is not an instant, on-demand check.
- `site:domain.com` in Google can still give a rough, directional sense of a domain's presence in the index, but treat it as an estimate only — Google has never guaranteed it reflects true index size, and reporting from early 2026 describes external index observability degrading further (a page can rank, get impressions and clicks, and still not show as reliably "indexed" through public operators). Don't put a `site:` count in an audit as if it were a measurement; use GSC inspection data for that.
- Soft 404s (pages returning 200 with "not found" content)

**Known data reliability trap — flag it, don't silently trust the numbers.** A Google Search Console logging bug inflated impressions (and by construction average position and CTR) on the standard Performance report from 13 May 2025 to 27 April 2026 — clicks were not affected. Google fixed the logging function going forward but never reprocessed the past window. Any audit pulling `bdzGetGscDomainAnalytics`/`bdzGetGscDomainAnalyticsSummary` over a period overlapping that year owes the client an explicit note: trust the clicks, treat impressions/position/CTR from that window as overstated, not as a clean baseline for a before/after comparison. This is separate from the ordinary reporting-delay regime below — it's a data-*correctness* bug, not a data-*freshness* one, and it doesn't self-correct by waiting longer.

**The normal freshness regime, and when to suspect an incident instead.** GSC data through Bulldozer OS runs D-3 (matching Google's own 2–3 day publication lag) — present that as the baseline, not as evidence something is broken. It has broken at least three times in ways worth knowing before you blame the OS: the Performance report ran several weeks behind in December 2025 (resolved); the Page Indexing report (what `bdzGetGscDomainInspections` reads) ran about a month behind from mid-June to early July 2026 (resolved); and a third Performance report delay was confirmed by Google on 21 September 2026 — as of this review (25 September 2026), no source reports a resolution or an ETA. The first two were confirmed by Google as display delays only (crawl, indexing and ranking were not actually affected while the report lagged); treat the third the same way unless something surfaces saying otherwise. Three incidents in under a year means this isn't a one-off fluke to wave away — if a client's data looks stuck more than a few days past D-3 for several days running, check for a live incident before either blaming the OS or re-explaining the normal lag as if nothing could be wrong.

**Canonicalization**:
- Read straight from `googleCanonical` vs. `userCanonical` in `bdzGetGscDomainInspections` where available — a mismatch is the canonicalization problem, directly, no inference needed.
- HTTP → HTTPS canonical consistency
- www vs. non-www consistency
- Trailing slash consistency across all pages

### Schema Markup Detection Limitation

`web_fetch` and `curl` cannot reliably detect schema markup. Many CMS plugins (AIOSEO, Yoast, RankMath) inject JSON-LD via JavaScript — it won't appear in static HTML.

**To accurately check schema**:
1. `bdzGetGscDomainInspections`' `richResultsVerdict` field, for URLs the daily scheduler actually inspects — Google's own read, not a guess from HTML.
2. Google Rich Results Test: https://search.google.com/test/rich-results, for anything outside that inspected set.
3. Browser DevTools: `document.querySelectorAll('script[type="application/ld+json"]')`
4. Screaming Frog (if client provides an export)

Do not report "no schema found" based solely on `web_fetch` — this produces false audit findings. And don't flag a missing `FAQPage` schema as a rich-result opportunity: Google removed FAQPage rich results from search entirely in May 2026, for every site, not just the government/health-only restriction that had been in place since 2023. The markup itself is harmless to keep, it just no longer earns anything in the SERP.

### Core Web Vitals

| Metric | Target | What it measures |
|--------|--------|-----------------|
| LCP (Largest Contentful Paint) | ≤ 2.5s | Loading performance |
| INP (Interaction to Next Paint) | ≤ 200ms | Responsiveness |
| CLS (Cumulative Layout Shift) | ≤ 0.1 | Visual stability |

These are field-data thresholds: Google evaluates them at the 75th percentile of real visitor data (Chrome UX Report), not a single lab measurement — a page can look fast in PageSpeed Insights and still fail Core Web Vitals if the real-world 75th percentile is worse. Check via PageSpeed Insights and the Search Console Core Web Vitals report; no Bulldozer OS tool surfaces this report directly today.

**Common LCP killers**: unoptimized hero images, render-blocking JavaScript, slow server response (TTFB > 600ms).

**Common CLS killers**: images without dimensions, ads/embeds without reserved space, web fonts causing layout shift.

### Mobile & Security

- Responsive design (same content as desktop — Google uses mobile-first indexing)
- HTTPS across entire site, valid SSL, no mixed content
- HTTP → HTTPS 301 redirects in place
