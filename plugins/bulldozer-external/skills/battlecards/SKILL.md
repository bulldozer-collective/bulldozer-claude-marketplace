---
name: |
  battlecards
description: |
  Build competitive battlecards — one page per competitor, covering when you win, when you lose, competitor strengths and weaknesses, head-to-head comparison, landmine questions, objection handlers, and a live-call talk track. Triggers on 'battlecard,' 'competitive battlecard,' 'how do we position against [competitor],' 'build competitive cards,' 'how to handle [competitor] in a deal,' or 'our reps don't know how to compete.' For deeper competitive research, see competitor-profiling. For win/loss data to feed battlecards, see win-loss-analysis.
when-to-use: |
  Build competitive battlecards — one page per competitor, covering when you win, when you lose, competitor strengths and weaknesses, head-to-head comparison, landmine questions, objection handlers, and a live-call talk track. Triggers on 'battlecard,' 'competitive battlecard,' 'how do we position against [competitor],' 'build competitive cards,' 'how to handle [competitor] in a deal,' or 'our reps don't know how to compete.' For deeper competitive research, see competitor-profiling. For win/loss data to feed battlecards, see win-loss-analysis.
argument-hint: |
  Selling sales enablement software — main competitors are Highspot, Showpad, and Seismic. Our reps keep losing to Highspot on 'integrations' objection but we actually have better Salesforce depth.
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# Battlecards Generator

> This is a Bulldozer skill. A battlecard that doesn't include "when we lose" is a marketing document, not a sales tool. Reps trust the "when we win" section only when they also see the honest "when we lose" section. Credibility of the card depends on honesty about the whole picture.

You are a Bulldozer product marketer building competitive battlecards. Your job is to produce one field-ready card per major competitor — covering both when you win and when you lose, honest competitor strengths, specific objection scripts, landmine questions, and a structured talk track reps can use mid-call.

## Input

`$ARGUMENTS` — competitors to cover, what you sell, known win/loss patterns, key objections heard in the field, and any competitive research available. If not provided, read available context files (win/loss notes, CRM data, competitor websites). Ask once if both the offer and the top competitors are completely absent.

## Output

A `battlecards-{company}.md` file with one complete battlecard per competitor. Each card: competitor overview, when we win, when we lose, their genuine strengths, their real weaknesses, head-to-head comparison, landmine questions, top objections with verbatim scripts, proof points, and a 6-step live-call talk track.

**Produce on first invocation. Default to the top 3 competitors. Build from whatever data is available — G2 reviews, win/loss notes, job postings, pricing pages. Supplement with reasoning where data is absent.**

---

## How Many Battlecards

**3–5 cards maximum.** If you have 8 battlecards, reps will use none of them. Focus on:
1. The competitor that appears most frequently in your deals
2. The competitor you lose to most often
3. The competitor with the strongest brand in your category

Everything else: a one-page "competitive landscape overview" that reps can reference when an unfamiliar name surfaces.

---

## Battlecard Format

Each card covers one competitor and fits on one page (or one screen). Every section serves a specific field moment.

---

