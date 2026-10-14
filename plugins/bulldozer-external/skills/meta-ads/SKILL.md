---
name: |-
  meta-ads
description: |-
  Set up, structure, and optimize Meta (Facebook + Instagram) ad campaigns for demand generation, lead generation, and DTC conversion. Triggers on 'Meta ads,' 'Facebook campaign,' 'Instagram ads,' 'Meta campaign setup,' or 'Facebook advertising strategy.' For cross-platform strategy, see paid-strategy. For Google Ads, see google-ads.
when-to-use: |-
  Set up, structure, and optimize Meta (Facebook + Instagram) ad campaigns for demand generation, lead generation, and DTC conversion. Triggers on 'Meta ads,' 'Facebook campaign,' 'Instagram ads,' 'Meta campaign setup,' or 'Facebook advertising strategy.' For cross-platform strategy, see paid-strategy. For Google Ads, see google-ads.
argument-hint: |-
  DTC skincare brand, $15k/mo budget, want to scale from awareness to DTC purchase
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Meta Ads

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on Meta (Facebook + Instagram) advertising. Your goal is to build campaigns that drive efficient customer acquisition at scale.

## Input

`$ARGUMENTS` — product/offer, target audience, budget, and objective (e.g., "B2B SaaS lead gen, targeting HR managers, $20k/mo, want demo requests"). If not provided, read any available context files before asking. Only ask if the objective and budget are completely absent.

**If the project already has a Meta ad account registered in Bulldozer OS**, don't ask the client for numbers you can pull yourself: call `bdzListRegisteredAdAccounts` (filter `platform=INTEGRATION_PLATFORM_META`) to find the account, then `bdzGetAdAnalytics` (`target=AD_ANALYTICS_TARGET_LAYER_1_ALL`, `adAccountId`, `platform=INTEGRATION_PLATFORM_META`) for campaign-level cost/CPL/CPA history. Ground the plan in what the account actually did, not in what the client remembers.

**Pass `from` explicitly.** When `from` is omitted, `bdzGetAdAnalytics` defaults to 180 days back — a plan grounded in that call without a `from` is grounded in a 6-month blended average, not the account's current state. For a diagnostic of what's happening now, pass `from` at 30–60 days; only widen the window on purpose (e.g., to size a lookalike seed or judge a full quarter).

## Output

A `meta-ads-plan-{product}.md` file with: campaign structure (campaign → ad set → ad level), audience strategy (cold + warm + lookalike), creative brief (angles, formats, specs), bid strategy, optimization guide, and a 30-day launch plan with budget milestones.

**Produce output on first invocation. Read available context before asking. Only ask if the primary input is completely absent.**

---

## Campaign Structure

```
Campaign (objective)
├── Ad Set 1: Cold audience — top of funnel
│   ├── Ad A: Creative angle 1
│   ├── Ad B: Creative angle 2
│   └── Ad C: Creative angle 3
├── Ad Set 2: Warm audience — website visitors
│   ├── Ad A: Case study / social proof
│   └── Ad B: Objection handling
└── Ad Set 3: Lookalike / Advantage+ audience — customers
    ├── Ad A: Direct conversion offer
    └── Ad B: Trial / free offer
```

**Rule**: Maximum 5 ads per ad set. More than that splits the learning phase signal too thin.

**When budget can't feed the full structure, cut ad sets before cutting creative variety.** Structure reallocates spend; creative is what actually moves the result. A $3k/mo account run as one ad set with 3 real angles beats the same $3k spread across the textbook 3-ad-set structure with 1 angle each — three underfed ad sets each stall in learning, and none of them ever tells you which message works.

### Campaign Objectives (Choose One)

| Objective | Use when | What Meta optimizes for |
|-----------|----------|------------------------|
| **Awareness** | Building brand recognition | Reach and impressions |
| **Traffic** | Driving page visits | Clicks (cheap, low-intent) |
| **Engagement** | Growing social following | Video views, reactions |
| **Leads** | Lead gen forms | Form fills (native or website) |
| **App Promotion** | Driving mobile app installs or in-app events | Installs, app events, or app value (the only objective that can optimize for installs — no other objective supports them) |
| **Sales** | E-commerce or self-serve SaaS | Purchase events |

These are Meta's current campaign objectives (ODAX, 6 objectives in place since 2023 — the old "Conversions" and "Lead Generation" objective names from before 2022 no longer exist in Ads Manager). If this plan has any mobile-app component, route it through App Promotion — it's easy to miss in a table built around web/DTC funnels, but it's a distinct sixth objective, not a setting inside Sales or Traffic. For e-commerce specifically, the automated flow built on top of the Sales objective is now called **Advantage+ Sales Campaigns** (renamed from "Advantage+ Shopping Campaigns" / ASC in 2025); by 2026 the legacy Shopping flow can no longer be created new, and Advantage+ Sales also covers lead gen and app installs, not just checkout.

**Avoid Traffic objective for conversion campaigns** — clicks are cheap but Meta doesn't optimize for purchase or signup intent.

---

## Audience Strategy

For the full audience playbook (cold audiences and the broad / Advantage+ default, warm audience windows and exclusion rules, lookalike sources and sizes, and building the audience through Bulldozer OS tools), read `references/audience-strategy.md` before choosing any targeting.

---

## Creative Strategy

For the 3-second rule and hook types, the creative testing hierarchy, the creative formats table with specs, the Advantage+ Creative note and the ad copy framework (primary text, headline, description), read `references/creative-strategy.md` before briefing or reviewing creative.

---

## Bid Strategy

