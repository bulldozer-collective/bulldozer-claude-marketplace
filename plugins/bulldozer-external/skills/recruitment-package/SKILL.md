---
name: |
  recruitment-package
description: |
  Build a complete recruitment package for a GTM or ops hire — role scorecard, job description (200–350 words), structured interview kit with stage-specific questions and scoring rubrics, offer decision framework, and 30/60/90-day onboarding plan. Triggers on 'recruitment package,' 'job description,' 'interview kit,' 'hiring for,' 'write a JD,' 'scorecard for,' 'we're hiring a,' or 'how should we interview for.' For org design context, see org-design-hiring-roadmap. For headcount planning, see budget-resources-planning.
when-to-use: |
  Build a complete recruitment package for a GTM or ops hire — role scorecard, job description (200–350 words), structured interview kit with stage-specific questions and scoring rubrics, offer decision framework, and 30/60/90-day onboarding plan. Triggers on 'recruitment package,' 'job description,' 'interview kit,' 'hiring for,' 'write a JD,' 'scorecard for,' 'we're hiring a,' or 'how should we interview for.' For org design context, see org-design-hiring-roadmap. For headcount planning, see budget-resources-planning.
argument-hint: |
  Hiring a mid-market AE for a Series B SaaS company. €700K quota, 3–6 month sales cycle, HubSpot, 5-stage pipeline. ICP is RevOps and Head of Sales at 100–500 person companies. Looking for someone who can run a full cycle and multi-thread.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |
  high
---

# Recruitment Package

> This is a Bulldozer skill. Most job descriptions are written for candidates who already want to work at the company. A strong JD is written for the candidate you haven't convinced yet — it answers their questions before they ask them, shows them what "good" looks like in this role, and makes them curious enough to apply. And the interview process is designed to evaluate what actually predicts success in the role — not how well someone interviews.

You are a Bulldozer operator building a complete recruitment package. Your job is to define the role outcome, write a tight job description, design a structured interview process with scoring rubrics, produce the offer decision framework, and draft the 30/60/90-day onboarding plan.

## Input

`$ARGUMENTS` — role title and function, seniority level, key outcomes the hire is responsible for, ICP the hire will work with (if customer-facing), team they'll join, compensation range (base + variable or total comp). If not provided, read available context files. Ask once if role title and key outcomes are completely absent.

## Output

A `recruitment-package-{role}-{company}.md` file with: role scorecard, job description (publish-ready), 4-stage interview kit with questions and scoring rubrics, offer decision criteria, and 30/60/90-day onboarding plan.

**Produce on first invocation. Write the scorecard before the JD — the scorecard defines what success looks like, and the JD is a marketing expression of that definition.**

---

## Section 1: Role Scorecard

**The scorecard is the source of truth for the hire.** It answers: why does this role exist, what does success look like in 90 days, and what hard skills and traits will we evaluate?

```
Role: [Title]
Reporting to: [Manager title]
Team: [Team name]
Quota / Primary metric: [if quota-carrying: quota amount; if not: primary KPI]

Mission (one sentence):
[Why this role exists — what changes in the company because this person is here]

Success in 90 days:
- [Specific, measurable outcome expected in first 90 days]
- [Second outcome]
- [Third outcome]

Success in 12 months:
- [Primary metric target]
- [Qualitative outcome — relationships built, systems created, market established]

Required skills (max 5 — each additional must-have reduces qualified applicants by ~20%):
1. [Skill — be specific: "5+ years running full-cycle B2B SaaS deals at €100K+ ACV"]
2. [Skill]
3. [Skill]
4. [Skill]
5. [Skill]

Core traits:
- [Trait 1: e.g., "Multi-threader — builds relationships across buying committee, not just the champion"]
- [Trait 2]
- [Trait 3]

Disqualifying flags:
- [Behavior that would immediately disqualify: e.g., "Relies exclusively on warm inbound; no evidence of outbound pipeline building"]
- [Flag 2]
```

---

## Section 2: Job Description

**200–350 words. Longer JDs reduce application rate without improving quality.** The JD is not the scorecard — it's the marketing version of the scorecard.

```
[Job Title] — [Company Name]

[Company name] is [one sentence: what you do, for whom, and your current stage — €X ARR, Series X, growing X]. 

We're hiring a [Job Title] to [one sentence on what this person will own and the impact it has].

**What you'll do:**
- [Outcome 1 — written as what they produce, not what they do daily]
- [Outcome 2]
- [Outcome 3]
- [Outcome 4]

**What we're looking for:**
- [Must-have 1 — specific and verifiable, not "strong communicator"]
- [Must-have 2]
- [Must-have 3]
- [Nice-to-have — labeled explicitly as "nice to have, not required"]

**What we offer:**
- [Compensation: base €X, OTE €X (if applicable) — transparency reduces time-to-close on offers]
- [Equity — be specific or skip it; "competitive equity" is meaningless]
- [1–2 specific benefits that are genuinely differentiating — not "casual Fridays"]

**Process:**
[Recruiter screen → Hiring manager interview → Skills assessment → Panel interview → Offer] — we move fast; typical process: 2–3 weeks.
```

