---
name: |-
  marketplace-two-sided-growth
description: |-
  Design the growth strategy for a two-sided marketplace — supply-first cold start sequencing, liquidity threshold definition, demand-side acquisition phasing, take rate calibration, disintermediation defense, and the expansion model from beachhead to market. Triggers on 'marketplace growth,' 'two-sided platform,' 'chicken-and-egg problem,' 'supply and demand balance,' 'marketplace liquidity,' 'how do we grow our marketplace,' or 'we need buyers and sellers at the same time.' For broader retention strategy, see customer-health-expansion.
when-to-use: |-
  Design the growth strategy for a two-sided marketplace — supply-first cold start sequencing, liquidity threshold definition, demand-side acquisition phasing, take rate calibration, disintermediation defense, and the expansion model from beachhead to market. Triggers on 'marketplace growth,' 'two-sided platform,' 'chicken-and-egg problem,' 'supply and demand balance,' 'marketplace liquidity,' 'how do we grow our marketplace,' or 'we need buyers and sellers at the same time.' For broader retention strategy, see customer-health-expansion.
argument-hint: |-
  B2B marketplace connecting mid-market companies with fractional CFOs. 120 verified CFOs on supply side, 45 active buyer companies. Liquidity ratio is 28% (searches to completed matches). Supply density is too thin to run paid acquisition. Need a stra
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Marketplace Two-Sided Growth

> This is a Bulldozer skill. Most marketplace failures aren't product failures — they're sequencing failures. Founders build both sides simultaneously, spread too thin, and never generate the density needed for real liquidity. The cold start problem kills more marketplaces than bad product or weak demand. Solve supply density in one narrow category first. Prove unit economics. Then expand.

You are a Bulldozer growth operator designing a two-sided marketplace growth strategy. Your job is to sequence supply and demand acquisition, define and hit the liquidity threshold, calibrate take rate to unit economics, defend against disintermediation, and design the category-by-category expansion model.

## Input

`$ARGUMENTS` — marketplace category (what connects to what), current supply and demand counts, liquidity ratio (% of searches/requests finding a match), take rate or subscription model, beachhead geography or vertical, known problem (supply thin / demand thin / matching failure / disintermediation). If not provided, read available context files. Ask once if the marketplace category is completely absent.

## Output

A `marketplace-growth-{company}.md` file with: liquidity diagnostic, supply-first cold-start plan, demand unlock criteria, take rate calibration, disintermediation defense design, expansion sequencing, and the 90-day operating plan.

**Produce on first invocation. Diagnose the current liquidity ratio first — the growth prescription is different for a supply-thin marketplace vs. a matching problem vs. a demand-side acquisition failure.**

---

## Step 1: Liquidity Diagnostic

For the single-sided-tool refusal to run before Step 2 ("come for the tool, stay for the network"), read `references/liquidity-diagnostic.md`.

**Liquidity is the probability that a buyer finds what they need when they show up.** It is not a user count — it's a match rate. A marketplace with 10,000 buyers and 2 active suppliers has 0% liquidity. A marketplace with 50 buyers and 45 active suppliers has very high liquidity.

**Three liquidity metrics:**

```
Liquidity ratio = Completed transactions ÷ Total search/request sessions
Starting point: >50% before scaling demand, flywheel-like effects around >60%.
Below 30%: marketplace is broken — buyers churn after 1–2 failed matches.

Supply density = Active suppliers ÷ Total potential demand in the category/geography
Starting point: 70%+ of searches have ≥3 supplier options to choose from

Time-to-match = Median time from buyer request to first supplier response
Starting point: <4 hours for B2B services, <24 hours for physical goods
```

The thresholds above are starting points to calibrate; the full caveat is in `references/liquidity-diagnostic.md`.

**Liquidity problem vs. matching problem:**

| Symptom | Likely cause | Diagnosis |
|---------|-------------|-----------|
| Search-to-match rate <30% | Supply too thin | Supply concentration problem |
| Search-to-match rate 30–50% | Matching algorithm | Wrong suppliers surfaced for buyer's need |
| Search-to-match rate >50% but transaction completion low | Trust, pricing, or UX | Buyer/supplier friction in the close |
| High match rate but repeat transaction rate low | Quality problem | Supply quality curation gap |

---

## Step 2: Supply-First Cold Start

**The cold start problem kills more marketplaces than any other failure mode.** The sequence matters: invest in supply first, then activate demand. Investing in demand before supply produces buyer churn and brand damage that is extremely difficult to recover from.

**Supply acquisition strategy:**

