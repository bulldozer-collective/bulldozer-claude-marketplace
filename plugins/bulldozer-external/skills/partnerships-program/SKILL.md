---
name: |
  partnerships-program
description: |
  Design and launch a B2B partnerships program — partner type selection, deal economics, standard terms, deal registration, enablement, operating cadence, and 12-month ramp. Triggers on 'partnerships program,' 'partner channel,' 'build a partner program,' 'reseller program,' 'referral program,' 'co-sell motion,' 'channel partners,' or 'we want partnerships to drive revenue.' For affiliate programs specifically, see affiliate-program. For co-marketing motions, see co-marketing.
when-to-use: |
  Design and launch a B2B partnerships program — partner type selection, deal economics, standard terms, deal registration, enablement, operating cadence, and 12-month ramp. Triggers on 'partnerships program,' 'partner channel,' 'build a partner program,' 'reseller program,' 'referral program,' 'co-sell motion,' 'channel partners,' or 'we want partnerships to drive revenue.' For affiliate programs specifically, see affiliate-program. For co-marketing motions, see co-marketing.
argument-hint: |
  B2B SaaS, €8M ARR, proven repeatable sales playbook — want to launch a referral + co-sell partner motion targeting digital agencies and complementary SaaS vendors, targeting 20% of ARR from partners in 18 months
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
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

---

## Step 1: Partnership Thesis

The thesis answers one question: **which kind of partner, doing which thing, would meaningfully change our growth curve in the next 18 months?**

Not "partnerships are good for us" — that's a hope, not a thesis.

**Thesis format:**
> We will build a [referral / reseller / co-sell / technology] partner program targeting [specific partner type], who will [specific action: introduce us to, bundle us with, co-sell alongside], in order to [specific outcome: reach X new ICP accounts, add Y% to ARR from partner-sourced deals] by [quarter].

**The thesis also answers:**
- What portion of resources (sales ops, marketing, CS) are we prepared to allocate to support partners? (Rule of thumb: if you want 20% of revenue from partners, allocate 20% of relevant cross-functional resources.)
- What type of partner leader does this thesis require? A co-sell motion builder is a different person than a marketplace/integration builder.

---

## Step 2: Partner Type Selection

**Selection framework:**

| Factor | Referral | Reseller | Technology (Integration) | SI / Agency |
|--------|---------|---------|--------------------------|------------|
| ACV required | Any | >€5K | Any | >€15K |
| Product complexity | Low | Low-Medium | Medium | High |
| Sales cycle to support | Short | Medium | Varies | Long |
| Setup investment | €5K–20K | €30K–80K | €30K–100K (eng) | €50K–150K |
| Time to first deal | 1–3 months | 6–12 months | 3–9 months | 6–18 months |
| Deal control | You close | Partner closes | Indirect | Partner leads |
| Commission structure | 10–25% one-time | 20–40% recurring | Revenue share varies | 15–30% + implementation |

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

**Standard term categories:**

**Revenue share:**
- Referral (introduction + step back): 10–15% of first-year contract value, paid once within 30 days of customer first payment
- Referral (stays involved in deal): 15–25% of first-year contract value
- Reseller (manages full sales cycle): 20–40% recurring margin on deals they source and close (not co-sell deals)
- Co-sell (partner assists, you close): 10–15% of first-year contract value

**MDF (Market Development Funds):**
- Budget 1–3% of partner-sourced revenue annually
- Require a quarterly plan with measurable conversion path before releasing funds
- Use tranche release: 50% upfront on plan approval, 50% on execution milestones + pipeline evidence
- Never release MDF for "events" without a clear lead generation and follow-up plan attached

**Deal registration:**
- First-to-register wins (no duplicate protection on unregistered deals)
- Registration requires minimum information: target account name, qualified contact, use case/trigger, dated next step
- Protection window: 90 days for mid-market, 180 days for enterprise
- Renewal requires evidence of progress (meeting held or MAP milestone completed)
- Registration decision within 48 hours of submission — slow approvals kill partner motivation

**Term length:**
- Standard: 1-year agreement, auto-renewing
- Termination: 90-day notice (ensures deals in flight complete properly)
- Non-compete clause: typically waived for referral, required for exclusive reseller arrangements

---

## Step 4: Partner Tiering

Avoid tiers until you have 10+ active partners. Before that, tiers are administrative overhead on a program that hasn't proven itself.

Once you have 10+ partners, design tiers around **productive behaviors that predict revenue** — not vanity metrics:

**Tier criteria (assign weights):**
- Partner-sourced qualified pipeline (last 12 months) — 40%
- Closed-won revenue from partner deals (last 12 months) — 30%
- Active certifications (sales + product) — 15%
- Joint customer satisfaction on partner-managed accounts — 15%

**Never tier on:** Training completions without evidence of selling, number of registered employees, events attended, or other inputs with no output correlation.

**Tier benefits (make benefits reduce cost to sell, not just signal status):**

| Tier | Benefits |
|------|---------|
| **Gold** (top 20% by pipeline + revenue) | Dedicated partner success manager, prioritized SE support for joint deals, co-marketing budget, fast-track deal registration (24h), access to roadmap briefings |
| **Silver** (next 30%) | Pooled partner success team, standard SE support, deal registration (48h), joint case study eligibility |
| **Bronze** (remainder) | Self-serve portal access, standard deal registration (72h), quarterly webinar updates |

---

## Step 5: Deal Registration Protocol

**Deal registration is the mechanism that protects partner investment while preserving your ability to manage quality.**

**Partner submission (required fields):**
1. Target account name and website
2. Primary contact: name, title, email
3. Use case or trigger (what problem / what prompted them to look)
4. Dated next step (meeting scheduled, intro agreed — not "plan to reach out")
5. Partner's role in the deal (referral only, or staying involved)

**Your team's review process (48-hour SLA):**
- Verify account is not in existing direct pipeline or CRM
- Verify contact is not already in an active conversation with your sales team
- Confirm account fits ICP criteria
- Approve or reject with explanation

**Conflict resolution rules:**
- Partner-registered deal vs. direct prospect already in pipeline: notify partner, honor existing direct relationship, offer goodwill gesture (MDF credit)
- Two partners register the same account: first-to-register wins, notify second partner within 24 hours
- Partner-registered deal where you initiated the contact first: your deal, partner receives nothing — communicate this clearly in the program agreement to prevent disputes

---

## Step 6: Partner Enablement Program

**Partners can only sell what they understand.** Enablement is not a one-day orientation — it's the ongoing program that keeps partners current as your product and competitive landscape evolve.

**Enablement curriculum (certification required before first deal registration):**

| Level | Content | Duration | Gate |
|-------|---------|----------|------|
| **Certified partner** | Product overview, ICP definition, qualification framework, demo (basic) | 4–6 hours async + 1 live session | Quiz + mock discovery call with partner success team |
| **Advanced partner** | Competitive positioning, full demo, objection handling, QBR framework | Additional 4 hours + 2 live sessions | Live deal review with partner success team |
| **Joint sales certified** | Full co-sell motion, 