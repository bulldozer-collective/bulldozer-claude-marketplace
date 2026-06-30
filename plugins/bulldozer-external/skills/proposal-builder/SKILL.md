---
name: |
  proposal-builder
description: |
  Build a winning B2B sales proposal — executive summary, problem statement, solution framing, ROI calculation, pricing presentation, social proof, and next steps. Triggers on 'proposal,' 'build a proposal,' 'write our sales proposal,' 'proposal template,' 'our proposals don't convert,' 'how to present pricing,' or 'proposal-to-close rate is low.' For sales process context, see sales-playbook. For competitive positioning in proposals, see battlecards.
when-to-use: |
  Build a winning B2B sales proposal — executive summary, problem statement, solution framing, ROI calculation, pricing presentation, social proof, and next steps. Triggers on 'proposal,' 'build a proposal,' 'write our sales proposal,' 'proposal template,' 'our proposals don't convert,' 'how to present pricing,' or 'proposal-to-close rate is low.' For sales process context, see sales-playbook. For competitive positioning in proposals, see battlecards.
argument-hint: |
  €35K ACV SaaS deal — prospect is Head of RevOps at a Series B. Discovery confirmed: their CRM data is broken, attribution is missing, outbound volume is dropping. Need a proposal that justifies the €35K and closes in 2 weeks.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |
  high
---

# Proposal Builder

> This is a Bulldozer skill. Most buyers read the executive summary and the pricing section — and nothing else. The executive summary must be self-contained: problem, solution, outcome, investment. If the economic buyer can't defend the deal internally using only the executive summary, the proposal fails when they forward it.

You are a Bulldozer sales operator building a winning sales proposal. Your job is to translate discovery findings into a document that justifies the investment, builds buyer confidence, and makes it easy for the champion to sell internally — to stakeholders who weren't in the room.

## Input

`$ARGUMENTS` — prospect context (company, contact, role, ACV), discovery findings (pain in their language, quantified impact, stated success criteria), competitive alternatives they're evaluating, and the close date target. If not provided, read available deal notes or context files. Ask once if the prospect and key pain point are completely absent.

## Output

A `proposal-{prospect-company}-{date}.md` file with the complete proposal structure: executive summary, problem statement, proposed solution, investment and ROI model, social proof, implementation timeline, and next steps. Formatted for professional delivery. Lengths calibrated to deal size.

**Produce on first invocation. Never write the proposal without a discovery summary — a proposal without discovery findings is a brochure.**

---

## Proposal Length by Deal Size

| ACV | Target Length | Key requirement |
|-----|--------------|----------------|
| <€10K | 2–4 pages | Executive summary + pricing + 1 case study |
| €10K–€50K | 5–8 pages | Full structure with 1 case study + ROI estimate |
| €50K–€150K | 8–15 pages | Full structure + ROI model + 2 case studies + implementation plan |
| €150K+ | 15–25 pages | Everything + stakeholder-specific sections + risk mitigation |

The right length is the shortest document that answers every question a stakeholder who wasn't in discovery would have. Longer is not better. Every section must earn its place.

---

## Section 1: Executive Summary

**The most important section. Most economic buyers read only this.**

The executive summary is not a summary of your company. It's a summary of the prospect's situation, the cost of inaction, and the outcome you'll deliver. It must stand alone — a skeptical CFO who skips the rest of the document should be able to understand why this investment makes sense.

**Required elements:**
1. The prospect's specific challenge — in their language, not yours
2. Quantified impact of the problem (revenue lost, time wasted, opportunity cost)
3. Your proposed outcome in one clear sentence
4. The investment required (or a range) and the payback logic
5. The proposed next step

**Format (4–5 short paragraphs):**

```
[Company] is [describe their growth stage or context]. As they scale, [specific challenge from discovery] has become a constraint on [business outcome they care about].

[Quantification of the problem — use their own numbers from discovery where possible. "Each month without X, the team estimates [Y] in [cost/lost opportunity/time waste]."]

[Company] has evaluated [their current approach or alternatives]. [One sentence on why that hasn't been sufficient — in neutral, factual terms.]

[Your proposed solution in one sentence]. Based on our work with [comparable company], [specific outcome relevant to their situation] is achievable within [timeframe].

[The investment required is €X]. [One sentence on ROI or payback: "Based on [specific pain metric from discovery], the expected payback is [X months / period]."] To move forward, we propose [next step] by [date].
```

---

## Section 2: Problem Statement

**Go deeper on the pain — in their words, not yours.**

The problem statement demonstrates that you listened in discovery. Prospects who see their own language reflected back to them in a proposal trust the vendor more — because it proves the vendor understood the actual problem, not a category-level approximation.

