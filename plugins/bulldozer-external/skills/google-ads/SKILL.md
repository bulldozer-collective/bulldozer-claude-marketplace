---
name: |-
  google-ads
description: |-
  Set up and optimize Google Ads campaigns across Search, Shopping, Performance Max, and YouTube/Demand Gen. Triggers on 'Google Ads,' 'Search campaign,' 'Performance Max,' 'Google shopping,' or 'PPC on Google.' For cross-platform strategy, see paid-strategy. For Meta campaigns, see meta-ads. For live performance data on an already-running account (campaigns, ad groups, keywords, metrics, keyword ideas), see bulldozer-sea.
when-to-use: |-
  Set up and optimize Google Ads campaigns across Search, Shopping, Performance Max, and YouTube/Demand Gen. Triggers on 'Google Ads,' 'Search campaign,' 'Performance Max,' 'Google shopping,' or 'PPC on Google.' For cross-platform strategy, see paid-strategy. For Meta campaigns, see meta-ads.
argument-hint: |-
  B2B SaaS project management tool, $15k/mo budget, want search campaigns for bottom-funnel keywords
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Google Ads

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on Google Ads. Your goal is to build Search, Shopping, and Performance Max campaigns that drive efficient, high-intent customer acquisition.

## Input

`$ARGUMENTS` — product, monthly budget, target keywords or campaign type, and goal (e.g., "B2B SaaS, $10k/mo, want Search campaigns targeting 'project management software' keywords"). If not provided, read any available context files before asking. Only ask if budget and campaign type are completely absent.

If the account is already registered in Bulldozer OS, pull real numbers instead of asking the client to guess: account list and currency from `bdzListGoogleAdwordAccounts`, running campaigns/ad groups/keywords from `bdzListSeaL1s`/`bdzListSeaL2s`/`bdzListSeaL3s`, and their performance from `bdzGetSeaL1Metrics`/`bdzGetSeaL3Metrics` — all served by the **bulldozer-sea** skill. A plan built on the account's actual conversion volume and cost is worth more than one built on the client's memory of last month's numbers.

## Output

A `google-ads-plan-{product}.md` file with: campaign type selection, keyword strategy (with match types), ad group structure, RSA copy (15 headlines + 4 descriptions), bid strategy recommendation, conversion tracking checklist, negative keyword list, and optimization cadence.

**Produce output on first invocation. Read available context before asking. Only ask if the primary input is completely absent.**

---

## Campaign Types

| Campaign type | Best for | When to use |
|--------------|----------|-------------|
| **Search** | High-intent, bottom-funnel | People actively searching for your solution |
| **Performance Max** | Full-funnel, cross-channel | Scaling conversion campaigns, e-commerce |
| **Shopping** | E-commerce product discovery | Physical or digital products with SKUs — standalone Shopping campaigns still exist alongside Performance Max with a Shopping goal |
| **YouTube / Demand Gen** | Awareness, upper-funnel, retargeting | Complex product that benefits from video explanation. Since July 15, 2026 this is also where Google Display Network inventory lives — see note below |

**Display no longer exists as a standalone campaign type.** Google retired standalone Display campaigns on July 15, 2026: new ones can't be created, and existing ones auto-migrate into Demand Gen through 2027 (Google's own migration tool, or automatic if nobody moves them first). The Display Network inventory itself hasn't gone away — remarketing and low-CPM awareness placements that used to live in a Display campaign are now bought through a Demand Gen campaign instead, alongside YouTube, Discover, Gmail, and Maps. If a legacy account still shows a Display campaign, treat it as on borrowed time and plan the migration rather than optimizing it as a permanent fixture. Placement exclusions, device targeting, and audience layering don't always carry over cleanly — check them after any migration, manual or automatic.

**For most B2B SaaS starting out**: Begin with Search. It captures existing demand efficiently before creating demand.

---

## Search Campaign Structure

### Account Organization

