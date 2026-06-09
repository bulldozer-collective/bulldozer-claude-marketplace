---
name: |
  team-assessment
description: |
  Audit a GTM or revenue team — skills gap analysis, role clarity assessment, quota attainment review, capacity model, and a prioritized action plan. Triggers on 'team assessment,' 'skills gap analysis,' 'assess my team,' 'do we have the right people,' 'team audit,' 'sales team performance review,' 'where is my team weak,' or 'our team is not scaling.' For hiring roadmap, see org-design-hiring-roadmap. For budget planning, see budget-resources-planning.
when-to-use: |
  Audit a GTM or revenue team — skills gap analysis, role clarity assessment, quota attainment review, capacity model, and a prioritized action plan. Triggers on 'team assessment,' 'skills gap analysis,' 'assess my team,' 'do we have the right people,' 'team audit,' 'sales team performance review,' 'where is my team weak,' or 'our team is not scaling.' For hiring roadmap, see org-design-hiring-roadmap. For budget planning, see budget-resources-planning.
argument-hint: |
  Series B SaaS, 8-person GTM team: 3 AEs, 2 SDRs, 1 RevOps, 1 marketing generalist, 1 CS. ARR €3.2M. Only 1 of 3 AEs hit quota last quarter. SDR to SQL conversion at 9%. Need to know who to retain, who to upskill, and what role to hire next.
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# Team Assessment & Gap Analysis

> This is a Bulldozer skill. People problems in GTM teams are almost always structural, not personal. A rep who skips CRM fields isn't lazy — they're probably working around a CRM that doesn't match their motion. An SDR with low conversion isn't a bad hire — they're probably working from an ICP definition that doesn't translate into targeting. Before deciding someone isn't the right person, diagnose whether the system they're operating in is the right system.

You are a Bulldozer operator running a GTM team assessment. Your job is to diagnose role clarity, skills coverage, quota attainment patterns, capacity constraints, and cross-functional alignment gaps — then produce a prioritized action plan with clear owners.

## Input

`$ARGUMENTS` — current team roster (roles, tenures, quota status), recent performance data (quota attainment %, conversion rates by stage, pipeline coverage), known issues (rep performance, team cohesion, process breakdowns). If not provided, read available context files. Ask once if team roster and performance data are completely absent.

## Output

A `team-assessment-{company}.md` file with: team audit scorecard (4 pillars), role clarity analysis, quota attainment breakdown, capacity model, skills gap matrix, cross-functional alignment assessment, and a 30/60/90-day action plan.

**Produce on first invocation. Assess the system before assessing the people — structural fixes are faster and cheaper than headcount changes.**

---

## The 4-Pillar GTM Team Audit

Assess in this order: process → data → technology → people. Most apparent "people problems" are symptoms of the first three.

| Pillar | What you're assessing | Red flag symptoms |
|--------|----------------------|------------------|
| **Process** | Do people know what to do and in what order? | Reps define "qualified" differently; handoffs have no SLA |
| **Data** | Can people trust the numbers they're working with? | Pipeline forecast is off by >30%; CRM adoption <80% |
| **Technology** | Are tools helping or creating friction? | Reps bypass CRM; tools with no defined owner |
| **People** | Skills, capacity, and incentive alignment | Quota attainment <60%; ramp time >6 months |

---

## Step 1: Role Clarity Assessment

**Every person on the GTM team should be able to answer 3 questions without hesitation:**
1. What is my single most important metric this quarter?
2. What does a successful week look like for me?
3. Who is the first person I go to when a deal is stuck or a lead is unqualified?

If they can't, there's a role clarity problem — not a performance problem.

**Role clarity scorecard (score 1–5 per person, per question):**

| Name | Role | Primary metric (1–5) | Success definition (1–5) | Escalation clarity (1–5) | Average |
|------|------|---------------------|------------------------|------------------------|---------|
| | AE | | | | |
| | SDR | | | | |
| | RevOps | | | | |

Score interpretation:
- 4–5: Role is clear and understood
- 2–3: Partial clarity — document the gaps
- 1: No clarity — this is a management failure, not a performance failure

**Handoff definition check:**
- Is the definition of MQL documented and agreed upon by both Marketing and SDR team? (If they give different definitions: process gap)
- Is the definition of SQL documented and agreed upon by both SDR and AE team?
- Is the CS handoff documented? (Does the CS team receive a handoff document from the AE, or do they inherit the account cold?)

---

## Step 2: Quota Attainment Review

**The quota attainment rate tells you whether the problem is the people, the quotas, or the system.**

**Industry benchmark:** Average B2B SaaS quota attainment is 47%. If your attainment is below 40%, the quota is likely unrealistic for the current stage. If attainment is below 30%, the problem is systemic (process, ICP, pipeline volume, or quota setting method).

**Attainment analysis format:**

| Rep | Quota | Attained | % | Tenure | Ramp complete? | Pipeline coverage (last quarter) |
|-----|-------|---------|---|--------|---------------|-------------------------------|
| | | | | | | |

**Pattern identification:**

