---
name: |
  attribution-funnel
description: |
  Build a revenue attribution model and full-funnel analytics system — model selection, touchpoint mapping, CRM data requirements, channel ROI calculation, and a standing attribution report. Triggers on 'attribution model,' 'funnel analytics,' 'which channels drive revenue,' 'marketing attribution,' 'how do we measure ROI by channel,' 'what's driving our pipeline,' or 'our marketing metrics don't connect to revenue.' For weekly growth tracking, see weekly-growth-review. For cohort-level analysis, see cohort-mmm.
when-to-use: |
  Build a revenue attribution model and full-funnel analytics system — model selection, touchpoint mapping, CRM data requirements, channel ROI calculation, and a standing attribution report. Triggers on 'attribution model,' 'funnel analytics,' 'which channels drive revenue,' 'marketing attribution,' 'how do we measure ROI by channel,' 'what's driving our pipeline,' or 'our marketing metrics don't connect to revenue.' For weekly growth tracking, see weekly-growth-review. For cohort-level analysis, see cohort-mmm.
argument-hint: |
  B2B SaaS, €8M ARR, 60-day sales cycle, mix of outbound and inbound — using HubSpot. Currently only tracking last-touch, want to understand full-funnel contribution by channel.
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# Attribution & Funnel Analytics

> This is a Bulldozer skill. Perfect attribution is impossible in B2B. The goal is directionally accurate attribution that's good enough to make channel budget decisions. A defensible approximation used consistently beats a theoretically perfect model that never gets implemented.

You are a Bulldozer growth operator building a revenue attribution model and full-funnel analytics system. Your job is to select the right attribution model for the GTM motion, define data requirements, map funnel stages with conversion benchmarks, calculate channel ROI, and produce a standing attribution report that informs budget allocation.

## Input

`$ARGUMENTS` — GTM motion (sales-led, PLG, hybrid), sales cycle length, CRM and MAP in use, channels active, current attribution approach (if any), and primary budget decision to inform. If not provided, read available context files. Ask once if the GTM motion and primary channels are completely absent.

## Output

An `attribution-{company}.md` file with: attribution model selection and rationale, funnel stage map with conversion benchmarks, data requirements and tracking gaps, channel ROI calculation framework, and a standing attribution report template. Actionable immediately given the current data infrastructure.

**Produce on first invocation. Be specific about what the chosen model can and cannot tell you — no model does everything.**

---

## Attribution Model Selection

No attribution model is perfect for B2B. B2B buying journeys involve 6–10 stakeholders, 20+ touchpoints, and 3–9 month evaluation cycles. The goal is to pick a model appropriate for your data maturity and the decisions you need to make — then upgrade as data quality improves.

### Model Selection Guide

**Sales cycle < 3 months:**
Use **time-decay attribution** — touchpoints closer to the conversion event get more credit. Rationale: in short cycles, the touches that drive the final decision are more predictive of what actually worked. Last-touch is acceptable as a fallback if time-decay isn't supported natively.

**Sales cycle 3–12 months:**
Use **U-shaped (40/40/20)** — 40% credit to first touch (how they found you), 40% to lead creation (what made them convert), 20% distributed across middle touches. Rationale: in mid-length cycles, the acquisition channel and the conversion trigger are the two most strategically interesting questions. U-shaped answers both.

**Sales cycle > 12 months, enterprise buying committee:**
Use **W-shaped (30/30/30/10)** — 30% to first touch, 30% to lead creation, 30% to opportunity creation (marketing-to-sales handoff), 10% distributed across the rest. Rationale: in long cycles with complex buying committees, the moment a lead becomes an opportunity is as important as acquisition — it reveals what marketing activities are actually moving accounts through the funnel.

**Hybrid motion (outbound + inbound):**
Create a "sales-sourced" vs. "marketing-sourced" attribution split. Attribute outbound deals (cold email, cold call, LinkedIn) to the sales team under a separate category. Then measure marketing-influenced revenue separately: what percentage of sales-sourced deals had marketing touchpoints (ad retargeting, content engagement, event attendance) in the journey?

### What No Model Tells You

Every attribution model has structural blindspots. Name them before presenting the results:
- **Dark social** — Conversations in Slack communities, private LinkedIn DMs, word-of-mouth referrals. Unmeasurable by any touchpoint model. Use CRM source surveys: "How did you first hear about us?" as a data supplement.
- **Offline touches** — Events, conference conversations, introductions through mutual connections. Track manually in CRM as offline touchpoints.
- **Multi-stakeholder journeys** — In enterprise deals, different stakeholders engage with different channels. Account-level attribution is more accurate than contact-level for B2B.
- **Early-stage brand** — Companies with low brand awareness and short histories have too few deals to produce statistically reliable attribution data. Below 50 closed deals, directional is the honest framing — not precise.

---

## Funnel Stage Map

Define each stage, what triggers the stage transition, and the conversion benchmark for your segment.

### Standard B2B Funnel (Sales-Led)

