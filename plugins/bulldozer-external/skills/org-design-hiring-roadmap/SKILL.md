---
name: |-
  org-design-hiring-roadmap
description: |-
  Design the GTM org structure and sequence the hiring roadmap — role prioritization by revenue impact, headcount model by ARR milestone, hiring sequence logic, reporting lines, and span-of-control standards. Triggers on 'org design,' 'hiring roadmap,' 'who should I hire next,' 'GTM team structure,' 'hiring plan,' 'building out my team,' 'sales org chart,' or 'how do I scale my GTM team.' For team performance audit, see team-assessment. For budget and headcount planning, see budget-resources-planning.
when-to-use: |-
  Design the GTM org structure and sequence the hiring roadmap — role prioritization by revenue impact, headcount model by ARR milestone, hiring sequence logic, reporting lines, and span-of-control standards. Triggers on 'org design,' 'hiring roadmap,' 'who should I hire next,' 'GTM team structure,' 'hiring plan,' 'building out my team,' 'sales org chart,' or 'how do I scale my GTM team.' For team performance audit, see team-assessment. For budget and headcount planning, see budget-resources-planning.
argument-hint: |-
  Series A, €2.4M ARR. Founder-led sales closing, 1 AE hired 3 months ago hitting quota. 12-month target: €5M ARR. Budget for 4 GTM hires. Need to know who to hire, in what order, and what the org looks like at €5M.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Org Design & Hiring Roadmap

> This is a Bulldozer skill. The most expensive sales hiring mistake is bringing in a VP of Sales before having 2 reps hitting quota. The second most expensive is hiring SDRs before validating that the AE can close what they book. The sequence of GTM hiring matters as much as the hires themselves. Getting the order wrong means the hires can't succeed — because the foundation they need doesn't exist yet.

You are a Bulldozer operator designing a GTM org structure and hiring roadmap. Your job is to select the right roles to add, sequence hires based on the current bottleneck, set headcount targets by ARR milestone, and produce reporting line and span-of-control standards.

## Input

`$ARGUMENTS` — current ARR, current GTM team roster, 12-month ARR target, budget for GTM hiring (headcount count or budget €), primary sales motion (sales-led / product-led / founder-led), known bottleneck (pipeline volume / closing / process / CS). If not provided, read available context files. Ask once if ARR and target are completely absent.

**Working inside a Bulldozer project:** `bdzListProjectTeams` → `bdzListProjectTeamMembers` returns the current roster (job title, experience level Junior/Medior/Senior/Lead/Exec, AI-adoption level, time allocation, LinkedIn profile URL) — use it to ground "current GTM team roster" instead of asking blind. It does not carry a manager/reports-to field, and there's no notion of hierarchy between teams either: it cannot tell you who a hire would report to or how many direct reports a manager already has. Reporting lines and onboarding capacity (Step 4, Step 5) still have to come from the client directly.

Same discipline for the "12-month ARR target": check `bdzGetProjectObjectives` (type `PROJECT_OBJECTIVE_TYPE_TARGETS`) before asking blind — but don't treat a 404 as a fixed property of the project. Bulldozer's own internal project returned a bare 404 on this objective type on one pass and came back populated a week later with nobody noting a change; re-confirmed still populated on this pass (a short free string, e.g. "500k arr" — never a structured amount-plus-date). A 404 means "nothing recorded as of this call," not "this project has no target" — check it live each time rather than reusing a prior pass's result. When it *is* filled in, still say the number back to the client before building a roadmap on it: the field carries no timeframe of its own, so a populated answer still needs the client to confirm it actually means 12 months out — and a target logged three quarters ago is a stale input dressed up as a verified one.

## Output

A `org-design-hiring-roadmap-{company}.md` file with: hiring sequence decision logic, role-by-role hire rationale, headcount model by ARR milestone, target org chart (current → 12 months), reporting lines, span-of-control standards, and a quarterly hiring calendar.

**Produce on first invocation. Start with the bottleneck diagnosis — hiring the wrong role for the bottleneck is the most common org design mistake.**

---

## When Not to Build a Full Roadmap

A hiring sequence is a commitment device. Building one when there's no real decision pending just produces a document nobody follows.

- **No budget for any hire this cycle.** If the honest answer to "budget for GTM hiring" is zero or "maybe next round," the constraint is cash, not sequence — send the client to `budget-resources-planning` first. A roadmap that assumes headcount the company can't fund isn't ambitious, it's fiction, and it will be the first thing questioned when the board asks why the plan didn't happen.
- **Only one role is actually in question.** If the client already knows who they're hiring next and just wants the hire itself validated (title, level, comp), that's `recruitment-package` or `team-assessment`, not a full org redesign. Running Steps 1–6 to justify a decision already made is a framework filled in for its own sake.
- **The bottleneck is already diagnosed and being acted on.** If a req is open for the right role, re-running Step 1 to re-diagnose something the client has already committed to doesn't change the decision — pick up at Step 2 (sequence) or Step 6 (calendar) instead of restarting from the symptom table.

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
1. What is the pipeline coverage ratio? (Target: 3–4x quarter target for a mid-market motion — closer to 1.5–2x for SMB/high-velocity selling, 4–7x+ for enterprise with lower win rates; treat 3–4x as the mid-market default, not a universal number) → If below the relevant target: pipeline bottleneck
2. What is the AE win rate from stage 2 (demo) onward? → If <20%: closing bottleneck
3. Can you produce an accurate forecast? → If no: process/RevOps bottleneck
4. What is your gross revenue retention? → If <80%: CS bottleneck