```
Account
├── Campaign: Brand (your brand name keywords)
│   └── Ad Group: Brand exact
├── Campaign: Category — [Problem/Solution]
│   ├── Ad Group: Category broad keywords
│   └── Ad Group: Category specific long-tail
└── Campaign: Competitor — [Competitor Name]
    └── Ad Group: Competitor name + "alternative"
```

**Always run a Brand campaign** separately, even if you rank #1 organically. Competitors bid on your brand. Brand CPC is cheap. Protecting brand terms has near 100% ROI.

**Before writing Competitor campaign copy, look at what the competitor is actually running** — don't guess their message. If the account is registered in Bulldozer OS, this is a real toolchain, not a manual UI trip: resolve the competitor's Google advertiser ID (`bdzGetSeaPublicGoogleAdvertiserIds` by domain, or `bdzSearchSeaPublicAdvertisers` by keyword when you only know what they might be bidding on), launch the import (`bdzCreateSeaPublicGoogleAdwords` — asynchronous, poll `bdzGetSeaPublicGoogleAdwordsImport` until it reports success), then read the creative with `bdzListSeaPublicGoogleAdwords`. A `text` field of `null` means the Transparency Center never published structured copy for that ad, not that the ad doesn't exist. This is a separate, public corpus — it never reconciles with the competitor's real performance, which you can't see.

### Keyword Strategy

For keyword research in Bulldozer OS, the match-type table and progression rules, when broad match is safe, AI Max for Search, and the negative keyword baseline list, read `references/keywords-and-negatives.md`. Build the negative list before launch.

### Ad Group Structure

Each ad group = one tightly themed keyword group. Mix of match types for the same theme.

```
Ad Group: "project management software"
- [project management software]
- "project management tool"
- project management app
- project management platform

→ 1 RSA + 1–2 variants
```

---

## RSA (Responsive Search Ads) — Writing Headlines

Google assembles 15 headlines and 4 descriptions into combinations. Write each headline as standalone — they appear in random positions. Google displays up to 3 headlines and 2 descriptions per assembled ad.

For the 15-headline formula (value proposition, features, CTA, social proof), character limits, the warning on pushing copy changes to a live ad group, pinning rules, Ad Strength guidance and the 4-description formula, read `references/rsa-formulas.md`.

---

## Bidding Strategy

For the bidding strategy ladder by stage, the rules on CPA targets, learning-phase resets and moving to a new stage, and audience bid adjustments (observation mode), read `references/bidding-and-quality-score.md`.

---

## Quality Score

For the Quality Score components, the per-keyword metrics call in Bulldozer OS, and how to improve QS, read `references/bidding-and-quality-score.md`.

---

## Performance Max

For when to use Performance Max, its best practices, the exclusion-list caveats and the visibility limits, read `references/pmax-and-conversion-tracking.md`.

---

## Conversion Tracking Checklist

For the conversion tracking checklist, offline conversion upload, and the B2B reading-window guidance, read `references/pmax-and-conversion-tracking.md`. Verify tracking before judging any campaign.

---

## Weekly Optimization Checklist

If the account is registered in Bulldozer OS, most of the numbers below don't need a manual pull from Google Ads' UI — **bulldozer-sea** already surfaces them: `bdzListSeaSearchTermReports` (filterable by `minImpressions`/`maxConversions`) for search-term waste, `bdzGetSeaL1Metrics`/`bdzGetSeaL3Metrics` with `daily=true` for pacing and keyword-level performance over a real date range, and `bdzGetSeaL3Metrics` for the three Quality Score components per keyword. The same service can also apply the pause/bid/copy change directly on the live account — it isn't limited to reporting.

**Reading revenue and ROAS, not just conversions.** The same L1/L3 calls (and `bdzGetSeaAdMetrics` at ad level) also return `conversionValue`, `allConversions`/`allConversionsValue`, and `roas` (= `conversionValue` / cost) — the actual revenue signal a Target ROAS strategy is optimizing toward, not just a conversion count. All four come back `null`, never `0`, on any date range that was imported before revenue tracking existed on the account: read a `null` as "not measured," not as zero revenue, and re-import the window before trusting a ROAS conclusion built on it.

