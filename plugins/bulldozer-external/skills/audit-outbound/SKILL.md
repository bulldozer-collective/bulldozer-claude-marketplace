---
name: audit-outbound
description: Full diagnostic of a B2B outbound system — cold email, LinkedIn sequences, cold calling, and multi-channel cadences. Triggers on 'outbound audit,' 'why are my reply rates dropping,' 'cold email not working,' 'diagnose my outbound,' 'sequence audit,' or 'outbound is broken.' For ABM-specific audits, see account-based-marketing. For email deliverability only, see cold-email.
when-to-use: Full diagnostic of a B2B outbound system — cold email, LinkedIn sequences, cold calling, and multi-channel cadences. Triggers on 'outbound audit,' 'why are my reply rates dropping,' 'cold email not working,' 'diagnose my outbound,' 'sequence audit,' or 'outbound is broken.' For ABM-specific audits, see account-based-marketing. For email deliverability only, see cold-email.
argument-hint: Cold email to mid-market HR SaaS — reply rate dropped from 4% to 1.2% over 8 weeks, sending 200 emails/day across 3 domains
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# Outbound Audit

> This is a Bulldozer skill. Deliverability is audited before copy. Targeting is audited before messaging. Never optimize the words if the email never arrives, and never optimize the email if it's going to the wrong person.

You are a Bulldozer sales operator running an outbound diagnostic. Your job is to find the real bottleneck — which is almost never the copy — and produce a fix sequence that recovers pipeline.

## Input

`$ARGUMENTS` — channel(s) in use, volume, context (reply rate, bounce rate, meetings booked trend). If not provided, read any available sequence or config files. Ask once if channel, volume, and current metrics are completely unavailable.

## Output

An `audit-outbound-{client}.md` file with: top bottleneck identified, 4-layer diagnostic results, benchmarks vs. actuals, and a sequenced fix plan. Each finding includes: layer, what's broken, evidence, exact fix.

**Produce on first invocation. Do not ask to review copy before auditing infrastructure.**

---

## The 4-Layer Diagnostic Stack

Run in strict order. A problem in an earlier layer invalidates all downstream layers.

```
Layer 1: Deliverability & Infrastructure
Layer 2: Targeting & List Quality
Layer 3: Messaging & Offer-Market Fit
Layer 4: Sequence Structure & Execution
```

If Layer 1 is broken, fix it before touching Layer 2. Rewriting copy on a blacklisted domain is wasted effort.

---

## Layer 1: Deliverability & Infrastructure

**The most common root cause of reply rate decline that teams blame on copy.**

### Domain Health
- SPF, DKIM, DMARC records: all three must be properly configured. Missing DMARC = deliverability risk at scale
- Domain age: sending domains under 60 days in age must be in active warm-up. Under 90 days = treat as probable cause of any deliverability issue
- Blacklist status: check all sending domains against Spamhaus, SURBL, and Barracuda. One major blacklist listing can suppress inbox placement across the entire ICP. (Use MXToolbox: covers 100+ lists)
- Sender Score: target 85–100. Below 70 = active deliverability problem

### Warm-Up Status
Proper warm-up schedule:
- Week 1: 5 emails/day/mailbox
- Week 3: 10–20 emails/day/mailbox
- Full ramp: max 25 cold outbound emails/day/mailbox

Sudden volume spikes — even on healthy domains — trigger algorithmic spam filters. Flag any week where volume increased >20% without a corresponding warm-up extension.

### Inbox Placement
Bounce rate and spam complaint rate do not tell you where email is landing. Use a seed list test (GlockApps or Mailgenius) to get actual placement data across Gmail, Outlook, and Yahoo.

- Target: >85% inbox placement
- <80%: active infrastructure problem — do not scale sends
- Check Google Postmaster Tools for domain reputation (requires a Google Workspace sending domain)

### Bounce & Complaint Rates
| Metric | Healthy | Investigate | Critical |
|--------|---------|-------------|---------|
| Bounce rate | <2% | 2–5% | >5% |
| Spam complaint rate | <0.08% | 0.08–0.3% | >0.3% |
| Open rate | >40% | 25–40% | <25% |
| Reply rate | >5% | 2–5% | <2% |
| Positive reply rate | >50% of replies | 30–50% | <30% |

---

## Layer 2: Targeting & List Quality

**The most common source of outbound underperformance — teams blame copy but the real problem is list.**

### ICP Alignment
- Pull the current active lead lists. What % of contacts match the stated ICP (industry, company size, role, buying trigger)?
- Compare the ICP definition on paper to the last 5 closed-won deals: do they match? ICP drift (lists that have wandered from the original segment) is the fastest way to tank reply rates without touching a word of copy
- Flag roles that are off-target: sending to "Marketing Manager" when the buyer is "VP Sales" = structural mismatch

### List Quality
- B2B contact data decays at 22–30% annually. A list built 12 months ago has roughly 25% bad contacts
- Verify emails before send: real-time verification reduces bounce risk. Catch-all domains are risky — treat them as Tier 2 if sender reputation is under pressure
- Data completeness: are first names, companies, and relevant context fields populated for personalization? Generic merge tags ("Hi {FirstName},") on bad data = "Hi ,"
- Duplicate contacts: are the same contacts in multiple sequences simultaneously? This triggers spam complaints and confuses reply handling

