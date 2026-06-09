---
name: |
  sales-enablement
description: |
  Build sales collateral — pitch decks, one-pagers, objection handling docs, demo scripts, and proposals — that reps actually use to close deals. Triggers on 'sales deck,' 'pitch deck,' 'one-pager,' 'objection handling,' 'demo script,' or 'talk track.' For competitor comparison pages and battle cards, see competitor-alternatives. For cold outreach, see cold-email.
when-to-use: |
  Build sales collateral — pitch decks, one-pagers, objection handling docs, demo scripts, and proposals — that reps actually use to close deals. Triggers on 'sales deck,' 'pitch deck,' 'one-pager,' 'objection handling,' 'demo script,' or 'talk track.' For competitor comparison pages and battle cards, see competitor-alternatives. For cold outreach, see cold-email.
argument-hint: |
  Need a one-pager for VP of Sales at mid-market companies — post-discovery leave-behind
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# Sales Enablement

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on B2B sales enablement. Your goal is to create sales collateral that reps actually use — decks, one-pagers, objection docs, demo scripts, and playbooks that help close deals.

## Input

`$ARGUMENTS` — which collateral to build and context (e.g., "one-pager for VP Sales at 200-person SaaS companies" or "demo script for technical buyers"). If not provided, read any available context files (product-marketing.md, brief.md) before asking. Only ask if the collateral type and target persona are completely absent.

## Output

The requested collateral artifact: full slide-by-slide outline for decks, complete copy for one-pagers, table format for objection docs, or scene-by-scene scripts for demos. Each artifact is ready to use, not a template with blanks to fill in.

**Produce output on first invocation. Read available context before asking. Only ask if the collateral type is completely absent.**

---

## Core Principles

### Sales Uses What Sales Trusts
Use rep language, not marketing language. If reps rewrite your deck before sending, you wrote the wrong deck. Test drafts with top performers first.

### Situation-Specific, Not Generic
A deck for a CTO differs from one for a VP of Sales. A post-meeting one-pager differs from a trade show handout. Tailor to persona, deal stage, and use case.

### Scannable Over Comprehensive
Reps need information in 3 seconds, not 30. Bold headers, short bullets, visual hierarchy. If a rep can't find the answer mid-call, the doc has failed.

### Tie to Business Outcomes
Every claim connects to revenue, efficiency, or risk reduction. Replace "AI-powered analytics" with "cut reporting time by 80%." Features mean nothing without the "so what."

---

## Sales Deck — 10-12 Slide Framework

1. **Current World Problem** — The pain your buyer lives with today (their language, not yours)
2. **Cost of the Problem** — What inaction costs (time, money, risk) — make it concrete
3. **The Shift Happening** — Market or technology change creating urgency now
4. **Your Approach** — How you solve it differently (not a feature list — a philosophy)
5. **Product Walkthrough** — 3–4 key workflows tied to their pain, not a feature tour
6. **Proof Points** — Metrics, customer logos, analyst recognition
7. **Case Study** — One customer story told well (before/after with real numbers)
8. **Implementation / Timeline** — How they get from here to live (remove the fear of switching)
9. **ROI / Value** — Expected return and payback period (quantified, not "significant")
10. **Pricing Overview** — Transparent, tiered if applicable, anchored correctly
11. **Next Steps / CTA** — Specific action with timeline ("by Friday, we'll...")

**Story arc, not feature tour**: Every deck tells a story: world has a problem → there's a better way → here's proof → here's how to get there.

**Customization by buyer type**:
| Buyer | Lead with | De-emphasize |
|-------|-----------|-------------|
| Technical | Architecture, security, API, integrations | ROI calculations |
| Economic | ROI, payback period, total cost, risk | Technical details |
| Champion | Internal selling points, quick wins, peer proof | Deep technical/financial |

---

## One-Pager — Structure

**Use for**: Post-meeting recap, champion internal selling tool, trade show handout.

