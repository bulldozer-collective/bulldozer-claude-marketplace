---
name: |-
  affiliate-program
description: |-
  Design and launch a paid B2B SaaS affiliate/partner program — commission model selection, attribution window calibration to sales cycle length, partner type segmentation (content / consulting / agency / customer advocates), tracking platform requirements, launch sequencing, and governance rules. Triggers on 'affiliate program,' 'build an affiliate channel,' 'partner commissions,' 'affiliate tracking,' 'how should we pay affiliates,' or 'we want to add affiliates.' For a simple customer-referral loop with no external partner network to manage, see referral-program instead. For broader (non-commission) partnership strategy, see partnerships-program.
when-to-use: |-
  Design and launch a paid B2B SaaS affiliate/partner program — commission model selection, attribution window calibration to sales cycle length, partner type segmentation (content / consulting / agency / customer advocates), tracking platform requirements, launch sequencing, and governance rules. Triggers on 'affiliate program,' 'build an affiliate channel,' 'partner commissions,' 'affiliate tracking,' 'how should we pay affiliates,' or 'we want to add affiliates.' For a simple customer-referral loop with no external partner network to manage, see referral-program instead. For broader (non-commission) partnership strategy, see partnerships-program.
argument-hint: |-
  Series A SaaS, €8K ACV, 3-month average sales cycle, no existing affiliate program. Target: 10–15% of new ARR from affiliate channel within 12 months. ICP: RevOps and sales leaders. Best partners: consultants and agencies who serve those buyers.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Affiliate Program

> This is a Bulldozer skill. The biggest structural mistake in B2B affiliate programs is copying the e-commerce playbook: 30-day cookie windows, flat commission, mass recruitment. B2B buying cycles are 3–18 months. A 30-day cookie window leaks every deal that takes 31 days or longer to close — which in mid-market B2B is most of them. Design for how B2B actually buys.

You are a Bulldozer partnerships operator designing a B2B affiliate program. Your job is to select the right commission model, calibrate the attribution window to the actual sales cycle, define partner types and their distinct terms, set up tracking infrastructure, and build the recruitment and governance system.

## Input

`$ARGUMENTS` — product ACV, average sales cycle length, primary ICP, current channel mix (is there an existing referral or partner motion?), target % of revenue from affiliate within 12 months. If not provided, read available context files. Ask once if ACV and sales cycle are completely absent.

## Output

A `affiliate-program-{company}.md` file with: commission model recommendation with economic rationale, attribution window calibration, partner type definitions and tier structure, tracking platform selection, partner portal requirements, recruitment sequence, and governance rules. Produces a ready-to-launch program spec.

**Produce on first invocation. Define commission structure and attribution window before recruitment. Recruiting partners into a program with a 30-day cookie and mid-cycle ACV deals is setting them up to fail.**

---

## Before You Build This

A paid affiliate program is the wrong tool in three recurring situations — say so instead of producing a spec that will misfire:

- **No retention data yet.** Recurring-share commissions and the clawback window (Step 1) are calibrated against how long a customer actually stays. Pre-PMF, or with fewer than a handful of cohorts past their first renewal, there is nothing real to calibrate against — any number written down is a guess wearing a spreadsheet. Fix that first, or launch with a flat one-time bounty and revisit the model once retention is observed.
- **A single enterprise-only motion.** A company closing a handful of $50K+ deals a year through a small, named enterprise sales team doesn't have the deal volume to make a scaled, self-serve affiliate program worth the tracking and governance overhead (Steps 4–6). A short list of named strategic partners is a partnerships-program problem, not an affiliate-program one.
- **A pure customer-referral ask.** "Customers referring customers" with no consultants, agencies, or content partners to recruit is `referral-program` — simpler mechanics, no tiered commission, no deal registration.

If none of these apply, proceed.

---

## Step 1: Commission Model Selection

**Four models, each with different alignment to retention economics:**

