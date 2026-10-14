---
name: |-
  cohort-mmm
description: |-
  Build cohort analysis and unit economics models — logo retention cohorts, revenue cohorts, CAC payback by channel and segment, LTV calculation, and media mix modeling interpretation. Triggers on 'cohort analysis,' 'retention cohorts,' 'LTV by cohort,' 'CAC payback,' 'unit economics,' 'media mix model,' 'which cohorts perform best,' or 'our blended metrics are hiding problems.' For attribution model setup, see attribution-funnel. For weekly tracking, see weekly-growth-review.
when-to-use: |-
  Build cohort analysis and unit economics models — logo retention cohorts, revenue cohorts, CAC payback by channel and segment, LTV calculation, and media mix modeling interpretation. Triggers on 'cohort analysis,' 'retention cohorts,' 'LTV by cohort,' 'CAC payback,' 'unit economics,' 'media mix model,' 'which cohorts perform best,' or 'our blended metrics are hiding problems.' For attribution model setup, see attribution-funnel. For weekly tracking, see weekly-growth-review.
argument-hint: |-
  B2B SaaS, 18 months of customer data, 3 acquisition channels (outbound, content, paid) — want to know which cohorts and channels have the best unit economics and where payback is trending
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Cohort Analysis & Unit Economics

> This is a Bulldozer skill. Blended averages hide problems and credit windfalls. A company can show healthy aggregate MRR while one customer segment churns out and another expands — the cohort table is the only view that shows this. If you're making decisions from blended metrics, you're making decisions about the average customer you don't have.

You are a Bulldozer growth operator building a cohort analysis and unit economics system. Your job is to build the retention cohort table, the revenue cohort table, calculate CAC payback by channel and segment, derive LTV, and interpret what the trends mean for resource allocation.

## Input

`$ARGUMENTS` — customer data (billing history, signup dates, plan types), sales and marketing spend by channel and month, and the specific question to answer (e.g., "which channel has the best payback?", "are our newer cohorts improving?", "what's our LTV:CAC by segment?"). If not provided, read available data files. Ask once if billing history is completely absent.

## Output

A `cohort-analysis-{company}.md` file with: methodology, retention cohort table (logo + revenue), CAC payback calculation by channel and segment, LTV derivation, trend interpretation, and recommended allocation changes. Produces concrete recommendations, not just tables.

**Produce on first invocation. Work from whatever data is available — partial cohort data from 12 months beats no data. Label what the analysis can and cannot say at the current sample size.**

---

## Why Blended Metrics Lie

**The core problem with averages:**

If you add 50 new customers with high churn risk and lose 10 high-LTV customers, your MRR might hold steady — while your business quality is deteriorating. Blended NRR masks both problems.

