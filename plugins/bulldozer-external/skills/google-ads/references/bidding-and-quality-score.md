# Bidding Strategy and Quality Score

| Stage | Strategy | When to use |
|-------|----------|-------------|
| No conversion data | Manual CPC | First 2–4 weeks; gather data |
| 30+ conversions/month | Target CPA | Main optimization goal |
| 50+ conversions/month | Target ROAS | E-commerce or revenue-based optimization |
| Scaling | Maximize Conversions (with target) | After tCPA is proven |

**Start manual CPC** — automated, value-based bidding needs roughly 30–50 conversions per month per campaign to leave the learning phase; below that, don't compare variants or draw conclusions, wait for volume.

**Naming note**: since June 2026 Google shows "Target CPA" and "Target ROAS" as standalone strategies rather than as "Maximize Conversions with a Target CPA" / "Maximize Conversion Value with a Target ROAS" — a display rename, the underlying bidding behavior is unchanged. A rollout that completed by late August 2026 also changed how budget-limited campaigns running Target CPA/ROAS pace against their target: bidding now tracks the displayed target more faithfully through a budget change, which closes an over-performance effect some budget-capped accounts used to see before that date. If a budget-capped account's numbers moved closer to the stated target starting around then, read that as the new normal, not as something broken.

**Setting CPA targets**: Don't set them lower than your observed CPA until you've had 50+ conversions. Setting too-low targets causes Google to reduce impressions dramatically.

**Resetting the learning phase**: a budget or target change beyond roughly 20% is the threshold agencies commonly cite for resetting Smart Bidding's learning phase. Treat it as a working assumption, not a published Google rule — no editor source documents that exact figure. In practice: bundle changes instead of nudging a campaign every few days, and don't touch budget or target on a campaign still inside its first 30–50 conversions.

**Moving to a new stage in this table means a new campaign, not an edit.** Bidding strategy type, channel type, and geo/language targeting are immutable on an existing Google Ads campaign — Bulldozer OS's own campaign update (`bdzUpdateSeaL1`) can pause, resume, rename, or rebudget a live campaign, but it cannot flip Manual CPC to Target CPA in place. Plan the Manual-CPC-to-automated-bidding transition as standing up a new campaign, not converting the one gathering data today. Ad-group- and keyword-level CPC bids (`bdzUpdateSeaL2`/`bdzUpdateSeaL3`) follow the same logic in reverse: they only take effect while the parent campaign runs Manual CPC — once it moves to Target CPA/ROAS, the bidding algorithm owns the bid and those fields stop doing anything.

### Audience Bid Adjustments (Search)

Bidding by device and bidding by audience are two separate mechanisms in Google Ads Search, and Bulldozer OS keeps them apart. `bdzCreateSeaBidModifier` only ever adjusts the DEVICE dimension (mobile/tablet/desktop) at ad-group level — it has no concept of audience. To bid up or down for a specific audience within an ad group, use `bdzCreateSeaAdGroupAudience` (attach a user list or audience from `bdzListSeaAudiences`, with an optional `bidModifier`) or `bdzUpdateSeaAdGroupAudience` (`bidModifier` is the only field it can change — to swap the audience itself, detach and reattach rather than edit in place).

**Observation mode is enforced on purpose.** Google Ads' raw API defaults a newly-attached audience criterion to Targeting, which restricts who sees the ad — unlike the Google Ads UI, which defaults a Search campaign's audience to Observation (adjust the bid, never restrict reach). Bulldozer OS always forces Observation when attaching an audience this way, so an ad group's reach never narrows just because an audience was added for bid tuning. `bdzListSeaAdGroupAudiences` returns an `observation` flag — shared by every audience on that ad group, not set per row — worth checking first if an ad group's impressions collapse right after an audience was added.

This is a real lever Google Ads Search has that LinkedIn doesn't: LinkedIn has no per-audience bid adjustment, so isolating a tier there means a separate campaign. On Google Ads Search, the same ad group can weight its bid by audience without duplicating the campaign per tier.

Quality Score (1–10) directly impacts CPC: a higher score lowers the cost per click needed to hold the same ad rank. Google does not publish the exact magnitude of that discount, and the numbers floating around in agency blogs (anywhere from ~25% to ~80% for the same QS gap) don't agree with each other — treat the relationship as directional, not as a specific percentage to promise a client.

**QS components** (each rated Below average / Average / Above average, rolling up into the 1–10 score):
- **Expected CTR** (most important): Does your ad match what people expect to see?
- **Ad relevance**: Does ad copy match the keyword?
- **Landing page experience**: Does the landing page match the ad and keyword?

If the account is registered in Bulldozer OS, **bulldozer-sea**'s per-keyword metrics call (`bdzGetSeaL3Metrics`) returns these three components individually, not just the blended score — use that to diagnose *which* component is dragging a keyword down instead of only reporting the 1–10 number.

**Improving QS**:
- Match headline to keyword (if keyword = "project management software," headline should include those words)
- Ensure landing page headline matches ad headline (message match)
- Improve landing page load speed and mobile experience
