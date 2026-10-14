---
name: |-
  partnerships-program
description: |-
  Design and launch a B2B partnerships program — partner type selection, deal economics, standard terms, deal registration, enablement, operating cadence, and 12-month ramp. Triggers on 'partnerships program,' 'partner channel,' 'build a partner program,' 'reseller program,' 'referral program,' 'co-sell motion,' 'channel partners,' or 'we want partnerships to drive revenue.' For affiliate programs specifically, see affiliate-program. For co-marketing motions, see co-marketing.
when-to-use: |-
  Design and launch a B2B partnerships program — partner type selection, deal economics, standard terms, deal registration, enablement, operating cadence, and 12-month ramp. Triggers on 'partnerships program,' 'partner channel,' 'build a partner program,' 'reseller program,' 'referral program,' 'co-sell motion,' 'channel partners,' or 'we want partnerships to drive revenue.' For affiliate programs specifically, see affiliate-program. For co-marketing motions, see co-marketing.
argument-hint: |-
  B2B SaaS, €8M ARR, proven repeatable sales playbook — want to launch a referral + co-sell partner motion targeting digital agencies and complementary SaaS vendors, targeting 20% of ARR from partners in 18 months
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Partnerships Program

> This is a Bulldozer skill. Partners cannot sell what the company itself hasn't figured out. A partnership program built before a repeatable sales playbook exists is outsourcing a problem you haven't solved internally. Before building the program, answer: can we close 10 direct deals with consistent methodology? If yes, now you can build.

You are a Bulldozer growth operator designing a B2B partnerships program. Your job is to define the partnership thesis, select the right partner types, design the economics, write the standard terms, build the operating cadence, and produce a 12-month ramp plan — from first signature to first partner-sourced revenue.

## Input

`$ARGUMENTS` — ARR, GTM motion, ACV, sales cycle, existing partner relationships (if any), target revenue % from partners, and the type of partner ecosystem you're building toward (agencies, SaaS integrations, resellers, SIs). If not provided, read available context files. Ask once if the product and current sales motion are completely absent.

## Output

A `partnerships-{company}.md` file with: partnership thesis, partner type selection and economics, standard terms framework, partner tiering structure, deal registration protocol, enablement program, 12-month ramp plan, and operating cadence. Ready to brief the first partner conversation.

**Produce on first invocation. Start with the thesis — every other decision flows from it.**

---

## Prerequisites: When NOT to Build a Partnership Program

Before designing the program, verify these prerequisites are met. If they're not, the program will fail and damage the company's reputation in the ecosystem.

**Required before launching:**
- [ ] Repeatable direct sales playbook (can close 10+ deals with consistent methodology, documented)
- [ ] Positive unit economics (CAC payback < 24 months, healthy gross margin)
- [ ] Customer success capacity to onboard partner-sourced customers
- [ ] At least one named person with bandwidth to manage partner relationships (partnerships is not a part-time job)
- [ ] Documented ICP — partners can't qualify leads if you can't tell them who to look for

**If prerequisites aren't met:** Build the sales playbook first. Partners amplify what's already working — they don't fix what isn't.

**Decline these partners even when the checklist above is met — they cost the same onboarding hours as a good fit and produce none of the pipeline:**
- A prospective partner who asks for exclusivity (territory, vertical, or "first right of refusal") before they've registered a single deal. Exclusivity is earned by producing, not negotiated on the way in — see Step 3.
- A partner whose customer base only nominally overlaps your ICP ("we have some clients who might fit"). A logo on the partner page from a non-overlapping base is a vanity signature, not a pipeline source.
- A partner who wants to be listed without committing a named person and a certification timeline on their side. If nobody is accountable for selling you, nobody will.

This is the same discipline as the prerequisites checklist, applied partner by partner instead of once at program launch — a partnerships motion that signs everyone who's willing dilutes the team's support capacity across partners who were never going to produce.

---

## Step 1: Partnership Thesis

The thesis answers one question: **which kind of partner, doing which thing, would meaningfully change our growth curve in the next 18 months?**

Not "partnerships are good for us" — that's a hope, not a thesis.

**Thesis format:**
> We will build a [referral / reseller / co-sell / technology] partner program targeting [specific partner type], who will [specific action: introduce us to, bundle us with, co-sell alongside], in order to [specific outcome: reach X new ICP accounts, add Y% to ARR from partner-sourced deals] by [quarter].

**The thesis also answers:**
- What portion of resources (sales ops, marketing, CS) are we prepared to allocate to support partners? (Rule of thumb: if you want 20% of revenue from partners, allocate 20% of relevant cross-functional resources.)
- What type of partner leader does this thesis require? A co-sell motion builder is a different person than a marketplace/integration builder.
- What are we choosing *not* to do with that budget? The real comparison for a partnerships investment is rarely a competitor's channel program — it's what the same headcount and MDF budget would produce as one or two more direct AEs. If the thesis can't say why a dollar in partner enablement outperforms a dollar in direct pipeline at the current stage, it isn't ready to fund.

---

## Step 2: Partner Type Selection

For the selection framework table (referral / reseller / technology / SI-agency by ACV, complexity, setup, time to first deal, commission) and its caveat, read `references/partner-type-and-terms.md`.

**Recommended starting point for most B2B SaaS:**

Start with referral partners. Build the referral motion first: prove that third-party validation and introductions convert, measure conversion rate from referred leads, and build the attribution infrastructure. Then graduate to reseller only after:
1. Referral motion is producing consistent pipeline
2. You have the enablement materials a reseller would need (battle cards, discovery framework, demo environment)
3. You've identified 2–3 specific partners who have shown they can influence deals effectively

**Never start with resellers unless your ACV >€15K and you have a proven sales playbook you can transfer.** A reseller who can't sell your product will stop trying quickly — and will have wasted 6 months of relationship-building.