```
[Headline — the outcome you deliver]
[Subhead — for whom and how]

THE PROBLEM                    OUR SOLUTION
[Pain in 2 sentences]          [Solution in 2 sentences]

WHY [COMPANY NAME]
• [Differentiator 1 — with proof]
• [Differentiator 2 — with proof]
• [Differentiator 3 — with proof]

WHAT CUSTOMERS SAY             RESULTS
"[Quote — attributed]"         • [Metric 1]
— [Name, Title, Company]       • [Metric 2]
                               • [Metric 3]

NEXT STEP
[Specific CTA — not "learn more"]
[Contact info]
```

**Design rule**: One page, front only, scannable in 30 seconds. This is a sales tool, not a brand piece.

---

## Objection Handling Doc

### Objection Categories

| Category | Examples |
|----------|----------|
| Price | "Too expensive," "No budget this quarter," "Competitor is cheaper" |
| Timing | "Not the right time," "Maybe next quarter" |
| Competition | "We already use X," "What makes you different?" |
| Authority | "I need to check with my boss," "Committee decides" |
| Status quo | "What we have works fine," "Not broken" |
| Technical | "Does it integrate with X?," "Security concerns" |

### Response Format (Per Objection)

```
OBJECTION: "We already use [Competitor]."

WHY THEY SAY IT: Fear of switching cost + sunk cost fallacy.
They're invested and don't want to admit it's not working.

RESPONSE: "That makes sense — a lot of our best customers came from [Competitor].
The question isn't whether to switch, it's whether what you're getting now
is worth the cost. What's the one thing you wish [Competitor] did better?"

PROOF POINT: "[Customer] switched from [Competitor] in 3 weeks and
cut their process time by 40%."

FOLLOW-UP QUESTION: "What would need to change for you to take a second look?"
```

---

## Demo Script Structure

| Section | Duration | Content |
|---------|----------|---------|
| Opening | 2 min | Confirm agenda, goals for the call |
| Discovery recap | 3 min | Summarize pain points heard, confirm priorities |
| Workflow 1 | 5–7 min | Mapped to their #1 pain |
| Workflow 2 | 5–7 min | Mapped to their #2 priority |
| Workflow 3 | 5–7 min | Mapped to their #3 use case |
| Interactive Q&A | Throughout | Ask questions during demo, not just at end |
| Close | 5 min | Summarize value, propose specific next steps |

**Demo principles**:
- Demo after discovery, not before. Without knowing their pain, you're guessing.
- Customize to their use case: use their terminology, their workflow, their industry examples.
- Leave 25% of the time for questions — a demo where the prospect doesn't talk doesn't close.

---

## Buyer Persona Cards

| Field | Economic Buyer | Technical Buyer | End User | Champion |
|-------|---------------|----------------|----------|---------|
| Goals | ROI, risk reduction, predictable budget | Reliable system, clean integration, minimal tech debt | Ease of use, daily workflow fit | Internal credibility, career win |
| Top objections | "Prove the ROI" | "Show me the API / security docs" | "Is this going to be another tool nobody uses?" | "How do I sell this internally?" |
| Lead with | Payback period, cost reduction | Architecture, integration depth, uptime SLA | Time saved, frustration eliminated | Internal selling kit, peer proof |

---

## Sales Playbook Sections

When building a playbook (new product/market/persona):

1. **Buyer profile** — Who you're selling to, their goals and pains
2. **Qualification criteria** — BANT, MEDDIC, or your framework
3. **Discovery questions** — Organized by topic (not a script — a bank of questions)
4. **Objection handling** — Top 10 objections with responses
5. **Competitive positioning** — How you win against each main competitor
6. **Demo flow** — Recommended sequence per persona
7. **Email templates** — Follow-up, proposal, check-in, breakup

**Maintenance rule**: Review quarterly, get input from top reps, remove outdated content. Unowned playbooks rot within 6 months.