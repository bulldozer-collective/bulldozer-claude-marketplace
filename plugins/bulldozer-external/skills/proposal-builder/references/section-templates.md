# Proposal Section Templates and Case Study Sourcing

## Section 1: Executive Summary — Format

**Format (4–5 short paragraphs):**

```
[Company] is [describe their growth stage or context]. As they scale, [specific challenge from discovery] has become a constraint on [business outcome they care about].

[Quantification of the problem — use their own numbers from discovery where possible. "Each month without X, the team estimates [Y] in [cost/lost opportunity/time waste]."]

[Company] has evaluated [their current approach or alternatives]. [One sentence on why that hasn't been sufficient — in neutral, factual terms.]

[Your proposed solution in one sentence]. Based on our work with [comparable company], [specific outcome relevant to their situation] is achievable within [timeframe].

[The investment required is €X]. [One sentence on ROI or payback: "Based on [specific pain metric from discovery], the expected payback is [X months / period]."] To move forward, we propose [next step] by [date].
```

## Section 5: Social Proof — case study format and sourcing

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

**For an Existing Business deal (renewal or expansion), the strongest proof is this account's own history — not a comparable client's.** Check `dealtype` on the deal record before defaulting to the format below: a renewal or expansion pitch that reaches for a stranger's case study when the buyer already has a year of your own delivered results on file reads as if the account team hasn't been paying attention. Lead instead with what's actually happened since signature — adoption, the outcome already achieved, the metric that moved — and reserve the external case-study format for New Business deals, or for an expansion into a genuinely new use case this account hasn't touched yet.

**If this portal runs Commerce Hub, pull the account's own revenue trajectory instead of reconstructing it from memory.** The `SUBSCRIPTION` object (`hs_arr`, `hs_mrr`, `hs_status`) carries this account's actual recurring-revenue history since signature — a real number for the "metric that moved" paragraph above, not an estimate. Company-level rollups (`hs_next_renewal_date`, `hs_num_active_contracts`) only populate when Commerce Hub Contracts is also active on this portal — check before citing them rather than assuming every client has both pieces turned on.

**Sourcing the case study.** If HubSpot is connected, `mcp__HubSpot__search_crm_objects` (objectType `DEAL`, `hs_is_closed_won=true`) surfaces real closed-won deals to check against before writing this section — confirm with the account owner that the client has agreed to be referenced before naming them; when they haven't, anonymize as shown in the format above ("a Series B SaaS company with 8 AEs"). Never invent a result, a metric, or a quote to fill this section — an unverifiable number here is the fastest way to lose credibility on the one section meant to build it.

## Section 6: Implementation Timeline — template

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

## Section 7: Next Steps — template

```
Proposed next steps:

1. Review this proposal with your team — we're available for a 30-minute walkthrough on [specific date options]
2. Questions or adjustments — send to [AE name] at [email] by [date]
3. Move forward — sign the agreement by [close date target] to [benefit: start before X, secure the Q2 implementation slot, etc.]

[AE name] will follow up on [specific date].
```

**One CTA, not three.** The next step is either "let's talk through questions" or "sign here" — depending on where you are in the cycle. Don't include both in the same section.
