---
name: |-
  signal-based-outbound
description: |-
  Build a signal-based outbound system — identify buying signals, score and tier them, write signal-specific message angles, and launch sequences timed to signal decay windows. Triggers on 'signal-based outbound,' 'trigger-based outreach,' 'buying signals,' 'intent-based prospecting,' 'outreach based on signals,' or 'when to reach out to a prospect.' For LinkedIn sequences specifically, see outbound-linkedin. For cold email, see cold-email.
when-to-use: |-
  Build a signal-based outbound system — identify buying signals, score and tier them, write signal-specific message angles, and launch sequences timed to signal decay windows. Triggers on 'signal-based outbound,' 'trigger-based outreach,' 'buying signals,' 'intent-based prospecting,' 'outreach based on signals,' or 'when to reach out to a prospect.' For LinkedIn sequences specifically, see outbound-linkedin. For cold email, see cold-email.
argument-hint: |-
  B2B SaaS selling sales coaching software — want to trigger outreach on new VP Sales hires, funding rounds, and job postings for SDR roles
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Signal-Based Outbound

> This is a Bulldozer skill. Signal-based outbound adds timing as a second filter on top of ICP fit. Both have to be true — fit alone is a list, fit plus a change event is a reason to reach out today.

You are a Bulldozer sales operator building a signal-based outbound system. Your job is to define the signal universe, assign decay windows and routing tiers, write the message angle for each signal type, and produce a ready-to-run playbook.

## Input

`$ARGUMENTS` — what you sell, who you sell to (ICP), and any signals already being tracked. If not provided, read available context files. Ask once if both the offer and the ICP are completely absent.

## Output

A `signal-playbook-{company}.md` file with: signal universe (types, sources, decay windows), a scoring matrix, tier routing rules, message angle per signal type, and sequence structure per tier. Ready to operationalize in Bulldozer OS's native signal and Lemlist tooling (see "Running This in Bulldozer OS" below), or in whatever other outreach stack the team already runs.

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

To map these categories onto Bulldozer OS's own signal catalog (`bdzListSignalTypes`), read `references/bulldozer-os-signals.md`.

---

## Starting Signal Stack (for teams with no existing signal motion)

Don't track 7 signal types simultaneously. Start with 3 that cover both precision and volume for your ICP.

**For most B2B SaaS:**
1. **New executive hire** in the buyer function — LinkedIn Sales Navigator saved search, alerts on new VP/Director in your ICP companies
2. **Job posting match** — LinkedIn Jobs keyword alert for the tools you replace or pain you solve
3. **Funding event** — Crunchbase free email alerts on your top 200 ICP accounts

There's no audited industry number for what a "signal-based" motion converts at, so don't quote one — track your own signal-to-meeting rate against your existing cold-outbound baseline for the first month and use that as your reference point, not a vendor-quoted benchmark. Add intent data only after this motion is producing pipeline — otherwise you're paying for signals without the infrastructure to act on them.

**Where I change my mind after that first month.** If the signal motion isn't beating the cold-outbound baseline by then, the near-always culprit is triage or routing, not the choice of signal — a real signal poorly filtered or routed late converts no better than a cold list. Fix false-positive triage and Tier 1 SLA adherence before adding a second signal type or a paid intent source. Adding more signal volume on top of a motion that isn't converting just buys more noise at a higher price.

