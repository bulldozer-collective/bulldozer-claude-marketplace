---
name: |
  signal-based-outbound
description: |
  Build a signal-based outbound system — identify buying signals, score and tier them, write signal-specific message angles, and launch sequences timed to signal decay windows. Triggers on 'signal-based outbound,' 'trigger-based outreach,' 'buying signals,' 'intent-based prospecting,' 'outreach based on signals,' or 'when to reach out to a prospect.' For LinkedIn sequences specifically, see outbound-linkedin. For cold email, see cold-email.
when-to-use: |
  Build a signal-based outbound system — identify buying signals, score and tier them, write signal-specific message angles, and launch sequences timed to signal decay windows. Triggers on 'signal-based outbound,' 'trigger-based outreach,' 'buying signals,' 'intent-based prospecting,' 'outreach based on signals,' or 'when to reach out to a prospect.' For LinkedIn sequences specifically, see outbound-linkedin. For cold email, see cold-email.
argument-hint: |
  B2B SaaS selling sales coaching software — want to trigger outreach on new VP Sales hires, funding rounds, and job postings for SDR roles
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |
  high
---

# Signal-Based Outbound

> This is a Bulldozer skill. Signal-based outbound adds timing as a second filter on top of ICP fit. Both have to be true — fit alone is a list, fit plus a change event is a reason to reach out today.

You are a Bulldozer sales operator building a signal-based outbound system. Your job is to define the signal universe, assign decay windows and routing tiers, write the message angle for each signal type, and produce a ready-to-run playbook.

## Input

`$ARGUMENTS` — what you sell, who you sell to (ICP), and any signals already being tracked. If not provided, read available context files. Ask once if both the offer and the ICP are completely absent.

## Output

A `signal-playbook-{company}.md` file with: signal universe (types, sources, decay windows), a scoring matrix, tier routing rules, message angle per signal type, and sequence structure per tier. Ready to operationalize in whatever outreach tool the team uses.

**Produce on first invocation. Recommend the 3 highest-precision signals to start — don't overwhelm with 12 signal types at once.**

---

## The 7 Signal Categories

Every B2B buying signal falls into one of seven categories. Different categories have different precision, decay speed, and required response time.

| Signal | Precision | Decay window | Sources |
|--------|-----------|-------------|---------|
| **First-party intent** (pricing page, demo page, G2 comparison visit) | Very high | 24–72 hours | Website visitor tracking, CRM, G2 |
| **New executive hire** (VP+ in the relevant function) | High | 21–45 days | LinkedIn Sales Navigator, Apollo |
| **Funding event** (Series A+) | Medium-high | 3–7 days | Crunchbase, LinkedIn announcements |
| **Tech stack change** (competitor dropped or installed) | High | 7–14 days | BuiltWith, Datanyze, job descriptions |
| **Job posting match** (role names a pain you solve or tool you replace) | Medium | 7–21 days | LinkedIn Jobs, Indeed, Workable |
| **Content engagement** (liked/commented on relevant post, webinar attendance) | Medium | 3–7 days | LinkedIn, CRM, MAP |
| **Competitor mention** (publicly mentioned competitor, asked for alternatives) | High | 48 hours | LinkedIn search, Reddit, G2 reviews |

**Decay** means the signal's predictive power drops as time passes. A funding round 60 days old has already been worked by every competitor. A new VP hire 14 days in is still in orientation. Act within the window or don't act at all.

---

## Starting Signal Stack (for teams with no existing signal motion)

Don't track 7 signal types simultaneously. Start with 3 that cover both precision and volume for your ICP.

**For most B2B SaaS:**
1. **New executive hire** in the buyer function — LinkedIn Sales Navigator saved search, alerts on new VP/Director in your ICP companies
2. **Job posting match** — LinkedIn Jobs keyword alert for the tools you replace or pain you solve
3. **Funding event** — Crunchbase free email alerts on your top 200 ICP accounts

These three cost <€500/month combined and generate measurable signal-to-meeting conversion above 5% in most B2B verticals. Add intent data only after this motion is producing pipeline — otherwise you're paying for signals without the infrastructure to act on them.

**Add later:**
- First-party intent (requires website visitor identification tool: Warmly, Clearbit, RB2B)
- Tech stack change (BuiltWith or Datanyze, useful for competitive displacement)

---

## Signal Scoring Matrix

Score every incoming signal on two dimensions:

**Signal strength** (how strongly does this correlate with an active buying window?)
- Very high (90–100): pricing page visit, demo page, G2 comparison, multiple stakeholders from same account on site
- High (65–85): new VP hire in relevant role, tech stack change, competitor mention, funding (within 48h)
- Medium (40–60): job posting match, webinar attendance, content engagement, funding (3–7 days old)
- Low (<40): newsletter subscriber, generic website visit, old funding (30+ days)

**Signal freshness** (apply weekly decay):
- Within 48 hours: full score
- 3–7 days: -20%
- 8–14 days: -35%
- 15–30 days: -50%
- 30+ days: do not act

**Combined score determines the tier:**
- Tier 1 (score ≥75): Rep routes immediately. Same-day outreach SLA.
- Tier 2 (score 45–74): Automated sequence with signal-specific personalization. Act within 7 days.
- Tier 3 (score <45): Nurture sequence or no action. Do not spend rep time.

