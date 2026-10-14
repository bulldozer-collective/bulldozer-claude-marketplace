# Two-Axis Performance Map and Cannibalization Check

## Phase 3: Two-Axis Performance Map

Plot every URL on two axes:

| | **High Conversion** | **Low Conversion** |
|---|---|---|
| **High Visibility** | Protect & Compound | Fix Discovery → Conversion path |
| **Low Visibility** | Fix SEO / distribution | Consolidate or Remove |

**Threshold definitions:**
- High visibility = top 50th percentile by organic clicks in the library
- High conversion = top 50th percentile by key event completions

**Read clicks alongside position, not alone.** AI Overviews and other SERP answer features now compress organic CTR industry-wide — three independently-sourced 2026 measurements (an Ahrefs panel of ~300,000 keywords, a randomized causal study, and Pew Research's comparison of users shown an AI summary vs. not) converge on roughly a third to half of clicks lost when an AI Overview fires for a query, worse on purely informational intents than on transactional ones. It hits informational, top-of-funnel intents ("what is X," "how does X work") much harder than bottom-funnel or transactional ones ("X pricing," "X vs Y"). **Treat the exact magnitude as moving, not settled.** Ahrefs' own figure for the top result shifted between its two published runs (roughly a third in one version, closer to 58% in a later one), and at least one 2026 analysis argues total click volume on a site hasn't actually fallen — rising search volume offsets the lower per-query CTR. Read the range as directional (informational queries lose more than transactional ones) rather than a precise constant to plug into a forecast. An explainer page whose clicks fell while its average position held or improved isn't losing visibility — the SERP is eating the click before it reaches the page. Score that case as a distribution problem (get the piece in front of people through channels that don't run through a search results page — newsletter, LinkedIn, internal linking from pages that still convert clicks) rather than dropping it into "Fix SEO" and rewriting for keywords it still ranks for.

This produces four segments with clear actions:

1. **Protect & Compound** (high/high): Keep fresh. Add internal links from new content. Strengthen CTAs and conversion pathways. Do not rewrite — refine.
2. **Fix CTA/UX** (high visibility, low conversion): Traffic exists but isn't converting. Audit the CTA, the offer alignment, and whether the page addresses the right intent.
3. **Fix SEO** (low visibility, high conversion): Converts well but nobody finds it. Improve keyword targeting, add internal links from high-traffic pages, update the title tag.
4. **Cut or Consolidate** (low/low): No traffic, no conversions. Unless it has significant backlinks, this is a removal or redirect candidate.

## Phase 5: Cannibalization Check

Pull all target keywords from the inventory. Flag any where 2+ URLs are getting impressions for the same query in Search Console.

**Where this actually comes from.** `bdzGetGscDomainAnalytics` stores each row against exactly one dimension (QUERY, PAGE, COUNTRY or DEVICE) — a QUERY row gives impressions and position for a keyword, a PAGE row gives the same for a URL, but the two are never joined on the same row. It cannot tell you which URLs rank for a given query. For that, use `bdzGetSeoDomainKeywords` (per-market keyword tracking): each row already carries both `keyword` and `url`, so two or more rows sharing the same keyword with different URLs is the real cannibalization signal — sort by `keyword` to group them. Use GSC's QUERY-dimension impressions as a secondary check on which of those clusters carries enough search demand to be worth fixing first.

**One required argument that's easy to miss.** `sources` is mandatory on `bdzGetSeoDomainKeywords` — a list of markets (full enum names like `FRANCE` or `UNITED_STATES`, never ISO codes like `FR`; call `bdzListSeoDataSources` for the valid set), and only markets already configured on the domain return rows. Skip it or configure the wrong market and the call comes back empty in a way that reads as "no keyword data" rather than "wrong market" — check which markets the domain actually tracks before concluding there's nothing to cluster.

**Also a monthly snapshot, not live ranking data.** Two independent real calls on the same project, a week apart, returned the identical snapshot (same `metadata.month`/`metadata.year`, four months old both times) — no progress in between. Check `metadata.month`/`metadata.year` on the response before trusting a cluster's positions as current, and don't expect a re-run of this check to show movement unless the snapshot itself has actually advanced.

**Cannibalization diagnostic:**
- Two pages ranking positions 8–20 for the same keyword = likely cannibalizing each other
- One page at position 3 and another at position 15 for the same query = the weaker one is suppressing the stronger
- Fix: choose the winner (usually the one with more backlinks + higher engagement), consolidate content from the loser into the winner, redirect loser to winner

**Check intent before you fix anything.** A shared keyword is not automatically cannibalization. Two pages can legitimately target the same term at different points in the buyer's decision — an explainer ("what is X") and a bottom-of-funnel page ("X pricing") — and merging them serves neither reader. Open both URLs and check whether they answer the same question for the same reader before consolidating; if they don't, leave them alone. And weigh this against real demand: a keyword overlap on a query with near-zero GSC impressions is not worth fixing regardless of how clean the cannibalization signal looks — spend the effort where the QUERY-dimension impressions say someone is actually searching.

Do not split cannibalization fixes across multiple pages. One URL wins per keyword cluster. That's it.
