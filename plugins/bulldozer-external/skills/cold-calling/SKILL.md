---
name: cold-calling
description: Write cold call scripts, objection responses, and phone cadence structures for B2B SDR and AE outbound. Triggers on 'cold calling,' 'phone prospecting,' 'call script,' 'SDR calls,' or 'outbound phone.' For cold email outreach, see cold-email. For deal qualification frameworks, see pipeline-deal-review.
when-to-use: Write cold call scripts, objection responses, and phone cadence structures for B2B SDR and AE outbound. Triggers on 'cold calling,' 'phone prospecting,' 'call script,' 'SDR calls,' or 'outbound phone.' For cold email outreach, see cold-email. For deal qualification frameworks, see pipeline-deal-review.
argument-hint: Targeting VP Sales at mid-market SaaS, selling revenue forecasting software, SDR team of 3
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
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

### The First 7 Seconds

Prospects decide whether to engage within 7 seconds. Lead with relevance, not your name and company. Your opener should make them think "this might be worth 30 more seconds."

### Disarm, Don't Pitch

The worst opener: "Hi, I'm John from Acme Corp, the leading provider of AI-powered revenue intelligence solutions..." — instant hang-up. The best opener: something that disarms with honesty or a pattern interrupt.

### The Goal Is a Meeting, Not a Sale

Every call has one goal: qualify interest and book a next step. You're not selling the product on the phone — you're selling 15 minutes on the calendar.

### Volume Is Not Strategy

30 calls/day with bad scripts = wasted hours. 15 calls/day with context, relevance, and real talk tracks = pipeline.

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

**Best call times** (data-backed): Tuesday, Wednesday, Thursday 8–9am or 4–5pm in their timezone. Avoid Monday mornings and Friday afternoons.

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