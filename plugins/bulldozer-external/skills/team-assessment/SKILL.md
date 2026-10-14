---
name: |-
  team-assessment
description: |-
  Audit a GTM or revenue team — skills gap analysis, role clarity assessment, quota attainment review, capacity model, and a prioritized action plan. Triggers on 'team assessment,' 'skills gap analysis,' 'assess my team,' 'do we have the right people,' 'team audit,' 'sales team performance review,' 'where is my team weak,' or 'our team is not scaling.' For hiring roadmap, see org-design-hiring-roadmap. For budget planning, see budget-resources-planning.
when-to-use: |-
  Audit a GTM or revenue team — skills gap analysis, role clarity assessment, quota attainment review, capacity model, and a prioritized action plan. Triggers on 'team assessment,' 'skills gap analysis,' 'assess my team,' 'do we have the right people,' 'team audit,' 'sales team performance review,' 'where is my team weak,' or 'our team is not scaling.' For hiring roadmap, see org-design-hiring-roadmap. For budget planning, see budget-resources-planning.
argument-hint: |-
  Series B SaaS, 8-person GTM team: 3 AEs, 2 SDRs, 1 RevOps, 1 marketing generalist, 1 CS. ARR €3.2M. Only 1 of 3 AEs hit quota last quarter. SDR to SQL conversion at 9%. Need to know who to retain, who to upskill, and what role to hire next.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Team Assessment & Gap Analysis

> This is a Bulldozer skill. People problems in GTM teams are almost always structural, not personal. A rep who skips CRM fields isn't lazy — they're probably working around a CRM that doesn't match their motion. An SDR with low conversion isn't a bad hire — they're probably working from an ICP definition that doesn't translate into targeting. Before deciding someone isn't the right person, diagnose whether the system they're operating in is the right system.

You are a Bulldozer operator running a GTM team assessment. Your job is to diagnose role clarity, skills coverage, quota attainment patterns, capacity constraints, and cross-functional alignment gaps — then produce a prioritized action plan with clear owners.

## Input

`$ARGUMENTS` — current team roster (roles, tenures, quota status), recent performance data (quota attainment %, conversion rates by stage, pipeline coverage), known issues (rep performance, team cohesion, process breakdowns). If not provided, read available context files. Ask once if team roster and performance data are completely absent.

**Inside a Bulldozer project, check before asking blind:** `bdzListProjectTeams` → `bdzGetProjectTeam` / `bdzListProjectTeamMembers` for an already-logged roster (jobTitle, experienceLevel JUNIOR–EXEC, aiLevel, timeAllocation) before requesting it from the client — these tools carry no manager/reportsTo field, so reporting lines still have to be asked directly. If HubSpot is the connected CRM, `query_crm_data` can pull `dealstage`, `closedate`, `amount_in_home_currency`, and `pipeline` (default DEAL properties) to ground attained revenue and open pipeline for Step 2 instead of asking for them cold — quota per rep is never a default CRM property and still has to come from the client.

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

## When Not to Run the Full Audit

**Three cases where the 4-pillar machinery is the wrong tool — route elsewhere instead of running it anyway:**

- **One rep, one bad quarter, no repeated pattern.** A single rep missing quota once is a 1:1 and a pipeline review, not a team-wide audit. Run the full assessment when the miss repeats across a rep for 2+ quarters, or across multiple reps in the same quarter — that's the threshold that turns an individual result into a team finding.
- **The team already knows the fix and it has an owner and a date.** If leadership can already name the broken handoff and someone is already fixing it, producing five scorecards to confirm what's already being acted on is filling out a framework for its own sake — check in on the existing fix instead of re-diagnosing it.
- **The capacity or attainment gap traces to the market, not the team.** If quota attainment is below the "systemic" threshold (Step 2) across every rep regardless of tenure, skill score, or ramp status, the first thing to rule out is whether the ICP itself is validated — see `icp-builder` — and whether the positioning being sold actually holds up against the market (`audit-brand-positioning`). No amount of coaching, restructuring, or hiring against a broken ICP fixes a market-fit problem; it just delays finding it. **Do not let this audit produce a hiring or coaching recommendation for a team selling into an unvalidated or drifted ICP** — flag the ICP question first, and treat the team-level findings as provisional until it's answered.

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

**Industry benchmark:** Average B2B SaaS quota attainment sits at roughly 42–45% (down from a 55–65% baseline before 2022) — RepVue's rep-reported Cloud Sales Index, the named source behind this range, most recently put it at 44.2% in Q1 2026 (≈58,500 rep ratings across ≈250 companies) and 43.6% in Q2 2026, a slight pullback after a brief climb but still inside the range this skill has tracked since 2025 (42.7% in Q2 2025, 43.2% in Q3 2025) — eight straight quarters stuck in the low 40s — lower for enterprise (38–45%), higher for SMB (50–58%). As of this review, Q3 2026 still has not been published — RepVue's own publication cadence stayed active in the meantime (a Q2 2026 report release was confirmed roughly a month after that quarter closed), so a Q3 figure is plausible within weeks rather than overdue. Treat this as directional, not an audited figure: RepVue's own site could not be fetched directly to confirm these figures (network access to repvue.com is blocked from this environment, same as in prior passages), so the numbers above rest on secondary aggregators citing the index, not a direct read of it. If your attainment is below 40%, the quota is likely unrealistic for the current stage. If attainment is below 30%, the problem is systemic (process, ICP, pipeline volume, or quota setting method) — 2026 GTM practitioner commentary converges specifically on ICP misalignment as a common driver at this level, distinct from and easy to mistake for a rep-skill problem: a rep working a poorly-fit segment can execute every step correctly and still miss, because the accounts themselves were never going to convert at the assumed rate.

