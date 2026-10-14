---
name: |-
  paid-strategy
description: |-
  Select paid channels, allocate budget across platforms, and define measurement framework for a paid acquisition strategy. Triggers on 'which paid channel should I use,' 'media mix,' 'paid acquisition strategy,' 'how to allocate ad budget,' or 'paid growth strategy.' For platform-specific execution, see meta-ads, google-ads, or linkedin-ads.
when-to-use: |-
  Select paid channels, allocate budget across platforms, and define measurement framework for a paid acquisition strategy. Triggers on 'which paid channel should I use,' 'media mix,' 'paid acquisition strategy,' 'how to allocate ad budget,' or 'paid growth strategy.' For platform-specific execution, see meta-ads, google-ads, or linkedin-ads.
argument-hint: |-
  B2B SaaS $200/mo ACV, $20k/mo budget, trying to scale beyond content
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Paid Acquisition Strategy

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on paid acquisition strategy. Your goal is to determine the right channel mix, budget allocation, and measurement approach before spending a dollar.

## Input

`$ARGUMENTS` — company context: product type, ACV, monthly budget, ICP, current traction (e.g., "B2B SaaS, $150 ACV, $30k/mo budget, targeting ops managers at 50-200 person companies"). If not provided, read any available context files before asking. Only ask if the budget and ICP are completely absent.

## Output

A `paid-strategy-{company}.md` file with: recommended channel mix with rationale, budget allocation by channel, testing vs. scaling phase plan, KPI framework by channel, attribution approach, and 90-day paid roadmap. Each channel recommendation includes: expected CPL/CPA range, timeline to optimization, and when to kill vs. scale.

**Produce output on first invocation. Read available context before asking. Only ask if the primary input is completely absent.**

---

## Ground the Plan in Real Account Data First

Before reaching for the benchmark table below, check whether the company already has ad accounts registered in Bulldozer OS: `bdzListRegisteredAdAccounts` (Meta, LinkedIn, Google Ads, Microsoft Ads only — TikTok, YouTube and X have no account integration in the OS, so any spend on those stays manual) followed by `bdzGetAdAnalytics` (target `AD_ANALYTICS_TARGET_LAYER_1_ALL`, filtered by platform and account) returns real cost, conversions and cost-per-conversion per campaign, no client export needed. If that data exists, it beats every generic range in this document — use it to set the actual starting CPA/CPL, not the table.