The only way to see this: cohorts. Group customers by when they started, track each group separately over time. Suddenly you see:
- Which acquisition channels produce customers who retain (and which don't)
- Whether your newer cohorts are better or worse than older ones (product and onboarding quality trend)
- Exactly when in the customer lifecycle churn is highest (onboarding problem vs. long-term fit problem)
- Whether your LTV assumption is justified or theoretical

---

## Step 1: Build the Logo Retention Cohort Table

**Data requirements:**
- Customer ID (stable, unique)
- First payment date (cohort anchor — not signup date, payment date)
- Active/churned status per month

For how to decide what counts as "active" and how to treat downgrades, read `references/cohort-table-reading.md`.

For the cohort table structure and the pattern-reading table (pattern, meaning, action), read `references/cohort-table-reading.md`.

**The two-stage churn model:**
Most SaaS companies see two distinct churn behaviors:
1. **Early-stage churn** (M0–M3): Customers who never fully activated, wrong ICP, or buyer's remorse. High rate, then rapid decline.
2. **Steady-state churn** (M4+): True annual churn rate from customers who activated. Much lower and more predictable.

Treat these separately. A company with 8% M1 churn and 1% steady-state monthly churn is very different from a company with 3% churn every month. The first is an onboarding problem; the second is a product/market fit problem.

---

## Step 2: Build the Revenue Cohort Table

Logo retention tells you how many customers stay. Revenue retention tells you if the ones who stay are growing.

**Same structure as the logo table, but cells = retained MRR as % of starting MRR:**

| Cohort | M0 MRR | M3 MRR | M6 MRR | M12 MRR | M12 NRR |
|--------|---------|---------|---------|---------|---------|
| Jan 2024 | $42K | $41K (98%) | $44K (105%) | $48K (114%) | 114% |
| Feb 2024 | $38K | $37K (97%) | $35K (92%) | — | — |

**Revenue cohort above 100% = expansion is outpacing churn.** This is the compounding engine. A cohort at 114% NRR after 12 months means customers are spending 14% more than when they started, even accounting for any who churned.

**GRR vs. NRR:**
- **GRR (Gross Revenue Retention)** — Retained MRR from the cohort excluding expansion. This is your floor: how much of original revenue would you keep if no customer expanded?
- **NRR (Net Revenue Retention)** — Retained MRR including expansion and contraction. This tells you if the base is growing or shrinking.

**Use GRR for conservative planning. Use NRR for growth planning.** If GRR is 85% but NRR is 110%, you're masking significant churn with expansion from your best accounts. This is fragile — if expansion slows, the GRR reality hits fast.

---

## Step 3: CAC Payback by Channel and Segment

CAC payback = how many months until a cohort's cumulative gross profit exceeds the cost to acquire them.

**Data requirements:**
- Sales and marketing spend by channel and month
- New customers acquired by channel and month
- Monthly MRR per customer
- Gross margin (%)

For what "spend" must include in the CAC calculation (the biggest lever, usually left implicit), read `references/cac-payback-detail.md`.

**CAC payback calculation:**

```
1. Blended CAC (per cohort month) = Total S&M spend that month ÷ new customers acquired
   OR: Channel CAC = Channel spend that month ÷ customers from that channel

2. Monthly gross profit per customer = MRR × gross margin %

3. Cumulative gross profit per cohort = sum of monthly gross profit across the cohort over time

4. Payback month = first month where cumulative gross profit > cohort CAC
```

For the worked payback example, the CAC payback benchmark table by ACV, its caveats, and the annual-prepay clock issue, read `references/cac-payback-detail.md`.

**What matters more than the benchmark:** Whether payback is improving or worsening across cohort vintages. If payback is extending quarter over quarter, it's caused by one of three things:
1. CAC rising (channels getting more expensive or less efficient)
2. Early-period churn increasing (acquisition quality dropping)
3. Gross margin compression

The cohort table isolates which one.

---

## Step 4: LTV Calculation

**LTV from cohort data (not the formula):**

The classic formula LTV = ARPU ÷ churn rate is wrong for most SaaS businesses. It assumes constant churn, which never happens. Use the cohort to project LTV:

1. Plot the retention curve from the cohort table
2. Fit a curve to project retention forward (logarithmic curves match most SaaS patterns — customers who survive early churn become progressively more loyal)
3. Sum projected retained revenue per cohort per month until year 5 (most SaaS LTV fully realized within 5 years)
4. Divide by cohort size

**LTV:CAC ratio benchmarks:**
- **<2x**: Unsustainable — you're spending more to acquire than you recover. Fix ICP, pricing, or churn before scaling.
- **2–3x**: Marginal — viable but thin. Most growth will consume more cash than you'd like.
- **3–5x**: Healthy — efficient acquisition at scale. Standard target for growth-stage SaaS.
- **>5x**: Underinvested — you may be leaving growth on the table by being too conservative on acquisition spend. Test scaling.

For where the LTV:CAC "3x" reference comes from and its limits, read `references/ltv-and-ceiling-notes.md`.

**LTV by segment:** Calculate separately for each:
- Acquisition channel (outbound vs. inbound vs. paid vs. partner)
- Firmographic segment (employee band, industry, funding stage)
- Plan or pricing tier

This reveals which customer profile creates the most value — which should inform ICP, sales prioritization, and channel mix simultaneously.

---

## Step 5: CAC Ceiling by Channel

The payback target should drive your maximum allowable CAC per channel:

```
CAC ceiling = (MRR at acquisition × Gross Margin %) × Target Payback Months
Example: ($1,000 MRR × 80% GM) × 15 months = $12,000 CAC ceiling

Any channel spending above $12,000 to acquire a customer paying $1,000/month is buying growth at a loss.
```

For why the CAC ceiling is conservative whenever there is real expansion, read `references/ltv-and-ceiling-notes.md`.

Set CAC ceilings quarterly per channel. When a channel exceeds its ceiling, either:
1. Reduce spend until efficiency recovers
2. Improve conversion rates to reduce CAC
3. Re-examine whether this channel reaches the right ICP

---

## Step 6: Trend Interpretation

The cohort data answers one primary question: **Are we getting better or worse at growing durable revenue?**

For the positive and negative trend signals and the sample-size check before acting on a trend, read `references/trends-and-allocation.md`.

---

## Step 7: From Trends to Allocation Decisions

This is where the analysis stops being a report and becomes a resourcing call. For each channel and segment, answer three questions with the cohort data already built:

1. **Is CAC payback under, at, or over the ceiling from Step 5?** Under → room to scale spend. At → hold and monitor. Over → cut spend or fix the funnel before adding more.
2. **Is the channel's LTV:CAC trending up or down over the last 2–3 cohort vintages?** A channel above the LTV:CAC bar today but trending down is a different call than one trending up — the direction matters as much as the level.
3. **Is retention for this channel's cohorts converging toward the blended average, or diverging from it?** A channel that consistently retains worse than the blended average is quietly dragging down company-wide NRR even if its CAC looks fine in isolation.

For the allocation recommendation table and what this analysis cannot tell you on its own, read `references/trends-and-allocation.md`.

---

## Common Mistakes

For the list of common mistakes (single-cohort trends, survivorship bias, blended CAC, tiny cohorts, gross margin, NRR, LTV extrapolation, S&M spend, subscription status), read `references/common-mistakes.md` before presenting results.

---

## Rules

- Never present a cohort table without stating the sample size behind each row — a percentage with no denominator is not evidence.
- Never blend CAC or LTV across channels when channel-level data exists — the whole point of this analysis is to stop hiding channel-level reality inside an average.
- Never call a trend "improving" or "degrading" off a single cohort vintage — require at least two to three consecutive cohorts moving the same direction.
- Always separate early-stage churn (M0–M3) from steady-state churn before drawing conclusions about product/market fit — they have different causes and different fixes.
- Always show GRR next to NRR when NRR is used to argue growth is healthy.
- When revenue data lives in the CRM, pull it from there rather than asking for a manual export. In principle, Bulldozer OS can query HubSpot DEAL records directly by SQL, grouped by `DATE_TRUNC(closedate, 'MONTH' | 'WEEK' | 'QUARTER' | 'YEAR' | ...)`, which would build the revenue cohort table (Step 2) and the CAC payback inputs (Step 3) in one query. **In practice, on this portal this exact call fails**: `query_crm_data` on DEAL is blocked by a missing OAuth scope (`reporting.full.read`, `reporting.full.admin`, `crm.hubsql.execute`, `marketing.campaigns.revenue.lite.read`, `marketing.campaigns.revenue.full.read`), reproduced repeatedly over six weeks (2026-09-03 through 2026-10-10), including with this skill's own GROUP BY DATE_TRUNC query every time it was retested. Try it first — if it works on the connected portal, use it as described above. If it fails, the error itself now names a fix: reconnect the HubSpot connection and explicitly check the missing scopes during reconnection (none are granted by default). If a scope shows a lock icon and can't be selected, a HubSpot admin on the client's portal has to approve it for the app first — reconnecting alone won't clear that case. Until the scopes are granted, the fallback is `search_crm_objects` (DEAL, filtered on `hs_is_closed_won`/`hs_is_closed_lost`, paginated via `total`/`offset`), aggregating by month on the client side instead of via SQL GROUP BY. Either way, a scope refusal must never be read as "no revenue this month" — a blocked call returns nothing, and nothing looks exactly like an empty cohort. Use the property ending in `_in_home_currency` (e.g. `amount_in_home_currency`), not the raw `amount` — on a multi-currency portal, summing raw `amount` mixes currencies and silently misstates the total.
- For the logo retention table (Step 1), DEAL alone is not enough: closed-won tells you a deal happened, not whether the customer is still paying next month. Check first whether the client bills through HubSpot's own Subscription object (`hs_status`: active/past_due/unpaid/paused/canceled/expired/scheduled, plus `hs_mrr` and `hs_recurring_billing_frequency`) — when it's populated, it is the CRM-native source for per-customer active/churned status and billing cadence, and Step 1 can be built without leaving HubSpot. When the client bills elsewhere (Stripe, Chargebee, a homegrown billing table), the Subscription object will be empty or absent and the billing/subscription system stays the required source for Step 1 — confirm which situation applies before promising either path.
- Never report a CAC payback number without stating whether the CAC behind it is media-spend-only or fully-loaded (sales and marketing headcount included) — the two answer different questions and are commonly reported several times apart.
- Never blend cohorts billed on different frequencies (monthly vs. annual or multi-year) into one payback trajectory without saying so — state whether payback is measured on a cash (bill-date) or recognized-revenue (MRR) basis.