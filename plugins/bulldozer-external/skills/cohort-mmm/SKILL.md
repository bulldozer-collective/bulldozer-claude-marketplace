---
name: |
  cohort-mmm
description: |
  Build cohort analysis and unit economics models — logo retention cohorts, revenue cohorts, CAC payback by channel and segment, LTV calculation, and media mix modeling interpretation. Triggers on 'cohort analysis,' 'retention cohorts,' 'LTV by cohort,' 'CAC payback,' 'unit economics,' 'media mix model,' 'which cohorts perform best,' or 'our blended metrics are hiding problems.' For attribution model setup, see attribution-funnel. For weekly tracking, see weekly-growth-review.
when-to-use: |
  Build cohort analysis and unit economics models — logo retention cohorts, revenue cohorts, CAC payback by channel and segment, LTV calculation, and media mix modeling interpretation. Triggers on 'cohort analysis,' 'retention cohorts,' 'LTV by cohort,' 'CAC payback,' 'unit economics,' 'media mix model,' 'which cohorts perform best,' or 'our blended metrics are hiding problems.' For attribution model setup, see attribution-funnel. For weekly tracking, see weekly-growth-review.
argument-hint: |
  B2B SaaS, 18 months of customer data, 3 acquisition channels (outbound, content, paid) — want to know which cohorts and channels have the best unit economics and where payback is trending
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |
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

**Table structure:**

| Cohort | M0 | M1 | M2 | M3 | M6 | M12 |
|--------|----|----|----|----|----|----|
| Jan 2024 | 100% | X% | X% | X% | X% | X% |
| Feb 2024 | 100% | X% | X% | X% | X% | — |
| Mar 2024 | 100% | X% | X% | X% | — | — |

Each cell: percentage of cohort still active (paying) in that month.

**Reading the table:**

| Pattern | What it means | Action |
|---------|--------------|--------|
| Large M0→M1 drop (>15%) | Onboarding failure — customers not reaching activation | Fix onboarding: time-to-value, first-week experience |
| Steady decline throughout | Normal churn — product may not be "sticky" enough | Investigate engagement; consider usage-based triggers |
| Flat after M3 | Customers who survive onboarding become loyal | Optimize early-stage experience to push more through onboarding |
| Newer cohorts declining faster | Acquisition quality dropping OR product regressed | Segment by channel — is the problem ICP drift or product? |
| Newer cohorts improving | Onboarding or product improvements working | Quantify the improvement; protect the changes that drove it |

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

**CAC payback calculation:**

```
1. Blended CAC (per cohort month) = Total S&M spend that month ÷ new customers acquired
   OR: Channel CAC = Channel spend that month ÷ customers from that channel

2. Monthly gross profit per customer = MRR × gross margin %

3. Cumulative gross profit per cohort = sum of monthly gross profit across the cohort over time

4. Payback month = first month where cumulative gross profit > cohort CAC
```

**Example table:**

| Month | Customers | Cohort CAC | M0 MRR | Gross Margin | M0 GP | Cumulative GP | Payback? |
|-------|-----------|-----------|--------|-------------|-------|--------------|---------|
| Acquisition | 10 | $8,000/customer | $1,200 | 80% | $960 | $960 | No |
| M1 | 9 active | — | $1,250 | 80% | $900 | $1,860 | No |
| M2 | 9 active | — | $1,280 | 80% | $922 | $2,782 | No |
| ... | ... | ... | ... | ... | ... | ... | ... |
| M9 | 8 active | — | $1,400 | 80% | $896 | ~$8,100 | ✅ |

Payback at month 9.

**CAC payback benchmarks:**

| ACV | Acceptable | Healthy | Watch Signal |
|-----|-----------|---------|-------------|
| <€5K | 6–10 months | <6 months | >12 months |
| €5K–€25K | 10–15 months | <12 months | >18 months |
| €25K–€100K | 14–20 months | <18 months | >24 months |
| €100K+ | 18–30 months | <24 months | >36 months |

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

Set CAC ceilings quarterly per channel. When a channel exceeds its ceiling, either:
1. Reduce spend until efficiency recovers
2. Improve conversion rates to reduce CAC
3. Re-examine whether this channel reaches the right ICP

---

## Step 6: Trend Interpretation

The cohort data answers one primary question: **Are we getting better or worse at growing durable revenue?**

**Positive trends (growing quality):**
- Newer cohorts retain at higher rates through M6 → onboarding improvements are working
- CAC payback shortening → acquisition efficiency improving or expansion accelerating
- NRR increasing quarter over quarter → customer success and expansion motions strengthening

**Negative trends (degrading quality):**
- Newer cohorts churn faster → ICP drift (acquiring wrong customers), product regressi