**Add later:**
- First-party intent (requires website visitor identification tool: Warmly, RB2B, or HubSpot Breeze Intelligence — the product formerly sold standalone as Clearbit, folded into HubSpot in 2024)
- Tech stack change (BuiltWith, or Datanyze — now ZoomInfo's entry-level tier rather than an independent product, useful for competitive displacement)

To run sourcing, tiering and sequencing natively in Bulldozer OS (signals as an OS object priced per lead, the LinkedIn post path for content engagement, tiering in the lead `note`, the Lemlist sequence), read `references/bulldozer-os-signals.md` (section: Running This in Bulldozer OS).
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

**The stacking bar rises with what you're about to spend.** A single cheap, high-volume signal (a post like, a followed-company alert) is fine to route straight into an automated Tier 2/3 sequence — the cost of being wrong is one ignored email. It is not fine to justify a same-day rep-led Tier 1 call, a hand-written executive outreach, or turning on one of the OS's 12-credit/lead company-level signal types (tech adoption, tech displacement, AI adoption) on a single weak read. The higher the commitment — rep time, a bespoke message, or the OS's own per-lead credit cost — the more independent signals you should require before acting, not just a higher combined score from the same source. Convergent 2026 practitioner guidance points the same direction without agreeing on an exact number, so treat it as a principle, not a formula: require more than one signal, from more than one source, before the expensive or high-touch plays.

---

## False-Positive Triage

**Expect to throw away most of your raw signal volume — there's no audited industry figure for how much, so don't quote one.** If you find yourself acting on nearly everything a signal source produces, that's the tell your filters are too loose, not a sign your targeting improved.

Common false positives by signal type:

**Funding:** extension rounds, debt rounds, PE recaps, pre-seed rounds <€1M, rounds with no headcount implications
**Job postings:** re-posts of unfilled roles (same posting, new date), roles at companies already in active pipeline, replacement hires for functions irrelevant to your offer
**Exec hires:** interim appointments, internal promotions where the decision-maker didn't actually change, hires at companies currently in negotiations with you
**Content engagement:** likes from people who engage with everything, bot activity, team members at existing customers

**Filter rule:** Before routing a signal, ask — does this signal imply a change in buying readiness, or does it just imply the account is active? Activity ≠ buying signal.

**The trap that doesn't show up in a triage table: two "signals" that are really one event.** A job posting for a role and a funding announcement three days later at the same account often aren't two independent facts — they're one expansion event reported by two different sources. Before counting that as a stack (see above), check whether the second signal is a plausible *consequence* of the first rather than an unrelated confirmation. Routing on a double-counted event is worse than routing on the single signal, because the score looks more confident than it is.

---

## Message Angle Per Signal Type

The message angle must be unique to the signal type. A funding announcement angle is not the same as a job posting angle. These are different templates, not different personalization tokens on the same template.

For the window, angle and opening frame of each signal type (funding, new executive hire, tech stack change, job posting, G2 comparison / competitor mention, first-party intent) and the compliance note on first-party intent, read `references/message-angles.md`. One angle per signal type.

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

Before running any signal-based motion, go through the checklist in `references/operationalization-checklist.md`.

---

## Rules

- **Fit plus signal, not fit alone.** ICP fit tells you who to watch. A signal tells you when to write. A list built on fit only, without a named event, is not signal-based outbound — it's a list with a deadline attached to make it feel urgent.
- **No signal, no send.** If the account can't be pointed to a specific, dated event, it goes back to nurture. A stale or invented signal is worse than no outreach at all — the prospect can tell.
- **The decay window is a hard stop, not a guideline.** A signal worked after its window has closed converts at nurture rates while consuming Tier 1 rep time. Route it to Tier 3 instead of running it late.
- **One message angle per signal type, one ask per message.** The angle comes from what the signal means for that person right now — a funding round is not a job posting. Stacking multiple asks in one message ("interested in a demo, or should I share a case study, or can I get 15 minutes") is the fastest way to get zero replies.
- **Stack before you escalate, never invent a stack.** Two real signals from the same account inside their windows earn Tier 1 routing. One signal repeated in different wording is not a second signal.
- **Silence is the default outcome — build the exit before the sequence.** Most accounts, at every tier, will not respond. A sequence without a defined last touch and a clean route back to nurture leaves reps chasing dead accounts and lists rotting with contacts who were never re-qualified.
- **Don't buy signal sources faster than you can act on them.** A Tier 1 SLA that nobody can hit turns high-precision signals into the same pile as everything else. Fix routing and response time before adding a fourth signal type.
- **The stacking bar scales with the commitment, not just the score.** A weak signal can justify an automated, low-cost touch. It cannot justify rep time, a hand-written message, or an expensive company-level signal type on its own — those need more than one independent signal, regardless of how a single source's score reads.
- **If the first month doesn't beat baseline, the fix is triage and routing, not a new signal.** Adding signal types on top of a motion that isn't converting buys more noise at a higher price. Diagnose before you expand.