**Reading impression share without over-reading it.** `searchImpressionShare` is masked below 10% — Google returns exactly `0.0999` to mean "under 10%," a sentinel value, not a measurement, so don't trend it as if it moved from 0.0999 to 0.0999. It's also `null` for any non-Search campaign and for the current, still-partial day.

**Every week**:
- [ ] Review Search Terms report — add new negatives
- [ ] Check budget pacing (on track? under/over?)
- [ ] Review auction insights (competitive pressure)
- [ ] Pause ads with CTR <1% after 500+ impressions
- [ ] Check impression share — are you losing to budget or rank? (watch for the 10% mask above)

**Every 2 weeks**:
- [ ] Review Quality Score per keyword
- [ ] Add new ad variants to best-performing ad groups
- [ ] Adjust bids on manual campaigns based on performance data

**Every month**:
- [ ] Review keyword performance — pause consistent underperformers
- [ ] Test new keyword themes from search terms report
- [ ] Update negative keyword list
- [ ] Review device performance — adjust mobile bid modifiers if needed

---

## Rules

- **Don't optimize before the signal is real.** A verified conversion action tied to actual revenue comes before any bid or budget change. An account that looks disciplined but optimizes toward an untrustworthy conversion event is optimizing toward nothing.
- **Don't compare or conclude below the conversion-volume floor.** Under ~30 conversions/month per campaign, a bid strategy change, an ad variant test, or a "this audience beats that one" call is reading noise as signal. Wait for volume, or widen the campaign until you have it.
- **The RSA copy is the lever, not the afterthought.** Fifteen headlines and four descriptions, iterated on purpose, move more than another round of bid-strategy tinkering. Budget review time accordingly — most accounts under-invest in copy and over-invest in re-checking bids.
- **Every launch gets a stop rule before it gets a budget.** A CPA/ROAS ceiling and a time box (e.g., 4–6 weeks for PMax, 2–4 weeks for a new Search structure) decided up front, not discovered after the spend has already happened.
- **PMax answers campaign-level questions only.** Don't ask a PMax campaign which keyword or audience is winning — structurally, it can't tell you. Route anything that needs that level of control back to Search.
- **A benchmark without a source doesn't go in the plan.** Cite where a CPC, CPA, or CTR threshold comes from, or state it as an order of magnitude — never as a precise number attributed to "industry average."
- **Don't open broad match on "we're on Smart Bidding" alone.** It needs conversion tracking, engaged Smart Bidding, an active negative list, and real volume — all four, not one. On a lead-gen account especially: a loose match doesn't just waste spend, it floods the CRM with leads that look like pipeline until someone qualifies them.
- **AI Max for Search is upgrading accounts automatically now, not waiting to be turned on.** Since September 1, 2026 any account with Automatically Created Assets or broad match enabled is being rolled onto it, whether or not anyone asked — check for those two settings before promising a client that a tightly-pinned RSA structure will hold, and plan on page-feed/URL exclusions rather than a full opt-out once the account is upgraded.
- **A brand exclusion list set once isn't a brand exclusion list.** PMax's account-level exclusions don't cover every surface (Shopping has its own separate toggle) and don't stay effective on autopilot — recheck branded query volume periodically instead of assuming the box you ticked at launch is still doing its job.
- **Don't plan a standalone Display campaign.** Google retired the campaign type on July 15, 2026 — Display Network inventory now runs through Demand Gen. A legacy account still showing one is migrating, not staying put.
- **Bidding strategy, channel type, and geo/language targeting don't change in place.** Moving a campaign from Manual CPC to Target CPA means launching a new campaign, not editing the existing one — plan the transition as a cutover, with the old campaign's history preserved for reference, not as a setting you flip.