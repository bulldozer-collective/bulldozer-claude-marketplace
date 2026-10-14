---
name: |-
  cold-calling
description: |-
  Write cold call scripts, objection responses, and phone cadence structures for B2B SDR and AE outbound. Triggers on 'cold calling,' 'phone prospecting,' 'call script,' 'SDR calls,' or 'outbound phone.' For cold email outreach, see cold-email. For deal qualification frameworks, see pipeline-deal-review.
when-to-use: |-
  Write cold call scripts, objection responses, and phone cadence structures for B2B SDR and AE outbound. Triggers on 'cold calling,' 'phone prospecting,' 'call script,' 'SDR calls,' or 'outbound phone.' For cold email outreach, see cold-email. For deal qualification frameworks, see pipeline-deal-review.
argument-hint: |-
  Targeting VP Sales at mid-market SaaS, selling revenue forecasting software, SDR team of 3
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Cold Calling

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on cold calling. Your goal is to write call scripts, objection responses, and phone cadence structures that get prospects to engage — not hang up.

## Input

`$ARGUMENTS` — ICP description, product/value prop, and goal (e.g., "Targeting VP Sales at 100-500 person SaaS companies, selling revenue forecasting software, want a call script + objection handling"). If not provided, read any available context files before asking. Only ask if ICP and value prop are completely absent.

## Output

A `cold-call-playbook-{target-persona}.md` file with: opener script (permission-based + direct variants), 5 objection responses (with talk tracks), voicemail script, call cadence structure (calls + emails + voicemails), and call coaching notes. Scripts are ready to use — not placeholders.

**Produce output on first invocation. Read available context before asking. Only ask if ICP and value prop are completely absent.**

---

## Cold Calling Principles

### The First Few Seconds

Prospects decide whether to keep listening or hang up within the first several seconds of the call — recent write-ups on cold-call data put the window somewhere around 8–15 seconds, though none of them is an audited study, so treat it as an order of magnitude, not a stopwatch. Lead with relevance, not your name and company. Your opener should make them think "this might be worth 30 more seconds."

### The Trigger Must Be Real

A filter isn't a trigger. "VP Sales at 100–500 person SaaS companies" tells you who to call; it doesn't tell you why to call them *today*. Opener 3 below only earns its "Why it works" claim when the observation is genuinely recent — a funding round, a launch, a hire, something that just happened. In Bulldozer OS, that trigger can come from a real signal instead of manual research: `bdzListSignalTypes` lists what signal types the project can detect, and `bdzListSignals` returns the ones already running. The account list to work from should be a lead list already reviewed to `ACCEPTED` (`bdzListLeadListLeads`, filterable by review state), not every account a firmographic filter matched.

### Disarm, Don't Pitch

The worst opener: "Hi, I'm John from Acme Corp, the leading provider of AI-powered revenue intelligence solutions..." — instant hang-up. The best opener: something that disarms with honesty or a pattern interrupt.

### The Goal Is a Meeting, Not a Sale

Every call has one goal: qualify interest and book a next step. You're not selling the product on the phone — you're selling 15 minutes on the calendar.

### Volume Is Not Strategy

30 calls/day with bad scripts = wasted hours. 15 calls/day with context, relevance, and real talk tracks = pipeline.

### The Cadence Doesn't Get a Free Rerun

A cadence that finishes with zero live conversations isn't proof the account needs another pass — it's proof the trigger was weak or missing to begin with. Don't relaunch the same account into a second full cadence just because a rep has open capacity; that's busywork wearing the shape of a strategy. Either a new signal has genuinely appeared since the first pass (a fresh entry in `bdzListSignals`, a job change, a funding round, real engagement on a LinkedIn post) or the account goes back to be re-qualified against the ICP — not straight back onto a dialer.

---

## Opener Frameworks

### Opener 1 — Permission-Based (Best for Busy Executives)

```
"Hey [Name], this is [Your name] calling from [Company].
Did I catch you at a bad time?"

[They say "no" or "what's this about?"]

"I'll be quick — we help [ICP description] with [specific outcome, e.g., 
'building revenue forecasts that don't blow up at end of quarter'].
I had [Company or mutual connection] in mind when I was doing research.
Is that something that's on your radar right now?"
```

**Why it works**: Asking permission immediately separates you from robotic SDRs. The "I'll be quick" signals respect for their time. The specific outcome creates instant relevance.

### Opener 2 — Direct / Pattern Interrupt

```
"Hi [Name], [Your name] at [Company].
I'm going to be upfront with you — this is a cold call.
Do you have 27 seconds for me to tell you why I'm calling?"
```

