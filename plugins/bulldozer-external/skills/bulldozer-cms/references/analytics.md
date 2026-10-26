# Site analytics (Webflow Analyze only)

Needs the Webflow **Analyze** add-on (else 403). WordPress: 501 — use Google Analytics / Search Console instead.

Constraints:
- **One request at a time per site** — never call these tools in parallel.
- `startTime` / `endTime` ISO-8601 UTC; window ≤ **100 days**; nothing before `2025-04-09T00:00:00Z`.
- `limit`: top-pages / top-events ≤ 250, top-dimensions ≤ 100; out of range is a 400.

| Question | Tool |
|---|---|
| Visits over time | `bdzGetCmsTrafficReport(siteId, startTime, endTime, metricScope?, bucketTimeZone?)` |
| Best pages | `bdzGetCmsTopPagesReport(siteId, startTime, endTime, sortBy?, limit?)` — note `sortBy`, not `metricScope` |
| Sources, countries, devices… | `bdzGetCmsTopDimensionsReport(siteId, startTime, endTime, dimension, …)` |
| Clicks / form events | `bdzGetCmsTopEventsReport(siteId, startTime, endTime, limit?)` |
| Engagement over time | `bdzGetCmsTimeOnPageReport(siteId, startTime, endTime, …)` |

Typical monthly review: traffic (last 30 days, `bucketTimeZone` = the site's `timeZone` from `bdzGetCmsSite`),
then top pages, then top dimensions by traffic source — in sequence. Cross with [seo-metadata.md](seo-metadata.md)
to prioritise the metadata of the most visited pages.