For the reserve on the 80% gross revenue retention floor, read `references/benchmark-reserves-and-calendar.md` (section Step 1).

**Before recommending a hire for any of the four, name the non-hire alternative and rule it out explicitly.** The instinct is to jump straight to headcount; the honest alternative is almost never a competitor's org chart, it's one of these three:
- **Fix the process, don't add a person.** A broken handoff, an unused CRM field, a forecast nobody trusts — these are process bottleneck symptoms (row 3 of the table above), and the antidote is RevOps hours or a consulting sprint, not a hire. Adding a rep to a process that's already leaking just produces more leaked deals.
- **Rent the capacity before you own it.** Fractional AE, a contract SDR agency, an outsourced CS pod — real options below roughly 3 FTEs of need in a given function, and the only sane option under a burn constraint (see override conditions). Don't skip this option just because a full-time hire feels more "real."
- **Do nothing yet.** If the bottleneck metric moved on its own in the last quarter without a hire (win rate improved after a pricing change, pipeline grew after a campaign), the fix already happened — a hire justified by last quarter's number is solving a problem that's no longer there.

Only once the process fix and the rent-don't-buy option are both ruled out for the specific bottleneck does a full-time hire belong on the calendar.

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

Before quoting the ARR-per-employee benchmarks, read `references/benchmark-reserves-and-calendar.md` (section Step 3) for the reserve on their sources.

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

Org charts reflect the GTM motion, not a conventional template. For the Series A and Series B org charts, the span-of-control standards and the note on what Bulldozer OS holds for this, read `references/org-charts-and-overrides.md` (section Step 4).

---

## Step 5: Override Conditions

The default sequence bends for real conditions, not preference: enterprise ACV, AI SDR / prospecting agents, PLG motion, bootstrapped or burn-constrained company, international expansion. For the override table, read `references/org-charts-and-overrides.md` (section Step 5).

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
| AE (enterprise) | 8–14 weeks | 9–12 months | 12–15 months post-decision |
| VP Sales | 10–16 weeks | 6 months | 8–10 months post-decision |
| RevOps | 6–8 weeks | 1–2 months (process impact) | 2–3 months post-decision |

For the reserve on the time-to-fill and ramp figures and the quarterly hiring calendar template, read `references/benchmark-reserves-and-calendar.md` (section Step 6).

---

## Two Judgment Calls a Roadmap Has to Make

A roadmap has two judgment calls to make explicitly: the signaling hire (a board or investor pushing for a VP Sales to show seriousness) and when to stop the sequence instead of continuing it. For both, read `references/judgment-calls.md`.

---

## Rules

- **Never hire a VP of Sales before 2 AEs are consistently hitting quota.** A VP's job is to scale what works. If nothing has been proven to work, you're paying €250K+ OTE to watch someone rebuild from scratch while the board questions the spend.
- **Hire for the bottleneck, not for the org chart.** An org chart that looks like a best-practice SaaS company is useless if your real problem is pipeline volume and you hired an enablement person instead of an SDR.
- **Time-to-revenue from a hire is longer than you think.** The VP you hire in January won't impact Q1 revenue. They might impact Q3. Build this into your capacity plan and communicate it to the board.
- **SDR before AE only when closing is proven.** If your AEs can't close what SDRs book, adding more SDR-sourced meetings just widens the gap between activity and revenue. Fix the close motion first — enablement, deal review, pricing — then add pipeline volume.
- **The org chart follows the motion, not a template.** Copying a "best-practice SaaS org chart" before the team has reached the ARR stage it assumes adds a management layer the headcount doesn't need yet. Span-of-control standards exist to size managers to reps already hired, not to justify hiring a manager early.
- **The default sequence bends for real conditions, not preference.** Enterprise ACV, a PLG motion, burn constraints, or a new-market entry each change the hiring order for a specific reason — see the override table. Following the default sequence when one of these applies produces a hire who is structurally set up to miss quota, not one who is simply slower to ramp.
- **Revisit the roadmap every quarter, not once a year.** The bottleneck that justified the last hire rarely stays the bottleneck for four quarters straight — pipeline coverage, win rate, and retention should be re-checked against Step 1 before committing to the next hire on the calendar.