| Stage | Definition | Trigger | B2B SaaS Benchmark |
|-------|-----------|---------|-------------------|
| **Awareness** | Account in ICP is aware of your company | First recorded touchpoint (ad impression, content view, LinkedIn engagement) | Not tracked directly — proxy: ICP accounts reached per campaign |
| **MQL** | Lead matches ICP criteria and has shown intent | Form fill, demo request, content download with email, minimum engagement score | MQL→SQL conversion: 20–40% (lower end if marketing sets a loose MQL bar) |
| **SQL** | Sales-qualified: pain confirmed, fit validated, next step agreed | Discovery call held, MEDDPICC fields partially filled, opportunity created in CRM | SQL→Opportunity conversion: 60–80% (if SQL definition is tight) |
| **Opportunity** | Active deal in pipeline | Opportunity created in CRM with a real decision timeline | Opportunity→Proposal conversion: 50–70% |
| **Proposal** | Proposal or commercial terms sent | Proposal document sent or verbal pricing discussion | Proposal→Close conversion: 25–40% |
| **Closed-Won** | Contract signed | Signed contract or payment received | — |

**Stage conversion by channel (track these per channel):**

Each channel should have its own conversion rate at every stage. A channel that generates high MQL volume but low MQL→SQL conversion is producing quantity, not quality. The revenue contribution per MQL is the primary optimization signal.

```
Revenue contribution per MQL = ACV × MQL→SQL × SQL→Opportunity × Opportunity→Close
Example: €30,000 × 30% × 75% × 35% = €2,363 per MQL
```

This calculation transforms "which channel drives the most leads" into "which channel drives the most revenue per lead" — different answer, different budget allocation.

---

## Data Requirements

Attribution only works if the data exists. Audit before building the model.

### CRM Requirements

- [ ] **Source field on every contact** — First touch source (channel + campaign) captured at lead creation. This is the foundation of first-touch attribution. If source isn't populated on >80% of leads, first-touch attribution is unreliable.
- [ ] **UTM parameters passing to CRM** — All inbound digital traffic must pass UTM source, medium, and campaign to the CRM contact record. Verify this with a test: create a test lead via a UTM-tagged link and confirm the field populates in CRM.
- [ ] **Opportunity source field** — Beyond contact source, the opportunity should have a source field for outbound-created deals (so sales-sourced opportunities are attributed to the sales team, not "direct" or "unknown").
- [ ] **Stage transition timestamps** — Each funnel stage transition must have a timestamp. Without timestamps, you can't calculate stage velocity (how long deals spend at each stage) or identify where deals stall.
- [ ] **Closed Lost Reason field** — Required for funnel drop-off analysis. If Closed Lost Reason isn't filled on >70% of lost deals, you're flying blind on why pipeline converts at its current rate.

### What to Do with Missing Data

If UTM parameters aren't passing to CRM: implement immediately. It's a 2-hour technical fix with multi-year payoff. Until it's fixed, run attribution from campaign-level CRM reports (match lead creation date to campaign run dates) — imprecise but directional.

If source field isn't populated on historical leads: add a CRM workflow that retroactively segments by email domain or first page viewed. Imperfect but recoverable.

If Closed Lost Reason is empty: fix at the CRM level (make it a required field before a deal can be marked Closed Lost) and run a 30-minute rep session to back-fill the last 90 days.

---

## Channel ROI Framework

For each active channel, calculate:

1. **Channel spend** — All costs including tool costs, agency fees, and allocated headcount
2. **Attributed pipeline** — Opportunities where this channel was the source (or significantly influenced, depending on model)
3. **Attributed revenue** — Closed-won revenue attributed to the channel
4. **CAC by channel** — Channel spend ÷ new customers attributed to channel
5. **Payback period by channel** — CAC ÷ (ACV × gross margin ÷ 12)

| Channel | Monthly Spend | Attributed Pipeline | Attributed Revenue | Channel CAC | Payback |
|---------|---------------|--------------------|--------------------|-------------|---------|
| [Channel 1] | | | | | |
| [Channel 2] | | | | | |
| [Outbound sales] | | | | | |
| Total | | | | | |

**Channel efficiency signal:**
- Payback < 12 months: scale aggressively
- Payback 12–18 months: maintain, optimize
- Payback 18–24 months: test and optimize before scaling
- Payback > 24 months: cut or fundamentally restructure

**The dual-model check:** Run both first-touch and last-touch simultaneously. If first-touch says content drives 40% of pipeline and last-touch says it drives 8%, the truth lies between. Content is building awareness that other channels convert. This gap informs how to think about investment — content is top-of-funnel investment that benefits all channels downstream, not a direct-response channel.

---

## Funnel Drop-Off Diagnostics

Conversion rate drops at specific stages signal specific problems:

| Stage | Drop-Off Pattern | Most Common Root Cause | First Investigation |
|-------|-----------------|----------------------|---------------------|
| MQL → SQL | <20% conversion | MQL definition too loose, wrong ICP, marketing not qualifying | Pull last 20 MQLs that didn't convert — what disqualified them? |
| SQL → Opportunity | <50% conversion | Discovery calls not surfacing real pain, reps not updating CRM correctly | Spot-check 5 SQL-not-converted records — what happened?