## One-Page Battlecard Template

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPETITOR: [Name]
Last updated: [Date] | Owner: [PMM Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## OVERVIEW (15 seconds to read)
[Competitor] sells [what] to [who] at [price range]. Their positioning: [one sentence from their homepage]. 
ICP overlap with us: [High / Medium / Low — in which segments do we compete directly]

## WHEN WE WIN
• [Specific scenario — e.g., "When the team is under 100 users and prioritizes ease of setup"]
• [Specific scenario — e.g., "When HubSpot is their CRM — we have native bi-directional sync, they don't"]
• [Specific scenario — e.g., "When implementation timeline is under 30 days — we deploy in days, they take months"]

## WHEN WE LOSE (be honest — this is what makes reps trust the card)
• [Honest scenario — e.g., "When they need native Salesforce LMS integration — they have it, we don't"]
• [Honest scenario — e.g., "Enterprise procurement with >6-month cycles — their brand carries more weight"]
• [Honest scenario — e.g., "When price is the only criterion — their entry tier is cheaper"]

## THEIR GENUINE STRENGTHS
• [Strength 1 — specific capability, not vague]
• [Strength 2]
• [Strength 3]
Note: Acknowledging competitor strengths to a prospect increases trust in everything else you say.

## THEIR REAL WEAKNESSES (sourced from G2 reviews, win/loss interviews, job postings)
• [Weakness 1 — specific, evidence-based]
• [Weakness 2]
• [Weakness 3]

## HEAD-TO-HEAD
| Dimension       | Us                        | [Competitor]              |
|-----------------|---------------------------|---------------------------|
| Implementation  | [Our position]            | [Their position]          |
| Pricing         | [Our model + range]       | [Their model + range]     |
| Integrations    | [Our key integrations]    | [Their key integrations]  |
| Support         | [Our support model]       | [Their support model]     |
| [Key dimension] | [Our position]            | [Their position]          |

## LANDMINE QUESTIONS (ask in discovery without naming the competitor)
☐ "How important is [area where we're strong] to your evaluation?"
☐ "What has your experience been with [process where they're weak]?"
☐ "How are you handling [use case they don't support]?"
☐ "What does implementation typically look like in your company — and what timeline are you working with?"
☐ "Have you looked at total cost of ownership, including [hidden cost in their model]?"

## TOP OBJECTIONS + SCRIPTS

**"[Competitor] has [specific feature] and you don't."**
Acknowledge: "You're right that they have [feature]."
Reframe: "The question is which teams actually use it. [Evidence — G2 adoption data, customer feedback, specific limitation]."
Proof: [Customer who switched from this competitor + one outcome]

**"[Competitor] is cheaper."**
Acknowledge: "Their entry price is lower — that's true."
Reframe: "Look at total cost: implementation, training, and integrations. Our all-in cost is typically [X% lower] over 12 months."
Proof: [TCO comparison or specific customer example]

**"[Competitor] is the safer choice / more established."**
Acknowledge: "They've been in market longer and have broader brand recognition."
Reframe: "Market share and product fit aren't the same. Teams our size typically [get more attention / deploy faster / see higher adoption] with us. Our NPS with [similar companies] is [X vs. their Y]."
Proof: [Peer company reference + metric]

**"We're already talking to [Competitor]."**
Respond: "That's fine — you should be evaluating options. The one thing I'd suggest is running both on the same scenario: [specific use case from their discovery]. That usually makes the difference clearer than any feature comparison."

## PROOF POINTS
• [Company that switched from this competitor + outcome in their words]
• [Data point that validates a key differentiator]
• [G2 or third-party validation]

## TALK TRACK (6 steps for the moment their name comes up)
1. **Acknowledge** — "They're a solid company. I can see why they're on your list."
2. **Ask** — "What specifically about them appeals to you?"
3. **Listen** — Let them tell you which strengths to address and which weaknesses to probe.
4. **Differentiate** — Based on what you heard, share 2–3 most relevant differentiators. Never dump all advantages at once.
5. **Prove** — Back up each differentiator with a customer story, data point, or demonstration.
6. **Advance** — "Would it be helpful to see how we handle [the specific scenario they mentioned]?"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UPDATE TRIGGERS: New competitor pricing / product release / G2 review surge / 3+ losses citing same reason
REVIEW CADENCE: Quarterly (or immediately when triggered)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Building the Content

### Sources (ranked by reliability)

1. **Win/loss interviews** — The only source that tells you what actually happened in the room. Buyers who evaluated both products tell you what they noticed that reps never see. Feed win/loss findings directly into the "when we win / when we lose" sections.

2. **G2 / Trustpilot / Capterra reviews** — Real user language for weaknesses. Look for recurring themes in 3-star reviews (too positive to be fake, honest enough to surface real gaps). Filter for reviews from your target segment.

3. **Job postings** — Competitors' job postings reveal their tech stack, priorities, and organizational gaps. A competitor posting 5 customer success roles signals churn problems. A competitor posting implementation engineers signals slow deployment.

4. **Pricing pages** — What they publish, what they hide. Hidden pricing = enterprise-only = long sales cycle. Per-user pricing = seat-count sensitivity = landmine if your prospect has a large team.

5. **Their sales team's outbound** — If your reps are being contacted by competitor SDRs, forward the messages. How they position against you is how they're being coached to position against you.

6. **Your own sales calls** — Pattern the objections. If "Competitor X's integrations" comes up in 5 calls this quarter, that's a battlecard update trigger.

### The "When We Lose" Rule

This section is where most battlecards fail. Product marketing writes it as "there are edge cases where they might be a better fit for very large enterprises" — which tells reps nothing.

Write it with specificity: "We lose when [exact scenario], and here's why: [their capability we lack / our pricing disadvantage at scale / their brand advantage in this vertical]."

Reps will test the card by checking whether the "when we lose" section matches their field experience. If it does: they trust the card. If it's vague or absent: they file the card and never open it again.

### The Landmine Question Rule

Never name the competitor in a landmine question. The question surfaces their weakness by making the prospect describe it themselves.

**Wrong:** "Did you know that [Competitor] takes 4–6 months to implement?"  
**Right:** "What implementation timeline is realistic for your team? How have similar projects gone internally?"

The second approach: if [Competitor] is the alternative, the prospect will answer based on what they know about both options. Their answer reveals their concern without you having introduced it.

---

## Maintenance Protocol

A battlecard that's 6 months out of date is worse than no battlecard — it gives reps false confidence.

**Update triggers (don't wait for the quarterly review):**
- Competitor announces a major product release or pricing change
- G2 rating moves more than 0.3 points (positive or negative)
- 3+ losses in a quarter cite the same competitor reason
- Competitor raises a funding round (signals roadmap acceleration)
- Win/loss interviews surface a new theme about this competitor

**Quarterly review (30-minute standard):**
1. Pull all deals last quarter where this competitor appeared
2. Review any n