**Why it works**: Radical honesty. Decision-makers hear cold calls all day. Naming it immediately differentiates and often gets an amused "sure, go ahead."

### Opener 3 — Research-Based

```
"Hey [Name], saw [Company] just [raised a round / launched X / hit Y milestone].
Congrats — that usually means [challenge this creates].
We help [ICP] with exactly that. Worth 15 minutes to explore?"
```

**Why it works**: Specificity signals homework. The challenge observation creates a "yes, how did you know?" moment.

---

## Call Body — After They Engage

Once you have their attention (30–60 seconds):

```
"So [their outcome] — we've been working with [2-3 companies in their space] on this.
The way we typically see it play out is [common pattern of their pain].
Is that resonating with what you're seeing?"

[Let them talk — this is your discovery moment]

"That makes sense. What we do is [one sentence on your solution].
We helped [similar company] [specific result] in [timeframe].
Would it make sense to put 20 minutes on the calendar to see if there's a fit?"
```

**Key**: After your bridge to the product, always ask a question. The rep who talks longest loses the call.

---

## Objection Handling (5 Core Objections)

### "I'm not interested."

```
"Fair enough — most people I call feel that way before we've talked.
Can I ask — is it that [pain area] isn't a priority right now,
or that you're not sure what we do?"

[If timing]: "When would be a better time? Q3 budget cycle?"
[If awareness]: [Brief bridge to outcome] "Does that sound more relevant?"
```

### "We already have a solution."

```
"Good to know — a lot of the teams I talk to have something in place.
The question is usually whether it's doing [specific thing current solutions fail at].
Is [their current tool] getting you [specific outcome]?"
```

### "Send me an email."

```
"Happy to — I want to make sure I send you something worth reading.
One question before I do: [discovery question]. That way I can make sure
what I send is actually relevant to your situation."
```

**Rule**: Never just say "sure, I'll send you an email" and hang up. That email goes unread. Extract one piece of information before you get off the call.

### "I'm too busy right now."

```
"Totally get it — I'll be brief.
Is the challenge [pain area] something that's actually on the list for this year,
or should I check back in Q4?"

[If yes]: "Great — my calendar has a 15-minute slot Thursday at 10am or Friday at 2pm.
Which works better?"
```

### "We don't have budget."

```
"Makes sense — most teams I talk to don't have a line item for this yet.
The question usually becomes whether the ROI justifies going to get the budget.
For [similar company], [outcome] paid back in [timeframe].
Is it worth 20 minutes to see if the math works for you?"
```

---

## Voicemail Script

Leave voicemails sparingly (1 per sequence, not every attempt). A well-placed voicemail increases callback rate; repeated voicemails don't.

```
"Hey [Name], [Your name] from [Company].
Calling because [one sentence — specific to their situation or company].
If that's on your radar, I'm at [phone number].
Happy to be brief when you call back — [Your name], [number]."

[Total: under 20 seconds]
```

**No**: "Hi, this is John from Acme Corp, the leading provider of..." — they hit delete before you finish.

---

## Call Cadence Structure

A structured phone cadence works alongside email. Total sequence: 12–15 touches over 3–4 weeks.

| Day | Touch | Notes |
|-----|-------|-------|
| 1 | Call + voicemail | First attempt + voicemail if no answer |
| 2 | Email (cold email 1) | Send email referencing the call |
| 4 | Call (no voicemail) | Multiple no-voicemail attempts are fine |
| 6 | Call (no voicemail) | |
| 8 | Email (follow-up angle 2) | Different value angle |
| 10 | Call + voicemail | Second voicemail of the sequence |
| 12 | Email (resource) | Useful piece of content |
| 15 | Email (breakup) | Final touch |

**Best call times**: several 2026 sales-data write-ups (not a single audited study) converge on Tuesday–Thursday as the strongest days, with two windows standing out — mid-morning (roughly 10–11:30am) and early-to-mid afternoon (roughly 2–3:30pm) — plus late afternoon (4–5pm), all in the prospect's timezone. Avoid Monday mornings and Friday afternoons. Treat this as a starting point to test against your own call data, not a fixed rule.

---

## Compliance & Number Reputation

Two constraints sit outside the script itself, and either one can shut a cadence down if ignored.

**Calling hours are a legal limit, not a best-practice suggestion.** In the US, the TCPA restricts calls to 8am–9pm in the *recipient's* local time zone, not the caller's — and this applies to a decision-maker's mobile number even in a B2B context, since the TCPA treats wireless numbers as residential and the federal B2B exemption realistically only covers a published business landline. Some states cut the window further — Florida and Oklahoma, for example, stop at 8pm local (trackers disagree by an hour; treat 8pm as the better-supported reading). Build the cadence around the recipient's time zone and check current rules for the state or country before assuming the federal window applies everywhere.

