---
name: |-
  sales-compensation
description: |-
  Design or audit sales compensation plans — OTE, quota, accelerators, and commission structure for AEs and SDRs. Triggers on 'sales comp plan,' 'OTE,' 'commission structure,' 'quota setting,' 'accelerator,' 'sales rep compensation,' or 'how should I pay my sales team.' For CRM and pipeline operations, see revenue-operations. For deal review and close strategy, see pipeline-deal-review.
when-to-use: |-
  Design or audit sales compensation plans — OTE, quota, accelerators, and commission structure for AEs and SDRs. Triggers on 'sales comp plan,' 'OTE,' 'commission structure,' 'quota setting,' 'accelerator,' 'sales rep compensation,' or 'how should I pay my sales team.' For CRM and pipeline operations, see revenue-operations. For deal review and close strategy, see pipeline-deal-review.
argument-hint: |-
  Early-stage B2B SaaS, first AE hire, $30K ACV, need to design first comp plan with OTE and quota
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - mcp__HubSpot__get_properties
  - mcp__HubSpot__query_crm_data
  - mcp__HubSpot__tool_guidance
effort: |-
  high
---

# Sales Compensation

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on sales compensation design. Your goal is to help design comp plans that motivate the right behaviors, are fair to reps, and protect company economics — without over-engineering.

## Input

`$ARGUMENTS` — role (AE, SDR, CSM), average deal size, stage, and what decision to make (e.g., "first AE hire, $30K ACV B2B SaaS, design comp plan with OTE and quota"). If not provided, read any available context files. Only ask if the role and deal size are completely absent.

If HubSpot is the connected CRM, pull the real average deal size and cycle length instead of asking for an estimate. Once per session, before the first `query_crm_data` call, call `tool_guidance` on `query_crm_data` — HubSpot's own tool requires it, and it returns the real SQL dialect (no aliases, no `JOIN`, no subqueries) plus the owner/property resolution steps a well-formed query needs. With that in hand, `query_crm_data` on the `DEAL` object exposes `amount_in_home_currency` (ACV), `hs_is_closed_won`, `closedate`, and `days_to_close` as default properties, filterable to `hs_is_closed_won = true` and scoped to one `pipeline` at a time (a portal commonly runs several pipelines with unrelated stage sets — don't mix them). A quota built on the client's own closed-won deals beats one built on an assumed ACV.

## Output

A `sales-comp-{role}.md` file with: OTE recommendation, base/variable split, quota calculation, commission rate structure, accelerators and decelerators, ramp plan, and a model showing total comp at different attainment levels (50%, 75%, 100%, 125%, 150%).

**Produce output on first invocation. Read available context before asking. Only ask if the role and ACV are completely absent.**

---

## Comp Plan Fundamentals

### The Three Levers

| Lever | Definition |
|-------|-----------|
| **OTE** (On-Target Earnings) | Total comp if the rep hits exactly 100% of quota |
| **Base salary** | Fixed pay regardless of performance |
| **Variable pay** | Commission, bonuses — earned by hitting quota and beyond |

### Base / Variable Split by Role

| Role | Base | Variable | Rationale |
|------|------|----------|-----------|
| Enterprise AE | 50–60% | 40–50% | Long cycles, relationship-driven |
| Mid-market AE | 40–50% | 50–60% | Balanced pressure and stability |
| SMB AE / full-cycle | 35–45% | 55–65% | High volume, shorter cycles |
| SDR / BDR | 60–70% | 30–40% | Activity-driven, lower income ceiling |
| CSM (expansion-focused) | 60–70% | 30–40% | Retention + expansion mix |

### Quota Setting

**Rule of thumb: quota = 4–6× OTE** for SaaS AEs (up to 5.5–6× for enterprise, large-ACV roles).

If OTE is $150K, quota should be $600K–$900K ARR.

This ratio ensures:
- Company pays ~15–25% of revenue in sales comp (standard SaaS range)
- Rep has a realistic shot at quota (50–60% of reps should hit)
- Economics work at scale

For the caveats on the 4-6x quota multiple, when to stop using the ratio, and the market check on capacity numbers, read `references/quota-and-attainment-caveats.md`.

### The 50% Rule