Three things to get right when reading it. First, `from` defaults to 180 days ago when you don't pass it — an unqualified call returns a cost-per-conversion smoothed over roughly six months, not this quarter's number. Pass `from` explicitly (e.g. the last 30–60 days) whenever the question is "what's this channel doing right now," or you'll read a flattering six-month average while the last few weeks are quietly drifting. Second, on Meta, `conversions` counts only terminal events (purchase, lead, complete_registration, submit_application, subscribe, start_trial, contact, schedule, donate, custom) — never sum in the `conversionsPerType` upper-funnel breakdown (view_content, add_to_cart, etc.) or the unnamed `custom_pixel_events` aggregate, both are excluded from `conversions` for the same reason and summing them inflates the apparent volume while deflating CPA. A custom conversion also shows under its own name in the account but is counted through the standard event it was built on, so it can be silently excluded from `conversions` too, even when that underlying event is itself upper-funnel — the name being visible in the account isn't proof it reaches the total. The bias runs the other way too, rarer but worth knowing: when an advertiser fires a custom pixel event alongside the standard event it duplicates, `conversions` counts both as separate outcomes (Meta doesn't expose a link between them) — observed at roughly 0.3–2.9% of the total, so it's an upper bound more often than it's exactly right, not a reason to distrust the number wholesale. Third, when comparing spend across platforms or across multiple ad accounts on the same project, check each account's `currency` field before adding costs together — a single project can have accounts in different currencies, and a freshly-connected account can show a null currency until it has synced.

**Check what competitors are actually running before recommending a channel for a competitive space — don't guess.** Bulldozer OS can pull real competitor ad activity instead of assuming "everyone in your space is on LinkedIn" or "no one bothers with Search here": resolve the advertiser via `bdzGetSeaPublicGoogleAdvertiserIds` (by domain) or `bdzSearchSeaPublicAdvertisers` (by keyword, when you don't have the domain yet — create the competitor as a company first with `bdzCreateCompetitor` if it isn't tracked in the project), start the import with `bdzCreateSeaPublicGoogleAdwords` (asynchronous — poll `bdzGetSeaPublicGoogleAdwordsImport` until it reports success or an error), then read what was pulled with `bdzListSeaPublicGoogleAdwords`. This is Google Ads Transparency Center data scraped per company — it tells you whether a competitor is active on Search and what message they're running, not whether the campaign is working for them; a creative's text can come back null (Transparency Center didn't publish a readable copy), which means "copy unavailable," not "no message." `bdzCreateSeaPublicDataPage` (Semrush, needs the company's website set) adds keyword-level paid-search visibility for the same company. Two minutes of real signal beats a channel recommendation built on assumption.

---

## Platform Selection Framework

For the per-platform table (best-for, key signal, typical CPA/CPM range) and the caveats on how to read it, see `references/platform-benchmarks.md`. Short version: treat every number in it as an order-of-magnitude starting point, not a target — replace it with real account data (see above) the moment that exists. Only Google Search, Meta, LinkedIn and Microsoft Ads have account-level measurement inside Bulldozer OS; YouTube/Demand Gen, Twitter/X and TikTok performance has to be pulled and reported on manually.

### Channel Selection Rules

**Start with Google Search if**: Your product solves a known problem people actively search for. Keywords with commercial intent exist. You can write a landing page that converts cold traffic.

**Start with Meta if**: Your audience doesn't know they have the problem yet (demand gen). Product is visual. ACV is lower than $2k (volume matters more than targeting precision). You have strong creative capabilities.

**Start with LinkedIn if**: ACV is >$5k. Job title is the primary targeting criterion. You're selling to a clearly defined professional role at companies of a specific size.

**Don't start with all three**: Pick your best channel for 8 weeks. Prove unit economics before adding complexity.

**Creative is the lever, structure and targeting redistribute.** Two accounts with identical structure, targeting and budget will still post very different CPAs if one runs a message that names the buyer's actual problem and the other runs generic category copy. Structure and targeting decide *who sees the ad*; creative decides *whether it works*. Practically: if a channel has been killed twice in a row after one exhausted creative angle each time, the finding is "the message didn't land," not "the channel doesn't work" — rotate the angle before you rotate the platform, and budget for genuinely different angles (different problem framing, different proof point, different format), not five color variations of the same headline.

---

## Budget Allocation

### Testing Phase (Weeks 1–8)

**Goal**: Find profitable channel(s) before scaling.

Allocation principle:
- 60% to your primary channel (best hypothesis)
- 30% to your second channel
- 10% reserve for learnings

**Minimum viable budget by platform**:
- Google Search: $3,000/mo minimum (below this, too few clicks to learn)
- Meta: $3,000/mo minimum ($100/day buys meaningful impressions)
- LinkedIn: $5,000/mo minimum (CPMs are high; need volume to learn)

**Kill signal — and its most common misuse**: If CPA is 3x+ your target after 6 weeks and creative has been tested, reallocate. This works as written for self-serve or product-led motions, where the buyer converts close to the click. It gives the wrong answer for a B2B sales-led motion with a real sales cycle: converging industry sources put a full B2B SaaS cycle — first touch to closed-won — commonly in the several-months range (order of magnitude, not a number to quote to a client; it varies hugely by deal size), which means a campaign judged purely on CPA at week 6 is being judged on a metric that hasn't finished forming yet. A channel can look 3x over target on CPA at six weeks and still be the cheapest source of pipeline once its leads close, four months later.

For a sales-led motion, don't wait blind for revenue either — track the interim signal weekly instead: lead-to-SQL rate, meetings booked, and pipeline created. A CPL that holds steady while the SQL rate quietly drops is not a healthy channel, it's a channel getting worse on a metric you're not watching. Extend the kill decision window to roughly match the sales cycle (or at least to the point where enough leads have had time to qualify), and kill on a degrading leading indicator, not on CPA alone before the cycle has had a chance to run once.

### Scaling Phase (After Proof)

When you've found a channel with CPA at or near target:
- Consolidate budget into winning channel first
- Increase budgets 20–30% at a time
- Wait 5–7 days between increases (algorithm learning)
- Only expand to second channel after primary is profitable and scaled

---

## KPI Framework

| Objective | Primary KPI | Secondary KPIs | Guardrail |
|-----------|-------------|----------------|-----------|
| Awareness | CPM | Video view rate, reach | Brand safety |
| Consideration | CPC, CTR | Time on site, pages visited | Bounce rate |
| Conversion (lead gen) | CPL | Lead quality (MQL rate) | Cost per MQL |
| Conversion (self-serve) | CPA | ROAS, LTV:CAC | Payback period |

**Target setting**: Don't set CPA targets before you have historical data. In testing phase, optimize for CPL and monitor lead quality. Set CPA targets after 4–6 weeks of data.

---

## Attribution Approach

**The attribution problem**: Every platform over-reports its contribution. Google claims more conversions than happen. Meta does the same. They all use different attribution windows.

**Practical solution**:
1. Use UTM parameters consistently on all ad URLs
2. Pull platform-reported CPA/CPL directly — `bdzGetAdAnalytics` when the account is registered in Bulldozer OS, rather than asking the client for a dashboard export
3. Track blended CAC (total ad spend / new customers) against the company's own revenue system — that reconciliation is a `data`/CRM handoff, not something the ad platforms measure
4. Compare platform-reported CPAs against blended CAC — expect meaningful inflation per platform, the exact amount varies too much by setup to give a single number
5. Make budget decisions based on blended CAC trend, not platform-reported CPA alone
6. Run holdout tests for your biggest channels quarterly to measure true incrementality

**Attribution models**:
- Last-click: Easy to implement, under-credits upper-funnel. Fine for getting started.
- Data-driven / value-based Smart Bidding (Google): Better for high-volume accounts — Target ROAS and Maximize Conversion Value strategies generally need roughly 30–50 conversions per month per campaign to exit learning and be judged reliably; below that, wait rather than compare
- Blended first-party: Best for understanding true channel contribution

**The volume rule behind all of this**: don't compare two audiences, two creatives, or two campaigns on a handful of conversions — under a few dozen events, you're reading noise and calling it a decision. Meta's own learning phase is a useful proxy for the order of magnitude: it targets roughly 50 optimization events in a rolling 7-day window before it considers a campaign's signal stable, and a budget change large enough to cross a meaningful threshold (commonly cited around 20%) resets that clock. Below that kind of volume, the answer to "which audience/creative is winning" is "wait," not a guess dressed up as an insight.

---

## Naming Conventions

Consistent naming is non-negotiable for clean reporting. For the structure and worked examples, see `references/naming-conventions.md`.

---

## The 90-Day Paid Roadmap

**Weeks 1–2: Foundation**
- Set up conversion tracking and verify it's working
- Install UTM parameters on all URLs
- Create naming convention and apply to all campaigns
- Build campaign structure for primary channel

**Weeks 3–8: Test Phase**
- Run primary channel with 3+ creative angles
- Run secondary channel with validated creative from primary
- Review weekly: CPA vs. target, creative performance, audience performance, and — for sales-led motions — lead-to-SQL rate and pipeline created
- Kill underperformers at week 6 if CPA is 3x+ target (self-serve/PLG); for sales-led B2B, kill on a degrading leading indicator instead — see the Kill signal note under Budget Allocation

**Weeks 9–12: Optimize or Expand**
- If primary channel is working: scale budget 20–30% every 7 days
- If primary channel is not working: audit creative → audience → landing page (in that order)
- If both channels show promise: refine budget split based on CPA

---

## Common Strategic Mistakes

- **Spreading budget across 5 channels at $5k/mo each** — none reaches the minimum needed to learn. Concentrate first.
- **Measuring CPA from platform dashboards** — inflated by attribution. Always cross-reference with blended CAC.
- **Scaling before proving unit economics** — spending $50k/mo on a channel with 3x target CPA just compounds the loss.
- **Changing budgets and creative simultaneously** — you can't learn what caused the change. One variable at a time.
- **Launching without conversion tracking verified** — campaigns optimizing for wrong event or no event = wasted spend.
- **Killing a B2B channel on CPA before the sales cycle has run once** — see the Kill signal note above. Confirm the interim signal (SQL rate, meetings, pipeline) is actually degrading before reallocating; a rising CPA with a stable or improving SQL rate is a channel getting more expensive to reach, not one that stopped working.
- **Touching bids or budgets daily while an account is still in the learning phase** — a string of small "optimizations" inside that window usually resets the learning clock each time rather than steering it; it produces the illusion of active management while actually degrading the signal you're trying to read.
- **Presenting any CPA/CPL figure in this document, or in a client deck, as a target rather than a starting range** — every number here is an order of magnitude pulled from converging industry sources, not a benchmark specific to any one sector, deal size or sales cycle. Replace it with the account's own data (see "Ground the Plan in Real Account Data First") as soon as it exists.