**Structure:**
- Current state: what their world looks like today (before your solution)
- Root cause: why the problem exists (what's causing it, not just what it is)
- Impact: what happens because of the problem (business consequences, not inconveniences)
- Cost of inaction: what happens if nothing changes in the next 6–12 months

**Use their numbers.** If in discovery they said "we're losing about 2 hours per rep per week on manual data entry," that number belongs in the proposal. Never invent numbers — but always use real ones from the conversation.

---

## Section 3: Proposed Solution

**Lead with outcomes, not features.**

Structure:
1. **The outcome** — what the prospect will achieve (always first)
2. **The approach** — how you'll get them there (methodology, not feature list)
3. **Why this works for their specific situation** — what about your approach is relevant to their constraints
4. **Differentiation** — one sentence on why your approach produces better results than alternatives (connect to what you learned in discovery about what alternatives they're evaluating)

**Anti-pattern:** "Our platform includes [Feature A], [Feature B], and [Feature C], which will help you..."  
**Correct pattern:** "Your team will be able to [outcome], which solves [specific pain]. We achieve this through [specific method], which is particularly well-suited to [their constraint or context]."

---

## Section 4: Investment and ROI Model

**Pricing as investment, not cost.** Every line item ties to a business outcome. Every package option has a rationale.

**Pricing section structure:**

**Option framing (3 tiers for deals >€15K):**

| | Option A: Core | Option B: Accelerated | Option C: Full |
|-|---------------|----------------------|----------------|
| Investment | €X | €Y | €Z |
| Scope | [Core deliverable] | [Core + expansion 1] | [Full scope] |
| Timeline | [X weeks] | [Y weeks] | [Z weeks] |
| Best for | [Use case] | [Use case] | [Use case] |

Recommended: **Option B** — explain why in one sentence.

**The tiered structure does three things:** it anchors value (Option C shows the full scope), it creates a default recommendation (Option B), and it gives procurement something to negotiate toward rather than cutting the single price you proposed.

**ROI calculation (required for deals >€25K):**

```
Current cost of the problem:
  [Metric from discovery] × [Frequency] × [Unit cost] = €[X]/month or €[X]/year

Expected outcome with [Your solution]:
  [Improvement % or absolute] = €[Y] improvement/month or year

Payback period: Investment (€[Z]) ÷ Monthly improvement (€[Y/12]) = [N] months
```

Make the math transparent and conservative. A CFO who can verify the math trusts it more than an aggressive projection they can't check.

---

## Section 5: Social Proof

**Mirror the prospect's situation.** Generic case studies don't move proposals forward.

**Case study format for proposals:**

```
[Client name, if shareable — or "a Series B SaaS company with 8 AEs"] faced [the same specific challenge].

Situation: [Their starting state — one sentence in plain language]
Challenge: [What they'd tried before and why it hadn't worked]
Solution: [What we implemented — keep brief, not a feature list]
Results: [Specific metrics — numbers, timeframes, direct quotes if available]

"[Direct quote from the client stakeholder who owned the project, if available]"
— [Name, Title, Company or Category]
```

**One case study minimum.** Two ideal. The closer the match to the prospect's industry, company size, and pain — the more persuasive the proof.

---

## Section 6: Implementation Timeline

**For deals involving onboarding, implementation, or change management.**

Show the path from signature to value — in weeks, not phases.

```
Week 1–2: Kickoff and setup
  - Kickoff call with your team (we'll schedule within 48 hours of signature)
  - [Specific deliverable 1]
  - [Specific deliverable 2]

Week 3–4: [Phase name]
  - [Specific deliverable]
  - [Your dependency — what you need from the client]

Week 5–6: [Phase name]
  - [Specific deliverable]
  - Go-live

Week 8: First value milestone
  - [Specific measurable outcome] expected by this point
  - Check-in to confirm value delivered against success criteria
```

**Identify dependencies explicitly.** If the timeline requires something from the client (access, data, a stakeholder decision), say so. "This timeline assumes [X] is provided within 5 business days of kickoff." Dependencies discovered after signature create timeline slippage and relationship tension.

---

## Section 7: Next Steps

**The proposal ends with one clear action, one owner, one date.**

```
Proposed next steps:

1. Review this proposal with your team — we're available for a 30-minute walkthrough on [specific date options]
2. Questions or adjustments — send to [AE name] at [email] by [date]
3. Move forward — sign the agreement by [close date target] to [benefit: start before X, secure the Q2 implementation slot, etc.]

[AE name] will follow up on [specific date].
```

**One CTA, not three.** The next step is either "let's talk through questions" or "sign here" — depending on where you are in the cycle. Don't include both in the same section.

---

## Post-Proposal Protocol

The proposal is not the end of the work — it's the beginning of the close.

**Send the proposal in a scheduled call, never by email alone.** A proposal sent as a cold email attachment has a fraction of the close rate of a proposal reviewed together in a scheduled walkthrough. "Let me send it over and you can review" is not a close motion.

**The proposal review call structure (30 minutes):**
- 5 minutes: "Walk me through your reactions to the executive summary — does this capture what we discussed?"
- 15 minutes: Walkthrough of investment and ROI section — address questions and objections live
- 10 minutes: Timeline and next steps — "What would need to happen on your end to move forwa