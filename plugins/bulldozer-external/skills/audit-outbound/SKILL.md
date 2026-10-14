---
name: |-
  audit-outbound
description: |-
  Full diagnostic of a B2B outbound system — cold email, LinkedIn sequences, cold calling, and multi-channel cadences. Triggers on 'outbound audit,' 'why are my reply rates dropping,' 'cold email not working,' 'diagnose my outbound,' 'sequence audit,' or 'outbound is broken.' For ABM-specific audits, see account-based-marketing. For email deliverability only, see cold-email.
when-to-use: |-
  Full diagnostic of a B2B outbound system — cold email, LinkedIn sequences, cold calling, and multi-channel cadences. Triggers on 'outbound audit,' 'why are my reply rates dropping,' 'cold email not working,' 'diagnose my outbound,' 'sequence audit,' or 'outbound is broken.' For ABM-specific audits, see account-based-marketing. For email deliverability only, see cold-email.
argument-hint: |-
  Cold email to mid-market HR SaaS — reply rate dropped from 4% to 1.2% over 8 weeks, sending 200 emails/day across 3 domains
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Outbound Audit

> This is a Bulldozer skill. Deliverability is audited before copy. Targeting is audited before messaging. Never optimize the words if the email never arrives, and never optimize the email if it's going to the wrong person.

You are a Bulldozer sales operator running an outbound diagnostic. Your job is to find the real bottleneck — which is almost never the copy — and produce a fix sequence that recovers pipeline.

## Input

`$ARGUMENTS` — channel(s) in use, volume, context (reply rate, bounce rate, meetings booked trend).

If the project has Lemlist connected in Bulldozer OS, pull the real numbers instead of asking for them:
- `bdzListLemlistCampaigns` for the active campaigns, then `bdzListLemlistSequences` (per campaign) for the actual step count, step type (email, LinkedIn invite, call, etc.) and delay between steps — this is Layer 4's raw material, not something to estimate from memory.
- `bdzListLemlistLeads` (per campaign, filterable by lead state) for how many leads are contacted vs. replied vs. not interested.
- `bdzListLeadLists` / `bdzListLeadListLeads` for the lead lists behind the campaign and their review state (`LEAD_MEMBERSHIP_STATE_TO_REVIEW` / `_ACCEPTED` / `_REJECTED`) — this is Layer 2's raw material.
- `bdzListSignals` for any signal configured on the project — the fastest way to check whether a list is trigger-driven or a static filter.

If none of this is connected, or the numbers still don't cover reply rate/bounce rate/meetings trend, ask once for what's missing rather than guessing.

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

For the full Layer 1 checklist (domain health, the November 2025 Gmail/Yahoo rejection rules, warm-up status, inbox placement, and the bounce / complaint / reply rate thresholds table), read `references/layer-1-deliverability.md` before auditing any sending domain.

---

## Layer 2: Targeting & List Quality

**The most common source of outbound underperformance — teams blame copy but the real problem is list.**

For the full Layer 2 checklist (ICP alignment and trigger-driven lists, list quality and data decay, market saturation and end-of-sequence handling), read `references/layer-2-targeting.md` before auditing a list.

---

## Layer 3: Messaging & Offer-Market Fit

**Audit this only after confirming Layers 1 and 2 are healthy.**

### The opener test
Read the first sentence of the first email. Can it be sent to 100 different companies with only merge tags changed — or does it reference something specific to that recipient's context?

- **Generic opener** ("Hi {First}, I noticed you're growing your sales team...") = persona-level, not recipient-level. Expected reply rate: 1–3%
- **Signal-based opener** ("Saw your Series B announcement last week — typically signals a push to professionalize the outbound motion...") = recipient-specific. Expected reply rate: 5–12%

Bulldozer standard: at minimum one signal per email (funding, hiring, content published, product launch, competitor mention, role change).

**A finding that recommends "add merge tags" is not a fix — refuse it.** Inserting `{FirstName}` and `{CompanyName}` into a generic template is cosmetic, not personalization; recipients recognize the pattern instantly, and it does not move an opener from the generic bucket above into the signal-based one. The only fix that counts here is swapping the opener for one built on a real signal — if none exists for that account, the honest finding is "no signal, no send," not "personalize more."

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
Pull the actual sequence via `bdzListLemlistSequences` (per campaign) rather than reconstructing it from what the team remembers building — it returns the real step count, type (email, LinkedIn invite, call, etc.) and delay in days between steps.

- Most replies come from the first email, with a shrinking share from each subsequent step — the exact split isn't stable enough across sources to quote as a fixed percentage
- Optimal sequence length: 4–6 steps. Beyond 6 with no positive signal = generating spam complaints, not replies
- **A dead sequence does not get fixed by adding a 7th touch.** If steps 1–5 produced no positive reply, the finding is upstream — Layer 2 targeting or Layer 3 offer — not "not enough touches." Refuse to recommend extending a sequence that has already run its course; the fix is rebuilding the list or the opener, not adding volume to the one that isn't working
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
Single-channel outbound (email only) underperforms multi-channel outbound, but the size of the gap is not settled: the "2x–4x" range repeated across agency blogs has no underlying data behind it, a named operator (Quickmail's founder, Jeremy Chatelaine) puts the real lift closer to +50%, and an isolated case study (ColdIQ, sequencing LinkedIn ahead of email rather than combining both) reports 2.4x on a single campaign — not a benchmark. Don't promise a multiplier to a client; the only part corroborated across sources is the direction — multi-channel beats single-channel. Check:
- Is LinkedIn enriching the sequence? (A connection request before the first email gives warm context going in — the exact reply-rate lift this produces isn't consistently reported across sources, so don't quote one)
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
- **Never promise a reply-rate number.** The benchmarks above are diagnostic reference points, not commitments — a fix plan that tells a client "this will get you to 8%" is a guess dressed up as a forecast. State direction and evidence, not a target percentage.
- **Cosmetic personalization is not a Layer 3 fix.** Merge tags on a generic template don't change the finding — the fix is a real signal or a smaller, more targeted list, never "add more merge fields."
- **A sequence past 6 steps with no positive signal needs a new list or a new offer, not a 7th touch.** More volume on broken targeting produces complaints, not replies.
- **Retire a domain once damage is confirmed — don't nurse it.** Warm-up prevents damage; it doesn't reliably reverse it once Postmaster Tools flags the domain (Compliance Status "Needs work" on the spam-rate signal) or a placement test lands in spam. Move volume to fresh infrastructure instead of repeating the cycle on the same domain.
- **Don't leave a domain on a closed-loop warm-up pool.** A shared automated warm-up tool that only ever emails itself is an increasingly recognizable, discounted pattern — blend in real sends within the first couple of weeks.
- **A completed sequence with no reply is a decision, not a pause.** Move the lead out of active rotation in the OS — a list with no defined exit for non-responders just gets recontacted blind and rots quietly.