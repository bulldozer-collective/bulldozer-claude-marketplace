---
name: |
  affiliate-program
description: |
  Design and launch a B2B SaaS affiliate program — commission model selection, attribution window calibration to sales cycle length, partner type segmentation (content / consulting / agency / customer advocates), tracking platform requirements, launch sequencing, and governance rules. Triggers on 'affiliate program,' 'referral program,' 'build an affiliate channel,' 'partner commissions,' 'affiliate tracking,' 'how should we pay affiliates,' or 'we want to add affiliates.' For broader partnership strategy, see partnerships-program.
when-to-use: |
  Design and launch a B2B SaaS affiliate program — commission model selection, attribution window calibration to sales cycle length, partner type segmentation (content / consulting / agency / customer advocates), tracking platform requirements, launch sequencing, and governance rules. Triggers on 'affiliate program,' 'referral program,' 'build an affiliate channel,' 'partner commissions,' 'affiliate tracking,' 'how should we pay affiliates,' or 'we want to add affiliates.' For broader partnership strategy, see partnerships-program.
argument-hint: |
  Series A SaaS, €8K ACV, 3-month average sales cycle, no existing affiliate program. Target: 10–15% of new ARR from affiliate channel within 12 months. ICP: RevOps and sales leaders. Best partners: consultants and agencies who serve those buyers.
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
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

If your attribution window is shorter than your actual sales cycle, you are systematically underpaying partners who influence deals that take longer than the window to close. One SaaS company that extended its window from 30 to 45 days — after discovering its actual average sales cycle was 38 days — reported a 22% increase in affiliate-attributed revenue the following quarter. They weren't getting more deals; they were crediting deals that had already been happening uncredited.

**Attribution window by sales cycle:**

| Sales cycle | Required attribution window |
|-------------|---------------------------|
| <30 days (self-serve SMB) | 30 days |
| 30–90 days (mid-market, sales-assisted) | 90 days |
| 90–180 days (commercial) | 120–180 days |
| 180+ days (enterprise) | 365 days + manual referral registration |

**For enterprise deals:** Click-based attribution is insufficient. Any deal with a sales cycle longer than 90 days needs a manual referral registration mechanism — the affiliate submits the company name and contact before the deal enters your CRM. The first-registered affiliate holds the deal, not the last-click.

**Multi-touch attribution for B2B (best practice):** Use position-based attribution — 40% credit to first-touch affiliate, 40% to last-touch, 20% split across middle touchpoints. This rewards both discovery (affiliate who introduced the product) and conversion (affiliate who closed the final objection) rather than pure last-click, which disadvantages long-cycle referrers.

---

## Step 3: Partner Type Definitions

**Not all affiliates are equal.** B2B affiliate programs segment partners by trust level, deal influence, and expected conversion quality. One-size-fits-all commission structures overpay low-quality partners and underpay high-value ones.

**Partner Type 1: Consultants and Advisors**
Who they are: Independent consultants who advise your ICP buyers on tooling, process, or strategy. They make product recommendations as part of their client work.
Why they convert: Buyers trust advisor recommendations. A consultant who says "you need this tool" produces a qualified, motivated buyer — not a lead who needs to be educated.
Commission: Higher rate (25–30%) or custom, because conversion quality is higher.
Attribution: Require deal registration (consultant submits company + contact name before the deal enters pipeline).
Volume expectation: Low volume, very high quality.

**Partner Type 2: Agencies**
Who they are: Agencies serving your ICP who use your product in client delivery or recommend it as part of their tech stack advisory.
Why they convert: Agencies can influence entire client portfolios — one agency relationship can produce 5–15 referrals over 12 months.
Commission: Recurring share (agencies have a recurring incentive to send clients who stay).
Attribution: Agency-specific referral link + deal registration for enterprise clients.
Volume expectation: Medium volume, high quality when the agency is ICP-aligned.

**Partner Type 3: Content Publishers and Review Sites**
Who they are: B2B comparison sites (G2, Capterra, TrustRadius), category newsletters, YouTube reviewers, and bloggers who rank for "[your category] tools" or "best [category] software."
Why they convert: These affiliates reach buyers in active research mode. A review post ranking for "[your product] vs [competitor]" intercepts a high-intent buyer mid-decision.
Commission: Standard rate (20–25%) — high volume but variable quality.
Attribution: Standard click-through + 90-day cookie window.
Volume expectation: Highest volume, variable quality (lower than advisor/agency).

**Partner Type 4: Customer Advocates**
Who they are: Existing customers who refer peers at other companies.
Why they convert: Peer recommendations convert at the highest rate of any referral source in B2B — buyers trust peers who've already implemented the solution.
Commission: Consider non-cash rewards (account credits, feature access, gift cards) rather than cash to keep them feeling like advocates rather than salespeople.
Attribution: Unique referral link per customer, shorter cookie window acceptable (30 days) because these leads are already warm and move faster.
Volume expectation: Low-medium volume, highest conversion rate.

---

## Step 4: Tracking Platform Requirements

**Choose tracking platform at launch. Manual tracking breaks at 20 affiliates and becomes unmanageable at 50.**

**Required capabilities for B2B SaaS:**
- Recurring-revenue commission engine (calculates monthly commission based on customer billing events, not one-time conversions)
- Long attribution windows: configurable from 30 to 365+ days per deal type
- Subscription-event integration with billing platform (Stripe, Chargebee, Recurly) — commission triggers on payment, not on form fill
- Manual deal registration: affiliate can submit company + contact name for enterprise deals outside click-window
- Partner portal: affiliate sees their links, clicks, conversions, and payout status without contacting your team
- Fraud detection: identify self-referrals, suspicious traffic patterns, cookie stuffing
- CRM integration: affiliate deal registration syncs to HubSpot/Salesforce so sales team sees referral source

**Platform options by stage:**
- Pre-product-market-fit / first 10 partners: Rewardful or PartnerStack Starter — quick to set up, Stripe-native, sufficient for simple recurring commission
- 10–100 partners (growth stage): PartnerStack or Impact.com — multi-currency, more partner type configuration, stronger analytics
- 100+ partners / complex program: Impact.com, Partnerize, or TUNE — enterprise attribution, multi-tier, deep CRM sync

**Avoid:** Generic affiliate plugins (AffiliateWP, Post Affiliate Pro) — they're built for e-commerce and don't handle recurring SaaS commissions, long attribution windows, or CRM-connected deal registration.

---

## Step 5: Program Launch Sequence

**Launch order: build before recruiting. Partners who sign up to a broken tracking setup leave and don't 