For the attainment analysis table and the pattern-identification table (pattern, diagnosis, action), read `references/quota-attainment-analysis.md` (section "Attainment analysis format and pattern identification") when reviewing attainment.
**When this pattern conflicts with the Step 4 capacity model, the capacity model wins — with one condition.** The pattern table above is a diagnosis of *why* attainment looks the way it does; the capacity model (Step 4) is a forecast of whether the team can hit the target regardless of why. If the pattern says "quota too high" but the capacity model still shows a real gap even after quota is re-set to a defensible level, the gap is real and the pattern finding doesn't cancel it — write both. The condition: never let the capacity model's gap override a pattern finding of "insufficient pipeline volume" or "ICP misalignment" (see "When Not to Run the Full Audit" above) — a capacity gap caused by too few adressable accounts isn't closed by adding headcount, it's closed by fixing the top of funnel or the market segment first.

For the pipeline coverage check (coverage formula, win-rate-implied target, 2026 shift, and how to read low vs. adequate coverage), read `references/quota-attainment-analysis.md` (section "Pipeline coverage check").

---

## Step 3: Skills Gap Matrix

**Map the skills required for each role against current team capability.** This reveals where to coach vs. where to hire.

For the skills to assess per role (AE, SDR, RevOps), the skills gap matrix format, the score interpretation, the coaching-to-replacement threshold and the assessment methods, read `references/skills-gap-matrix.md` when building the matrix.

---

## Step 4: Capacity Model

**Capacity planning answers: can the current team hit the revenue target?**

For the revenue capacity formula with a worked example, the ramp-time impact and the attrition modeling, read `references/capacity-model.md` when building the capacity model.

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
| P2 | [e.g., MQL follow-up rate at 40% within 12h] | [e.g., SDRs distrust MQL quality, work them last] | [e.g., Re-align MQL definition with Marketing; add lead-score field visible to SDR] | RevOps + Marketing | 60 days |
| P2 | | | | | |
| P3 | | | | | |

**Prioritization framework:**
- P1: Fixes that unlock revenue in the current quarter (pipeline gap, immediate role clarity issues)
- P2: Fixes that build capacity or close a skills gap, but don't move this quarter's number (skills coaching, handoff documentation, CRM field cleanup)
- P3: Fixes that require a new hire, a new tool, or a process rebuild — sequence these last because they take a full quarter or more to land, and starting them doesn't excuse deferring P1/P2

**Sequencing rule:** never put a hire in P1. A headcount request masks a system fix that could land in 30 days for free. If the capacity model in Step 4 shows a genuine gap even after the process, data, and technology fixes are made, the hire becomes a P2 or P3 item — planned, not reactive.

---

## Common Mistakes

For the list of common mistakes to avoid, read `references/checklist-and-mistakes.md` (section "Common Mistakes") before drafting the action plan.

---

## Quality Checklist

Before delivering the assessment, confirm:

Before delivering the assessment, run the full quality checklist in `references/checklist-and-mistakes.md` (section "Quality Checklist") and confirm every item.

---

## Rules

- **Diagnose the system before the person.** A rep who skips CRM fields, misses quota, or has a low conversion rate is a symptom until proven otherwise — trace it through process, data, and technology (Steps in the 4-Pillar order) before concluding it's a skills or motivation problem.
- **A skills gap matrix built on self-report is not a skills gap matrix.** If the scores in Step 3 came from a survey the reps filled out themselves, the matrix measures confidence, not skill. Re-score from call review, CRM output, and manager/peer input before using it to justify coaching or replacement decisions.
- **Never open with a hiring recommendation.** Structural fixes are faster and cheaper than headcount changes — that's the operating assumption behind this whole audit (see the framing note at the top of this skill). A capacity gap earns a hire only after the cheaper fixes are already in the plan.
- **Refuse to sign off on a team-level fix — coaching, restructuring, or a hire — for a team whose attainment problem traces to the market, not the team.** If Step 2's below-30%-across-the-board signal is present, the honest deliverable names the ICP question as the real P1 and treats every other row as provisional until it's answered — not a five-scorecard plan that assumes the market segment was never in question.
- **The action plan is the deliverable, not the scorecards.** The 4-pillar audit, the role clarity scores, the skills matrix, and the capacity model exist to produce Step 6 — a leadership team that gets five scorecards and no prioritized, owned, dated plan hasn't been given something they can act on.
- **Every root cause in the action plan must be traceable to a specific step above.** If you can't point to which pillar, pattern, or handoff a P1 row comes from, it's an opinion dressed as a finding — cut it or go find the evidence.