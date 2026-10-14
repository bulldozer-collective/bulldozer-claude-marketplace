# Post-Launch Monitoring

A launch plan without a re-measurement date doesn't correct itself. Set the cadence before
launch, ground it in what Bulldozer OS actually stores, and decide upfront what gap makes
you stop and change something — not after the fact.

**What, how, and when:**

- **Indexation status per page.** `bdzPutGscInspectionUrls` registers which URLs the daily
  GSC scheduler inspects (max 50 at a time, de-duplicated, replaces the previous set); read
  the results back with `bdzGetGscDomainInspections` for `indexingState` and
  `coverageVerdict` per URL. A batch bigger than 50 pages doesn't fit in one set — rotate
  which URLs are registered (newest launches first, then a sample of the rest) rather than
  trying to watch all of them at once. GSC data lags 2–3 days behind reality (Search
  Console's own documentation on data freshness) and this scheduler itself only refreshes
  daily — checking more than weekly just re-reads the same snapshot. Treat that 2–3 day
  figure as the normal regime, not a guarantee: it has been disrupted by three separate
  Search Console reporting incidents in under a year (a weeks-long Performance report delay
  in December 2025 and a month-long Page Indexing report delay in June–July 2026, both since
  resolved, and a third Performance report delay Google confirmed on 2026-09-21, resolved
  within about a week — a live GSC property checked directly on 2026-09-29 and again on
  2026-09-30 showed freshness back to the normal D-3 regime). The same property drifted to
  D-4 then D-5 on 2026-10-03/10-04 with no SEO outlet reporting a new incident — it turned
  out to be scheduler jitter, not a fourth incident: direct checks on 2026-10-07 and again on
  2026-10-11 both found it back at the normal D-3 regime. Three confirmed incidents in under a
  year is still the number to plan around: if a read looks stuck several days beyond the
  normal lag, check for a new Search Console incident before reading it as the launch
  underperforming — but a one- or two-day wobble that corrects itself within days isn't that
  signal on its own.
- **Rankings and organic traffic per page group.** `bdzGetGscDomainAnalytics` with
  `dimension: PAGE`, filtered to the group's URL path — read weekly, not daily, for the same
  lag reason. Compare against the pattern's baseline volume from Step 1. **Past issue, no
  longer reproduced**: a call with `dimension: PAGE` used to return `QUERY` rows mixed into
  the same page of results (seen twice in August–September 2026); two fresh test calls in
  September 2026 came back clean, one dimension per row each time. Treat it as fixed rather
  than live, but keep re-filtering the response on each row's own `dimension` field as a
  free defensive habit — the cost of checking is zero, and page-level and query-level
  numbers aren't summable against each other if a mix ever recurs. **Known issue, closed but
  not backfilled**:
  a GSC logging bug inflated impressions, average position, and CTR — never clicks — on the
  Performance report from 2025-05-13 to 2026-04-27; fixed since, but Google never reprocessed
  that window. If a pattern's Step 1 baseline or an early monitoring read falls inside that
  range, discount its impressions/position/CTR and trust the click count instead.
- **Cannibalization across templates.** GSC's own analytics store one dimension per row —
  it cannot tell you which URL ranks for which query. Use `bdzGetSeoDomainKeywords` instead:
  it returns keyword + URL pairs, so two rows with the same keyword and different URLs is a
  real cannibalization signal between combinations, not a guess.
- **Sitemap health.** `bdzGetGscDomainSitemaps` for submission errors and warnings on the
  dedicated sitemap — a silently-failing sitemap means new pages never reach the index in
  the first place.

**When to stop and change something**, not just note it: set the bar before launch — e.g. "most
of this batch should be indexed within a few weeks" — and when a pattern clearly misses it,
pause generating new pages on that pattern and audit the data quality (Step 2) before
publishing more; `bdzGetGscDomainInspections`'s `coverageVerdict` will usually name the
reason. If impressions show up but clicks stay near zero over several weeks, the problem is
intent match or the title/meta (Step 3), not volume — publishing more pages on the same
broken template compounds the mistake instead of fixing it.

Watch for:
- Manual action notices in GSC
- Pages de-indexed after being indexed (quality signal failure)
- Rich Results Test / Search Console structured-data warnings on the schema from Step 3