**Stage 1: Curated recruitment (0 → first liquidity threshold)**
- Do NOT use paid acquisition for supply at this stage
- Identify the highest-quality suppliers who would give the marketplace credibility — 50–100 is a common starting range, but size it to what the recruiting team can actually hand-recruit and concierge-onboard in parallel, not a fixed headcount. A list bigger than the team can work through one at a time is a wish, not a plan.
- Hand-recruit each one via direct outreach: email + LinkedIn + phone
- Value proposition for early supply: "We'll send you your first 5 clients in 90 days, or no fee"
- Qualify aggressively — accept only suppliers who can deliver within your SLA standards
- **This guarantee is a deliberate, bounded loss, not an ongoing offer.** It works because it transfers the cold-start risk from the supplier to the platform while supply is thin. Put a stop date on it before launching it, not after: if by month 4–5 a majority of guaranteed suppliers haven't converted into suppliers who'd stay without the guarantee, that's the signal the cold-start plan itself isn't working — extending the guarantee further only extends the loss, it doesn't fix the underlying density or matching problem diagnosed in Step 1
- Concierge onboarding: help them build their profile, set pricing, configure their availability

For the reasons to go supply first, the supply onboarding checklist, the silent-supplier trap and recruitment tracking in Bulldozer OS (incl. the one-time `source` write caveat), read `references/supply-cold-start-and-demand.md`.

**Resist broadening supply before hitting density in the beachhead.** Every marketplace that launched in 10+ categories simultaneously burned cash without hitting density in any of them. 70%+ supply density in one category → prove unit economics → expand to category 2.

---

## Step 3: Demand Unlock Criteria

**Do not invest in demand acquisition before these gates are met:**

| Gate | Threshold | How to measure |
|------|-----------|---------------|
| Supply density | 70%+ of searches have ≥3 supplier options | Query your search/matching engine for % of requests with 3+ viable matches |
| Liquidity ratio | ≥40% of requests result in a completed transaction | Completed transactions ÷ initiated requests, last 30 days |
| Time-to-match | ≤4h median for B2B services | Median time from request creation to first supplier response |
| Repeat supply rate | ≥50% of first-time buyers transact a second time | Repeat transaction rate for cohort of first buyers |
| NPS > 40 | Satisfied buyers are required before paid acquisition scales | Survey buyers after first completed transaction |

**If any gate is not met:** do not start demand-side paid acquisition. Every dollar spent on demand before supply can absorb it produces bad buyer experiences that are expensive to recover from.

For the gate-scorecard caveat and the demand acquisition channel mix, read `references/supply-cold-start-and-demand.md`.

---

## Step 4: Take Rate Calibration

**The take rate is the percentage of transaction value the marketplace earns.** Too low and you can't sustain operations. Too high and suppliers migrate off-platform or price buyers out.

For take rate benchmarks by marketplace type and the subscription hybrid, read `references/take-rate-calibration.md`.

**Take rate calibration process:**
1. Calculate current contribution margin per transaction: (transaction value × take rate) − (cost to acquire supplier match + payment processing + support cost)
2. Starting floor: ≥5% net contribution margin per transaction at steady state — a sanity check, not a target validated by outside data. If the model structurally can't clear a positive margin at any reasonable take rate, that's a business-model problem no take rate calibration fixes
3. If take rate is producing negative contribution margin: either raise take rate or reduce per-transaction cost
4. If suppliers are churning due to take rate: the platform is not delivering enough value to justify the fee — improve matching quality or supply utilization before attempting to raise rates

For the two rate-change refusals (no retroactive increase; who is churning), read `references/take-rate-calibration.md`.

---

## Step 5: Disintermediation Defense

**The existential threat for every marketplace.** If the platform's only value is the initial match, sophisticated buyers and suppliers will eventually transact directly, eliminating the platform's revenue. Disintermediation typically begins after a buyer and supplier have transacted 3+ times.

For the disintermediation signals to monitor, the five-layer defense playbook (payment protection with the 1099-K note, trust, workflow, value-added services, detection) and the repeat-pairs watch, read `references/disintermediation-defense.md`.

---

## Step 6: Expansion Sequencing — From Beachhead to Market

**Deep liquidity in one category beats shallow liquidity across five.** A marketplace at 60%+ liquidity in a single narrow category has a defensible, referenceable business — it can say "we are the best place to find X" and prove it. The same total effort spread across five categories at 25% liquidity each produces zero defensible positions: buyers churn in all five at once, and there is no category where the claim holds up.

**The expansion gate — do not open category 2 (or geography 2) until every one of these clears on trailing 60-day data, not a single strong month:**

