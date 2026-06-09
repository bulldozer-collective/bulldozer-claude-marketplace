---
name: pipeline-deal-review
description: Analyze a specific deal: MEDDIC/BANT scoring, red flag identification, stakeholder mapping, and recommended next actions. Triggers on 'review this deal,' 'deal stuck,' 'opportunity review,' 'qualify this deal,' or 'MEDDIC.' For ABM account strategy, see account-based-marketing. For closing tactics, see negotiation-closing.
when-to-use: Analyze a specific deal: MEDDIC/BANT scoring, red flag identification, stakeholder mapping, and recommended next actions. Triggers on 'review this deal,' 'deal stuck,' 'opportunity review,' 'qualify this deal,' or 'MEDDIC.' For ABM account strategy, see account-based-marketing. For closing tactics, see negotiation-closing.
argument-hint: Enterprise deal at Acme Corp, $180k ACV, 6 months in pipeline, VP Ops is champion but no economic buyer access
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# Deal Review

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on deal reviews. Your goal is to score the deal, surface red flags, map the stakeholder landscape, and produce a specific action plan to advance or close.

## Input

`$ARGUMENTS` — deal description: company name, deal size, stage, contacts involved, timeline, known objections, and current status (e.g., "Acme Corp, $120k ACV, Evaluation stage, 4 months in pipeline, VP Ops as champion, haven't met the CFO, they're comparing us to Competitor X"). If not provided, ask for the deal description — this skill requires deal-specific context.

## Output

A `deal-review-{company}.md` file with: MEDDIC scorecard, stakeholder map, red flag analysis, deal health score (1–10), and a prioritized next-action plan (3–5 specific actions with owners and timelines). Includes recommended talk tracks for the most critical next conversation.

**Produce output on first invocation with the deal context provided. Only ask if the company name and deal stage are completely absent.**

---

## MEDDIC Framework

Score each component 1–3:
- **3**: Confirmed, documented, verified
- **2**: Partially known, needs confirmation
- **1**: Unknown or weak

| Component | 3 (Strong) | 2 (Moderate) | 1 (Weak) |
|-----------|-----------|-------------|---------|
| **M — Metrics** | Specific quantified impact ("saves 8 hrs/week per rep") | Vague benefit claimed | No metrics defined |
| **E — Economic Buyer** | Met, understands value, engaged | Identified but not yet accessed | Unknown who controls budget |
| **D — Decision Criteria** | Formal criteria documented, evaluated against | Some criteria known, others unclear | Unknown how they'll decide |
| **D — Decision Process** | Full process mapped (steps, timeline, approvers) | Rough timeline known | Unknown process |
| **I — Identify Pain** | Pain quantified, confirmed by multiple stakeholders | Pain identified by one stakeholder | Pain unclear |
| **C — Champion** | Champion active, has influence, is selling for you internally | Possible champion, limited influence or access | No internal advocate |

**MEDDIC Total Score**: /18

**Interpretation**:
- 15–18: Strong deal — risk is execution
- 10–14: Moderate — missing components are blockers to close
- 6–9: Weak — deal is more wish than pipeline
- <6: Qualification decision required

---

## Stakeholder Map

Map everyone involved in or influencing the decision:

| Role | Name | Title | Stance | Influence | Engaged? |
|------|------|-------|--------|-----------|---------|
| Economic Buyer | | | Supportive/Neutral/Risk | High/Med/Low | Y/N |
| Technical Evaluator | | | | | |
| Champion | | | | | |
| End User Lead | | | | | |
| Legal/Procurement | | | | | |
| Known Blocker | | | | | |

**Stance definitions**:
- **Supportive**: Actively advocates for you
- **Neutral**: Evaluating objectively
- **Risk**: Unknown stance — needs engagement
- **Blocker**: Actively opposing or creating friction

---

## Red Flag Analysis

### Hard Red Flags (Deals Often Die Here)

| Red Flag | Indicator | Action |
|----------|-----------|--------|
| No economic buyer access | Champion says "I'll handle the budget conversation" | Escalate — insist on economic buyer meeting before proposal |
| No decision timeline | "We're evaluating over time" | Establish timeline or reprioritize the deal |
| Competitor advantage not addressed | You don't know why they'd choose you over X | Run competitive displacement conversation |
| Champion losing internal support | Meetings getting postponed, champion less responsive | Develop alternate relationships in the account |
| Demo not specific to their use case | Showed generic demo, no customization | Offer a tailored POC or scenario-specific follow-up |
| Verbal "yes" with no next step | "This looks great, we'll be in touch" | Never end a meeting without a specific next step |

### Soft Red Flags (Warning Signs)

- More than 3 evaluation stages without a decision commitment
- Procurement involved before commercial agreement on value
- IT/Security review triggered before business case is confirmed
- Executive sponsor not replicated across their org chart
- Price objection before value is established

---

## Deal Health Score (1–10)

Combine three dimensions:

| Dimension | Weight | Your score |
|-----------|:------:|:----------:|
| MEDDIC completion (% of 18 pts) | 40% | |
| Stakeholder coverage (% of buying committee engaged) | 35% | |
| Deal momentum (last meaningful progress was <2 weeks ago) | 25% | |

**Deal Health Score** = weighted average

- 8–10: High confidence, focus on execution and closing
- 5–7: Moderate — specific gaps need to be closed before forecasting
- <5: Action required — deal may need to be reviewed for close plan or disqualification

---

## Common Deal Archetypes and Plays

### The Stuck Deal (4+ months in evaluation with no movement)

**Root cause**: Usually missing economic buyer access OR undefined decision process.

**Play**:
1. Direct conversation with champion: "Help me understand — what needs to happen for you to make a decision?"
2. Offer to run a "Business Case Review" with the economic buyer directly
3. Create urgency with a deadline: limited pricing, implementation slots, or a competing event

### The Competitor Threat

**Root cause**: Competitor has better positioning, pricing, or timing.

**Play**:
1. Ask directly: "What's their strongest argument? What would make you choose them?"
2. Run a structured proof point comparison — not a feature checklist, but a specific scenario
3. Find the criterion your competitor fails on and amplify it

### The Committee Deal (Many stakeholders, no clear decision-maker)

**Root cause**: Political complexity, no internal champion with authority.

**Play**:
1. Map the committee — identify the informal decision-maker (not always the highest title)
2. Run an executive alignment meeting before submitting a proposal
3. Build a coalition: convert neutral stakeholders to supporters one at a time

### The Price Objection at Proposal Stage

**Root cause**: Value not established before price was introduced.

**Play**:
1. Never negotiate on price before ROI is agreed upon
2. "Before we talk about price, can we agree on what the value of solving this problem is worth to you?"
3. Offer a phased implementation that lowers initial commitment while proving value

---

## Prioritized Next-Action Plan

Output 3–5 specific actions:

```
1. [Action] — [Who] — [By when]
   Why: [What this unblocks]
   Talk track: [Opening line for the conversation]

2. [Action] — [Who] — [By when]
   Why: [What this unblocks]
   Talk track: [Opening line for the conversation]
```

**Action quality criteria**:
- Specific (not "follow up with champion" — "schedule 30-min with CFO to present business case")
- Owned (assigned to one person)
- Time-bound (by this Friday, by end of Q)
- Linked to a specific MEDDIC gap