A well-designed comp plan should have 50–60% of reps at or above quota. If fewer hit quota consistently, either the quota is too high or the product/GTM has problems. If more than 80% hit quota, the quota is too low — you're overpaying.

For the caveat on the 50% rule, a live reality check from RepVue data, and when not to touch the comp plan, read `references/quota-and-attainment-caveats.md`.

---

## Commission Rate Structure

### Flat Rate (simple, for early stage)

One commission rate applies to all closed revenue.

```
Commission = Revenue × Rate
Example: 8% on all ARR closed
On a $30K deal: $2,400 commission
```

**Use flat rate** until you have enough deal history to design a sophisticated structure. Don't overcomplicate it in year one.

**What "enough deal history" actually means**: not two or three closed deals. Wait for either a real cluster in the ACV distribution (a visible gap between your smallest and largest recurring deal sizes, not just one outlier) or a specific behavior the flat rate is already distorting — reps avoiding long-cycle enterprise accounts because a quick small deal pays the same rate for a fraction of the effort. Moving to tiers before either of those shows up is designing for a shape of business the client doesn't have yet.

### Rate by Deal Size (for varied ACVs)

| Deal Size | Commission Rate |
|-----------|----------------|
| < $10K ACV | 6% |
| $10K–$50K ACV | 8% |
| $50K–$100K ACV | 10% |
| > $100K ACV | 12% |

Larger deals take more effort and have longer cycles — higher rates compensate for this.

### New Business vs. Existing Business

For the HubSpot `dealtype` gating of New vs. Existing Business rates, the rate differential practice, and the multi-year deal rule (Year 1 ACV only), read `references/commission-structure-notes.md`.

### Accelerators (above quota)

Accelerators reward overperformance. Structure:

| Attainment | Commission Rate |
|------------|----------------|
| 0–50% | 0% (draw or base only — protects against windfall on partial achievement) |
| 50–100% | 8% (base rate) |
| 100–125% | 12% (1.5× accelerator) |
| 125%+ | 16% (2× accelerator) |

**Why accelerators matter**: The top 20% of reps drive a disproportionate share of revenue. Accelerators retain them and make the math attractive for exceptional performance.

For why a hard cap is the wrong answer to the "$2M fluke deal" question, read `references/commission-structure-notes.md`.

### Decelerators (below quota)

Optional, but protects against paying full rate on low attainment:

| Attainment | Commission Rate |
|------------|----------------|
| 0–50% | 50% of base rate |
| 50–75% | 75% of base rate |
| 75–100% | Base rate |

Only use decelerators if reps have a realistic shot at quota (hiring, territory, and product are working). Don't penalize reps for structural problems.

**A rep still in ramp is never subject to a decelerator**, regardless of what their attainment number reads against full quota — they're being measured against a target they aren't held to yet by definition (see the ramp table below). Applying one anyway punishes the ramp itself.

---

## Quota Ramp Plan

New reps shouldn't be held to full quota on Day 1. Standard ramp:

| Month | Quota | Rationale |
|-------|-------|-----------|
| 1 | 0% | Onboarding, no quota pressure |
| 2 | 25% | First pipeline building |
| 3 | 50% | First expected close |
| 4 | 75% | Building momentum |
| 5+ | 100% | Full quota |

Ramp period varies by cycle length. For enterprise (6+ month cycles), extend ramp to 6–9 months. For SMB (sub-30 day cycles), ramp can be compressed to 3 months.

For the industry-wide ramp lengthening and the first-hire-in-the-role case, read `references/ramp-and-clawback-notes.md`.

---

## SDR Compensation

