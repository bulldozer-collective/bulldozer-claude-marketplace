---
name: sales-compensation
description: Design or audit sales compensation plans — OTE, quota, accelerators, and commission structure for AEs and SDRs. Triggers on 'sales comp plan,' 'OTE,' 'commission structure,' 'quota setting,' 'accelerator,' 'sales rep compensation,' or 'how should I pay my sales team.' For CRM and pipeline operations, see revenue-operations. For deal review and close strategy, see pipeline-deal-review.
when-to-use: Design or audit sales compensation plans — OTE, quota, accelerators, and commission structure for AEs and SDRs. Triggers on 'sales comp plan,' 'OTE,' 'commission structure,' 'quota setting,' 'accelerator,' 'sales rep compensation,' or 'how should I pay my sales team.' For CRM and pipeline operations, see revenue-operations. For deal review and close strategy, see pipeline-deal-review.
argument-hint: Early-stage B2B SaaS, first AE hire, $30K ACV, need to design first comp plan with OTE and quota
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# Sales Compensation

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on sales compensation design. Your goal is to help design comp plans that motivate the right behaviors, are fair to reps, and protect company economics — without over-engineering.

## Input

`$ARGUMENTS` — role (AE, SDR, CSM), average deal size, stage, and what decision to make (e.g., "first AE hire, $30K ACV B2B SaaS, design comp plan with OTE and quota"). If not provided, read any available context files. Only ask if the role and deal size are completely absent.

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

**Rule of thumb: quota = 4–6× OTE** for SaaS AEs (sometimes higher at scale).

If OTE is $150K, quota should be $600K–$900K ARR.

This ratio ensures:
- Company pays ~15–25% of revenue in sales comp (standard SaaS range)
- Rep has a realistic shot at quota (50–60% of reps should hit)
- Economics work at scale

### The 50% Rule

A well-designed comp plan should have 50–60% of reps at or above quota. If fewer hit quota consistently, either the quota is too high or the product/GTM has problems. If more than 80% hit quota, the quota is too low — you're overpaying.

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

### Rate by Deal Size (for varied ACVs)

| Deal Size | Commission Rate |
|-----------|----------------|
| < $10K ACV | 6% |
| $10K–$50K ACV | 8% |
| $50K–$100K ACV | 10% |
| > $100K ACV | 12% |

Larger deals take more effort and have longer cycles — higher rates compensate for this.

### Accelerators (above quota)

Accelerators reward overperformance. Structure:

| Attainment | Commission Rate |
|------------|----------------|
| 0–50% | 0% (draw or base only — protects against windfall on partial achievement) |
| 50–100% | 8% (base rate) |
| 100–125% | 12% (1.5× accelerator) |
| 125%+ | 16% (2× accelerator) |

**Why accelerators matter**: The top 20% of reps drive a disproportionate share of revenue. Accelerators retain them and make the math attractive for exceptional performance.

### Decelerators (below quota)

Optional, but protects against paying full rate on low attainment:

| Attainment | Commission Rate |
|------------|----------------|
| 0–50% | 50% of base rate |
| 50–75% | 75% of base rate |
| 75–100% | Base rate |

Only use decelerators if reps have a realistic shot at quota (hiring, territory, and product are working). Don't penalize reps for structural problems.

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

---

## SDR Compensation

SDRs are activity-driven. Comp should reflect activity (meetings booked, qualified pipeline) not closed revenue (which they don't control).

| Component | Description | Weight |
|-----------|-------------|--------|
| Base | Fixed salary | 60–70% of OTE |
| Meeting quota | $ per qualified meeting held | 30–40% of OTE |
| Pipeline quota | Bonus for sourced pipeline that closes | Optional kicker |

**SDR OTE benchmarks (2024)**:
- Early-stage startup: $55K–$75K OTE
- Growth-stage: $70K–$90K OTE
- Enterprise-focused SDR: $80K–$110K OTE

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

---

## Common Mistakes

- **Quota too high**: If fewer than 40% of reps hit quota, the plan motivates no one. Reset quarterly if needed.
- **No accelerators**: The plan loses your best reps to companies that pay for overperformance.
- **Changing the plan mid-year**: Destroys trust. Announce annual changes in Q4 for Q1 start. Minor tweaks acceptable but communicate immediately.
- **Commission on bookings, not cash**: Pay on collected cash or ARR recognized, not signed contracts that might not close or churn.
- **No ramp period**: Setting new reps to 100% quota immediately creates early failure and fast churn.
- **Too many SPIFs**: Short-term incentives for specific deals/products lose their motivational power if used constantly.