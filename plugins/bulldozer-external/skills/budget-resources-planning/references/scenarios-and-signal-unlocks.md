# Scenario Planning and Signal-Based Spending Unlocks

## Step 4: Scenario Planning

**Build 3 executable scenarios, not 5 theoretical ones.** Each scenario must have specific metrics that trigger switching — not "if things go badly."

**Base Case:**
- Revenue: Current trajectory, NRR holds, no major new customer segments
- Hiring: Headcount plan as designed (Step 3)
- Burn: [€X/month] → runway [Y months]
- Trigger to switch to Upside: ARR grows 20%+ ahead of plan for 2 consecutive quarters
- Trigger to switch to Downside: NRR drops below 90% or pipeline coverage falls below 2x for 2 months

**Upside Case:**
- Revenue: 120% of base case — driven by expansion win rate or new market channel performance
- Hiring: Accelerate 2–3 hires from Q3 into Q2; add 1–2 additional roles not in base plan
- Burn: [€X+15%/month] → runway [Y-3 months] — acceptable tradeoff for faster growth
- Unlock criteria: Specific NRR threshold AND specific pipeline coverage ratio both met for 60 days

**Only pull hires forward into a proven motion, never into an untested one.** The upside case is tempting to spend on the newest bet — a new segment, a new geography, a channel that just started converting — precisely because it looks like where the growth came from. That's the wrong place to accelerate: a hire pulled forward into a motion still being proven stacks two unknowns (does the extra spend pay back, does the motion actually work) on top of each other. Accelerate hiring into the roles and motion that were already working before the upside signal appeared; fund the new bet separately, sized to what you can afford to lose.

**Downside Case:**
- Revenue: 70% of base case — driven by churn spike, pipeline slowdown, or macro
- Hiring: Pause all hires except P1 roles (roles that directly produce revenue or prevent churn)
- Burn: [€X-20%/month via hiring freeze + discretionary cut] → runway [Y+6 months]
- Trigger: NRR below 90% OR monthly ARR growth flat/negative for 2 months
- Immediate actions: freeze non-essential vendor spend, defer hardware refreshes, freeze T&E

**Scenario switching protocol:** Designate one decision-maker (CEO or CFO) who reviews scenario metrics monthly. Scenario switch is a board-level decision — not operational. Pre-define the actions so there's no debate when the trigger fires.

**Don't wait for the calendar to confirm what the trigger already said.** The monthly review cadence above is for tracking, not for permission — the moment a downside trigger fires (NRR below 90%, two flat/negative ARR months), that's the moment to convene the off-cycle review, not the next scheduled monthly check-in. A downside trigger that sits unacknowledged for three weeks because the review meeting hasn't come around yet has already cost the plan the head start it was designed to give.

## Step 6: Signal-Based Spending Unlocks

**Release budget on performance signals, not on the calendar.** This is the direction most current CFO and budgeting commentary points to for 2026 — zero-based and OKR-linked spend review, re-justifying each line against proven results rather than rolling over last year's plan — though no single named study fixes the exact gate values below. Treat the rows as a format to fill in with this company's real numbers, not universal thresholds. The approach prevents the "we hired for the plan, but the plan was wrong" problem.

**Unlock gate format:**

| Spend category | Unlock trigger | Who approves | Action if trigger not met |
|---------------|---------------|-------------|--------------------------|
| AE #3 hire | Q1 ARR target hit AND pipeline coverage >3x | CEO | Defer to next quarter |
| Marketing budget increase (+€20K/month) | MQL→SQL rate >20% for 60 days | CEO + CFO | Hold at current budget |
| VP Sales hire | 2 AEs at >80% quota for 2 consecutive quarters | CEO + Board | Defer; hire SDR instead |
| International expansion spend | Existing market at €5M+ ARR AND NRR >110% | Board | Remove from plan entirely |

**Verify a marketing unlock trigger against real data, not a client estimate.** For a gate like the MQL→SQL row above, pull actual conversion performance from `bdzGetAdAnalytics` (cost per conversion, by platform and period, with `from`/`to` set explicitly rather than the tool's 180-day default) instead of taking the client's word for whether the gate is met.

**Don't call the gate on a trickle of leads.** A MQL→SQL rate computed on a handful of conversions in a single month is noise, not a verdict — a channel can clear 20% one month and 5% the next on volume alone, with nothing about the channel having actually changed. Require enough volume, sustained over the period the gate specifies (the 60 days above, not a single reporting cycle), before treating the rate as met or missed either way; below that, the honest answer is "not enough data yet," not a pass or a fail.

**"Hold" and "cut" are not the same action — pick the one the data supports.** The table above defaults every unmet gate to "hold at current budget." That's right when the metric is flat or newly missed. It's the wrong call when `bdzGetAdAnalytics` shows cost-per-conversion rising for the specific channel funding the increase across two consecutive periods while volume holds or falls — that's not "not yet," it's a channel getting worse, and the unlock gate should route to cutting that channel's budget back to baseline, not just freezing it where it is.

**Why signal-based unlocks matter:** A company that hires ahead of revenue signals burns capital building capacity that doesn't have work to do. A company that hires behind signals misses market opportunity. Signal-based unlocks thread the needle: capital deploys when the business has proven the need, not when the original plan said it would.
