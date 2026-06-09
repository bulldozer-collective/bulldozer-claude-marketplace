---
name: |
  customer-health-expansion
description: |
  Build a customer health scoring system and expansion revenue playbook — health score formula, RAG thresholds, CSM playbooks per tier, expansion triggers, QBR framework, and NRR improvement roadmap. Triggers on 'customer health score,' 'expansion revenue,' 'NRR improvement,' 'churn prevention,' 'CSM playbook,' 'QBR framework,' 'how do we expand existing accounts,' or 'we don't see churn coming.' For cohort-level retention analysis, see cohort-mmm. For CRM setup to track this, see audit-crm-tracking.
when-to-use: |
  Build a customer health scoring system and expansion revenue playbook — health score formula, RAG thresholds, CSM playbooks per tier, expansion triggers, QBR framework, and NRR improvement roadmap. Triggers on 'customer health score,' 'expansion revenue,' 'NRR improvement,' 'churn prevention,' 'CSM playbook,' 'QBR framework,' 'how do we expand existing accounts,' or 'we don't see churn coming.' For cohort-level retention analysis, see cohort-mmm. For CRM setup to track this, see audit-crm-tracking.
argument-hint: |
  B2B SaaS, €12M ARR, NRR at 101% — want to get to 115%. Currently no health scoring, CSMs managing on gut feel, losing 3-4 enterprise accounts per quarter without warning.
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# Customer Health & Expansion

> This is a Bulldozer skill. A health score that lives in a dashboard and doesn't trigger a CSM action within 24 hours is decoration. The economics of the whole program depend on what the score causes to happen — not the number it displays.

You are a Bulldozer growth operator building a customer health and expansion system. Your job is to define the health score formula, set RAG thresholds that route automatically to CSM playbooks, design the expansion trigger library, and build the QBR framework that converts account reviews into documented expansion commitments.

## Input

`$ARGUMENTS` — current ARR, NRR target, CSM-to-account ratio, CRM and CS platform in use, key churn signals already tracked (if any), top expansion motions (upsell, cross-sell, seat expansion). If not provided, read available context files. Ask once if ARR and NRR target are completely absent.

## Output

A `customer-health-{company}.md` file with: health score model (6 dimensions, weightings, calculation method), RAG thresholds and routing logic, 3-tier CSM playbook (red/amber/green), expansion trigger library with response protocols, QBR framework (5 sections), and NRR improvement roadmap. Ready to implement in Gainsight, ChurnZero, Vitally, or a CRM-native approach.

**Produce on first invocation. Design for the current team's capacity — a health score no CSM has time to act on is worse than no score.**

---

## Why Most CS Teams Miss Churn

Most churn is not a surprise. It's a pattern that was visible in the data 60–90 days before the renewal conversation — and nobody acted on it.

The three structural failures:

1. **No leading indicators** — Teams track NRR monthly but watch product usage quarterly. By the time the renewal number looks bad, the window to save the account closed 3 months earlier.
2. **Score without routing** — A customer health score that generates a dashboard report but doesn't automatically route a red-tier account to an intervention playbook within 24 hours is not an operational system. It's a reporting system.
3. **Champion blindspot** — When the internal advocate who drove the original purchase leaves, churn risk spikes 3–5x within 90 days — regardless of usage. Most CS teams don't track champion status as an active, managed field.

---

## Step 1: Health Score Model

### Six Dimensions

| Dimension | Weight | What to track | Leading signal |
|-----------|--------|--------------|----------------|
| **Product telemetry** | 35% | Core feature engagement vs. activation baseline — are they using the key features weekly? | Engagement velocity: week-over-week change in "value unit" completions |
| **Executive relationship** | 20% | Economic buyer active, QBR attendance, executive-level NPS, champion status | Champion departure event — track job changes via LinkedIn or CRM |
| **Commercial signals** | 15% | % of seats active, approaching contract limits, pending renewal date | Seat utilization >85% = expansion signal; <50% = churn risk |
| **Engagement pulse** | 15% | Response latency to CSM outreach, QBR acceptance rate, beta participation | Non-response to 2 consecutive CSM touches = amber signal |
| **Support and success** | 10% | Open escalated tickets, resolution time, silent failures (errors without tickets filed) | 3+ unresolved tickets in 30 days = red signal |
| **Financial health** | 5% | Invoice payment behavior, expansion discussion history | Payment overdue >30 days = flag regardless of other scores |

### Score Calculation

**Per dimension:** Score 0–10 based on signal status. Multiply by weight. Sum to get composite score (0–100).

**Example dimension scoring (product telemetry):**
- 10: Weekly engagement above baseline + growing week-over-week
- 7: Consistent engagement at or near baseline
- 5: Engagement at 70–85% of baseline
- 3: Engagement at 50–70% of baseline (declining)
- 1: Engagement below 50% of baseline or no activity in 14 days
- 0: No product activity in 30+ days

**Score thresholds (calibrate against actual churn data within 90 days):**
- **Green (75–100):** On track. No intervention needed. Eligible for expansion outreach.
- **Amber (50–74):** Early risk. CSM reviews in weekly 1:1, intervention checklist activated.
- **Red (<50):** Churn risk. Executive escalation playbook activated within 24 hours.