| Model | Structure | Best for | Risk |
|-------|-----------|---------|------|
| **Recurring share** | % of MRR paid each month the customer stays (capped at 12–36 months) | Mid-market SaaS, strong retention, longest alignment | Ongoing liability; calculate LTV ceiling before committing |
| **First-payment flat** | Fixed amount on first payment, one-time | Low-ACV self-serve, high churn risk in first 90 days | No incentive to send quality — affiliates optimize for volume |
| **Hybrid (recommended)** | Small amount on qualified trial/lead + larger amount on paid conversion | Any SaaS with sales-assisted motion | More complex to track; requires clear qualification criteria |
| **Revenue share + milestone** | Base recurring share + bonuses at volume thresholds | Scaling programs, top performers | Only add milestones once base program is running |

**Most B2B SaaS programs in 2026 use recurring share capped at 12–24 months.** This aligns affiliate incentive with your retention economics — affiliates who send customers who churn early see their commissions dry up.

**Commission rate by ACV:**
- ACV <€2K (self-serve SMB): 20–30% of first payment, or flat €20–€50 bounty
- ACV €2K–€15K (mid-market): 20–30% recurring for 12 months, or 1x MRR equivalent one-time
- ACV €15K–€50K (commercial): 10–15% of first-year ACV, paid in installments tied to customer retention milestones
- ACV €50K+ (enterprise): negotiate individually — flat percentage at first renewal, not at signature

**Tiered progression (add once program has 20+ active partners):**
- Base: 20% for all affiliates
- Tier 2: 25% once partner generates €2,000/month in commissions
- Tier 3: 30% once partner generates €10,000/month in commissions

The tier structure self-segments: your best partners identify themselves by performance.

**Clawback clause (required):** If a customer cancels within 90 days, the commission is reversed. For annual contracts, pro-rate: a customer who completes 6 of 12 months forfeits the remaining 6 months of recurring commission, not the full year. Without a clawback, affiliates have zero incentive to send customers who are likely to retain.

---

## Step 2: Attribution Window Calibration

**This is the structural decision that determines whether your affiliates trust your program.**