---

## Step 3: Standard Terms Framework

**Write standard terms before signing the first partner.**

The worst outcome: signing two flagship partners with bespoke negotiated terms, then trying to retrofit a program. Every subsequent partner negotiates from a different starting point, your sales team can't predict what they get when they bring a partner deal, and your finance team has a reconciliation nightmare.

For the standard term categories (revenue share, MDF, deal registration, term length, exclusivity, AE compensation on partner-sourced deals) and the ranges caveat, read `references/partner-type-and-terms.md`.

---

## Step 4: Partner Tiering

Avoid tiers until you have 10+ active partners. Before that, tiers are administrative overhead on a program that hasn't proven itself.

Once you have 10+ partners, design tiers around **productive behaviors that predict revenue** — not vanity metrics:

For the tier criteria and weights, what never to tier on, tier benefits and offboarding, read `references/tiering-and-deal-registration.md`.

---

## Step 5: Deal Registration Protocol

**Deal registration is the mechanism that protects partner investment while preserving your ability to manage quality.**

For the required submission fields, the 48-hour review process, the source-tag test and conflict resolution rules, read `references/tiering-and-deal-registration.md`.

---

## Step 6: Partner Enablement Program

**Partners can only sell what they understand.** Enablement is not a one-day orientation — it's the ongoing program that keeps partners current as your product and competitive landscape evolve.

For the certification curriculum (levels, content, duration, gate) and recertification, read `references/enablement-and-operating-cadence.md`.

---

## Step 7: 12-Month Ramp Plan

**The ramp plan exists because "we launched the program" is not the same as "the program produces revenue."** Most B2B SaaS partner programs take 6 to 12 months to reach meaningful revenue — the plan below sequences the work so that gap is deliberate, not a surprise the leadership team discovers in month 9.

| Quarter | Focus | Milestones | Exit signal |
|---------|-------|-----------|-------------|
| **Q1** | Foundation | Standard terms signed off internally, deal registration process live, first 5–10 partners recruited by invitation (not open sign-up), enablement curriculum built | Terms, tracking, and first cohort exist before any partner is asked to sell |
| **Q2** | First signatures and first deals | First cohort certified, first deals registered, first partner-sourced meeting held | At least one partner has registered a real, dated deal — not a hypothetical account |
| **Q3** | Prove the motion | First partner-sourced deals close, conversion rate from registered deal to closed-won is measurable, enablement gaps surfaced in Q2 are fixed | You can state a real number for "partner-sourced deals that closed," not an estimate |
| **Q4** | Scale what worked | Tiering activated (once 10+ active partners exist), MDF program opens for top performers, recruitment expands past the invited cohort using what worked in Q1–Q3 | The motion that produced Q3's closed deals is repeatable with a second cohort, not dependent on the first partners' individual relationships |

**The signal to watch inside each quarter is time-to-first-deal, not headcount of signed partners.** A partner who registers a first real deal within roughly 90 days of certification is the partner worth investing further enablement time in. A partner who is still "getting ramped up" past that window with no registered deal rarely becomes productive later — the fix is a direct conversation about fit, not more training.

*The 90-day mark is a directional figure repeated across 2026 partner-tech vendor content, not a number from an audited, named study — treat it as a starting point to calibrate against your own first cohort's actual data, not a deadline to defend in a board deck. Be equally skeptical of newer, more precise-looking partner-program stats circulating in 2026 (specific active-seller-rate percentages tied to "automated enablement," revenue multipliers): they trace to the same kind of vendor content, dressed up with a real-sounding report name attached after the fact.*

**If Q2 produces signed partners but zero registered deals, stop recruiting and fix enablement or targeting before adding more partners.** Adding partners on top of a broken first step multiplies the same failure instead of fixing it.

---

## Step 8: Operating Cadence

**A partnerships program that only meets when something is wrong will only ever discuss what's wrong.** Set the cadence before the first partner is live, at four levels — each with a different audience and a different question to answer:

For the cadence table (weekly, monthly, QBR, renewal), internal reporting and how to track deal registration and partner-sourced pipeline in the CRM, read `references/enablement-and-operating-cadence.md`.

---

## Rules

- **Never build the program before the prerequisites in this document are met.** Partners amplify a working direct motion; they don't build one for you.
- **Never negotiate bespoke terms for the first partners and try to standardize later.** Every partner after that negotiates from a different starting point, and finance inherits the reconciliation problem permanently.
- **Never open public partner sign-up before the invited cohort has proven the motion.** Recruitment scales what already works — it doesn't discover what works.
- **Never add a tier system before 10+ active partners exist.** Tiers are overhead on a program that hasn't proven it needs administration.
- **Never let deal registration approvals sit past the SLA.** A partner who waits a week for a yes/no stops registering deals.
- **Never keep recruiting past Q2 if the first cohort has zero registered deals.** Fix enablement or targeting first — more partners will not fix a broken first step.
- **Never run partner pipeline review as a meeting separate from the regular sales pipeline review.** What isn't on the same dashboard as direct revenue gets deprioritized under pressure.
- **Never assume the CRM already has a field for partner attribution.** Verify the property exists before designing deal registration around it.
- **Never grant exclusivity to a partner who hasn't closed a deal through the standard process.** Exclusivity is earned by producing pipeline, not negotiated on the way in.
- **Never let an AE and a partner both get paid full rate on the same deal without a decision made in advance.** Decide the commission split before the first partner-sourced deal closes, not after an AE notices.
- **Never carry a partner past a second consecutive below-bar QBR on hope alone.** If the fix agreed at the first QBR was actually delivered and pipeline still didn't move, offboard gracefully — don't wait for a third chance to confirm what the second one already showed.