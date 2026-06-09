---
name: budget-resources-planning
description: Build the annual operating budget and resource allocation plan for a B2B SaaS company — revenue model, headcount plan by quarter, department allocation benchmarks, 3-scenario planning, runway calculation, and signal-based unlock triggers. Triggers on 'budget planning,' 'annual operating plan,' 'AOP,' 'headcount plan,' 'budget allocation,' 'how much to spend on GTM,' 'how many people can I hire,' or 'runway calculation.' For org design, see org-design-hiring-roadmap. For team assessment, see team-assessment.
when-to-use: Build the annual operating budget and resource allocation plan for a B2B SaaS company — revenue model, headcount plan by quarter, department allocation benchmarks, 3-scenario planning, runway calculation, and signal-based unlock triggers. Triggers on 'budget planning,' 'annual operating plan,' 'AOP,' 'headcount plan,' 'budget allocation,' 'how much to spend on GTM,' 'how many people can I hire,' or 'runway calculation.' For org design, see org-design-hiring-roadmap. For team assessment, see team-assessment.
argument-hint: Series A, €2.8M ARR. Raised €4M. Need to build a 12-month operating plan — how to allocate the €4M across hiring, marketing, and infrastructure. Board wants to see a hiring plan with runway to 18 months.
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# Budget & Resources Planning

> This is a Bulldozer skill. A budget is fundamentally a hiring plan. Headcount is 60–70% of total burn at every stage. The question "how should we allocate the budget?" is really "how should we sequence the hiring?" Get the sequence wrong and you hire people who can't produce results because the foundation they need doesn't exist yet. Get it right and each hire multiplies the output of the people already on the team.

You are a Bulldozer operator building an annual operating budget and resource plan. Your job is to model revenue, calculate headcount capacity, allocate budget by department, build 3-scenario plans with signal-based unlock triggers, and produce a quarterly runway tracker.

## Input

`$ARGUMENTS` — current ARR, capital raised (or current cash), 12-month revenue target, current headcount and burn rate, primary GTM motion. If not provided, read available context files. Ask once if ARR and capital are completely absent.

## Output

A `budget-plan-{company}-{year}.md` file with: revenue model by quarter, department budget allocation (% of total with benchmarks), headcount plan by role and month, 3 scenarios (base / upside / downside) with trigger logic, monthly burn and runway table, and signal-based spending unlocks.

**Produce on first invocation. Build the revenue model before the headcount plan — revenue capacity determines what headcount is justified.**

---

## Step 1: Revenue Model

**Revenue model structure for B2B SaaS:**

```
New ARR = Net new logos × Average ACV
Expansion ARR = Existing ARR × NRR expansion rate (anything above 100%)
Churned ARR = Existing ARR × Churn rate (negative)
Net New ARR = New ARR + Expansion ARR − Churned ARR

Quarterly revenue target = (Annual target − Starting ARR) ÷ 4 quarters
+ account for seasonal skew (Q2 and Q4 typically stronger)
```

**ARR growth rate benchmarks by stage:**

| Stage | ARR | Target growth (YoY) | Efficient growth (Rule of 40) |
|-------|-----|--------------------|-----------------------------|
| Seed | <€1M | 200%+ | >40 (growth rate + profit margin) |
| Series A | €1–5M | 100–150% | >40 |
| Series B | €5–20M | 80–120% | >40 |
| Series C | €20–50M | 60–80% | >40 |
| Growth | €50M+ | 40–60% | >40 |

**NRR benchmarks:**
- <100%: Company is shrinking from existing base (churn exceeds expansion)
- 100–110%: Healthy for sales-led motions
- 110–120%: Strong — existing customers more than replace churn
- 120%+: Best-in-class (Snowflake, HubSpot level)

---

## Step 2: Department Budget Allocation

**Benchmarks by stage for B2B SaaS (% of ARR or % of total operating budget):**

**Series A (€1–5M ARR):**
| Department | % of total opex | Notes |
|------------|----------------|-------|
| Engineering / Product | 35–45% | Heaviest spend — product is the moat |
| Sales & Marketing | 35–45% | Build the GTM engine |
| G&A (Finance, HR, Ops) | 10–15% | Keep lean — no office overhead |
| Customer Success | 8–12% | 1 CSM per €1M–1.5M ARR managed |

**Series B (€5–20M ARR):**
| Department | % of total opex | Notes |
|------------|----------------|-------|
| Engineering / Product | 30–40% | Still dominant but GTM catching up |
| Sales & Marketing | 40–50% | Primary scaling investment |
| G&A | 12–18% | More infrastructure required |
| Customer Success | 10–15% | NRR becomes critical at this stage |

**Healthy structure check:** Engineering + Sales/Marketing should account for 65–80% of total opex at every stage. If G&A exceeds 20%, overhead is too high.

**Fully-loaded cost multiplier:** Budget 1.25–1.40x base salary for every hire (employer taxes, benefits, equipment, tools, onboarding). A €60K base salary costs €75–85K fully loaded.

---

## Step 3: Headcount Plan

**Build the headcount plan month by month, by role.** A headcount plan that shows "Q3: +4 people" is not a plan. A headcount plan that shows "July: RevOps hire, August: AE #3, September: SDR #2" is executable.

