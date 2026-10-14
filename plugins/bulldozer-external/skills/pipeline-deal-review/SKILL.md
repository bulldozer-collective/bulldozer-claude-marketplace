---
name: |-
  pipeline-deal-review
description: |-
  Analyze a specific deal: MEDDIC scoring, red flag identification, stakeholder mapping, and recommended next actions. Triggers on 'review this deal,' 'deal stuck,' 'opportunity review,' 'qualify this deal,' or 'MEDDIC.' For ABM account strategy, see account-based-marketing. For closing tactics, see negotiation-closing.
when-to-use: |-
  Analyze a specific deal: MEDDIC scoring, red flag identification, stakeholder mapping, and recommended next actions. Triggers on 'review this deal,' 'deal stuck,' 'opportunity review,' 'qualify this deal,' or 'MEDDIC.' For ABM account strategy, see account-based-marketing. For closing tactics, see negotiation-closing.
argument-hint: |-
  Enterprise deal at Acme Corp, $180k ACV, 6 months in pipeline, VP Ops is champion but no economic buyer access
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Deal Review

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on deal reviews. Your goal is to score the deal, surface red flags, map the stakeholder landscape, and produce a specific action plan to advance or close.

## Input

`$ARGUMENTS` — deal description: company name, deal size, stage, contacts involved, timeline, known objections, and current status (e.g., "Acme Corp, $120k ACV, Evaluation stage, 4 months in pipeline, VP Ops as champion, haven't met the CFO, they're comparing us to Competitor X"). If not provided, ask for the deal description — this skill requires deal-specific context.

## Output

A `deal-review-{company}.md` file with: MEDDIC scorecard, stakeholder map, red flag analysis, deal health score (1–10), and a prioritized next-action plan (3–5 specific actions with owners and timelines). Includes recommended talk tracks for the most critical next conversation.

**Produce output on first invocation with the deal context provided. Only ask if the company name and deal stage are completely absent.**

**Ground the review in what actually happened, not in what the rep remembers.** Before scoring MEDDIC from the text description alone, check whether this deal exists in the CRM (HubSpot) and has recorded calls (Claap) — a deal record carries its real stage, owner and last-activity date, and Claap's transcript search filters by this exact deal and by topic tag (`Objections`, `PainPoints`, `CompetitorMentions`). Each beats guessing from a stakeholder's mood. A scorecard filled from memory is a box ticked, not a qualification. Field and tag detail: `references/crm-signals.md`.

**A new-logo deal and an expansion deal don't get judged by the same bar.** Pull the deal's `dealtype` field (New Business vs. Existing Business). On existing business, the account already has a working relationship — a weak Economic Buyer or Champion score is a worse signal there than on a brand-new logo, where nobody would expect access yet. Score both the same way, weigh the gap as more urgent on existing business. Field detail: `references/crm-signals.md`.

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

**Note on scope**: this scorecard covers the six MEDDIC components. Enterprise deals over ~$100k with formal procurement or 6+ stakeholders also carry two risks MEDDIC doesn't score — the paper process (legal/security/procurement review, which can add weeks to a close date on its own) and named competition. If either is live on this deal, track it explicitly in the next-action plan even though it has no line in the table above; don't force it into one of the six components.

**On MEDDPICC**: Paper Process and Competition above are the two letters MEDDPICC adds to MEDDIC. The name is a legitimate industry term, not marketing gloss — Force Management, the firm that co-created MEDDIC, documents MEDDPICC as its established successor framework. That's not a reason to relabel this scorecard: renaming a deal review "MEDDPICC" is only worth doing if the CRM actually tracks a paper-process field and a named-competitor field per deal. Without that, it's a name on a slide, not a control applied to the deal. Keep the six-component table as the qualification instrument here; carry Paper Process and Competition as flagged risks in the next-action plan, the way this skill already does above.

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

**A cheap sanity check before filling this table by memory**: HubSpot's deal-level contact count is set automatically — a deal several months in with only one associated contact is already the single-threaded pattern below, before a single row of this table is filled in.