**Caller ID reputation behaves like domain reputation in cold email.** Carriers score a number on dial volume, answer rate, call duration, and complaint signals, and can label it "Spam Likely" on the recipient's phone without the caller having broken any rule — once flagged, connect rates drop sharply and take time to recover. Keep per-number daily volume in a normal range, rotate numbers instead of hammering one, and register numbers with a carrier "branded calling" program where available so the company name displays before pickup. Exact recovery timelines and lift percentages vary too much across sources to state as fact — treat any specific number you read on this as directional, not a guarantee.

**Dialer choice, local-presence numbers, and AI voice agents carry their own compliance exposure on top** — *Duguid* and the FTC's abandoned-call cap for predictive/parallel dialers, the reputation risk of a rented local-presence pool, and the FCC's 2024 ruling treating an AI-generated voice as a TCPA "artificial voice" (prior written consent, plus California's own AB 2905 disclosure duty). Detail: `references/compliance-and-number-reputation.md`. Operating rules: see Rules, below.

---

## Call Coaching Notes

**For SDR managers reviewing calls:**

- Did they ask for permission or just start pitching? (Permission = better engagement)
- Did they talk more than 50% of the call? (If yes, coaching needed — prospect should talk more)
- Did they ask a discovery question within the first 60 seconds?
- Did they get a specific next step, or just "send me info"?
- Did they follow up the call with an email within 1 hour?

**Signs a call is going well**: Prospect asks a clarifying question, prospect talks about their current situation, prospect suggests a follow-up time.

**Signs a call is going poorly**: Prospect gives one-word answers, sounds distracted, prospect asks "what company are you calling from again?"

---

## Common Mistakes

- **Reading an opener word-for-word.** These frameworks are the shape of a call, not a teleprompter — a rep who recites one verbatim sounds like it, and the prospect notices before the second sentence.
- **Calling "research-based" (Opener 3) when the observation isn't actually recent.** A funding round from 18 months ago or a job change nobody acted on isn't a trigger — it just borrows the *sound* of one.
- **Renting a rotating pool of local-presence numbers to lift answer rates.** It works for a few weeks, then the whole block gets flagged and every number the team owns inherits the hit.
- **Turning on a predictive or parallel dialer for cold outbound to raise dial volume, without a legal review.** The productivity gain is real; so is the abandoned-call exposure it creates.
- **Relaunching a cold account into a second full cadence because a rep has open capacity.** Capacity isn't a trigger — without a new signal, it's the same lottery a second time.
- **Accepting "send me an email" as a stopping point.** That email goes unread without a discovery answer to make it relevant — see the objection script above.
- **Cosmetic personalization** — swapping in the prospect's name and company on an otherwise generic opener. Prospects hear the same call everyone else is getting; it isn't personalization, it's a mail-merge with a voice.
- **Promising a connect rate or a meetings-booked number as if it were guaranteed.** Every benchmark in this document is directional, sourced from non-audited aggregates — cite it as a starting point to test against your own call data, never as a number a rep is on the hook for.

## Rules

- **A power dialer is the default for cold B2B calling; a predictive or parallel dialer is a legal decision, not a manager's toggle** — both fall outside the federal ATDS definition after *Duguid*, but only the predictive/parallel pattern carries the FTC's abandoned-call-rate exposure and the state-by-state autodialer laws that are stricter than the federal standard.
- **Local-presence numbers are bought or leased directly from the originating carrier, never rented from a rotating third-party pool.** A short-term pickup lift isn't worth a spam-flagged number block.
- **No account gets a second full cadence without a new, genuine trigger.** A completed cadence with zero live conversations is a targeting signal, not a reason to try again with the same list.
- **The opener frameworks are a shape, not a script to recite.** If a rep can't say it in their own words, they haven't understood who they're calling or why.
- **Every "send me an email" gets one discovery question first.** No exceptions — the email doesn't get read without it.
- **The recipient's time zone and local calling-hour law set the window, not the caller's schedule or the "best call times" data.** Best-time data optimizes pickup inside a legal window; it doesn't define the window.
- **An AI voice agent replacing a human SDR needs consent captured before the first call, not a disclosure line in the opener** — the FCC's 2024 ruling puts AI-generated voice calls in the same TCPA bucket as prerecorded robocalls, with its own written-consent requirement; don't assume the human-SDR checklist above already covers it.
- **No promised response rate, ever.** Every number in this playbook is a directional benchmark from non-audited sources, not a commitment a rep is measured against.