---
name: org-design-hiring-roadmap
description: Design the GTM org structure and sequence the hiring roadmap — role prioritization by revenue impact, headcount model by ARR milestone, hiring sequence logic, reporting lines, and span-of-control standards. Triggers on 'org design,' 'hiring roadmap,' 'who should I hire next,' 'GTM team structure,' 'hiring plan,' 'building out my team,' 'sales org chart,' or 'how do I scale my GTM team.' For team performance audit, see team-assessment. For budget and headcount planning, see budget-resources-planning.
when-to-use: Design the GTM org structure and sequence the hiring roadmap — role prioritization by revenue impact, headcount model by ARR milestone, hiring sequence logic, reporting lines, and span-of-control standards. Triggers on 'org design,' 'hiring roadmap,' 'who should I hire next,' 'GTM team structure,' 'hiring plan,' 'building out my team,' 'sales org chart,' or 'how do I scale my GTM team.' For team performance audit, see team-assessment. For budget and headcount planning, see budget-resources-planning.
argument-hint: Series A, €2.4M ARR. Founder-led sales closing, 1 AE hired 3 months ago hitting quota. 12-month target: €5M ARR. Budget for 4 GTM hires. Need to know who to hire, in what order, and what the org looks like at €5M.
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# Org Design & Hiring Roadmap

> This is a Bulldozer skill. The most expensive sales hiring mistake is bringing in a VP of Sales before having 2 reps hitting quota. The second most expensive is hiring SDRs before validating that the AE can close what they book. The sequence of GTM hiring matters as much as the hires themselves. Getting the order wrong means the hires can't succeed — because the foundation they need doesn't exist yet.

You are a Bulldozer operator designing a GTM org structure and hiring roadmap. Your job is to select the right roles to add, sequence hires based on the current bottleneck, set headcount targets by ARR milestone, and produce reporting line and span-of-control standards.

## Input

`$ARGUMENTS` — current ARR, current GTM team roster, 12-month ARR target, budget for GTM hiring (headcount count or budget €), primary sales motion (sales-led / product-led / founder-led), known bottleneck (pipeline volume / closing / process / CS). If not provided, read available context files. Ask once if ARR and target are completely absent.

## Output

A `org-design-hiring-roadmap-{company}.md` file with: hiring sequence decision logic, role-by-role hire rationale, headcount model by ARR milestone, target org chart (current → 12 months), reporting lines, span-of-control standards, and a quarterly hiring calendar.

**Produce on first invocation. Start with the bottleneck diagnosis — hiring the wrong role for the bottleneck is the most common org design mistake.**

---

## Step 1: Bottleneck Diagnosis

**Every GTM hiring decision should address a specific bottleneck.** Hiring without diagnosing the bottleneck produces hires who can't succeed.

**The 4 GTM bottlenecks and their hiring antidotes:**

| Bottleneck | Symptom | Right hire | Wrong hire |
|------------|---------|-----------|-----------|
| **Pipeline volume** | AE has quota capacity but not enough meetings; SDR to booking rate is low or team is too small | SDR or Demand Gen | AE (more closers won't fix an empty pipeline) |
| **Closing** | Meetings are booking but deals aren't advancing; win rate is low | AE (if AE-to-deal ratio is off) or Sales Enablement | SDR (more meetings won't fix a broken close motion) |
| **Process and infrastructure** | Data is inconsistent; CRM is not being used; no forecast; handoffs breaking | RevOps | More quota-carrying headcount (adding reps to a broken system produces more broken outcomes) |
| **Post-sale retention** | Churn is high; customers don't renew or expand; CS team is reactive | CS Manager or CSM | Sales (if the bucket is leaking, pour less water in) |

**Bottleneck questions:**
1. What is the pipeline coverage ratio? (Target: 3–4x quarter target) → If <2x: pipeline bottleneck
2. What is the AE win rate from stage 2 (demo) onward? → If <20%: closing bottleneck
3. Can you produce an accurate forecast? → If no: process/RevOps bottleneck
4. What is your gross revenue retention? → If <80%: CS bottleneck

