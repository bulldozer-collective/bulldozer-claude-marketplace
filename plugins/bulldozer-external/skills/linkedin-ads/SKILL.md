---
name: |-
  linkedin-ads
description: |-
  Set up and optimize LinkedIn ad campaigns for B2B demand generation, lead generation, and ABM targeting using job title, company, and seniority signals. Triggers on 'LinkedIn ads,' 'LinkedIn campaign,' 'sponsored content,' 'LinkedIn lead gen,' or 'B2B paid social.' For cross-platform strategy, see paid-strategy. For Meta campaigns, see meta-ads.
when-to-use: |-
  Set up and optimize LinkedIn ad campaigns for B2B demand generation, lead generation, and ABM targeting using job title, company, and seniority signals. Triggers on 'LinkedIn ads,' 'LinkedIn campaign,' 'sponsored content,' 'LinkedIn lead gen,' or 'B2B paid social.' For cross-platform strategy, see paid-strategy. For Meta campaigns, see meta-ads.
argument-hint: |-
  Enterprise SaaS targeting VP of Sales at 200-1000 person companies, $15k/mo budget
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# LinkedIn Ads

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on LinkedIn advertising. Your goal is to build campaigns that reach decision-makers at target accounts with relevant B2B offers — efficiently.

## Input

`$ARGUMENTS` — ICP (role, seniority, company size, industry), offer/CTA, monthly budget (e.g., "targeting VP Operations at 100-500 person SaaS companies, $20k/mo, offering a demo"). If not provided, read any available context files before asking. Only ask if ICP and budget are completely absent.

## Output

A `linkedin-ads-plan-{product}.md` file with: campaign structure, audience targeting strategy, ad format selection, copy templates (Sponsored Content, Message Ads, Lead Gen Forms), bid strategy, ABM target account approach, and 30-day launch plan with budget allocation.

**Produce output on first invocation. Read available context before asking. Only ask if the primary input is completely absent.**

---

## LinkedIn Ads Reality Check

**LinkedIn CPMs are 3–5x higher than Meta, and the range is wide.** Broad B2B targeting (director+ titles, mid-size companies) tends to sit far below narrow enterprise or C-suite targeting, where CPM can run several times higher — the same account can see $30 CPM on one campaign and $150+ on another, purely from audience breadth. Treat any single number here as a rough starting point, not a target: once the account has spend history, read the real CPM/CPC/CPL from the account itself (see "Reading Real Performance from Bulldozer OS" below) rather than benchmarking against outside blog aggregates, which disagree with each other by 2–5x for the same segment. CPL of $50–$300 is common. This is not a vanity metric — LinkedIn is genuinely expensive. Use it only when:

- ACV > $5,000 (economics justify the CPL)
- Job title or company is the primary targeting criterion (no other platform matches this)
- You need to reach decision-makers who aren't reachable elsewhere

If ACV is <$5k or your ICP is reachable via interest targeting on Meta, start with Meta. LinkedIn for the wrong product type is a money incinerator.

**The B2B lag is the trap, not the CPL.** A lead can look expensive and still be the cheapest path to real revenue, or look cheap and be worthless — CPL only measures the top of a funnel that, in B2B, routinely takes 60–120+ days to resolve into a closed deal. Judging a LinkedIn campaign on CPL alone at the 2-week or even 30-day mark is judging the wrong number: it tells you whether the ad and offer are working, not whether the pipeline behind them is real. Use early CPL/CTR to catch a broken ad fast; hold the actual go/no-go call for when enough of the sales cycle has played out to see SQL rate or, ideally, closed-won.

---

## Ad Formats

The ad format comparison table (best use and CPM range per format) is in `references/formats-and-bidding.md` (section "Ad Formats"). Read it when choosing formats.

---

## Audience Targeting

### Primary Targeting Dimensions (Use These First)

The primary targeting dimensions and how to use them are in `references/audience-targeting.md` (section "Primary Targeting Dimensions"). Read it before choosing targeting.

### Matched Audiences (Retargeting + ABM)

Matched Audiences for retargeting and ABM (what to upload, sizes, how to use them) are in `references/audience-targeting.md` (section "Matched Audiences"). Read it when building a retargeting or ABM audience.

### Predictive Audiences and Audience Expansion — Two Different Levers