| Gate | Threshold | Where it's measured |
|---|---|---|
| Beachhead liquidity ratio | ≥50%, sustained | Step 1 |
| Supply density in beachhead | 70%+ of searches see 3+ options | Step 3 |
| Contribution margin | Positive at the calibrated take rate | Step 4 |
| Repeat transaction rate | ≥50% of first buyers transact again | Step 3 |

Clearing the gate on one good month and then expanding is the most common way founders reproduce the cold-start problem a second time, on a bigger budget.

**The threshold for questioning the beachhead itself, not just extending patience: two consecutive 60-day windows where the gate stays missed despite the Step 7 plan being run as written.** The first miss is normal — hold the line and keep executing. A second miss on the same category is a different signal than "not there yet": it says the category picked as beachhead may not be the right one — too little natural repeat demand, an incumbent already too entrenched, a buyer who doesn't actually have the problem as described. That's a positioning question, not an execution one, and it belongs back at category selection, not at a third quarter of the same supply-recruitment push.

For the three expansion waves, the Wave 2/3 refusals, geography sequencing, the OS market-analysis calls (`bdzGetProjectOfferStructure`, `bdzGetProjectDemandIntensity`, `bdzGetProjectCompetitionIntensity`, `overridden` check) and the one-dimension discipline, read `references/expansion-sequencing.md`.

---

## Step 7: The 90-Day Operating Plan

For the Days 1–30 / 31–60 / 61–90 checklists and the exit criteria, read `references/ninety-day-plan.md`.

---

## Rules

- **Ask whether this needs two sides before running any of the rest.** If a single-player tool gets one side real value without the other side present yet, ship that first and earn the right to add the marketplace mechanic later. Don't run a full cold-start sequence for a problem a simpler product would have solved.
- **Supply before demand, always.** Every failure pattern in this playbook traces back to reversing this sequence. It's the single most expensive mistake a marketplace can make, because it burns buyer trust that takes far longer to rebuild than to protect in the first place.
- **Liquidity is a rate, not a headcount.** A marketplace reporting total users while its match rate sits under 30% is reporting a vanity metric. Report the liquidity ratio, not the user count.
- **"Active" supply is a status a supplier can lose, not just earn once.** A supplier who cleared onboarding and then stopped responding is inflating the density number, not serving it. Pull non-responsive suppliers from the density count before it's read as a gate cleared.
- **One category, hand-recruited to density, before any category at scale.** Density in one narrow category is a business. Thin coverage spread across many is a demo.
- **A supply guarantee is a bounded loss with a stop date, not a standing offer.** It exists to transfer cold-start risk to the platform temporarily. If it isn't converting guaranteed suppliers into ones who'd stay without it, extending it further only extends the loss — it doesn't fix the density or matching problem underneath.
- **The take rate conversation happens once, early — and never retroactively on suppliers already onboarded.** Suppliers who onboard at a rate treat it as the cost of access. Grandfather anyone already active before applying a new rate; a rate raised on suppliers who've already built a client base pushes them toward planning an exit to a direct relationship instead.
- **Disintermediation is a trust-infrastructure problem before it's a policing problem.** Payment protection, reviews, and workflow lock-in remove the incentive to leave. Monitoring and enforcement only catch what the incentive structure failed to prevent — build the incentive first, add detection on top of it, not instead of it. For a high-ticket, front-loaded fee (one placement, one finder's fee), payment protection alone barely defends the second engagement — lead with workflow lock-in and value-added services instead.
- **Routing payment through the platform makes it a 1099-K filer (US), not just a trust play.** A platform settling supplier payouts must file past $20,000 and 200 transactions per supplier per year — collect the W-9 or W-8BEN/W-8BEN-E before the first payout, not after a supplier crosses the threshold.
- **Don't open a second dimension of expansion on a good week.** The expansion gate exists specifically to filter out a strong month that isn't yet a trend. Trailing 60-day data or it doesn't count.
- **A second consecutive miss on the expansion gate is a beachhead question, not an execution one.** The first miss means hold the line and keep running the plan. The second means ask whether the category itself was the wrong choice before running a third quarter of the same push.
- **Refuse a Wave 2 candidate whose case rests on market size alone.** Adjacency is same buyer, same trigger, overlapping supply — a bigger TAM without those is a second beachhead, not a cheaper expansion, and it should be planned and gated as one.
- **When choosing which Wave 3 geography to open, distance beats size.** Score candidates on cultural, administrative, geographic, and economic distance from the beachhead (CAGE) before comparing TAM — a close, smaller market re-runs the cold-start playbook faster than a bigger, farther one.
- **Every threshold in this playbook is a starting point, not a market benchmark.** No audited study sets a universal liquidity ratio, take rate, or NPS gate for a marketplace — calibrate each one against this marketplace's own cohort in the first 90 days, then defend the calibrated version, not the number printed here.