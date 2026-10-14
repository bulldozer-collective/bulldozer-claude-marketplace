---
name: |-
  customer-health-expansion
description: |-
  Build a customer health scoring system and expansion revenue playbook — health score formula, RAG thresholds, CSM playbooks per tier, expansion triggers, QBR framework, and NRR improvement roadmap. Triggers on 'customer health score,' 'expansion revenue,' 'NRR improvement,' 'churn prevention,' 'CSM playbook,' 'QBR framework,' 'how do we expand existing accounts,' or 'we don't see churn coming.' For cohort-level retention analysis, see cohort-mmm. For CRM setup to track this, see audit-crm-tracking.
when-to-use: |-
  Build a customer health scoring system and expansion revenue playbook — health score formula, RAG thresholds, CSM playbooks per tier, expansion triggers, QBR framework, and NRR improvement roadmap. Triggers on 'customer health score,' 'expansion revenue,' 'NRR improvement,' 'churn prevention,' 'CSM playbook,' 'QBR framework,' 'how do we expand existing accounts,' or 'we don't see churn coming.' For cohort-level retention analysis, see cohort-mmm. For CRM setup to track this, see audit-crm-tracking.
argument-hint: |-
  B2B SaaS, €12M ARR, NRR at 101% — want to get to 115%. Currently no health scoring, CSMs managing on gut feel, losing 3-4 enterprise accounts per quarter without warning.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
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
3. **Champion blindspot** — When the internal advocate who drove the original purchase leaves, churn risk rises sharply — regardless of usage. Vendor write-ups on this vary widely on the exact multiplier (accounts described as "several times more likely to churn" in one source, "near coin-flip within 12 months" in another) and none publish a method solid enough to cite as a fact rather than a market rumor. Treat the direction as certain and any specific number as unverified. Most CS teams don't track champion status as an active, managed field.

---

## Step 1: Health Score Model

### Six Dimensions

| Dimension | Weight | What to track | Leading signal |
|-----------|--------|--------------|----------------|
| **Product telemetry** | 35% | Core feature engagement vs. activation baseline — are they using the key features weekly? | Engagement velocity: week-over-week change in "value unit" completions |
| **Executive relationship** | 20% | Economic buyer active, QBR attendance, executive-level NPS, champion status | Champion departure event — track job changes via a LinkedIn employee search or CRM |
| **Commercial signals** | 15% | % of seats active, approaching contract limits, pending renewal date | Seat utilization >85% = expansion signal; <50% = churn risk |
| **Engagement pulse** | 15% | Response latency to CSM outreach, QBR acceptance rate, beta participation | Non-response to 2 consecutive CSM touches = amber signal |
| **Support and success** | 10% | Open escalated tickets, resolution time, silent failures (errors without tickets filed) | 3+ unresolved tickets in 30 days = red signal |
| **Financial health** | 5% | Invoice payment behavior, expansion discussion history | Payment overdue >30 days = flag regardless of other scores |

### Where This Data Actually Lives

For the dimension-by-dimension map of what is and is not connected in Bulldozer OS (product telemetry, executive relationship, commercial signals, engagement pulse, support, financial health) and the check on writing the score back into the CRM, read `references/data-sources-by-dimension.md` before promising a CSM a live dashboard.

**Never claim more than what's actually connected.** A health score built on five available dimensions and used is worth more than a six-dimension model that silently assumes a data source nobody wired up.

**A missing dimension is not a red dimension.** If product telemetry — 35% of the score, the single biggest weight — has no data source connected, don't let that dimension default to 0. A 0 there manufactures a false red account out of an absence of data, not a real risk. Score only the dimensions actually wired up, reweight the rest so they still sum to 100, and mark the composite as partial until telemetry is connected. A CSM who gets a Day-0 escalation call triggered by a dimension nobody ever instrumented stops trusting the score inside a month — and once a CSM stops trusting the score, the routing in Step 2 stops happening regardless of what the dashboard says.

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

**Don't recalibrate on a handful of events.** A book with a small number of renewals or churns in a given quarter can show a threshold swing that's just noise from two or three accounts, not a real shift in where risk lives. If the quarter's churn count is too small to see a clear band where risk spikes, keep the prior threshold and widen the lookback window instead of moving the line on a small sample — the same discipline that applies to reading any test too early.

---

## Step 2: CSM Playbooks by Tier

### Red Account Playbook (immediate — within 24 hours of score drop)

**Trigger:** Score drops below 50 OR any single critical signal (champion departure, payment overdue 30+, 0 product activity 30 days)

For the red-account trigger sorting, the Day 0 / Day 2 / Day 5 / Day 30 steps and the what-not-to-do list, read `references/csm-playbooks.md`. The red playbook starts within 24 hours of the trigger.

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