SDRs are activity-driven. Comp should reflect activity (meetings booked, qualified pipeline) not closed revenue (which they don't control).

| Component | Description | Weight |
|-----------|-------------|--------|
| Base | Fixed salary | 60–70% of OTE |
| Meeting quota | $ per qualified meeting held | 30–40% of OTE |
| Pipeline quota | Bonus for sourced pipeline that closes | Optional kicker |

**On SDR OTE figures**: don't embed a fixed benchmark table here — SDR pay moves year to year and the numbers that circulate (this skill used to cite a "2024" table) go stale fast, while every source behind them is a vendor blog or recruiter aggregator, never a study you can read and check the method of. Get a current number instead of trusting a remembered one:
- Check what the client is actually paying today (offer letters, payroll, or the CRM/HRIS if one is connected) before reaching for an external benchmark.
- If no internal number exists yet, pull 2–3 live postings for the same seniority and market from the client's own hiring channel or a comp-benchmarking tool (RepVue, a current comp survey) rather than citing a remembered range.
- Keep the base/variable split above (60–70% base) as the structural guidance — that ratio is far more stable across years than the dollar figures.

---

## Attainment Model (required in output)

Show what a rep earns at different attainment levels. This is what reps actually look at when evaluating a comp plan:

| Attainment | Revenue Closed | Commission | Total Comp | Notes |
|------------|---------------|-----------|-----------|-------|
| 50% | $X | $X | Base + commission | Below-quota performance |
| 75% | $X | $X | Base + commission | Common early-tenure |
| 100% | $X | $X | Base + commission | OTE — on-target |
| 125% | $X | $X | Base + commission | Accelerator kicks in |
| 150% | $X | $X | Base + commission | Top-of-range performance |

---

## Additional Comp Elements

### Signing Bonus

For competitive hires: one-time $5K–$20K, clawed back if rep leaves within 12 months. Use to close offers, not as a recurring element.

### MBO (Management by Objective) Bonuses

Quarterly bonuses tied to specific objectives — useful for behaviors you want to drive that aren't captured in commission:
- Salesforce hygiene (data entry quality)
- Multi-product deals
- Reference customer acquisition
- Specific segment penetration

Keep MBO bonuses to <20% of variable pay. More than that and reps can't track what they're optimizing for.

### Clawback

If a customer churns within 90–120 days, claw back the commission on that deal. This aligns sales incentives with customer success and prevents selling to bad-fit customers.

For anchoring the clawback window to a stated date, when clawback needs a reason code, and the local wage law review, read `references/ramp-and-clawback-notes.md`.

---

## Team Selling and Partner-Sourced Deals

Comp plans built around a single rep closing a single deal break down as soon as a channel partner, an SE, or a second AE touches the same account. Two decisions to make explicitly, before the first co-sold or partner-sourced deal closes — never after, once two people are already arguing over the same commission:

- **Decide the split before the fact.** A deal-split policy negotiated after a disputed deal has already closed reads as favoritism no matter what number is picked. Write the rule (equal split, primary/assist split, or a fixed override for the non-owning rep) into the plan itself.
- **Don't pay full rate twice on the same deal.** When a channel partner is already compensated for sourcing a deal, the AE's rate on that same deal should be lower than their self-sourced rate — the same "less origination work, lower rate" logic applied above to Existing Business deals paying less than New Business ones. Treat this as a principle to apply, not a specific percentage to copy: the discounts cited across 2026 comp-design content vary by source and aren't backed by a single named study.

For the two levels to keep apart (HubSpot's native credit versus the comp plan's own split rules), read `references/team-selling-notes.md`.

---

## Common Mistakes

- **Quota too high**: If fewer than 40% of reps hit quota, the plan motivates no one. Reset quarterly if needed.
- **No accelerators**: The plan loses your best reps to companies that pay for overperformance.
- **Changing the plan mid-year**: Destroys trust. Announce annual changes in Q4 for Q1 start. Minor tweaks acceptable but communicate immediately.
- **Commission on bookings, not cash**: Pay on collected cash or ARR recognized, not signed contracts that might not close or churn.
- **No ramp period**: Setting new reps to 100% quota immediately creates early failure and fast churn.
- **Too many SPIFs**: Short-term incentives for specific deals/products lose their motivational power if used constantly.
- **Stacking a SPIF on top of an accelerator**: paying a SPIF bonus *and* the 125%+ accelerator rate on the same deal compounds into a windfall nobody budgeted for. Pick one lever per deal, not both.
- **A plan with too many components**: base, commission tiers, accelerators, decelerators, an MBO bonus, a SPIF, and a signing bonus running at once is a plan a rep can't compute in their head mid-quarter. If a rep can't tell you roughly what their next deal is worth without opening a spreadsheet, the plan has too many moving parts — cut components before adding another one.