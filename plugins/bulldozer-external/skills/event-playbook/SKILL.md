---
name: |
  event-playbook
description: |
  Build a B2B event playbook — pre-event intelligence and outreach, on-site execution, lead qualification protocol, post-event follow-up cadence, and pipeline attribution. Triggers on 'event playbook,' 'conference strategy,' 'field event,' 'how to get ROI from events,' 'trade show playbook,' 'pre-event outreach,' 'post-event follow-up,' or 'we go to events but get no pipeline.' For broader content and demand gen, see content-strategy. For ABM account targeting at events, see account-based-marketing.
when-to-use: |
  Build a B2B event playbook — pre-event intelligence and outreach, on-site execution, lead qualification protocol, post-event follow-up cadence, and pipeline attribution. Triggers on 'event playbook,' 'conference strategy,' 'field event,' 'how to get ROI from events,' 'trade show playbook,' 'pre-event outreach,' 'post-event follow-up,' or 'we go to events but get no pipeline.' For broader content and demand gen, see content-strategy. For ABM account targeting at events, see account-based-marketing.
argument-hint: |
  Attending SaaStr Europe (600 target attendees in ICP). 3-person team. Budget €15K. Goal: 25 pre-booked meetings, 8 opportunities created within 30 days.
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
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

---

## Phase 1: Pre-Event (T-6 Weeks to T-0)

### T-6 Weeks: Intelligence and List Building

**Get the attendee list.** Most events share it with exhibitors. If you're not exhibiting, buy a sponsor package that includes it. If neither: use LinkedIn event attendees (pull by event hashtag), or identify speakers/attendees from the agenda and previous years.

**Build the target account list from the attendee list:**
1. Import attendee list to Clay or spreadsheet
2. Filter against your ICP (employee count, industry, funding stage, tech stack)
3. Score by signal (have you been in outreach with this account? Do they show intent data? Are they a named account in your ABM list?)
4. Prioritize top 50 (Tier 1) + next 100 (Tier 2) for outreach
5. Tier 3 (everyone else): organic conversations at the event, no pre-event outreach

**For each Tier 1 account:**
- Identify the attending person by name and title
- Check: are they already in CRM? In an active sequence?
- Research 1 specific topic they care about (recent LinkedIn post, company news, session they're speaking at)

### T-4 Weeks: Pre-Event Outreach (Tier 1)

**The goal is to book meetings before the event, not at the event.** Teams that secure 20+ pre-booked meetings get 3–5x more pipeline per event than teams relying on badge swipes and impromptu conversations.

**Pre-event outreach sequence (for Tier 1 accounts):**

Touch 1 (T-4 weeks, LinkedIn connection request):
```
"[Name] — saw you're speaking at/attending [Event]. I'll be there with [team] — would love to connect ahead of time if you're open to it."
```
Note: 290 characters max. No pitch. No CTA beyond connecting.

Touch 2 (T-3 weeks, LinkedIn DM after acceptance):
```
"[Name] — looking forward to [Event]. [One sentence on what you noticed about their work — their talk topic, a recent post, a company milestone]. We help teams like yours [specific outcome]. Would it make sense to grab 20 minutes at the conference — I can come to you?"
```

Touch 3 (T-2 weeks, email):
Subject: "Meeting at [Event]?"
```
[Name] — reaching out separately from LinkedIn.

We'll have [X people] at [Event] focused on [specific problem you solve]. Given [company]'s work on [specific thing you noticed], I think there's something worth a 20-minute conversation.

Happy to make it work around your schedule — are you free [specific morning/afternoon block]?
```

Touch 4 (T-1 week, calendar slot):
If they've replied positively but haven't confirmed a time: send a specific calendar slot. Don't ask "when are you free?" — propose a specific time and let them accept or offer an alternative.

**Tier 2 outreach:** Simplified 2-touch sequence (LinkedIn + email). Goal: warm introduction and awareness. Meeting at the event is a nice-to-have, not the primary objective.

### T-2 Weeks: On-Site Preparation

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

**The 3-minute standing conversation:**
For unplanned contacts, have one version of your message: 3 minutes, ends with a request for a meeting (not an explanation of the product).

```
"What are you working on at [Company] right now?"
→ Listen
→ "[One sentence connecting their challenge to what you do]"
→ "We work with a few companies in [their situation] on exactly that. Worth 20 minutes? I can come to you tomorrow morning."
```

If yes: book in their calendar immediately (have a booking link on your phone). Don't trade business cards and follow up "next week."
If no: get their email for follow-up, make a CRM note within the hour.

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
- Log every meaningful conversation in CRM before the end of each event day
- Required fields: contact name, company, conversation context (1 sentence), qualification score, agreed next step
- Badge scans without a follow-up note: do not create CRM contacts — they become noise

---

## Phase 3: Post-Event Follow-Up

**The first 48 hours are the highest-leverage follow-up window.** Memory of the conversation, energy from the event, and the shared context of having been there are all at their peak.

### 48-Hour Follow-Up (A and B Contacts)

**Within 24 hours of returning:**

Email to A-tier contacts:
Subject: [Specific reference to your conversation topic]
```
[Name] — great to meet at [Event]. When you mentioned [specific thing they said], it resonated — that's exactly the problem [customer or case study] faced before [outcome we delivered].

You mentioned [their agreed next step]. I've [blocked time / sent calendar invite / prepared the doc you asked for].

[One clear CTA: "Does [specific time] work for a 30-minute call?" or "Here's the material I promised — happy to walk through it live if useful."]
```

Key: reference something specific they said. A generic "great to meet you at [Event]" follow-up is indistinguishable from a cold email and gets the same response rate as one.

### Days 3–7 Follow-Up (B-tier and no-shows)

**For B-tier contacts** who agreed to a next step but haven't responded:
- One LinkedIn message: "Following up on what we discussed at [Event]. [Specific question or offer from the conversation.]"
- One email if no response to LinkedIn: lighter version of the 24-hour email

**For scheduled meetings who no-showed:**
- Same-day reschedule attempt via email
- LinkedIn touch if no reply within 48 hours
- Total 2 attempts, then park in nurture

### Days 8–30: Event-Triggered Sequence

**For contacts who had good conversations but didn't book a next step**, enroll in a 3-touch e