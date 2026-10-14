# Performance Max and Conversion Tracking

Use Performance Max (PMax) when:
- You have 30+ conversions/month in Search
- You want to expand to Shopping, Display, YouTube, Gmail
- E-commerce with product feed

**PMax best practices**:
- Provide high-quality creative assets (images, logos, headlines, descriptions, videos)
- Use audience signals (customer list, website visitors) to guide targeting — Google Customer Match's minimum list size was lowered to 100 users (from 1,000) and generalized across all networks including Search, so a first-party list that used to be too small to bother with may now be usable as a PMax signal.
- Add a brand exclusion list at the account level (your own brand plus competitors you don't want to bid on) — isolates branded from non-branded traffic so PMax isn't just re-buying demand you already own, and lets you evaluate non-branded performance honestly. Exclusions cover misspellings and variants automatically.
- **Don't treat the exclusion list as a guarantee.** It's documented to apply to Search, Shopping, and YouTube search inventory — but Shopping carries its own separate opt-in ("allow Shopping ads on searches that mention excluded brands") that, left on, lets branded Shopping ads through the account-level exclusion anyway. Back the list up with campaign-level negative keywords for the variants brand-entity matching misses, and check Google's own PMax search-term/insights view periodically for branded query volume creeping back in — an exclusion list set once and never re-checked is exactly the kind of thing that quietly stops working.
- Use Search themes (up to 25 per asset group) as an exact-match-style hint to the algorithm: 5–15 specific, high-converting query patterns, not generic category words. Themes steer targeting; they don't substitute for weak assets.
- Exclude brand keywords from PMax (run Brand campaign separately)
- Give PMax 4–6 weeks before evaluating — longer learning phase than Search

**PMax caveat**: Limited visibility into where spend goes, and structurally so — a Performance Max campaign has no ad groups or keywords underneath it in Google's own data model (nor in Bulldozer OS's: `bdzListSeaL2s`/`bdzListSeaL3s` return empty for a PMax campaign). "Which keyword is winning" has no answer for PMax; the finest level you can analyze is the campaign itself, plus whatever asset-level report Google's own UI exposes. Supplement with Search campaigns for bottom-funnel keywords you need to see and control individually.

If the account is registered in Bulldozer OS, `bdzListSeaAdAssets` (filtered by `l1Id`) partially closes that gap: it returns the actual image/video assets sitting inside each PMax asset group — real, current composition, not a memory of what was uploaded at launch. It stops short of performance, though: Google doesn't attach a performance label (Low/Good/Best) to a Performance Max asset the way it does for a standard ad's assets — that field comes back empty for every PMax row. Useful to confirm what's actually deployed per asset group without opening Google's UI; not useful for ranking which asset is carrying the campaign.

- [ ] Google Ads tag installed on all pages
- [ ] Conversion actions created: Lead (form submit), Purchase, or equivalent
- [ ] Conversion action verified with a test conversion
- [ ] Import conversions from GA4 (recommended for cleaner data)
- [ ] Enhanced conversions enabled and Google's Customer Data Terms accepted — since June 2026 "enhanced conversions for web" and "enhanced conversions for leads" are a single on/off setting rather than two separate ones; if the account already had one enabled it should carry over, but confirm the toggle covers both surfaces
- [ ] UTM parameters in all ad final URLs
- [ ] Cross-device conversions enabled
- [ ] Attribution model checked, not assumed — Google retired first-click, linear, time-decay, and position-based in 2026, migrating every account automatically to data-driven (if it has the conversion volume) or last-click (if it doesn't). Know which one an account landed on: last-click gives zero credit to anything that isn't the final click, which understates the case for Demand Gen or PMax's upper-funnel contribution when a budget conversation comes up.
- [ ] Offline conversions wired back, if closed-won happens outside the click (B2B, sales-assisted) — see below

**Offline conversions, if the deal closes after the click**: Bulldozer OS can push these natively (`bdzCreateSeaConversionAction` with `type=UPLOAD_CLICKS`, then `bdzUploadSeaConversions` against gclid/gbraid/wbraid — auto-tagging must be on, check with `bdzGetSeaAutoTagging`, or clicks never carry an id to match against). Read the returned `results` field row by row; Google processes the batch as partial failure, so a 200 doesn't mean every row landed. Treat this path as legacy, not future-proof: Google blocked *new* adopters from it on June 15, 2026 (an account that had never called it before gets `CUSTOMER_NOT_ALLOWLISTED_FOR_THIS_FEATURE`), and is retiring it for every account, grandfathered or not, by March 2027 — the recommended replacement is the Data Manager API or Enhanced Conversions for Leads. Don't build a new offline-conversion workflow on this path for an account that hasn't already used it; standard CRM connectors (HubSpot, Salesforce) aren't affected, they run under the hood on the newer API.

**Why this matters**: Google optimizes for what you tell it to optimize for. If you don't set up conversion tracking, Google will optimize for clicks — cheap, high-volume, low-intent. And before trusting any optimization built on top of it: confirm what's actually reaching Google matches what makes revenue — a clean-looking account optimizing toward a form-fill that never becomes a customer is optimizing toward noise.

**In B2B specifically**: don't judge a campaign's conversion performance at 1–2 weeks if the sales cycle is longer than that. A "Lead" conversion fires fast; the revenue it represents doesn't. Judging Target CPA/ROAS performance before enough of that lag has played out is judging the wrong number.