**Pull `hs_buying_role` before guessing roles from job titles.** HubSpot's native Contact field is a 9-value, multi-select enum (a contact can carry several roles at once) — faster and more reliable than inferring "Champion" or "Economic Buyer" from a title on a business card. Its real limit: the field lives on the Contact, not the deal, so it can't capture a stakeholder playing different roles on two open deals — for that, use the Contact:Deal association label or Buying Groups (Sales Hub, when the portal has it). This table is still what turns a role into a stance and an influence read for *this* deal; `hs_buying_role` is the free pre-fill, not a replacement for it. Full field detail: `references/crm-signals.md`.

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

**Before asking whether you know why they'd choose a competitor, check if Claap already told you.** The `CompetitorMentions` transcript tag (`references/crm-signals.md`) confirms this Hard Red Flag instead of guessing it.

**Single-threaded escalation threshold**: don't wait for the deal to stall before naming this risk. The moment two consecutive calls on the same deal pass without the economic buyer present, log it as an explicit single-threaded account risk — a line in the next-action plan with an owner, not a note to self for later. Waiting for a third call to raise it is waiting for the deal to teach you what the second call already showed.

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

**Don't substitute the CRM's own forecast fields for this score, and don't ignore them either.** HubSpot's stage-based probability and its manual forecast category (Pipeline / Best Case / Commit / Closed Won, set by hand by the rep) are two separate, portal-specific signals — treat a mismatch between either one and this score as data, not noise: a deal marked "Commit" that scores <5 here is exactly the disagreement this review exists to surface. Raise it explicitly in the action plan rather than averaging it away. Field detail: `references/crm-signals.md`.

**A third native field, `hs_deal_score`, is worth a glance before the review, not worth building on.** HubSpot's own AI-predicted deal-health number doesn't expose its factors and isn't auditable the way the three weighted dimensions above are, so it never replaces scoring MEDDIC by hand — pull it as a cross-check, and confirm first that it's actually populated on this portal (the feature can be gated by Sales Hub tier, and an empty field reads identically to a low one). Field detail: `references/crm-signals.md`.

---

## Common Deal Archetypes and Plays

Four patterns cover most stuck or at-risk deals. Each has a specific play, talk tracks included — for the full steps, read `references/deal-archetypes.md`.

- **The Stuck Deal** (4+ months in evaluation, no movement) — usually missing economic buyer access or an undefined decision process. Disqualify it if it survives two structured interventions without producing a new, dated next step; past that, "in evaluation" pollutes the forecast instead of protecting it.
- **The Competitor Threat** — ask directly what their strongest argument is, then run a specific scenario comparison rather than a feature checklist.
- **The Committee Deal** (many stakeholders, no clear decision-maker) — map the committee (Buying Groups, when the portal has it, renders this as an org chart), run executive alignment before a proposal, build the coalition one stakeholder at a time.
- **The Price Objection at Proposal Stage** — value wasn't established before price was introduced; never negotiate price before ROI is agreed.

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

---

## Rules

- **A finished review ends in a decision, not a table.** "Advance," "disqualify," or "escalate" — stated once, plainly, before the action plan. A stakeholder map and a red flag list with no verdict at the top haven't reviewed anything.
- **A score is only as good as its evidence.** Don't award a 3 on Metrics or Pain because the rep is confident — award it because a named person on the buying side said a number, a budget, or a date out loud. Where the only evidence is the rep's read of the room, score it a 2 at most and say so.
- **Champion and economic buyer are never the same box.** A deal with a strong, engaged champion and zero access to the person who signs is not a strong deal — it's an unqualified one wearing a strong champion's optimism.
- **Silence after a proposal is not a yes.** Don't log a deal as "pending" past its committed decision date without a scheduled next touch. A deal with no next step is a deal that's dying quietly.
- **One hard red flag outweighs a high MEDDIC score.** A 15/18 scorecard with no economic buyer access is still a coin flip, not a strong deal — the health score exists to catch exactly this contradiction, not to be overridden by it.
- **Don't write a talk track for a conversation you're not going to have this week.** If the next action is more than two weeks out, the deal doesn't need a script yet — it needs the action that gets it back onto a timeline.