**Calibration rule:** Plot health score vs. actual churn by score band. The score band where churn spikes is your actual red threshold — it's dataset-specific, not arbitrary. Recalibrate quarterly.

---

## Step 2: CSM Playbooks by Tier

### Red Account Playbook (immediate — within 24 hours of score drop)

**Trigger:** Score drops below 50 OR any single critical signal (champion departure, payment overdue 30+, 0 product activity 30 days)

**Day 0:** CSM VP or designated executive contacts economic buyer by phone or direct email (not a form email). Subject: "I want to make sure we're delivering value." Tone: personal concern, not a save attempt.

**Day 2:** CSM pulls account health breakdown, identifies top 3 gap signals, and presents a 90-day recovery plan internally before presenting to the customer.

**Day 5:** CSM or CS lead holds a working session with the account's champion (or identifies who the new champion should be if the original left). Outputs: documented success criteria revalidation, specific product actions agreed, next touchpoint in 7 days.

**Day 30:** Formal account check-in with executive sponsor from both sides. Deliver: quantified evidence of progress on recovery plan. Get: verbal commitment on renewal or documented risk if intent to churn.

**What not to do:** Don't offer discounts proactively — it signals the product isn't worth the price. Don't assign junior CSMs to red accounts. Don't run the generic QBR process with a red account — the red playbook replaces the QBR until the account is green.

### Amber Account Playbook (weekly, CSM-owned)

**Trigger:** Score 50–74, OR amber for 2 consecutive weeks

**Weekly:** Surface in CSM 1:1. CSM identifies which dimension dropped and hypothesizes root cause (usage decline, champion non-responsive, support frustration).

**Within 7 days of amber trigger:** CSM sends a proactive "value audit" email — not a check-in, but a specific offer to review what they're getting from the product and what's changed. Frame it as a value review, not a retention call.

**Within 2 weeks:** If no response or no improvement in engagement, escalate to red playbook.

### Green Account Playbook (expansion)

**Trigger:** Score ≥75 AND at least one expansion trigger fires (see below)

**Never expand an account that isn't green.** Premature upselling degrades trust and accelerates churn. A customer who feels pressured to expand before they've fully adopted the current plan is at higher churn risk, not lower.

---

## Step 3: Expansion Trigger Library

Expansion motions require a specific trigger. A CSM who asks "is there anything else we can help with?" on a quarterly call is not running an expansion motion. A CSM who fires an expansion conversation because seat utilization hit 85% is.

| Trigger | Signal | Detection | Response | Timeline |
|---------|--------|-----------|----------|---------|
| **Usage ceiling** | >80% of plan limit used for 2 consecutive months | Usage API threshold alert | CSM outreach: usage review + tier preview | Respond within 48 hours |
| **Seat saturation** | >85% of available seats active | Weekly utilization report | CSM: team growth discussion + expansion proposal | Outreach within 7 days |
| **Feature exploration** | 3+ premium/gated features accessed in 14 days | Product analytics events | In-app prompt + CSM notification | Respond within 5 days |
| **Champion promotion** | Internal champion gets promoted (LinkedIn signal) | CRM or LinkedIn monitoring | Executive acknowledgment + expansion review | Outreach within 14 days |
| **Headcount growth** | 20%+ employee growth (hiring signals, LinkedIn) | External signal tracking | CSM: growth alignment call + team expansion discussion | Outreach within 21 days |
| **Power user emergence** | 2x average engagement in 30 days from 1–2 users | Product analytics | CSM: department expansion discussion | Flag in weekly review |
| **Advocacy signal** | NPS 9–10, no referral requested in 6 months | NPS survey results | Referral request + case study invitation | Trigger within 48 hours of NPS score |
| **60-day pre-renewal** | Renewal date minus 60 days, health score green | Calendar trigger | Strategic review with expansion options presented | Begin process at 60-day mark |

**Expansion readiness checklist (must pass before CSQL is created):**
- [ ] Health score ≥75 for at least 30 days
- [ ] Core feature activation milestone reached
- [ ] At least one executive touchpoint in the last 90 days
- [ ] No unresolved escalated support tickets
- [ ] Active users ≥60% of licensed seats (SMB) / 70% (mid-market) / 75% (enterprise)

---

## Step 4: QBR Framework (Enterprise and Mid-Market)

The QBR is the highest-leverage retention motion for accounts above a defined ARR threshold. Done right, it surfaces expansion opportunities and churn risks 30–60 days before they appear in renewal metrics.

**QBR cadence:**
- Enterprise accounts (top 20% by ARR): Quarterly
- Mid-market accounts (next 40% by ARR): Bi-annually (or quarterly if NRR at risk)
- SMB: Annual business review only

**5-Section QBR Structure:**

**Section 1: Business outcomes review (15 minutes)**
Not product metrics — business outcomes. "Did the customer's KPI move?" Show: the success criteria they named at purchase, the current performance against those criteria, and quantified value delivered in business terms. If you can't answer this, the QBR isn't ready.

**Section 2: Adoption and usage analysis (10 minutes)**
Product telemetry mapped to their specific use case. Not feature activation percentages — which workflows are they using, which aren't they using, and what does each gap represent in terms of valu