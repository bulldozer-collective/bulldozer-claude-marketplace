# Paid targeting mechanics for ABM — Step 4 detail

Full mechanics behind the "LinkedIn ads" / "Sponsored Content" rows in the Step 4 channel-mix
tables: how named-account targeting actually gets built in Bulldozer OS, how to narrow it to
the buying committee, the Tier 2/3 topical layers, retargeting already-engaged accounts, and
the deliverability gate before scaling Tier 3 email volume.

## Named-account targeting on LinkedIn and Meta

Named-account targeting on LinkedIn (and Meta) ads is a real, verified capability, not an
aspiration: `bdzSearchAdTargetingEntities` (facet `AD_TARGET_FACET_EMPLOYER`) resolves a
company name to the LinkedIn organization URN behind it. That URN goes into the `audience`
array of the ad group, created with `bdzCreateAdLayer2` — not the campaign: `bdzCreateAdLayer1`
only sets up the campaign shell (budget, objective, dates), it has no audience field at all,
`audience` lives one level down. `EMPLOYER` sits on Meta's detailed-targeting facet list too,
so the same named-account mechanic carries over if a tier's channel mix adds Meta alongside
LinkedIn. That's the mechanism behind "Sponsored Content to all contacts at the account" in
the Tier 1/2 tables — build the account list first, create the campaign (Layer 1), then
resolve each employer and set the audience on its ad group (Layer 2) before setting it live.

## Narrowing to the buying committee

To narrow that audience to the buying committee instead of every employee at the account,
stack `AD_TARGET_FACET_EMPLOYER` with `AD_TARGET_FACET_SENIORITY` and/or
`AD_TARGET_FACET_JOB_FUNCTION` — both are enumerable without a text query (10 seniority levels
from entry-level to owner, 26 job functions), so the values can be listed and picked directly
rather than guessed. There is no dedicated buyer-group facet: `AD_TARGET_FACET_BUYER_GROUP`
returns an empty list on role-style queries — compose the buying-committee audience from
employer + seniority/job-function (or `AD_TARGET_FACET_JOB_TITLE` for a specific title, which
does take a free-text query), never from that facet.

## Tier 2/3 topical layers — GROUP, SKILL, INTEREST, and MEMBER_BEHAVIOR

For Tier 2/3 cluster campaigns, four further facets layer a sector, community, or declared-
interest signal on top of firmographic and hierarchical targeting: `AD_TARGET_FACET_GROUP`
(LinkedIn professional/community groups), `AD_TARGET_FACET_SKILL` (member-declared skills),
`AD_TARGET_FACET_INTEREST` (declared interests), and `AD_TARGET_FACET_MEMBER_BEHAVIOR`
(observed behaviors) are all operant on `bdzSearchAdTargetingEntities` — like
JOB_TITLE/EMPLOYER/INDUSTRY, all four take a free-text query and return real, usable URNs.
INTEREST in particular can match an ABM-specific category directly: a query for `Account
Based Marketing` resolves to the interest "Account-Based Marketing (ABM) Software"
(`urn:li:interest:spc1324`) — useful to pre-filter for accounts already evaluating this kind
of tooling. Use these facets to add a topical layer to the Tier 2/3 industry-level targeting
already built from INDUSTRY, never as a Tier 1 named-account substitute for EMPLOYER.

Two different pitfalls apply, not one: GROUP and SKILL return noisier, less curated labels
than EMPLOYER — mixed-relevance and off-geography groups, product names surfacing as
"skills" — so vet the returned URNs by hand before adding them to an ad group's audience
rather than taking the first result the way EMPLOYER usually allows. INTEREST and
MEMBER_BEHAVIOR have the opposite problem: an over-specific query can return an empty list
even though the facet itself is operant (`Growth Marketing` on INTEREST, `Business` on
MEMBER_BEHAVIOR both return nothing), while the broader term that contains it does return
results (`Marketing`, `Travel`) — widen the query before concluding the facet has no match,
rather than assuming it's one of the genuinely empty facets below.

## Retargeting already-engaged accounts

Retargeting already-engaged accounts is a separate, real mechanism — not a substitute for the
named-account layer above. `bdzListPlatformSegments` (per LinkedIn ad account) lists every
Matched Audience segment LinkedIn already holds for that account — website retargeting,
LinkedIn Page visitors, lead-gen form openers, event-attendee lists, and predictive (LinkedIn's
post-lookalike ML) audiences — each with the exact `targetingId` (`urn:li:adSegment:*`) and the
facet to put it under (`AD_TARGET_FACET_DYNAMIC_SEGMENT` for retargeting/uploaded lists,
`AD_TARGET_FACET_AUDIENCE_MATCHING_SEGMENT` for the rest), added to the same `audience` array
on `bdzCreateAdLayer2`/`bdzUpdateAdLayer2` as the EMPLOYER values above —
`bdzSearchAdTargetingEntities` itself returns nothing for these two facets, this is the only
OS-native way to find their URNs. Check `state` before using one: only `AD_AUDIENCE_STATE_READY`
delivers, an `ARCHIVED`, `EXPIRED` or still-`BUILDING` segment is listed but inert. These
segments are account-wide (everyone who visited the pricing page, every event registrant), not
scoped to one named account, so use this layer to re-engage accounts that already tripped a
Step 3 signal, stacked alongside the EMPLOYER-based layer for Tier 1 — never as a replacement
for it.

A second, simpler retargeting lever sits directly on `bdzSearchAdTargetingEntities`:
`AD_TARGET_FACET_FOLLOWED_COMPANY` resolves a company name to the audience of people who
follow that LinkedIn page, exactly like EMPLOYER resolves a name to its organization URN —
no pre-built Matched Audience segment required. Two uses: point it at your own page to warm
an audience that already follows you before a Tier 1 push, or at a competitor's page to
conquest their audience. The same labeling trap as EMPLOYER applies, but worse — a company
name as generic as "Bulldozer" can resolve to several distinct URNs sharing the exact same
label (three separate organizations all labeled "Bulldozer" turned up in one real query,
on top of the obvious homonyms), so confirm page size and sector before diffusing rather than
taking the first exact-label match the way EMPLOYER usually allows.

## Deliverability gate before scaling Tier 3

Before turning on Tier 3 at 200–1000+ accounts, treat deliverability as a gate, not an
afterthought. Since late 2025, Gmail and Yahoo reject non-compliant bulk mail outright rather
than routing it to spam once a sender crosses their bulk-volume thresholds — missing
authentication, a complaint rate above roughly 0.3%, or no one-click unsubscribe gets the
message refused before it ever reaches an inbox. Confirm domain authentication and warm-up
status before scaling Tier 3 volume, not after open rates come back flat.