The difference between Predictive Audiences and Audience Expansion, and when to use each, is in `references/audience-targeting.md` (section "Predictive Audiences and Audience Expansion"). Read it before turning either lever on.

---

## Campaign Structure

**A note on naming**: LinkedIn is mid-way through renaming its campaign hierarchy in the UI — "Campaign Group" is becoming "Campaign," and the old "Campaign" is becoming "Ad set." The rollout is staggered, so two accounts (or two people on the same account) can see different labels at the same time; the underlying API objects haven't changed. Use whichever term the client's own UI shows them, and don't assume the structure below has moved — it hasn't, only the label on the middle tier has.

```
Campaign Group: [Product] B2B Demand Gen
├── Campaign 1: Cold — Target Account List + VP/Director Seniority
│   ├── Ad 1: Problem-framed Sponsored Content
│   ├── Ad 2: Case study / outcome-led
│   └── Ad 3: Lead Gen Form (low friction offer)
├── Campaign 2: Cold — Broad ICP (no account list)
│   ├── Ad 1: Thought leadership content
│   └── Ad 2: Lead Gen Form (content offer)
└── Campaign 3: Retargeting — Website Visitors (30 days)
    ├── Ad 1: Case study
    └── Ad 2: Demo request (direct CTA)
```

---

## Copy Framework

### Sponsored Content Copy

**Primary text structure** (keep the hook under ~150 characters — mobile truncates there even though the field itself accepts up to ~255):
```
[Hook: Problem or contrarian claim]
[1-2 sentence bridge to your solution]
[Social proof stat or customer reference]
[Clear CTA]
```

**Example**:
```
Most sales teams track activities. The best ones track revenue health.

[Company] gives revenue leaders a real-time view of pipeline risk before deals slip through.

Used by sales ops teams at Salesforce, HubSpot, and 200+ B2B companies.

Download the Pipeline Health Playbook →
```

**Headline** (below the image, 70 chars max): "The Revenue Forecasting Guide for B2B Sales Leaders"

### Lead Gen Form Copy

**Headline** (40 chars max): "Revenue Forecasting Playbook"

**Offer description** (clear on what they get):
"Download our 15-page guide used by 200+ B2B sales leaders to build accurate revenue forecasts and reduce forecast variance by 40%."

**Privacy notice**: Always include. Required by LinkedIn policy.