---

## Step 2: Hiring Sequence by Stage

**The default sequence for most B2B SaaS companies.** Exceptions exist — see override conditions at the bottom.

### Pre-Revenue to €1M ARR (Seed / Pre-Series A)
**Model:** Founder-led sales

- Hiring: First AE (not SDR) — hire someone who can both prospect and close; a pure hunter who can run a full cycle
- When to hire: After founder has validated 5+ repeatable closed deals with consistent ICP fit
- Do NOT hire: SDR (no point booking meetings your AE can't close yet), VP Sales (too early — the motion isn't repeatable), RevOps (founder manages the spreadsheet)

### €1M–€3M ARR (Series A)
**Model:** Building the engine

Hire in this sequence:
1. **AE #2** (if first AE is at >80% quota attainment) — clone the working motion
2. **SDR #1** (after 2 AEs are closing and the bottleneck shifts to pipeline) — first SDR feeds 2 AEs
3. **Marketing generalist** (content + demand gen to build inbound pipeline) — reduce dependency on outbound only
4. **RevOps hire** (when the team reaches 5–7 people and spreadsheets stop working for forecasting)

Do NOT hire: VP Sales before 2 AEs are hitting quota consistently. The VP's job is to scale what works — if nothing has been proven to work, you'll pay €250K to watch someone rebuild from scratch.

### €3M–€10M ARR (Series B)
**Model:** Scaling the repeatable engine

- VP/Head of Sales (player-coach who can manage 3–6 AEs) — hire when ARR crosses €3M and 2+ AEs consistently hit quota
- SDR Team (3–6 SDRs) with SDR Manager at 4+ SDRs
- Second marketing hire: either demand gen specialist or product marketing, depending on motion
- Full-time RevOps (or upgrade from generalist to specialist)
- CS Team: 1 CSM per €1M–€1.5M ARR; CSM Manager at 4+ CSMs
- Sales Enablement at 8+ reps and ramp time >4 months

Typical ratios at this stage:
- 1 SDR : 2 AEs
- 1 Sales Manager : 5–7 AEs
- 1 RevOps : 10 quota-carrying reps
- 1 CSM : €1M–€1.5M in managed ARR

### €10M–€25M ARR (Series B/C)
**Model:** Functional specialization

- CRO to unify sales, marketing, and CS under one revenue number
- VP of Marketing (upgrade from Head of Marketing)
- Sales Operations (dedicated, separate from RevOps strategy)
- Marketing Ops (dedicated)
- CS Ops
- Enterprise AE team (separate from mid-market; different motion, different comp)
- Solutions Engineers for complex deals

---

## Step 3: Headcount Model by ARR

**ARR per employee benchmarks for B2B SaaS:**

| Stage | ARR | Employees | ARR/employee | GTM headcount |
|-------|-----|-----------|-------------|--------------|
| Seed | €500K | 10–15 | €33–50K | 2–3 |
| Series A | €1–3M | 20–50 | €40–60K | 5–12 |
| Series B | €5–15M | 75–150 | €50–75K | 20–45 |
| Series C | €20M+ | 200–400 | €60–80K | 60–120 |

**Quota-based headcount math:**

```
AE headcount required = Revenue target ÷ (Attainment-adjusted quota per AE)

Example:
- 12-month revenue target: €5M new ARR
- AE quota: €800K
- Historical attainment: 75%
- Attainment-adjusted quota: €800K × 75% = €600K effective per AE
- Required AEs: €5M ÷ €600K = 8.3 → hire 9 AEs
- Hiring timeline: Account for 3-month ramp → AEs hired in Q1 contribute 50% in Q2, 100% in Q3+
```

---

## Step 4: Org Chart Design

**Org chart at each stage should reflect the GTM motion, not a conventional org chart template.**