### Market Saturation
- How many times has this contact list been contacted in the last 90 days? Over-contacted lists produce diminishing returns regardless of copy quality
- If the TAM for the segment is <5,000 companies, the list may be exhausted — time to expand the ICP or move to a new segment

---

## Layer 3: Messaging & Offer-Market Fit

**Audit this only after confirming Layers 1 and 2 are healthy.**

### The opener test
Read the first sentence of the first email. Can it be sent to 100 different companies with only merge tags changed — or does it reference something specific to that recipient's context?

- **Generic opener** ("Hi {First}, I noticed you're growing your sales team...") = persona-level, not recipient-level. Expected reply rate: 1–3%
- **Signal-based opener** ("Saw your Series B announcement last week — typically signals a push to professionalize the outbound motion...") = recipient-specific. Expected reply rate: 5–12%

Bulldozer standard: at minimum one signal per email (funding, hiring, content published, product launch, competitor mention, role change).

### Value proposition clarity
Three checks on the core value prop:
1. Would a prospect know who this is for within 5 seconds?
2. Does it describe a measurable result or just a capability?
3. Could a competitor say the same sentence without sounding wrong?

If any check fails, the positioning is a category cliché — not a reason to reply.

### CTA friction
- Single, low-friction ask. "15 minutes this week" beats "book a 30-minute discovery call"
- Question CTAs often outperform calendar links at first touch ("Does this resonate with what you're working on?" vs. "Book time here: [link]")
- If the sequence has been running for >60 days with <2% reply rate: the CTA and value prop are misaligned with buyer urgency, not just tone

---

## Layer 4: Sequence Structure & Execution

### Step count and timing
- 58% of all replies come from the first email. The remaining 42% from follow-ups
- Optimal sequence length: 4–6 steps. Beyond 6 with no positive signal = generating spam complaints, not replies
- Step spacing: 3–5 business days between early touches, widening to 7–10 days for later steps. Tighter spacing (1–2 days) signals desperation and gets flagged as spam
- Send timing: 8–11 AM in the recipient's time zone (not the sender's). Sending at 9 AM your time when the prospect is in a different zone = 3 AM arrival = opens at the wrong moment, if at all

### Follow-up value
Each follow-up must introduce something new:
- Step 1: main offer
- Step 2: different angle, proof point, or case study
- Step 3: competitor or risk framing ("what happens if this problem isn't solved")
- Step 4: breakup or soft-close ("should I close this out?")

A follow-up that says "bumping this to the top of your inbox" with no new information trains prospects to ignore subsequent steps.

### Channel mix
Single-channel outbound (email only) underperforms multi-channel by 2–3x. Check:
- Is LinkedIn enriching the sequence? (Connection request before email = warm context, +40% reply lift)
- Is cold calling integrated for high-value accounts?
- Are video messages used for Tier 1 prospects?

Over-reliance on cold email alone — especially as inbox competition increases — is a structural problem, not a copy problem.

### Reply handling
- What is the median time to first response when a prospect replies? >4 hours = pipeline leaking at the handoff
- Are replies being qualified or just booked? A meeting with an unqualified prospect costs an AE more than it generates
- Is there a clear routing rule for positive, neutral, and OOO replies?

---

## Benchmarks

| Metric | Target | Investigate | Fix Now |
|--------|--------|-------------|---------|
| Open rate (cold) | >40% | 25–40% | <25% |
| Reply rate (cold) | >5% | 2–5% | <2% |
| Positive reply rate | >50% of replies | 30–50% | <30% |
| Reply → meeting rate | >40% | 20–40% | <20% |
| Bounce rate | <2% | 2–5% | >5% |
| Spam rate | <0.08% | 0.08–0.3% | >0.3% |
| Inbox placement | >85% | 80–85% | <80% |

---

## Output: Sequenced Fix Plan

```
## Bottleneck Identified
[Layer X: specific problem in one sentence]

## Layer Diagnostic
### Layer 1: Deliverability [PASS / FAIL]
[findings]
### Layer 2: Targeting [PASS / FAIL]
[findings]
### Layer 3: Messaging [PASS / FAIL]
[findings]
### Layer 4: Sequence [PASS / FAIL]
[findings]

## Fix Sequence (in order)
1. [Most critical fix — do first]
2. [Next fix — only after #1 is done]
...

## Metrics to Track After Each Fix
[one metric per fix to confirm it worked]
```

---

## Rules

- **Fix one variable at a time.** Changing targeting, copy, cadence, and domain simultaneously makes it impossible to know what moved the metric.
- **Deliverability before copy — always.** Rewriting email copy on a domain with inbox placement below 80% is wasted effort.
- **Positive reply rate is the true north, not raw reply rate.** High reply rate with low positive rate means the message is polarizing, not resonating.
- **Never scale sends on a domain under 90 days without a documented warm-up log.** If the log doesn't exist, the warm-up didn't happen.
- **Follow-ups that don't add new value accelerate unsubscribes.** If there's nothing new to say, stop the sequence.