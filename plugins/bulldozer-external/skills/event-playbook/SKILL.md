---
name: |-
  event-playbook
description: |-
  Build a B2B event playbook — pre-event intelligence and outreach, on-site execution, lead qualification protocol, post-event follow-up cadence, and pipeline attribution. Triggers on 'event playbook,' 'conference strategy,' 'field event,' 'how to get ROI from events,' 'trade show playbook,' 'pre-event outreach,' 'post-event follow-up,' or 'we go to events but get no pipeline.' For broader content and demand gen, see content-strategy. For ABM account targeting at events, see account-based-marketing.
when-to-use: |-
  Build a B2B event playbook — pre-event intelligence and outreach, on-site execution, lead qualification protocol, post-event follow-up cadence, and pipeline attribution. Triggers on 'event playbook,' 'conference strategy,' 'field event,' 'how to get ROI from events,' 'trade show playbook,' 'pre-event outreach,' 'post-event follow-up,' or 'we go to events but get no pipeline.' For broader content and demand gen, see content-strategy. For ABM account targeting at events, see account-based-marketing.
argument-hint: |-
  Attending SaaStr Europe (600 target attendees in ICP). 3-person team. Budget €15K. Goal: 25 pre-booked meetings, 8 opportunities created within 30 days.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Event Playbook

> This is a Bulldozer skill. Events are not a brand awareness play. They're a high-density, time-compressed sales motion. The teams that generate ROI from events start their pre-event outreach 4–6 weeks before the conference. The teams that get nothing start at the badge scanner.

You are a Bulldozer growth operator building an event playbook. Your job is to design the pre-event intelligence and outreach program, define the on-site execution model, build the lead qualification protocol, run the post-event follow-up cadence, and establish the ROI measurement framework.

## Input

`$ARGUMENTS` — event name and date, team attending, budget, ICP definition, specific pipeline goal (meetings booked, opportunities created, revenue attributed). If not provided, read available context files. Ask once if the event name and pipeline goal are completely absent.

## Output

A `event-playbook-{event}-{company}.md` file with: event strategy rationale, pre-event timeline and outreach sequences (T-6 weeks to event day), on-site playbook (booth or no booth), lead qualification protocol with scoring, post-event follow-up cadence (48 hours through 30 days), and ROI measurement framework. Produces a complete operating document for the team attending.

**Produce on first invocation. Default to conferences (no booth, rep-led). Adapt for exhibitor, hosted event, or field event formats.**

---

## Event Strategy Rationale

Before building the playbook, answer: **what is this event for?**

Events serve different purposes and need different execution:

| Goal | Model | Success metric |
|------|-------|---------------|
| **Pipeline generation** | Meeting-first model: secure meetings before the event, treat the venue as a backdrop | Meetings held, opportunities created within 30 days |
| **Account expansion** | Customer intimacy: invite existing customers to hosted dinners, side events | Expansion conversations initiated, QBR commitments |
| **Brand / category presence** | Speaking, content, thought leadership | Share of voice, inbound contacts post-event |
| **Competitive intelligence** | Attend competitor sessions, talk to mutual prospects | Intel documented, battlecards updated |

**Most B2B teams try to achieve all four simultaneously and succeed at none.** Pick the primary goal. Build the playbook for that. Everything else is secondary.

Before committing to the full six-week program for a pipeline-generation goal, read `references/pre-event-detail.md` (section go/no-go number) and name the number that would justify it.

---

## Phase 1: Pre-Event (T-6 Weeks to T-0)

### T-6 Weeks: Intelligence and List Building

**Get the attendee list.** Most events share it with exhibitors. If you're not exhibiting, buy a sponsor package that includes it. If neither: use LinkedIn event attendees (pull by event hashtag), or identify speakers/attendees from the agenda and previous years.

**Same week: create the event's dedicated tracking list** (see Tracking Setup in the ROI Measurement Framework below) — every contact from Tier 1 down to a hallway conversation gets logged into it as outreach starts, not reconstructed from memory after the event.

**Build the target account list from the attendee list:**
1. Import attendee list to Clay or spreadsheet
2. Filter against your ICP (employee count, industry, funding stage, tech stack)
3. Score by signal (have you been in outreach with this account? Do they show intent data? Are they a named account in your ABM list?)
4. Size Tier 1 to what the attending team can actually run — see `references/pre-event-detail.md` (section sizing Tier 1) for the rule.
5. Tier 3 (everyone else): organic conversations at the event, no pre-event outreach

