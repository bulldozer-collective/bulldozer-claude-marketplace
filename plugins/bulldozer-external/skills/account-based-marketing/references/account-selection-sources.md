# Account selection — weighting caveat and data source detail

Detail behind the Step 2 "Selection Criteria" table and data-source list: why the published
weighting isn't an audited formula, and the nuance on two of the data sources (6sense/Bombora
overlap, which Bulldozer OS Signal types actually monitor a named list versus discover
candidates).

## The weighting is a starting framework, not an audited formula

Vendor frameworks published in 2026 don't converge on a single split — one common model weighs
fit/budget/intent at roughly 45/35/20, another weights five dimensions (industry, company size,
budget, intent, relationship) closer to 15/20/20/25/20 — none of them match the Step 2 table
exactly, and none publish the methodology behind their numbers. Use the table to get a first
list moving, then replace the weights with whatever actually predicts a closed-won account in
your own pipeline data once you have enough of it.

## G2 and Capterra are now one dataset, not two

G2 acquired Capterra, Software Advice, and GetApp from Gartner in early 2026 and folded them
into a single consolidated offering (G2 Digital Markets / G2 Buyer Intent): a profile visit or
review captured on any of the four sites feeds the same buyer-intent dataset. Treat "G2 /
Capterra" as one provider to evaluate, not two independent sources to check separately —
checking both no longer doubles your coverage, the same overlap logic as 6sense/Bombora below.
G2's own performance claims for the merged dataset (roughly 2x more signals, 36% more
in-market accounts) come only from G2's own announcement of the acquisition, with no published
methodology or third-party audit — treat them as a vendor claim, not a benchmark to repeat.

## 6sense and Bombora overlap

6sense and Bombora both remain active category leaders in 2026 for intent data showing who is
researching your category, but they aren't two independent sources to stack — 6sense ingests
Bombora's Company Surge data as one of its own inputs, so buying both gets you 6sense's
platform layer on top of Bombora, not broader coverage. Pick one based on whether you need the
raw data feed (Bombora) or the full orchestration layer (6sense), not both for redundancy.

## Bulldozer OS Signals — which types monitor a named list versus discover candidates

Only `SIGNAL_TYPE_JOB_OFFERS_WATCHLIST` genuinely monitors a **named** account list — either a
`companies` field filled in directly, or a `sourceType` reading a list you already keep in a
connected CRM (`csv` / `hubspot_list` / `pipedrive_filter` / `hubspot_company_list` /
`pipedrive_org_filter`). `SIGNAL_TYPE_COMPANY_GROWTH`, `SIGNAL_TYPE_DEPARTMENT_GROWTH`, and
`SIGNAL_TYPE_EMPLOYEE_DEPARTURE` read that way but aren't watchlists: their config only accepts
broad filters (company size, industry, region, growth range), so they *discover* accounts
matching those criteria rather than monitor the Tier 1 list already built. Use the
growth/departure signals earlier, to help build the Tier 2/3 candidate pool in this step, and
reserve `JOB_OFFERS_WATCHLIST` for the actual named-list trigger once Tier 1 is locked. Each
signal run costs credits per lead and writes into a lead list, so it's cheaper to point at a
short Tier 1 list than to run at Tier 3 scale.

A second, distinct path to the same growth signal sits on the ad-targeting side:
`AD_TARGET_FACET_GROWTH_RATE` on `bdzSearchAdTargetingEntities` enumerates five LinkedIn
company-growth tiers directly (from "Negative growth companies" to "20%+ company growth"),
usable straight in the `audience` array of a Tier 2/3 ad group (`references/paid-targeting-mechanics.md`).
Don't conflate the two mechanisms: `SIGNAL_TYPE_COMPANY_GROWTH` builds a lead list of accounts
to work (outbound, CRM), while `AD_TARGET_FACET_GROWTH_RATE` only filters who sees an ad —
neither substitutes for the other, and a Tier 2/3 program can legitimately use both at once
(ads reach the growth-tier audience, the Signal builds the list sales works).
