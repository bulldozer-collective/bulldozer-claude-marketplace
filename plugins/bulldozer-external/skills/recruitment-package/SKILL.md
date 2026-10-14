---
name: |-
  recruitment-package
description: |-
  Build a complete recruitment package for a GTM or ops hire — role scorecard, job description (200–350 words), structured interview kit with stage-specific questions and scoring rubrics, offer decision framework, and 30/60/90-day onboarding plan. Triggers on 'recruitment package,' 'job description,' 'interview kit,' 'hiring for,' 'write a JD,' 'scorecard for,' 'we're hiring a,' or 'how should we interview for.' For org design context, see org-design-hiring-roadmap. For headcount planning, see budget-resources-planning.
when-to-use: |-
  Build a complete recruitment package for a GTM or ops hire — role scorecard, job description (200–350 words), structured interview kit with stage-specific questions and scoring rubrics, offer decision framework, and 30/60/90-day onboarding plan. Triggers on 'recruitment package,' 'job description,' 'interview kit,' 'hiring for,' 'write a JD,' 'scorecard for,' 'we're hiring a,' or 'how should we interview for.' For org design context, see org-design-hiring-roadmap. For headcount planning, see budget-resources-planning.
argument-hint: |-
  Hiring a mid-market AE for a Series B SaaS company. €700K quota, 3–6 month sales cycle, HubSpot, 5-stage pipeline. ICP is RevOps and Head of Sales at 100–500 person companies. Looking for someone who can run a full cycle and multi-thread.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Recruitment Package

> This is a Bulldozer skill. Most job descriptions are written for candidates who already want to work at the company. A strong JD is written for the candidate you haven't convinced yet — it answers their questions before they ask them, shows them what "good" looks like in this role, and makes them curious enough to apply. And the interview process is designed to evaluate what actually predicts success in the role — not how well someone interviews.

You are a Bulldozer operator building a complete recruitment package. Your job is to define the role outcome, write a tight job description, design a structured interview process with scoring rubrics, produce the offer decision framework, and draft the 30/60/90-day onboarding plan.

## Input

`$ARGUMENTS` — role title and function, seniority level, key outcomes the hire is responsible for, ICP the hire will work with (if customer-facing), team they'll join, compensation range (base + variable or total comp). If not provided, read available context files. Ask once if role title and key outcomes are completely absent.

**If working inside a Bulldozer project, check before asking.** `bdzListProjectTeams` then `bdzGetProjectTeam` / `bdzListProjectTeamMembers` show whether the team this hire joins is already registered — current headcount and job titles on that team. Use that to fill "Team" instead of asking the user to describe a roster already on record. **Neither call returns a reporting line** — `bdzGetProjectTeam` returns only the team's id and name, and member records have no manager field — so still ask who this role reports to. If no team is registered, or this is the first hire in the function, say so explicitly — it changes Section 3 and Section 5 below (no peer to shadow, no coverage ratio to inherit).

All four of these team tools — `bdzListProjectTeams`, `bdzGetProjectTeam`, `bdzListProjectTeamMembers`, and `bdzCreateProjectTeamMember` below — take a third required parameter beyond the usual `customerId`/`projectId` headers: `targetProjectId`. Omit it and the call fails outright — pass the project's own id there too when wiring this check.

## Output

A `recruitment-package-{role}-{company}.md` file with: role scorecard, job description (publish-ready), 4-stage interview kit with questions and scoring rubrics, offer decision criteria, and 30/60/90-day onboarding plan.

**Produce on first invocation. Write the scorecard before the JD — the scorecard defines what success looks like, and the JD is a marketing expression of that definition.**

---

## When Not to Open the Search

Building this package is real work — for you and for every candidate who applies. Three checks before the JD goes live, not after:

- **Headcount is approved, not "should be soon."** A scorecard and a live posting for a role still waiting on budget sign-off produces two bad outcomes at once: candidates get run through a real process for a role that stalls, and the hiring manager anchors on a spec the org doesn't need yet. If approval is pending, draft the scorecard now and hold the JD — don't publish on the assumption that sign-off will catch up.
- **Test internal before external.** The strongest candidate for a role is often already inside the company — closer to the product, cheaper to ramp, and a known quantity on the traits an interview can't fully see. Opening a full external search without first asking whether someone internal could grow into this with a stretch and real support isn't rigor, it's a default. The exception is a role that genuinely needs an outside perspective the team doesn't have — the first specialist hire in a function, or a discipline nobody internal has practiced. Say that explicitly rather than skipping the check silently.
- **The role has to be stable before the scorecard is.** Writing a scorecard for a role in the middle of a reorg, or one whose reporting line hasn't been decided, produces a spec that's stale before the first interview happens. If the team structure isn't settled yet, fix that first — see `org-design-hiring-roadmap`.

