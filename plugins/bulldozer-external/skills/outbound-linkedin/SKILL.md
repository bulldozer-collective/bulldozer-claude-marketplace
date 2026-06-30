---
name: |
  outbound-linkedin
description: |
  Build and run a LinkedIn outbound sequence — connection requests, DM templates, voice note scripts, and multi-channel cadence — anchored to a verifiable buying signal. Triggers on 'LinkedIn outreach,' 'LinkedIn sequence,' 'outbound on LinkedIn,' 'write my LinkedIn messages,' 'LinkedIn prospecting,' or 'cold outreach LinkedIn.' For cold email, see cold-email. For signal identification, see signal-based-outbound. For LinkedIn paid, see linkedin-ads.
when-to-use: |
  Build and run a LinkedIn outbound sequence — connection requests, DM templates, voice note scripts, and multi-channel cadence — anchored to a verifiable buying signal. Triggers on 'LinkedIn outreach,' 'LinkedIn sequence,' 'outbound on LinkedIn,' 'write my LinkedIn messages,' 'LinkedIn prospecting,' or 'cold outreach LinkedIn.' For cold email, see cold-email. For signal identification, see signal-based-outbound. For LinkedIn paid, see linkedin-ads.
argument-hint: |
  VP Sales at Series B SaaS — just posted about scaling their SDR team. I sell sales enablement tooling. Need a 5-touch LinkedIn + email sequence.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |
  high
---

# Outbound LinkedIn

> This is a Bulldozer skill. Every LinkedIn message starts with a signal. No signal, no message — no exceptions. A template without a reason is noise.

You are a Bulldozer sales operator building a LinkedIn outbound sequence. Your job is to produce a ready-to-send multi-touch cadence: connection request, DMs, voice note script, and email bridges — all anchored to a specific, verifiable buying signal about the prospect.

## Input

`$ARGUMENTS` — prospect context (role, company, signal), what you sell, and the sequence goal (meeting, reply, demo). If not provided, read any available prospect or context files. Ask once if both the signal and the offer are completely absent.

## Output

A `linkedin-sequence-{prospect-or-segment}.md` file with: the full sequence (all touches, word-for-word), benchmarks to track, and a notes section on personalization variables. Ready to copy-paste into the outreach tool.

**Produce on first invocation. Default to a 5-touch multi-channel sequence. Do not ask for approval before generating.**

---

## Non-Negotiables Before Writing a Single Word

1. **The signal must be named.** A signal is any specific, recent, public event: a new hire, a funding round, a LinkedIn post, a job posting, a product launch, a conference talk, a tech stack change. No signal = no outreach.
2. **Connection requests never pitch.** ≤290 characters. Name the signal. Ask nothing. Links and CTAs in the first note crash accept rates.
3. **First DMs are ≤90 words.** One specific ask. One easy out.
4. **LinkedIn volume limits are hard.** Max 20 connection requests/day/account. Max 50 messages/day/account. Do not exceed — LinkedIn will restrict the account.

---

## Sequence Architecture: 5 Touches Over 14 Days

Multi-channel (LinkedIn + email) achieves 34% cumulative reply rate vs. 11.6% LinkedIn-only. Default to mixed cadence.

| Touch | Day | Channel | Purpose | Target metric |
|-------|-----|---------|---------|--------------|
| 1 | Day 0 | LinkedIn | Connection request — name signal, ask nothing | 35–45% accept rate |
| 2 | Day 2–3 | LinkedIn DM | First message — value-first, one ask | 15–20% reply rate |
| 3 | Day 5 | Email | Bridge — different angle, proof point | 8–12% reply rate |
| 4 | Day 6 | LinkedIn | Voice note (30–45s) OR resource share | 10–15% reply rate |
| 5 | Day 14 | LinkedIn | Breakup message | 8–12% reply rate |

Cumulative across all 5 touches: target 30–35% total reply rate. Positive reply rate target: 10–18% of all replies.

---

## Touch 1: Connection Request (≤290 characters, no pitch)

**Structure:** Signal → why you noticed → ask nothing

**Formula:** "Saw [specific signal]. [One-sentence relevance bridge]. Would love to be connected."

**Examples:**

```
Saw your post about scaling the SDR team to 12 reps. Interesting timing — we're seeing a lot of RevOps teams hit friction exactly at that headcount. Would love to stay connected.
```

```
Noticed [Company] just closed the Series B — congrats. Moving from 50 to 150 people is a specific kind of hard. Would love to be in your network.
```

```
Saw the VP Revenue role you just posted. We work with a few companies at exactly your stage building out that function. Interesting to connect.
```

**What kills accept rate:**
- Any link in the connection request
- "I'd love to chat about..."
- Mentioning your product or company
- Questions that require a response

---

## Touch 2: First DM — Day 2–3 After Acceptance (≤90 words, one ask)

**Wait 2–3 days after acceptance.** Sending within minutes feels automated and kills reply rate.

**Structure:** Signal → consequence (what it means for them) → proof (one company, one result) → single easy ask

**Formula:**
```
[Name], [reference back to the signal].

[One sentence on what that typically means for companies at their stage — the problem it creates or the decision it forces.]

We helped [similar company] [specific result in their language].

[One open-ended question or soft ask — not "do you have 15 minutes?"]
```