| Stage | Bid strategy | When to use |
|-------|-------------|-------------|
| Learning phase (0–50 events) | Lowest cost / Highest volume | Initial optimization |
| After 50+ events | Cost cap | Control CPA while scaling |
| Scaling (proven campaigns) | Bid cap | More control, less scale |

**Learning phase**: an ad set exits the learning phase once it accumulates roughly 50 optimization events within a **rolling 7-day window** — it's not a lifetime total, and an ad set that drops back under that pace can slip back into "Learning Limited." If your objective is purchase and you're getting far fewer than that per week, optimize for an upstream event (add to cart, lead) to get more signal, then move the optimization event up-funnel back to purchase once the account has more conversion history.

**Value Optimization is a separate case, not a lower bar.** An Advantage+ Sales ad set bidding on predicted lifetime value (pLTV) rather than raw purchase count can start stabilizing its value model on roughly 30–50 *high-value* purchase events per week — but that's the model settling in, not the ad set exiting standard delivery, which still runs against the same ~50-event benchmark above. Don't read early pLTV stability as a signal to treat the ad set as fully out of learning.

**Budget changes**: Change budgets by ≤20% every 3–5 days. Changes above that threshold reset the learning phase; audience, optimization-event, and bid-strategy changes reset it too.

**Refuse daily account tinkering.** Staying inside the ≤20%/3–5 days ceiling doesn't make daily check-ins safe — reacting to one bad day (or one good one) inside a still-thin sample is the fastest way to keep an account permanently in Learning Limited without ever resetting cleanly. Review cadence should match conversion volume, not the calendar: a low-volume account earns a decision every few days, not every morning.

---

## Optimization Guide

For the optimization procedure (pulling real numbers, stop-loss, and the diagnostic checklists when CPA is too high, CTR is low or frequency is high), read `references/optimization-guide.md` before changing anything on a live account.

---

## Retargeting Windows

| Audience | Window | Frequency cap |
|----------|--------|--------------|
| Pricing/checkout abandoners | 1–7 days | Higher OK (4–7x/week) |
| Key page visitors | 7–30 days | 3–5x/week |
| General site visitors | 30–90 days | 1–2x/week |

---

## Tracking Setup Checklist

- [ ] Meta Pixel installed on all pages
- [ ] Events verified: PageView, Lead, Purchase (or equivalent)
- [ ] Conversions API (CAPI) set up for server-side tracking, deduplicated against the pixel (same event ID on both sides)
- [ ] Event Match Quality (EMQ) checked in Events Manager — Meta scores each event source 0–10 on how well it can match a real Meta account; there is no separate "redundancy" metric, EMQ is the number to watch
- [ ] UTM parameters on all ad URLs
- [ ] Custom audiences created from customer list and pixel data
- [ ] Test purchase or lead event fires before launching conversion campaigns

**Why CAPI matters**: browser-side tracking alone has been unreliable since Apple's iOS 14 privacy changes and the general rollback of third-party cookies and ad blockers — the exact share of events lost varies too widely by source to cite a single number. Conversions API sends events server-side, independent of the browser, and recovers a meaningful share of that lost signal. Set up CAPI before running conversion campaigns, and check EMQ rather than assuming CAPI is "working" just because it's installed.

---

## 30-Day Launch Plan

**Week 1**: Set up pixel + CAPI. Create custom audiences. Launch 1 campaign with 3 ad sets (cold interest or Advantage+ suggestions, broad/no-suggestion, retargeting) with 3 creative angles each.

**Week 2**: Monitor learning phase. Check for early signals — which creative concepts are getting engagement? Don't optimize yet.

**Week 3**: Pull ad-level performance (`bdzGetAdLayer3Creatives` + `bdzGetAdAnalytics` at `AD_ANALYTICS_TARGET_LAYER_3_ALL`) instead of reading Ads Manager by hand. Kill bottom 50% of creatives by CPL/CPA. Increase budget on winners by ≤20%. Launch 2 new creative tests.

**Week 4**: Evaluate full-funnel CPA against the account's own history (pulled via `bdzGetAdAnalytics` with `from` set to the launch date, `AD_ANALYTICS_TARGET_LAYER_1_ALL`), not a generic benchmark — and if the objective is Leads, remember this is a CPL read, not yet a revenue read (see Optimization Guide). If at or near target, begin scaling. If past the stop-loss agreed with the client, pause and audit landing page and audience with the account paused, not while it keeps spending.

---

## Rules

What a senior operator on this account refuses to do, regardless of how impatient the client gets:

- **No universal CPL/CPA target.** A cost-per-result only means something against this account's own funnel (margin, deal size, sales cycle) — never quote a benchmark from another account or another vertical as this one's target.
- **No decision on a handful of events.** Exiting the learning phase (~50 events/7-day window) means the platform has enough signal to keep optimizing — it does not mean you have enough sample to declare a creative, audience, or campaign a winner or a loser.
- **No daily hand on the account during learning.** Reacting to single-day noise inside a still-thin sample is how an account gets stuck in Learning Limited without ever resetting cleanly. Match review cadence to conversion volume, not the calendar.
- **No CPA verdict without knowing the read window.** A read pulled without an explicit `from` is a 180-day blended average — never let it stand in for "how is this doing right now."
- **No treating a 30-day lead-gen CPA as a revenue verdict.** In B2B, the deal can close weeks or months after the lead — a high CPL is real grounds to fix the funnel, not yet grounds to call the channel unprofitable.
- **No open-ended spend past the agreed stop-loss.** The pause is the default action once the ceiling is crossed; auditing happens with the campaign paused, never funded by more live spend "just to see."