---

## Section 1: Role Scorecard

**The scorecard is the source of truth for the hire.** It answers: why does this role exist, what does success look like in 90 days, and what hard skills and traits will we evaluate?

The full role scorecard template (mission, 90-day and 12-month success, required skills, core traits, disqualifying flags) is in `references/scorecard-and-jd-templates.md` (section "Section 1"); copy it and fill it in before writing the JD.

**If you're reaching for a sixth must-have, stop.** A sixth requirement is rarely a stricter bar — it's usually two roles merged into one. Split the scope (this hire owns outbound; a second hire or a specialist covers the rest) instead of writing a spec that filters out the person already doing an adjacent job well. Whoever ends up in this role will almost never tick every box on paper — including, often, the best person doing an equivalent job today.

---

## Section 2: Job Description

**200–350 words. Longer JDs reduce application rate without improving quality.** The JD is not the scorecard — it's the marketing version of the scorecard. Postings keep getting longer, not shorter: Indeed's hiring-trends data shows posting word counts up 14.3% from 2021 to 2025, and Greenhouse reports average character count up 7.4% (2022–2026) with sections per listing up nearly 14% — both platforms' own aggregate data, not an independent audit, but pointing the same way, partly driven by AI drafting tools padding out old templates. One vendor's 2026 sample (29,000+ postings on a single ATS) puts the median at 412 words — directional, not a market benchmark, since it's one platform's customer base. A disciplined 200–350 words stands out more now than it used to, not less.

The full job description template (company line, what you'll do, what we're looking for, what we offer, process) is in `references/scorecard-and-jd-templates.md` (section "Section 2"); copy it and fill it in.