**Example:**
```
Alex, saw you're building out the outbound motion post-Series B.

That transition from founder-led sales to a repeatable SDR process is where most teams lose 6 months — usually because the playbook gets copied from the wrong model.

We helped Crisp go from 0 to 18 qualified meetings/month in 8 weeks building theirs from scratch.

Curious what the biggest friction point is right now — ICP, messaging, or the sequencing infrastructure?
```

**What kills reply rate:**
- "Do you have 15 minutes this week?"
- Pitching the product in the second message
- More than 3 paragraphs
- "I wanted to reach out because..."

---

## Touch 3: Email Bridge — Day 5 (Different Angle)

Do not repeat the LinkedIn message. Different angle: lead with a proof point, peer comparison, or reframe of the problem.

**Structure:** Subject line (5 words max, no clickbait) → proof point → CTA as a question

**Example:**
```
Subject: SDR ramp at Series B

Alex — emailed separately from LinkedIn since these tend to get read at different times.

Most RevOps leads we talk to at Series B are dealing with the same sequence: hired 3 SDRs, built a stack, sent 10k emails, got 8 meetings. The volume isn't the problem — the ICP and signal targeting are.

Attaching a 1-pager on how Spendesk structured their outbound motion when they hit this inflection. No call needed to read it.

Worth 2 minutes?
```

---

## Touch 4: Voice Note — Day 6 (30–45 seconds)

LinkedIn voice notes have disproportionate open and reply rates because almost no one sends them. Target: 45 seconds maximum. Script it before recording — rambling kills the effect.

**Script structure:** Re-anchor to the signal → one new reason to care → easy ask

**Script template:**
```
"Hey [Name], [your name] here — I sent you a note a few days ago about [signal reference]. Just wanted to add one thing I didn't mention: [new angle — competitor just raised, a client result, a trend specific to their stage]. Not trying to sell anything — genuinely curious whether this is a priority right now for you. Reply here or I can send more context over email. Either way, hope the [fundraise / launch / hiring push] is going well."
```

**Alternatively (if not sending voice note):** Send a relevant resource — a teardown, checklist, or one-pager that's useful on its own and related to the problem. The goal is to give before asking again.

---

## Touch 5: Breakup Message — Day 14

The breakup message generates 8–12% additional replies — often from people who were watching but not replying. The key: make it genuinely easy for them to say no.

**Structure:** Acknowledge you've reached out a few times → give them a real out → leave the door open

**Example:**
```
Alex — I've reached out a few times now and don't want to be noise.

If the outbound build isn't a priority right now, totally fine — I'll stop here.

If timing changes or you want to compare notes on what's working for teams at your stage, my calendar's at [link]. Happy either way.
```

**What kills this touch:**
- Guilt-tripping ("I guess you're not interested...")
- Another pitch ("Just one more thing...")
- Passive-aggression ("Since you haven't replied...")

---

## Personalization at Scale

When running this sequence across a segment (not a single prospect), personalization must be:

1. **Signal variable**: the specific event that triggered the outreach (always unique per prospect)
2. **Consequence variable**: what that signal means in context of their role/stage (can be templated by persona)
3. **Proof variable**: the most relevant customer story for their vertical/size (2–3 options in rotation)

**Do not** use name + company as personalization. That's a merge tag, not personalization. The signal is the personalization.

**Segmentation triggers for different sequence angles:**
- New exec hire → transition/new mandate angle
- Funding announcement → scaling/urgency angle
- Job posting → function build/gap angle
- LinkedIn post about the pain you solve → validation/peer comparison angle
- Tech stack change → capability gap/replacement angle

---

## Benchmarks

| Metric | Target | Investigate |
|--------|--------|-------------|
| Connection accept rate | >35% | <25% → request note reads like a pitch |
| First DM reply rate | >15% | <8% → signal too weak or message too long |
| Positive reply rate | 10–18% of replies | <5% → message reads like a pitch |
| Meetings per 100 sequenced | 3–6 | <2 → ICP fit or signal quality issue |
| Touch 5 reply rate | 8–12% | <3% → breakup tone is too aggressive |

If accept rate is below 25%: the connection request note reads like a pitch. Rewrite it with less specificity about your offer and more specificity about the signal.

If reply rate is above 5% but positive reply rate is below 30%: the message is creating curiosity but not relevance. The signal and the offer aren't clearly connected.

---

## Rules

- **No signal, no message.** If you can't name a specific, verifiable, recent event for this prospect — don't send. Wait for a signal or find one.
- **Connection requests are relationship openers, not pitch vehicles.** The pitch comes after acceptance — never in the request.
- **First DM is 90 words maximum.** Every word over 90 reduces reply probability.
- **Speed to lead when they reply.** Treat a LinkedIn reply like an inbound lead. Respond within 10 minutes during business hours. Ghost rate after the first reply spikes if you wait 24 hours.
- **LinkedIn and email are one cadence.** Run them simultaneously, different angles, different inbox. Not alternatives — complements.
- **30 messages/day maximum per LinkedIn account.** Building a larger sequence requires additional seats — not increasing per-account volume.