**Job description rules:**
- Never write "strong communicator," "team player," or "fast-paced environment" — these are meaningless to a strong candidate and signal an unfocused hiring process
- State compensation. JDs that hide comp ranges get worse candidates who later drop at offer stage
- Describe the interview process — candidates who know what's coming are more likely to complete it
- State your company stage honestly — "we're building the playbook" is more attractive to the right person than overselling a mature process that doesn't exist

---

## Section 3: Interview Kit

**4-stage structured interview process.** Each stage has a specific purpose — don't duplicate assessment across stages.

### Stage 1: Recruiter Screen (30 minutes)
**Purpose:** Verify logistics, confirm motivation, set expectations

Questions:
1. "What prompted you to look at this role right now?" → Listen for specificity; vague answers signal low conviction
2. "Walk me through your current OTE and what you're looking for — any hard floors?" → Surface compensation misalignment early
3. "What does your current / most recent sales process look like from first touch to close?" → Verify deal size, cycle, and motion match
4. "What do you know about us? What questions do you have?" → Preparation signals interest level

Pass criteria: Compensation aligned, motion compatible with ours, genuine interest demonstrated

### Stage 2: Hiring Manager Screen (45–60 minutes)
**Purpose:** Evaluate core competence and motivation depth

Questions for AE:
1. "Tell me about your most complex deal in the last 12 months — who were the stakeholders, how did you build consensus, and what made it hard?" → Evaluates multi-threading and deal complexity
2. "Walk me through a deal you lost. What did you learn and what would you do differently?" → Evaluates self-awareness and learning orientation
3. "How do you manage a deal when your champion goes quiet?" → Evaluates proactivity and pipeline management
4. "What does your prospecting routine look like on a typical week?" → Evaluates outbound discipline (not just inbound-dependence)

Questions for SDR:
1. "Show me an outbound email you sent recently that got a positive reply. What was the signal, and why did you personalize it that way?" → Evaluates signal literacy and message quality
2. "Walk me through how you handle 'send me more information' as a response." → Evaluates objection handling in practice
3. "How do you prioritize which accounts to work on a given week?" → Evaluates strategic thinking vs. task execution

Scoring rubric (1–5 per dimension, minimum 4/5 to advance):
- Relevant experience depth: ____
- Deal complexity match: ____
- Self-awareness: ____
- Motivation for this role specifically: ____

### Stage 3: Skills Assessment (60–90 minutes)
**Purpose:** Observe them actually doing the work, not describing it

For AEs — Discovery call roleplay:
- Assessor plays the prospect (give them a profile brief in advance: company, role, vague pain)
- AE runs a 30-minute discovery call
- Evaluate: Does the rep uncover actual pain or accept surface symptoms? Do they qualify budget and authority? Do they secure a next step with a specific date?

For SDRs — Prospecting exercise:
- Give them a target account and persona 24 hours in advance
- Ask them to produce: a 1-paragraph account research summary, a personalized cold email, and a LinkedIn message
- Evaluate: signal quality, message relevance, personalization depth, CTA specificity

Scoring rubric (1–5):
- Discovery quality (for AE) or research quality (for SDR): ____
- Question sequencing and listening: ____
- Objection response: ____
- Next step discipline: ____

### Stage 4: Panel Interview (60 minutes)
**Purpose:** Cross-functional culture and values fit; independent evaluator scoring

Panel composition: 1 peer (same function), 1 cross-functional stakeholder, 1 future skip-level
Independent scoring before debrief — aggregate scores, then discuss. If a panelist cannot give a specific reason for a concern, it doesn't count.

Questions:
1. "Tell me about a time you pushed back on a decision made by your manager or team. How did you handle it?" → Evaluates confidence and professional courage
2. "What's a process or way of working you've introduced at a previous company that made the team better?" → Evaluates builder mentality
3. "What kind of manager do you do your best work with, and what kind of management style brings out the worst in you?" → Evaluates self-awareness and alignment with your manager's style

---

## Section 4: Offer Decision Framework

**Make the hire/no-hire decision before the offer call.** Verbal offer calls are not the time to debate. Finalize the decision with the panel before the call.

**Offer decision criteria:**

| Criterion | Score (1–5) | Weight | Weighted |
|-----------|------------|--------|---------|
| Core competence (Stage 2 + 3 scores) | | 40% | |
| Motivation and conviction for this specific role | | 25% | |
| Cross-functional fit (Stage 4 panel score) | | 20% | |
| Trajectory and growth potential | | 15% | |
| **Total** | | 100% | |

Threshold to hire: weighted score ≥ 3.8 / 5.0
Threshold for "strong hire" (fast-track offer): ≥ 4.2 / 5.0
Below 3.5: decline — do not adjust criteria downward to fill the seat

**Compensation offer:** Offer acceptance rate below 70% indicates the process is too slow (candidate got another offer) or the EVP isn't landing. Move within 48 hours of Stage 4. Comp transparency in Stage 1 prevents offer-stage surprises.

---

## Section 5: 30/60/90-Day Onboarding Plan

**High first-year attrition signals onboarding failure, not a bad hire.** The 30/60/90 plan sets expectations before day 1 — the candidate sees it during the offer process so there are no surprises.

```
30 Days — Learn
Goal: Understand the product, the ICP, the sales process, and the tools
Milestones:
- Complete product demo certification (can demo independently by day 15)
- Shadow 5 discovery calls with senior AE / quota-carrying peer
- Complete CRM trai