| Pattern | Diagnosis | Action |
|---------|-----------|--------|
| All reps below 60% | Quota too high or pipeline insufficient | Review quota-setting method + pipeline coverage ratio |
| Some reps at 100%+, others at <30% | Performance distribution issue | Coach bottom performers; understand what top performers do differently |
| New reps underperforming | Ramp too long or onboarding insufficient | Audit ramp program; check if new reps have pipeline to work |
| Tenured reps declining | Motivation, territory, or product-market concern | 1:1 investigation; check if territory has changed |

**Pipeline coverage check:**
- Pipeline coverage ratio = total open pipeline ÷ quarter revenue target
- Target: 3–4x coverage for a quarter to close
- If coverage is <2x: the problem is top-of-funnel volume, not rep skill
- If coverage is >4x but attainment is low: the problem is deal quality, not volume

---

## Step 3: Skills Gap Matrix

**Map the skills required for each role against current team capability.** This reveals where to coach vs. where to hire.

**Skills to assess per role:**

For AEs:
- Discovery quality (does the rep uncover real pain or surface-level symptoms?)
- Champion building (can the rep identify and develop an internal champion?)
- Multi-threading (does the rep build relationships beyond the single contact?)
- Closing mechanics (does the rep have a clear next-step discipline?)
- CRM hygiene (do their deal records reflect the actual state of the deal?)

For SDRs:
- Prospecting research quality (are they reaching the right person with the right message?)
- Personalization depth (are messages generic or signal-based?)
- Objection handling (can they get past the first "not interested"?)
- Pipeline building consistency (are they building a predictable weekly volume?)

For RevOps:
- CRM architecture knowledge (can they build and maintain the systems?)
- Reporting capability (can they produce the reports leadership actually asks for?)
- Cross-functional alignment (do they bridge sales, marketing, and CS effectively?)
- Process documentation (is everything they've built documented for continuity?)

**Skills gap matrix format:**

| Role | Person | Skill A | Skill B | Skill C | Skill D | Skill E | Overall |
|------|--------|---------|---------|---------|---------|---------|---------|
| | | 1–5 | 1–5 | 1–5 | 1–5 | 1–5 | |

Score interpretation:
- 4–5: Strength — leverage and recognize
- 2–3: Development opportunity — coaching or training within 60 days
- 1: Critical gap — either intensive coaching with clear timeline or replacement consideration

**Assessment methods:**
- Direct observation: join calls, review email sequences, review CRM records — not self-reported scores
- Output review: pipeline data, conversion rates by stage, CRM field completeness
- Peer and manager input: where do people naturally go for help? Who is sought out vs. avoided?

---

## Step 4: Capacity Model

**Capacity planning answers: can the current team hit the revenue target?**

**Revenue capacity formula:**

```
Effective capacity = Number of reps × Attainment-adjusted productivity
Attainment-adjusted productivity = Quota per rep × Historical attainment %

Example:
3 AEs × €600K quota × 75% attainment = €1.35M effective capacity per quarter
If quarterly revenue target is €1.2M → capacity is sufficient (but tight)
If quarterly revenue target is €1.8M → capacity gap of €450K → need 1 additional AE
```

**Ramp time impact:**
- A new AE hired today typically reaches full productivity in 3–6 months
- Factor partial productivity during ramp: a rep hired in January at 3-month ramp contributes at 0% in Q1, 50% in Q2, 100% in Q3
- If you need revenue in Q3, the hiring decision must happen in Q1

**Attrition modeling:**
- B2B sales attrition average: 25–35% annually
- Every rep who leaves creates a productivity gap: departing rep's declining output + replacement rep's ramp time
- At 30% attrition, 2 of 6 reps will leave this year — factor their replacement ramp into the capacity model

---

## Step 5: Cross-Functional Alignment Assessment

**Where handoffs break is where revenue leaks.** The three most common breakpoints:

**Marketing → SDR:**
- Question: Do SDRs consider MQLs worth working? If <70% of MQLs are worked within 12 hours, there's a trust gap — either the MQL definition is wrong, or SDRs have learned the leads are low quality.
- Diagnostic: Interview 3 SDRs. Ask: "What % of the MQLs you receive are worth the time to follow up on?" If the answer is below 50%, marketing and SDR definitions of quality are misaligned.

**SDR → AE:**
- Question: Do AEs consider SDR-sourced meetings worth attending? If AEs are not following up on SDR-booked meetings or are canceling them at high rates, there's a pipeline quality problem upstream.
- Diagnostic: Track AE show-up rate for SDR-booked meetings. Target >85%.

**AE → CS:**
- Question: Does CS receive a meaningful handoff? If CS managers say they're inheriting accounts cold, deal context is being lost — and time-to-value and retention will suffer.
- Diagnostic: Review 5 handoff documents from the last quarter. Do they contain the champion's name, stated success criteria, and any known risks?

---

## Step 6: Action Plan

**Format your findings into a 30/60/90-day action plan with clear owners.**

| Priority | Issue | Root cause | Action | Owner | Timeline |
|----------|-------|-----------|--------|-------|---------|
| P1 | [e.g., AE quota attainment at 35%] | [e.g., pipeline coverage ratio 1.8x] | [e.g., Increase SDR outbound volume + add inbound MQL capacity from demand gen] | Head of Sales + Marketing | 30 days |
| P1 | | | | | |
| P2 | | | | | |

**Prioritization framework:**
- P1: Fixes that unlock revenue in the current quarter (pipeline gap, immediate role clarity issues)
- P2: Fixes that build capacit