If your attribution window is shorter than your actual sales cycle, you are systematically underpaying partners who influence deals that take longer than the window to close — not because fewer deals are happening, but because deals that were already closing are landing outside the window and going uncredited. Most affiliate programs across all categories still default to windows well under 60 days, which is a fine default for impulse or self-serve purchases and a bad one for anything with a multi-touch sales process; the fix is to measure the actual sales cycle first (Step 1 data, not the platform's default) and set the window to match it.

**Attribution window by sales cycle:**

| Sales cycle | Required attribution window |
|-------------|---------------------------|
| <30 days (self-serve SMB) | 30 days |
| 30–90 days (mid-market, sales-assisted) | 90 days |
| 90–180 days (commercial) | 120–180 days |
| 180+ days (enterprise) | 365 days + manual referral registration |

**For enterprise deals:** Click-based attribution is insufficient. Any deal with a sales cycle longer than 90 days needs a manual referral registration mechanism — the affiliate submits the company name and contact before the deal enters your CRM. The first-registered affiliate holds the deal, not the last-click.

**Multi-touch attribution for B2B (best practice):** Use position-based attribution, which rewards both discovery (the affiliate who introduced the product) and conversion (the affiliate who closed the final objection) rather than pure last-click, which disadvantages long-cycle referrers. If the CRM is HubSpot, this is a named native option: Marketing Hub's attribution reporting exposes it as the `U_SHAPED` model, selectable without building a manual weighting by hand. Treat the commonly-cited 40% first-touch / 40% last-touch / 20% middle-touch split as the general shape of position-based attribution, not as HubSpot's own documented weighting — HubSpot's own tool guidance names its eight attribution models (`U_SHAPED` among them) without publishing their internal weights, and the 40/20/40 figure traces only to third-party blogs, never a primary HubSpot source.

---

## Step 3: Partner Type Definitions

For the four partner types (consultants and advisors, agencies, content publishers and review sites, customer advocates) with who they are, why they convert, commission, attribution and volume expectation, read `references/partner-types.md`.

---

## Step 4: Tracking Platform Requirements

**Choose tracking platform at launch. Manual tracking breaks at 20 affiliates and becomes unmanageable at 50.**

For the required tracking capabilities, platform options by program stage, how not to pick by category label, and the third-party cookie caveat, read `references/tracking-platforms.md`.

---

## Step 5: Program Launch Sequence

**Launch order: build before recruiting. Partners who sign up to a broken tracking setup leave and don't come back — and word travels fast inside the tight communities (consultant Slack groups, agency partner networks) that B2B affiliate programs actually depend on.**

**Phase 1 — Build, before any partner sees the program:**
- Finalize commission model, attribution window, and clawback terms (Steps 1–2) in writing.
- Configure the tracking platform end to end: billing integration live, a test conversion fires correctly, partner portal accessible. For the first handful of partners, before committing to a paid platform, a dedicated Bulldozer OS lead list per partner (with the partner name written into each lead's free-text source field) is enough to track who sent what — a real interim substitute for a partner portal, not a replacement for one once volume grows past a few partners.
- Write the partner agreement — commission terms, payment schedule, deal registration process, and the governance rules below (Step 6). Not a marketing one-pager: a document a consultant's or agency's ops team will actually read before signing.
- Produce a one-page "why partner with us" brief per partner type (Step 3). A consultant and a review site need different pitches.

**Phase 2 — Warm recruitment, 2–4 weeks, invite-only:**
- Recruit from existing relationships first: customers who've already referred someone informally, consultants and agencies already in your network, any advisor who's mentioned the product unprompted.
- Onboard these partners manually — walk them through the portal, confirm their first link fires correctly, use their feedback to fix tracking gaps before opening recruitment further.
- Target the first 5–10 active partners from warm relationships before any public program page goes live. This phase is where tracking bugs surface; better they surface with people who'll tell you directly than with strangers who'll just leave.

**Phase 3 — Structured recruitment, month 2 onward:**
- Open recruitment to partner types in the order of expected quality (Step 3): consultants and agencies first via direct outreach, then content publishers and review sites, then a public partner page for inbound applications.
- Review every application manually before approval. A link generated automatically for anyone who signs up is a fraud vector, not a growth channel.
- Sales owns qualification once a partner-sourced lead enters the CRM. A deal registration is a source tag, not a qualified opportunity — it still goes through the same champion/decision-maker check as any other pipeline entry, so the affiliate credit doesn't end up attached to a deal that was never real.
- Track partner activation, not partner count. A partner with a live link who has referred zero leads after 60 days needs a check-in call, not a reminder email.

**Ongoing — governance cadence:**
- Monthly: review payout accuracy, check flagged conversions, confirm no attribution dispute is left open.
- Quarterly: review tier thresholds against actual partner performance, retire inactive partners, revisit commission economics against updated retention data.

---

## Step 6: Governance Rules

For the full governance rules (brand bidding, self-referral and channel conflict, coupon and cashback extensions, deal registration disputes, AE commission, termination and clawback enforcement, payment terms, tax forms), read `references/governance-rules.md`. Write them before the first partner signs.

---

## Rules

- **Never launch tracking and recruitment on the same day.** Prove the tracking works on 5–10 warm partners before a single public application is approved.
- **The attribution window is a promise, not a guess.** Calibrate it to the measured sales cycle (Step 2), not to whatever a tracking platform defaults to.
- **No clawback clause, no program.** Every commission structure needs a reversal mechanism for early cancellations, or affiliates are paid to send customers who won't stick around.
- **A commission plan without a governance section isn't finished.** Brand bidding, self-referral, and dispute resolution belong in the spec, not in an FAQ written after the first complaint.
- **Manual review beats automatic approval for the first 90 days.** An open sign-up page before tracking and terms are proven invites fraud, not growth.
- **Recurring share aligns incentives; a flat one-time bounty doesn't.** When the commission model is in doubt, default to the one that pays affiliates for retention, not just for a first conversion.
- **A partner-sourced lead is not a qualified opportunity until sales says so.** Deal registration tags the source; it doesn't skip qualification.
- **Don't build this without retention data, or for a single enterprise-only motion.** See "Before You Build This" — an affiliate program calibrated on guesses, or built for a business with no deal volume to recruit against, is a spec that will misfire on launch.
- **Build the CRM partner-attribution field before the first deal registration, not after.** On HubSpot there is no native property for it — a custom deal property has to exist before sales can see where a deal came from.
- **No round number of partners says when to name a dedicated owner.** Don't wait for a specific partner count or commission volume before making the program someone's named responsibility. The reliable signal is whether it now generates co-selling work and dispute adjudication (Step 6) that a marketing generalist running it as a quarter of their job can't keep up with — not a threshold on a chart.