**Stack signals before acting.** A single weak signal = Tier 3. Two medium signals from the same account in 7 days = Tier 1. Stacking is the single biggest lever on precision.

---

## False-Positive Triage

**Throw away 30–60% of raw signal volume.** If you're acting on more than 70% of raw signals, your filters are too loose and your signal-to-meeting rate will be low.

Common false positives by signal type:

**Funding:** extension rounds, debt rounds, PE recaps, pre-seed rounds <€1M, rounds with no headcount implications
**Job postings:** re-posts of unfilled roles (same posting, new date), roles at companies already in active pipeline, replacement hires for functions irrelevant to your offer
**Exec hires:** interim appointments, internal promotions where the decision-maker didn't actually change, hires at companies currently in negotiations with you
**Content engagement:** likes from people who engage with everything, bot activity, team members at existing customers

**Filter rule:** Before routing a signal, ask — does this signal imply a change in buying readiness, or does it just imply the account is active? Activity ≠ buying signal.

---

## Message Angle Per Signal Type

The message angle must be unique to the signal type. A funding announcement angle is not the same as a job posting angle. These are different templates, not different personalization tokens on the same template.

### Funding announcement
**Window:** Act within 3–7 days of announcement  
**Angle:** Budget to deploy, headcount to hire, systems to build  
**Opening frame:** "Companies at your stage typically use the 90 days post-raise to [build/fix/scale X]. We've worked with [3 companies at similar stage] through that exact transition."

### New executive hire (VP+)
**Window:** Act 14–21 days post-start date (not day 1 — too early signals surveillance)  
**Angle:** New leader evaluates vendors in the first 90 days. Position as a peer resource, not a sales call  
**Opening frame:** "New [role] typically spend their first quarter auditing [function] and making a few decisive bets. We've helped [peer company] get [specific outcome] — curious what's top of the list for you."

### Tech stack change (competitor dropped)
**Window:** Act within 7–10 days of detection  
**Angle:** Gap in the stack creates procurement urgency  
**Opening frame:** "Noticed [Company] recently moved off [Competitor]. A lot of teams we work with made that same switch and then needed to [fill capability gap]. We help with that specific transition."

### Job posting match
**Window:** Act within 7–14 days of posting  
**Angle:** The job posting reveals the problem — reflect it back  
**Opening frame:** "Saw you're hiring a [Role] — the JD mentions [specific requirement from posting]. That's usually a signal that [underlying problem] has become a priority. We've built that for a few companies at your stage."

### G2 comparison / competitor mention
**Window:** Act within 24–48 hours — this is the highest-precision, shortest-decay signal  
**Angle:** They're actively evaluating. Position your differentiation, not your feature list  
**Opening frame:** "Saw [Company] is researching [category/competitor]. We often talk to teams at this stage in the evaluation — happy to share how we compare on [the dimension that matters most for their use case]."

### First-party intent (pricing page / demo page)
**Window:** Same day. Within 4 hours is the standard for Tier 1  
**Angle:** They came to you. Don't pretend you don't know  
**Opening frame:** "Saw [Company] has been spending time on our [pricing/demo] page — figured it made sense to reach out directly rather than wait. [One sentence on their likely situation based on their vertical/stage.] Happy to answer any questions directly."

---

## Sequence Structure Per Tier

### Tier 1 (high-precision, fast-decay signals)
3 touches over 7 days. Rep-led.

| Touch | Day | Channel | Angle |
|-------|-----|---------|-------|
| 1 | Day 0 | LinkedIn DM or Email (whichever signal source) | Signal acknowledgment + single question |
| 2 | Day 2 | Email or LinkedIn (alternate channel) | Proof point from similar company |
| 3 | Day 5 | Phone or LinkedIn voice note | Re-anchor to signal, offer easy no |

### Tier 2 (medium-precision, 7-day window)
5 touches over 14 days. Can be automated with signal-specific templates.

| Touch | Day | Channel | Angle |
|-------|-----|---------|-------|
| 1 | Day 0 | Email | Signal acknowledgment + artifact (teardown, checklist) |
| 2 | Day 2 | LinkedIn | Connect with signal-based note |
| 3 | Day 5 | LinkedIn DM | Reference the artifact, narrow to one angle |
| 4 | Day 9 | Email | Peer-introduction framing or specialist angle |
| 5 | Day 14 | LinkedIn | Breakup — genuine easy out |

### Tier 3 (low-precision / stale signals)
Nurture only. No direct outreach until a Tier 1/2 signal fires from the same account.

---

## Operationalization Checklist

Before running any signal-based motion:

- [ ] Signal sources are connected and alerting (Crunchbase, LinkedIn Sales Navigator saved searches, BuiltWith)
- [ ] False-positive triage rules are documented and enforced — not everything that looks like a signal is a signal
- [ ] Each signal type has an assigned decay window and tier
- [ ] Tier 1 SLA is defined and achievable: who routes it and in how long?
- [ ] Each signal type has a unique message angle — not just personalization tokens on a generic template
- [ ] Sequence steps are loaded in the outreach tool before signals start firing
- [ ] CRM tracks signal type p