**Form fields** (pre-filled from LinkedIn profile):
- First name, Last name, Email — always included automatically
- Add: Job title, Company name (usually pre-filled)
- Optional: Phone number (lowers conversion — only add if you're calling leads)

### Message Ads (Sponsored InMail)

Use for: event invitations, exclusive offers, high-touch ABM outreach.

**Format**:
- Subject: personalized, not salesy ("Your thoughts on [topic]?" works better than "Free Demo Offer")
- Body: 500 characters max visible on mobile — treat it like a cold email
- CTA button: "Learn more," "Register," "Download" — match to offer

**Deliverability rule**: LinkedIn delivers InMail only to users who haven't received another InMail in the past 30 days. You cannot spam people. This makes InMail inherently less spammy but also limits reach.

---

## Bidding

The three Campaign Manager bid strategies and when to use each are in `references/formats-and-bidding.md` (section "Bidding"). Read it before setting bids.

---

## LinkedIn Insight Tag Setup

Required for retargeting and conversion tracking.

- [ ] Insight Tag installed on all pages (via tag manager or directly in `<head>`)
- [ ] Conversion events created: form submissions, page visits — pick the closest current category (LinkedIn consolidated MQL/SQL-style categories into a single "Qualified Lead" category; don't invent a custom MQL/SQL split that no longer maps cleanly)
- [ ] Matched audiences created from website visitors (30, 90, 180 days)
- [ ] Account list uploaded (if running ABM campaigns)
- [ ] Test conversion verified before launching conversion campaigns
- [ ] Status checked through Bulldozer OS rather than guessed from the dashboard — see below
- [ ] Attribution windows set deliberately, not left on default — LinkedIn tracks a post-click window (default 30 days) and a view-through window (default 7 days) as two separate settings, each independently adjustable to 1/7/30/90 days. A long B2B sales cycle without a matching post-click window undercounts conversions that arrive late; a wide view-through window on a low-consideration offer can inflate the conversion count with people who never clicked. Know which window a number is using before comparing it to anything else.
- [ ] Conversions API (CAPI) considered alongside the tag, not instead of it — a separate server-to-server channel that recovers conversions the browser tag misses (ad blockers, cookie loss) and is the only path to pass back offline/CRM outcomes — a closed deal, a sales-qualified lead — so LinkedIn can optimize toward revenue instead of form fills alone. Worth setting up for any account with a real B2B sales cycle behind the ad account. Not confirmed against a LinkedIn page read directly this pass (LinkedIn's own docs were unreachable from this environment) — several independent 2026 sources describe it as live and standard practice, converging enough to flag it here, not enough to promise an exact setup path.

---

## Reading Real Performance from Bulldozer OS

What Bulldozer OS can read back from a registered LinkedIn ad account (import jobs, Insight Tag status, per-campaign and per-ad metrics, running creatives, live targeting, audience demographics, lead form submissions, comments and reactions) is in `references/performance-and-optimization.md` (section "Reading Real Performance from Bulldozer OS"). Read it before analysing results, and register the account first if it isn't yet.

---

## Optimization Guide

The diagnosis guide (CPL too high, CTR low, form fill rate low) and the volume check to make before reacting are in `references/performance-and-optimization.md` (section "Optimization Guide"). Read it when a campaign underperforms.

---

## 30-Day Launch Plan

**Week 1**: Register the ad account in Bulldozer OS if it isn't already. Set up Insight Tag. Create matched audiences (website visitors, contact list). Launch 1 campaign with ABM account list + 2 Sponsored Content ads. Set at $3,000/mo.

**Week 2**: Pull real CPM/CTR/CPL from the OS import rather than eyeballing the Campaign Manager dashboard. Check the campaign's live targeting read-back — is the right seniority/title actually being served, not just what was configured at launch? Fix targeting drift if the two don't match.

**Week 3**: Test Lead Gen Form ad vs. landing page ad with same creative. Compare CPL.

**Week 4**: Kill bottom performer (LGF vs. landing page). Reallocate budget to winner. Begin testing second creative angle. **This kill decision is about CPL and form-fill rate, not about ROI** — 30 days of spend is nowhere near enough of the sales cycle to know which format actually produced pipeline. Cutting the CPL loser is fine; declaring the CPL winner "worked" for the business is a separate, later call.

---

## Rules

- **Read the account before you read a benchmark.** Once the account is registered in Bulldozer OS, its own CPM/CPC/CPL is the number that matters — the ranges in this skill are a starting point for an account with no history, not a target to defend once real data exists.
- **Don't compare or conclude below a few dozen conversions.** Cost Cap vs. Maximum Delivery, two ad angles, two audiences — a difference under that volume is noise dressed up as a signal. Wait for volume, or widen the campaign until you have it.
- **CPL is a leading indicator in B2B, not the verdict.** A cheap lead that never becomes a customer isn't a win, and an expensive one that closes isn't a loss. Hold the real go/no-go call for when enough of the sales cycle has played out to see SQL rate or closed-won — judging ROI off 30 days of CPL is judging the wrong number.
- **Check the ABM list math before committing budget.** A Matched Audience only activates above roughly 300 matched members — a thin named-account list can fall under that floor and simply never deliver. Widen the list or the seniority range before launch, don't discover it after.
- **Creative is the lever, structure is the plumbing.** A sharper hook or a new angle moves CPL more than another round of bid-strategy tinkering will. Budget the review calendar accordingly — most accounts under-invest in copy and over-invest in re-checking bids.
- **Every campaign gets a stop rule before it gets a budget.** A CPL ceiling and a time box, decided before launch — not discovered after the spend already happened.
- **Know which attribution window a number is using before trusting it.** Post-click and view-through are separate, independently adjustable settings — a number that blends them, or uses the wrong one for the sales cycle, isn't comparable to anything.
- **A benchmark without a source doesn't go in the plan.** State a CPM/CPL/CPC range as a starting point to validate against the account's own numbers — never as an industry fact to defend in front of a client.
- **Confirm the tag is alive before trusting anything it feeds.** "Installed" isn't a status — check the account's real Insight Tag status (absent, never called back, gone stale, blocked, or active) before reading conversions, retargeting audiences, or attribution off it. A stale or blocked tag produces numbers that look like a performance problem but are actually a tracking problem.