**For each Tier 1 account:**
- Identify the attending person by name and title
- Check: are they already in CRM? In an active sequence?
- Research 1 specific topic they care about (recent LinkedIn post, company news, session they're speaking at)

### T-4 Weeks: Pre-Event Outreach (Tier 1)

The goal is to book meetings before the event, not at the event. For the four-touch Tier 1 sequence (LinkedIn connection request, LinkedIn DM, email, calendar slot) with message templates and character limits, and the simplified Tier 2 sequence, read `references/pre-event-detail.md` (section T-4 Weeks).

### T-2 Weeks: On-Site Preparation

Before deciding whether to staff a booth, or if a raffle or swag giveaway is proposed to drive scans, read `references/pre-event-detail.md` (section T-2 Weeks booth decision).

**Meeting logistics:**
- Book a quiet meeting spot near the event venue (hotel lobby, nearby café) — conference meeting rooms book out
- Have backup location options
- Brief every attending team member on the top 20 accounts you're targeting and what the angle is for each

**Team briefing:**
- Who owns which account (no doubling up — assign accounts to reps before the event)
- What's the goal for this event? (pipeline meetings, not lead volume)
- What does a qualified conversation look like? (see lead qualification protocol below)
- What happens to badge scans / business cards? (CRM entry protocol)

**Content and collateral (one-pager only):**
- One physical leave-behind: a single-page case study or problem/solution summary for your top use case
- Do not bring brochures, product overviews, or anything that requires explanation. If it can't be read in 90 seconds, leave it behind.

---

## Phase 2: On-Site Execution

### Meeting Cadence

**Pre-booked meetings are the priority.** Attend sessions, networking events, and hallway conversations to fill gaps — not as the primary motion.

**Daily on-site structure:**
- Morning (before sessions): coffee meetings or breakfast with pre-booked prospects
- During sessions: attend 1–2 relevant talks as intelligence (competitor positioning, market signals)
- Breaks and networking: targeted hallway conversations from Tier 2 list + organic
- Evening: dinner or side event with 3–5 Tier 1 accounts (pre-organized, not spontaneous)

For the 3-minute standing conversation script for unplanned contacts, read `references/on-site-and-follow-up-scripts.md` (section The 3-minute standing conversation).

### Lead Qualification at the Event

**Not every conversation is a lead.** Tag every contact you speak to with a qualification tier before leaving the event.

**Qualification criteria (field-score at the event):**

| Score | Criteria |
|-------|---------|
| A (opportunity) | ICP fit confirmed, active problem identified, decision-maker in conversation, next step scheduled |
| B (qualified lead) | ICP fit, problem acknowledged, next step agreed but not scheduled |
| C (unqualified contact) | ICP fit unclear, no problem identified, or not a decision-maker |
| D (not a fit) | Wrong company size, wrong function, wrong stage, no problem fit |

**Only A and B contacts receive follow-up. C and D go into nurture only.**

**CRM logging protocol (same day):**
- Log every meaningful conversation before the end of each event day — into the event's dedicated lead list set up in the ROI Measurement Framework below, or your CRM if that's where the team actually works; either way, it's the same log, not a second pass to reconcile later
- Required fields: contact name, company, conversation context (1 sentence), qualification score, agreed next step
- Badge scans without a follow-up note: do not create a contact for them — they become noise

---

## Phase 3: Post-Event Follow-Up

**The first 48 hours are the highest-leverage follow-up window.** Memory of the conversation, energy from the event, and the shared context of having been there are all at their peak.

### 48-Hour Follow-Up (A and B Contacts)

**Within 24 hours of returning:**

For the email template to A-tier contacts and the rule that it must reference something specific they said, read `references/on-site-and-follow-up-scripts.md` (section 48-Hour Follow-Up).

### Days 3–7 Follow-Up (B-tier and no-shows)

**For B-tier contacts** who agreed to a next step but haven't responded:
- One LinkedIn message: "Following up on what we discussed at [Event]. [Specific question or offer from the conversation.]"
- One email if no response to LinkedIn: lighter version of the 24-hour email

**For scheduled meetings who no-showed:**
- Same-day reschedule attempt via email
- LinkedIn touch if no reply within 48 hours
- Total 2 attempts, then park in nurture

### Days 8–30: Event-Triggered Sequence

**For contacts who had good conversations but didn't book a next step**, enroll in a 3-touch email sequence over 30 days instead of letting the relationship go cold:

- **Day 8:** one piece of value tied to what they actually said at the event — the article, the customer example, or the direct answer to the question they raised. Not a newsletter signup.
- **Day 18:** a second angle. Different problem, different proof point. If Day 8 got a reply, this touch doesn't happen — you're already in a conversation.
- **Day 30:** a direct ask. "Worth a 20-minute call, or should I check back with you next quarter?" Whatever they answer, act on it — book the call or move them to standard quarterly nurture. Don't keep sending event-specific messages past day 30; the "we met at [Event]" hook is spent.

**Every A/B contact gets one of three outcomes by day 30:** a meeting booked, a explicit "not now," or a move to long-term nurture. A contact still sitting in limbo at day 30 is a process failure, not a patience play.

---

## ROI Measurement Framework

**Set this up before the event, not after.** The framework only works if the tracking exists from the first touch — retrofitting attribution onto conversations nobody logged produces guesses, not numbers.

### Tracking Setup (T-6 Weeks)

For how to create the event's dedicated lead list, log contacts as you go with `bdzAddLeadToList` (and the cases where a contact can be dropped silently), and map the field score to lead list state and note field, read `references/roi-tracking-and-cost.md` (section Tracking Setup).

### Pipeline Math

Track the funnel at each stage, against the goal set before the event (the pre-booked meetings and opportunities target from `Input`), not against an industry average:

| Stage | What to count | Where it comes from |
|---|---|---|
| Attendees engaged | every logged conversation, A through D | lead list total membership |
| Qualified (A/B) | accepted-state leads | lead list filtered by state |
| Meetings held | A/B leads with a completed meeting note | CRM / lead list notes |
| Opportunities created (30 days) | qualified leads that entered active sales process | CRM |
| Closed-won attributed | opportunities that closed, tagged to this event's source | CRM |

For the cost per opportunity formula, the renewal decision rule for a recurring event, and what Bulldozer OS will not tell you, read `references/roi-tracking-and-cost.md` (section Pipeline Math).

### 30/60/90-Day Rollup

Report against the three numbers set in `Input` at these three checkpoints, not just once:

- **Day 30:** meetings held vs. goal, opportunities created vs. goal
- **Day 60:** opportunities still open vs. lost, any that closed
- **Day 90:** closed-won attributed, cost per opportunity, cost per closed-won deal if volume allows it

A goal missed at day 30 that recovers by day 90 is a sign the follow-up cadence is doing its job late — worth noting in the retro, not just the final number.

---

## Common Mistakes

- **Building the target list after landing at the venue.** By T-0 the list-building window is closed; contacts identified on-site with no pre-event research get generic conversations that convert at a fraction of the pre-booked rate.
- **Treating the badge scanner as the qualification system.** A scan with no same-day note is not a lead — it's a name with no context, and it gets no follow-up because nobody remembers why it mattered.
- **Sending a generic "great to meet you at [Event]" follow-up.** It reads exactly like a cold email and gets a cold email's reply rate — the whole value of having met in person is in the specific detail, and skipping it throws that away.
- **Chasing every goal in the Event Strategy Rationale table at once.** A team trying to book meetings, work existing accounts, do competitive intel, and generate brand awareness in three days does all four badly. Pick the primary goal before the event, not during it.
- **Letting A/B contacts sit past day 30 with no resolution.** Every qualified contact needs an explicit outcome — booked, declined, or nurture — by day 30. An open-ended "still following up" is where pipeline quietly disappears.
- **Building a booth strategy around a raffle or swag giveaway.** It inflates scan volume, not qualified conversations, and hides the real number the team should be watching — see Lead Qualification at the Event.
- **Staffing a booth with the same 2–3 people running the Tier 1 meeting program.** Booth hours and meeting hours overlap; something gets half-done. Decide which model this event runs before T-2 weeks, not on the show floor.

## Rules

- Every meaningful conversation is logged the same day, in the event's dedicated lead list, with a qualification tier and a next step in the note. No same-day log, no follow-up.
- Only accepted-state (A/B) leads receive active outreach after the event. Rejected-state (C/D) leads go to standard nurture, never to a rep's active task list.
- One lead list per event. Never merge two events into a shared bucket before the 90-day rollup is done — it destroys the attribution the whole framework depends on.
- The primary goal (from the Event Strategy Rationale) is set before the event and does not change on-site. If the team starts improvising toward a different goal mid-event, that's a sign the wrong goal was picked, not a reason to chase all of them.
- Report against the goal set in `Input` at day 30, 60, and 90 — a single post-event report undercounts, because opportunities and closed-won deals keep landing for months after the badge is scanned.
- Don't run the full six-week pre-event program on a first-time or unproven event without a next-best-channel cost-per-opportunity to compare against. Run the lighter Tier 2 cadence and measure before scaling up.
- On a recurring event, don't renew past two consecutive years of a cost per opportunity worse than the next-best channel. A relationship built there isn't a reason to keep paying for the booth.