**Series A org (€1–3M ARR, 5–8 GTM headcount):**
```
CEO / Founder
├── Head of Sales (player-coach, also carries quota)
│   ├── AE #1
│   ├── AE #2
│   └── SDR #1 (optional)
├── Marketing Generalist
└── RevOps (part-time or fractional)
```

**Series B org (€3–10M ARR, 15–40 GTM headcount):**
```
CEO
├── VP Sales
│   ├── SDR Manager
│   │   ├── SDR #1–4
│   ├── AE #1–3 (Mid-Market)
│   ├── AE #4–6 (Enterprise, if segment exists)
│   └── Sales Enablement (at 8+ reps)
├── VP Marketing
│   ├── Demand Gen
│   └── Product Marketing
├── VP CS
│   ├── CSM #1–4
│   └── CS Ops (at 4+ CSMs)
└── RevOps (reports to CEO or CRO)
```

**Span of control standards:**
- 1 manager : 5–8 individual contributors (max 10 for high-velocity teams)
- SDR Managers: 6–8 SDRs before needing a second manager
- AE Managers: 5–7 AEs (enterprise), 7–10 AEs (SMB/high velocity)
- CSM Managers: 6–8 CSMs

---

## Step 5: Override Conditions

**When the default sequence doesn't apply:**

| Condition | Override |
|-----------|---------|
| Enterprise ACV >€100K | AE first always — enterprise deals require a dedicated senior AE, SDRs can't carry this motion alone |
| AI SDR tooling in use (Unify, 11x, Clay automation) | Reduce SDR headcount by 30–50%; invest in 1 skilled GTM engineer instead of 2–3 SDRs |
| Product-led growth (PLG) motion | Hire growth engineer / PLG ops before sales AE; users self-serve until a commercial motion is proven |
| Bootstrapped / burn-constrained | Fractional or contract AE before full-time; validate motion before committing base salary |
| International expansion | Hire local AE + local SDR before VP — the local market knowledge matters more than the management layer |

---

## Step 6: Quarterly Hiring Calendar

**Back-calculate from the role's revenue impact date.**

A role hired today produces revenue based on:
- Time-to-fill: 4–12 weeks depending on role seniority
- Ramp time: 1–3 months for SDR, 3–6 months for AE, 6–9 months for VP

**Revenue impact calculation:**

| Role | Time-to-fill | Ramp | Revenue impact starts |
|------|-------------|------|----------------------|
| SDR | 4–6 weeks | 1–2 months | 2–3 months post-decision |
| AE (mid-market) | 6–10 weeks | 3–4 months | 4–6 months post-decision |
| VP Sales | 10–16 weeks | 6 months | 8–10 months post-decision |
| RevOps | 6–8 weeks | 1–2 months (process impact) | 2–3 months post-decision |

**Quarterly hiring calendar template:**

| Quarter | Role | Revenue need it addresses | Hire date needed by | Notes |
|---------|------|--------------------------|--------------------|----|
| Q1 | SDR #2 | Pipeline volume gap vs. Q2 target | Jan 15 | Current pipeline coverage 1.9x |
| Q1 | RevOps | Forecasting + CRM accuracy | Feb 1 | Manual tracking breaking at current team size |
| Q2 | AE #3 | Q3 revenue capacity | Apr 1 | 3-month ramp means Q3 contribution |
| Q3 | Head of Sales | Q4 scale + manager layer | Jul 1 | First management hire — requires 2 AEs at quota |

---

## Rules

- **Never hire a VP of Sales before 2 AEs are consistently hitting quota.** A VP's job is to scale what works. If nothing has been proven to work, you're paying €250K+ OTE to watch someone rebuild from scratch while the board questions the spend.
- **Hire for the bottleneck, not for the org chart.** An org chart that looks like a best-practice SaaS company is useless if your real problem is pipeline volume and you hired an enablement person instead of an SDR.
- **Time-to-revenue from a hire is longer than you think.** The VP you hire in January won't impact Q1 revenue. They might impact Q3. Build this into your capacity plan and communicate it to the board.
- **SDR before AE only when closing is proven.** If your AEs can't close what SDRs book, adding more 