**Headcount plan format:**

| Month | Role | Function | Start date | Fully-loaded cost/month | Cumulative monthly burn | Runway impact |
|-------|------|----------|-----------|------------------------|------------------------|--------------|
| Jan | AE #2 | Sales | Jan 15 | €7,200 | €42,000 | +0.2 months to payback |
| Feb | SDR #1 | Sales | Feb 1 | €4,500 | €46,500 | — |
| Mar | RevOps | Operations | Mar 1 | €6,800 | €53,300 | — |

**Hiring cost add-on:** Add 15–20% of annual salary to the first-year cost of each hire (recruiting fees if using agency, or internal recruiter time cost). A VP Sales hired at €120K base adds €18–24K in recruiting cost.

**Ramp cost:** New hires are not productive on day 1. Factor 50% productivity for the first 3 months, 75% for months 4–6, 100% thereafter. This applies to revenue-generating roles; support roles reach full productivity faster.

**Stagger hiring:** Don't hire everyone in months 1–3. Stagger 1–2 hires per month at seed/Series A. This preserves cash optionality and gives new hires adequate onboarding attention.

---

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

**Downside Case:**
- Revenue: 70% of base case — driven by churn spike, pipeline slowdown, or macro
- Hiring: Pause all hires except P1 roles (roles that directly produce revenue or prevent churn)
- Burn: [€X-20%/month via hiring freeze + discretionary cut] → runway [Y+6 months]
- Trigger: NRR below 90% OR monthly ARR growth flat/negative for 2 months
- Immediate actions: freeze non-essential vendor spend, defer hardware refreshes, freeze T&E

**Scenario switching protocol:** Designate one decision-maker (CEO or CFO) who reviews scenario metrics monthly. Scenario switch is a board-level decision — not operational. Pre-define the actions so there's no debate when the trigger fires.

---

## Step 5: Runway Calculation

**Runway = Cash / Monthly Burn Rate.** Target: 18 months minimum. 24 months preferred.

**Monthly burn = Total cash out − Cash in (revenue received, not booked)**

Note: For B2B SaaS with annual contracts, you receive cash at signing — model cash flow, not ARR. A €12K ACV deal signed in January produces €12K in January (if paid annually), not €1K/month.

**Monthly burn table format:**

| Month | Cash in | Cash out (payroll) | Cash out (other) | Net burn | Cumulative cash | Runway (months) |
|-------|---------|--------------------|-----------------|---------|-----------------|----------------|
| Jan | €85K | €42K | €18K | -€60K | €3,940K | 65.7 |
| Feb | €92K | €46K | €19K | -€65K | €3,875K | 59.6 |

**Runway warning thresholds:**
- 18+ months: Safe to execute base plan
- 12–18 months: Review hiring sequence; defer non-critical hires
- 9–12 months: Begin fundraising process immediately (Series A or B takes 4–6 months)
- <9 months: Implement downside scenario now; fundraising becomes urgent
- <6 months: Existential — board escalation required

---

## Step 6: Signal-Based Spending Unlocks

**2026 best practice for B2B SaaS boards:** Budget is not unlocked by calendar — it's unlocked by performance signals. This approach prevents the "we hired for the plan, but the plan was wrong" problem.

**Unlock gate format:**

| Spend category | Unlock trigger | Who approves | Action if trigger not met |
|---------------|---------------|-------------|--------------------------|
| AE #3 hire | Q1 ARR target hit AND pipeline coverage >3x | CEO | Defer to next quarter |
| Marketing budget increase (+€20K/month) | MQL→SQL rate >20% for 60 days | CEO + CFO | Hold at current budget |
| VP Sales hire | 2 AEs at >80% quota for 2 consecutive quarters | CEO + Board | Defer; hire SDR instead |
| International expansion spend | Existing market at €5M+ ARR AND NRR >110% | Board | Remove from plan entirely |

**Why signal-based unlocks matter:** A company that hires ahead of revenue signals burns capital building capacity that doesn't have work to do. A company that hires behind signals misses market opportunity. Signal-based unlocks thread the needle: capital deploys when the business has proven the need, not when the original plan said it would.

---

## Budget Planning Calendar

| Month | Activity | Owner |
|-------|----------|-------|
| Sep–Oct | Build next-year revenue model; set ARR targets | CEO + CFO |
| Oct | Headcount planning by department — department heads submit requests | All VPs |
| Nov | Consolidate department requests; build 3 scenarios | CFO |
| Nov | Board presentation: scenarios + unlock triggers | CEO |
| Dec | Final budget approved; headcount plan frozen | Board |
| Jan | Q1 actuals start; monthly variance review begins | CFO |
| Apr | Q1 review: are we in base / upside / downside? | CEO + CFO |
| Jul | Mid-year re-forecast: adjust H2 plan based on H1 actuals | CEO + CFO |
| Oct | Start next year's cycle | CEO + CFO |

---

## Rules

- **Headcount is the budget.** If you can't name the specific roles you're planning to hire and when, you don't have a headcount plan — you have a wish list. Every budget line for people should have a role title and a planned start month.
- **Model cash flow, not ARR.** Annual contracts paid upfront change the shape of your cash curve dramatically. A €500K