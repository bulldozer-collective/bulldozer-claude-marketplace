---
name: negotiation-closing
description: Develop closing tactics, handle final objections, and build negotiation strategies for specific deals at contract stage. Triggers on 'closing tactics,' 'negotiation,' 'deal stuck at contract,' 'final objection,' or 'how to close.' For deal qualification and red flags, see pipeline-deal-review. For initial objection handling, see sales-enablement.
when-to-use: Develop closing tactics, handle final objections, and build negotiation strategies for specific deals at contract stage. Triggers on 'closing tactics,' 'negotiation,' 'deal stuck at contract,' 'final objection,' or 'how to close.' For deal qualification and red flags, see pipeline-deal-review. For initial objection handling, see sales-enablement.
argument-hint: Deal at $180k ACV, procurement wants 25% discount, legal wants unusual IP clause, decision by end of quarter
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# Negotiation & Closing

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on deal negotiation and closing. Your goal is to build a negotiation playbook for a specific deal — moving from "we're interested" to "signed."

## Input

`$ARGUMENTS` — deal context and specific stuck point (e.g., "Acme Corp, $150k ACV, procurement wants 20% discount, wants net-60 payment terms, decision by March 31"). If not provided, ask for the deal details — this skill requires deal-specific context to be useful.

## Output

A `negotiation-plan-{company}.md` file with: deal-specific negotiation strategy, concession ladder (what to give, in what order, and what to get in return), final objection responses with talk tracks, closing sequence, and deal protection rules (what not to concede). Ready to use in the next call.

**Produce output on first invocation with the deal context provided. Only ask if the company name and stuck point are completely absent.**

---

## Negotiation Principles

### Never Negotiate on Price Before ROI Is Agreed

If the buyer is asking for a discount and you haven't established the business case, stop and re-anchor to value first.

"Before we talk about price, I want to make sure we've agreed on what the value of this looks like for you. If we're delivering $500k in annual savings, a $150k investment is a 3x ROI in year 1. Does that math hold for your situation?"

### Give Slowly, Get Something Every Time

Every concession should be traded for something. Giving a discount for nothing trains the buyer that you'll give more if they push. Giving a discount in exchange for a longer contract, upfront payment, or reference case is a trade — not a capitulation.

### Concessions Should Feel Hard-Won

Even if you had room to discount all along, make the buyer feel they earned it. An immediate concession signals that your initial price was arbitrary. Slow negotiation = higher perceived value of the concession.

### Protect Margin, Give on Terms

Discounts are permanent. Non-price concessions (payment terms, implementation support, additional seats) cost you less and often satisfy the buyer's need to "win" something.

---

## Concession Ladder

Build before the negotiation call. Work from least to most valuable.

| Level | Concession | What to get in return |
|-------|-----------|----------------------|
| 1 (easy) | Extended payment terms (net-30 → net-45) | Contract signed by [date] |
| 2 | Additional seats or user licenses | Annual contract (if currently monthly) |
| 3 | Extended implementation support | Reference case or logo permission |
| 4 | 5–10% discount | Annual payment upfront |
| 5 (painful) | 10–15% discount | Multi-year commit (2–3 years) |
| 6 (last resort) | 15–20% discount | Executive reference case + case study |

**Never go below your floor without VP approval**. Define the floor before the negotiation call — not during.

---

## The Discount Request — Talk Tracks

### First discount request

```
"I appreciate you being direct. Our pricing reflects the value we deliver,
and I've seen [X% ROI / $X savings] for companies in your situation.

What I can do is look at structuring the deal differently — 
if you're committed to a multi-year engagement, I can explore
what flexibility we might have on the annual rate.

But I'd need your commitment to annual upfront before I can take anything
to my team. Is that something you'd consider?"
```

### When they push harder

```
"I hear you — I want to make this work.
The honest answer is I can get you [X%] if we can move quickly
and if we can lock in [term/reference/upfront].

If I get this approved, can we sign by [date]?"
```

### When they demand a specific number you can't hit

```
"[X%] is beyond what I can approve — my floor is [Y%].
Here's what I can do: I'll commit to [Y%] plus [non-price value add],
and I'll make sure your implementation is prioritized.

That's my best offer. Can you work with that?"
```

---

## Final Objections at Contract Stage

### "Legal is adding new clauses"

**What's really happening**: Either legitimate legal concern or procurement using legal as a delay tactic.

```
"Which clause is holding things up?
In my experience, we can usually find middle ground on most terms.
If it's [specific common clause], we've handled this before — 
let me connect your legal team with ours directly.

Can we get a call scheduled this week so this doesn't delay your go-live?"
```

**Escalation path**: Your legal → their legal direct. Never let it sit in email limbo.

### "We need one more internal meeting"

**What's really happening**: Usually missing stakeholder alignment, cold feet, or internal opposition.

```
"I want to make sure you have everything you need for that meeting.
What's the main concern we'll need to address?
Could I join to answer any technical or commercial questions directly?"
```

**Offer to attend the internal meeting**. Rarely said yes to, but the offer signals confidence.

### "We're going with someone else" (Last chance)

```
"I respect that — can I ask what made the difference?
If it's price, I can sometimes get approval for one more look.
If it's something else, I'd rather know so we can improve."

[If they say price]: "What number are you working with?
I can't promise anything, but let me see what I can do — 
can you give me 24 hours before you countersign with them?"
```

---

## Closing Sequence

### The Assumptive Close

Once all objections are handled and you've confirmed value, assume the deal is moving forward.

```
"Given everything we've discussed, I think we're aligned.
I'll have contracts sent today — if you can have legal review by [date],
we can get your implementation started by [onboarding date].
Does that timeline work for you?"
```

**Don't ask "So, are you ready to move forward?"** — it invites a "no." Assume yes, confirm the timeline.

### The Summary Close

Before the final conversation, send a written summary of what's been agreed:

```
Subject: Next steps — [Company] x [Your Company]

Hi [Name],

Per our conversation, here's where we've landed:
• Contract: $[X] / [term]
• Start date: [date]
• Agreed terms: [payment terms, special provisions]
• Open items: [anything still to resolve]

I'll have contracts drafted for [specific date].
Can we set a call for [date] to finalize the remaining items?
```

Written summaries reduce "I never agreed to that" moments and create momentum.

### Creating Urgency (Only If Real)

Artificial urgency destroys trust. Real urgency closes deals.

**Legitimate urgency triggers**:
- End of quarter pricing (if your company actually runs quarter-end offers)
- Implementation capacity (if you genuinely have a queue)
- Product change (price is increasing in [month])
- Their stated deadline (they said Q1 implementation — that's their urgency)

**Never use**: "This offer expires in 24 hours" if you'll extend it. Buyers know this game.

---

## Deal Protection Rules

**Things to hold firm on regardless of pressure**:
- IP ownership clauses that transfer your IP to the customer
- Unlimited liability provisions
- Payment terms longer than net-60 (cash flow)
- SLAs below your actual capability
- Service credits that exceed contract value

**If buyer insists on terms you can't accept**: Escalate to your VP before conceding. Some deals aren't worth winning.

---

## Post-Negotiation: Lock It Down

Within 24 hours of a verbal agreement:
1. Send deal summary email
2. Send DocuSign / contract immediately — don't let it sit
3. Confirm your champion received it and knows the expected signature date
4. Block time in your calendar for implementation kickoff — it signals you're confident they'll sign