For the expansion trigger table (usage ceiling, seat saturation, feature exploration, champion promotion, headcount growth, power user, advocacy, 60-day pre-renewal), the calibration note and the expansion readiness checklist that must pass before a CSQL is created, read `references/expansion-triggers.md`.

---

## Step 4: QBR Framework (Enterprise and Mid-Market)

The QBR is the highest-leverage retention motion for accounts above a defined ARR threshold. Done right, it surfaces expansion opportunities and churn risks 30–60 days before they appear in renewal metrics.

For the QBR cadence by tier, the 5-section QBR structure with timings, and what kills a QBR, read `references/qbr-framework.md` before designing or running a QBR.

---

## Step 5: NRR Improvement Roadmap

A health score, a tiered playbook and a QBR cadence are operating mechanics — they don't move NRR by themselves. This step is the sequencing: what to build first, and what "better" means for this specific book of business.

### Phase 1 (Weeks 1–4): Instrument before you intervene
Stand up the six-dimension score with whatever data already exists — a health score built on three dimensions and used is worth more than a six-dimension model waiting on a data pipeline. Backfill 90 days of history if the CRM or CS platform allows it, so the calibration in Step 1 has something to calibrate against. Do not run the red/amber/green playbooks yet: a score nobody trusts triggers actions nobody follows.

### Phase 2 (Weeks 5–8): Route the score, don't just display it
Wire the RAG thresholds to the playbooks in Step 2. The test of this phase isn't a dashboard screenshot — it's whether a red account actually got a Day-0 executive call last week. If CSMs are still finding out about red accounts from a monthly report, routing isn't done.

### Phase 3 (Weeks 9–12): Turn on expansion
Only start running the expansion trigger library once the red/amber playbooks are producing fewer surprises — an expansion motion launched while churn is still being caught late competes for the same CSM attention and loses. Expansion revenue recognized in this phase should be traceable to a named trigger from Step 3, not to a CSM's general sense that the account "seemed ready."

### Phase 4 (Ongoing): Calibrate against your own book, not the market
**Do not adopt a market NRR target as the goal.** Net revenue retention benchmarks vary by ARR size and average contract value far more than they vary by industry — one comparison of company cohorts found median NRR near 98% for sub-$10M ARR companies versus roughly 115% for companies above $100M ARR, with wide spread inside each band. A target imported from a benchmark report that doesn't match this company's size and ACV is a number to explain away, not a number to hit. Set the target from this account base's own churn-vs-health-score calibration (Step 1) and its own expansion trigger volume (Step 3), then track quarter-over-quarter movement against that baseline.

**Watch the gap between NRR and gross/logo retention, not NRR alone.** A book of business built on seat- or usage-based expansion can show NRR climbing while gross revenue retention or logo retention quietly falls — the expansion trigger library in Step 3 is, structurally, the mechanism that would produce exactly this pattern if it keeps firing on accounts that are churning underneath. A wide spread between the two (NRR comfortably above 100% next to GRR nearer 80%) is a diagnostic signal that expansion is masking churn, not proof the program is working — this shows up most often in seat- or usage-priced books, which is exactly what this expansion motion is. Track both numbers side by side.

**Roadmap review cadence:** revisit all four phases at the same interval as the health score recalibration (quarterly) — an NRR roadmap that isn't revisited becomes a slide nobody updates.

---

## Common Mistakes

For the list of common mistakes in running a health and expansion program (score as report instead of router, QBRs on the wrong accounts, expanding red or amber accounts, imported NRR benchmarks, lapsed champion tracking and more), read `references/common-mistakes.md`.

## Rules

1. A health score that doesn't route to an owner and a deadline within 24 hours is a dashboard, not a system — fix the routing before adding more dimensions.
2. Never run an expansion motion on an account that isn't green. The score exists to make that call so a CSM's quota pressure doesn't have to.
3. Every QBR ends with dated, named commitments on both sides, logged against the account — a QBR that ends in "let's reconnect" didn't happen.
4. Recalibrate the red/amber/green thresholds against actual churn every quarter. A threshold set once at launch drifts out of sync with the business it's meant to protect.
5. Set the NRR target from this account base's own data, not from a market benchmark — segment, ARR size and ACV move the "good" number too much for an imported target to mean anything.
6. Track gross or logo retention next to NRR, not NRR alone — a seat- or usage-based expansion motion can push NRR up while true retention erodes underneath it.
7. Map each health-score dimension to what's actually connected before promising a CSM a live dashboard — an unconnected dimension is a placeholder, not a score.
8. Never score a disconnected dimension as if it were measured and red — exclude it and reweight the rest, or the score punishes missing instrumentation instead of measuring risk.
9. Sort a red trigger before calling the customer — a billing failure gets routed to billing, not a "checking in on value" call it doesn't need.
10. Check who's actually on the deal before pitching an expansion — a green health score on a single-threaded account is still a single-threaded account, and it stays that way until someone else is in the room.