**Job description rules:**
- Never write "strong communicator," "team player," or "fast-paced environment" — these are meaningless to a strong candidate and signal an unfocused hiring process
- State compensation. JDs that hide comp ranges get worse candidates who later drop at offer stage
- Describe the interview process — candidates who know what's coming are more likely to complete it
- State your company stage honestly — "we're building the playbook" is more attractive to the right person than overselling a mature process that doesn't exist
- **Writing the JD is not distributing it.** A posting on a job board reaches whoever's browsing; it doesn't reach the person not looking. For a senior or niche GTM role, a personal post from the hiring manager announcing the search (on LinkedIn: `bdzCreateLinkedInPost` publishes to the connected user's own feed, not a company page) plus direct outreach to warm referrals usually surfaces stronger candidates than the board listing alone — treat the board as the floor, not the plan.

---

## Section 3: Interview Kit

**4-stage structured interview process.** Each stage has a specific purpose — don't duplicate assessment across stages. This isn't a style preference: structured interviews with scored rubrics and independent evaluation are, across decades of selection-method research, among the strongest predictors of on-the-job performance — well ahead of unstructured conversation. Skipping the rubric to "just get a feel for them" throws away the part of the process that actually works.

For the four interview stages — recruiter screen, hiring manager screen, skills assessment, panel interview — with their purposes, questions for AE and SDR, pass criteria, exercises and scoring rubrics, read `references/interview-kit.md` when building the interview kit.

---

## Reference Checks

**Run this before the panel finalizes its score, not after a verbal offer is already out.** A reference check that happens after you've told the candidate "we want to move forward" is a formality, not a check — nobody walks it back at that point.

- **Structure it like the interview, not like a courtesy call.** Same job-relevant questions for every candidate, asked to every reference, scored the same way. Government HR guidance on reference checking (U.S. OPM, CalHR) is consistent on this: structuring the process — same questions, same rating scale, tied to the actual job — is what makes a reference check add real signal instead of noise.
- **A candidate-supplied reference is a favorable sample, not a representative one** — nobody hands you the manager who'd give a lukewarm answer. Common practitioner workaround, useful but not a proven-research technique: ask each reference for the name of one more person who worked closely with the candidate, and call that person too. One extra call, and a name the candidate didn't pre-select.
- **Never contact someone not on the candidate's list without telling them first.** A "backdoor" check to an unlisted former manager might feel like sharper signal, but it trades real trust — with the candidate, and with your own name in a market where people talk — for a check you could get more honestly by asking for one more name instead.
- **France: written consent before you call anyone.** Practitioner-legal sources point to the Code du travail's finality and information-duty principles (commonly cited as Art. L.1221-6, L.1221-8, L.1221-9, though at least one source notes no article is written specifically for "reference checking" — none of this checked against Légifrance directly) plus GDPR: get consent before you call, questions kept job-relevant. Build the consent ask into the process itself, at Stage 1 or the offer step, rather than improvising it once you already have a name to check.

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

**Compensation offer:** Offer-acceptance benchmarks have moved a lot and vary widely by segment and market conditions — a single fixed percentage isn't a reliable bar to hire against. Track your own acceptance rate over your last several offers instead: a rate that drops well below your own recent average signals the process is too slow (candidate got another offer) or the EVP isn't landing, regardless of what a published "typical" number says this quarter. Move within 48 hours of Stage 4. Comp transparency in Stage 1 prevents offer-stage surprises.

**If a counter-offer appears, that's information you should have surfaced earlier, not a battle to win at the finish line.** The number that circulates in recruiting content — "most people who accept a counter-offer leave within a year anyway" — doesn't trace to any real, methodologically named study once you look for one; treat it as recruiting folklore, never quote it to a candidate as a fact. What's worth doing instead: ask directly, before the offer stage, what would make them stay where they are — if there's a real answer, you want to hear it in week two of the process, not the day they're supposed to sign. If a counter-offer still lands after that conversation happened, it's a signal that Stage 1 (motivation check) or the hiring manager screen missed something, not just a comp problem to out-bid.

---

## Section 5: 30/60/90-Day Onboarding Plan

**High first-year attrition signals onboarding failure, not a bad hire.** The 30/60/90 plan sets expectations before day 1 — the candidate sees it during the offer process so there are no surprises.

The full 30/60/90-day onboarding plan (goals, milestones and day-30, day-60 and day-90 checks) is in `references/onboarding-plan.md`; read it and adapt it to the role when writing Section 5.

**Once the offer is signed, close the loop in the project record.** If working inside a Bulldozer project, register the new hire with `bdzCreateProjectTeamMember` (job title, experience level, time allocation) against the team from the Input step — that's the same roster `team-assessment`, `org-design-hiring-roadmap`, and `budget-resources-planning` read from, so the org picture stays current instead of drifting from what actually got hired.

---

## Rules

- **Write the scorecard before the JD, and never skip it under deadline pressure.** A JD written without a scorecard invents criteria on the fly during interviews — every interviewer ends up scoring something different.
- **Never lower the offer threshold to fill an open seat.** A role open for three months feels expensive; a wrong hire who leaves in nine feels worse, and normalizes lowering the bar again next time.
- **The onboarding plan is a pre-close artifact, not a post-hire one.** Show it during the offer process, not after signature — surprises about what the first 90 days actually looks like show up as early attrition.
- **One clear disqualifying flag outweighs five bullet points of promise.** A structural gap — no evidence of outbound, no multi-threading, comp expectations that don't align — predicts failure better than a strong overall impression does.
- **Trace first-year attrition back to the stage that missed it.** If a hire fails, find out which interview stage should have caught it, or which 30/60/90 checkpoint should have flagged it early — "bad hire" without that diagnosis just repeats the same miss on the next one.
- **Never borrow a benchmark from a team that doesn't exist yet.** A coverage ratio, a shadowing plan, or a "typical" acceptance rate all assume history this hire doesn't have if they're the first in the function — set the number explicitly for this case instead of copying one that belongs to a team already at scale.
- **Don't open the search before the headcount, internal-candidate, and role-stability checks pass.** A live posting for a role that isn't real yet, or a role no one internal was ever seriously considered for, costs candidates' time and your employer brand — not just the hours spent writing the JD.
- **A reference check after the offer is already out is theater, not diligence.** It has to happen before the panel's score is final, while a bad answer can still change the decision — and a candidate-supplied reference is a favorable sample by construction, not a neutral one.