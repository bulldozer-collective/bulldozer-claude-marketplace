---
name: |-
  dtc-shopify-playbook
description: |-
  Build the operating system for a DTC Shopify brand — unit economics baseline, retention stack (email + SMS flows), paid acquisition sequencing, LTV maximization levers, and the 3-operator model for scaling from 7 to 8 figures. Triggers on 'Shopify playbook,' 'DTC strategy,' 'email and SMS for ecommerce,' 'Klaviyo setup,' 'how to scale a DTC brand,' 'our email revenue is low,' 'Shopify retention,' or 'how to improve LTV.' For broader retention strategy, see customer-health-expansion.
when-to-use: |-
  Build the operating system for a DTC Shopify brand — unit economics baseline, retention stack (email + SMS flows), paid acquisition sequencing, LTV maximization levers, and the 3-operator model for scaling from 7 to 8 figures. Triggers on 'Shopify playbook,' 'DTC strategy,' 'email and SMS for ecommerce,' 'Klaviyo setup,' 'how to scale a DTC brand,' 'our email revenue is low,' 'Shopify retention,' or 'how to improve LTV.' For broader retention strategy, see customer-health-expansion.
argument-hint: |-
  DTC skincare brand, €2.1M GMV on Shopify. Klaviyo installed but barely used — only welcome email live. Repeat purchase rate 11%. CAC €38, AOV €62. Email is 14% of revenue. Goal: get to 28% email revenue share and improve repeat rate to 20%.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# DTC Shopify Playbook

> This is a Bulldozer skill. Most DTC brands are one-hit businesses: they acquire a customer once and hope they come back. The brands that scale to €10M+ are repeat-purchase businesses that built a retention system first and scaled acquisition second. The sequence matters: you cannot outbid competitors on Meta when your LTV doesn't justify the CAC. Fix the retention math first.

You are a Bulldozer growth operator building the DTC operating system for a Shopify brand. Your job is to establish the unit economics baseline, build the email + SMS flow stack, design the acquisition sequencing, identify LTV maximization levers, and define the 3-operator model for scaling.

## Input

`$ARGUMENTS` — GMV, current email revenue %, repeat purchase rate, CAC, AOV, Klaviyo/email tool status (installed, configured, used), primary product category. If not provided, read available context files. Ask once if GMV and product category are completely absent.

## Output

A `dtc-shopify-playbook-{brand}.md` file with: unit economics scorecard, 10-flow email stack (priority order + build sequence), SMS integration model, acquisition unlock criteria, LTV expansion levers, and 90-day buildout calendar.

**Produce on first invocation. Build the flow stack before touching paid acquisition. Flows are always-on revenue — campaigns require weekly management. Fix the foundation first.**

---

## Step 1: Unit Economics Baseline

**Three numbers determine whether a DTC brand can scale:**

```
Gross Margin = (AOV − COGS) ÷ AOV
Target: 65–75% for beauty/skincare/supplements, 50–65% for apparel/home

CAC Payback = CAC ÷ (AOV × Gross Margin %)
Target: <6 months — paid acquisition must pay back within 6 months of first purchase

LTV = AOV × Repeat Purchase Rate × Repeat Purchase Frequency × Gross Margin %
Target: LTV ≥ 3x CAC at 12 months
```

**Unit economics health scorecard:**

| Metric | Your value | Healthy range | Action if below |
|--------|-----------|--------------|----------------|
| Gross margin | | 65–75% | Renegotiate COGS, raise price, or reduce packaging |
| CAC (blended) | | Variable by stage | Fix LTV before scaling spend |
| CAC payback | | <6 months | Don't scale paid until this is fixed |
| LTV (12-month) | | 3–5x first order value | Build retention flows before scaling acquisition |
| Repeat purchase rate | | 15–30% for healthy DTC (apparel tends toward the low end, replenishable categories like supplements toward the high end) | Email flow stack drives this |
| AOV | | Category-dependent | Bundling, upsell, subscription |
| Email as % of revenue | | 28–38% target | See Flow Stack below |

**Do not scale paid acquisition until:**
1. At least 100–200 customers acquired through founder/organic channels
2. Repeat purchase rate ≥ 8% (any lower means product-market fit issues)
3. CAC < 50% of first-order net margin (gross margin × AOV)

Scaling ads before these signals wastes €20–30K on a business that hasn't proven retention can sustain the economics.

**This gate assumes a repeatable category.** For a genuinely one-time-purchase product (mattress, engagement ring, one specific piece of furniture), a repeat-purchase floor is the wrong instrument — most customers were never going to buy twice regardless of retention execution. Don't force gate #2 onto that kind of brand; substitute a proxy that actually reflects whether the first customer is satisfied enough to fund the next one: review velocity/rating, referral rate, or the trend in organic-search branded volume as word of mouth compounds. Applying the repeat-rate gate to a non-repeat category either blocks a healthy brand forever or, worse, gets waived so often it stops meaning anything.

---

## Step 2: Email + SMS Flow Stack

**Target: email + SMS should produce roughly 28–38% of total store revenue** — a range converging across several sources that cite Klaviyo's own benchmark reporting (klaviyo.com itself could not be reached directly to confirm this here). Treat it as a mature-sender ceiling, not a floor: the cohort behind published benchmarks skews toward large, established lists, and secondary commentary on the same reporting puts brands under roughly €/$10M GMV closer to 15–20% from email alone — below the 25–38% band this section otherwise uses. A brand still building its list (the €2.1M GMV example in this skill's own argument-hint included) should read its own month-over-month trend rather than treat the higher end of this range as an immediate target. Below 25% (or below 15–20% for a newer, smaller list) means the flow stack is underbuilt — usually a thin set of flows, not a campaign frequency problem. The gap is almost always in flows, not in campaigns.

For the full 10-flow priority build order (Priority 1, 2 and 3: trigger, sequence, target revenue per recipient and goal of each flow, including the Welcome, Abandoned Cart and Win-Back sequences), read `references/flow-stack.md` before specifying or auditing any flow.

---

## Step 3: SMS Integration Model

**SMS does 3 things email cannot:**
1. High-urgency moments (flash sale ending, low stock, restock notification)
2. Recovery within hours (cart abandon where email hasn't converted after 24h)
3. Direct, personal tone that email's formatting can't replicate

**Email vs. SMS role split:**
- Email: Storytelling, education, product launches (full narrative), 8–12 sends/month
- SMS: Urgency, last-chance, recovery, drops — max 2–4 sends/month

**Promo cadence ceiling:** Above 4 SMS sends/month, opt-out rate climbs into 1–2% per send territory and you're churning the list faster than you're growing it.

**Platform decision:**
- <€10M GMV + already on Klaviyo: use Klaviyo SMS — unified profiles and reporting outweigh feature gaps
- >€10M GMV with sophisticated SMS journeys (AOV €200+, conversational SMS): evaluate Attentive or Postscript

**SMS setup checklist:**
- [ ] Compliance: TCPA (US) / GDPR (EU) — explicit SMS opt-in separate from email opt-in
- [ ] Revocation handling is a moving regulatory target right now — don't hard-code either stance into a platform setup. The FCC's 2024 rule required honoring an opt-out by any reasonable method, not only a fixed "STOP" reply, but the broader compliance deadline for that rule has been pushed back repeatedly (most recently to January 31, 2027). A separate FCC order reported as adopted around October 1, 2026 moves the other way — it would let a sender designate ONE exclusive revocation channel instead — but isn't yet in force (pending Federal Register publication as of the sources checked). Confirm the live requirement with whoever configures opt-out logic on the SMS platform rather than assuming either version is the current rule.
- [ ] Dedicated SMS keyword for opt-in (e.g., "text SKIN to 12345")
- [ ] Quiet hours configured (no sends 9pm–8am local time)
- [ ] Opt-out rate monitored weekly — pause if >1% per send
- [ ] SMS branches live in: Welcome, Abandoned Cart, Win-Back

---

## Step 4: Campaign Rhythm

**8–12 email campaigns per month is a practitioner starting point, not a published benchmark** — no email-platform benchmark report backs a specific campaigns-per-month figure; the platforms that do publish data (Klaviyo included) emphasize that relevance and timing move revenue more than raw send frequency. Treat 8–12 as a range to start from and adjust against your own unsubscribe rate and click-through trend, for DTC brands between €2M and €20M GMV. Below 6/month: list goes cold. Above 14/month: unsubscribe rate tends to climb without a proportional revenue lift.

**Don't read open rate as an engagement signal on its own.** Apple Mail Privacy Protection pre-fetches the tracking pixel server-side for any subscriber on Apple Mail — roughly half of most DTC lists in 2026 — so a large share of "opens" fire whether or not anyone actually read the email. A spike in open rate after a subject-line change can be entirely artifact. Opens still work as a slow, multi-month trend line (a list going completely cold will still show it), but the decision signal for cadence, subject lines, or list health is click-through rate and the downstream conversion, never a single campaign's open number.

**Campaign mix per month:**
- 2–3 product/promo (feature a product or run a sale)
- 2–3 educational/storytelling (ingredient transparency, how-to, behind the scenes)
- 1–2 community/UGC (customer stories, reviews, user photos)
- 1 transactional check-in (new collection preview, shipping update, restock)

**Campaign vs. flow revenue split:**
- Flows: 65–70% of Klaviyo-attributed revenue (automated, always-on)
- Campaigns: 30–35% of Klaviyo-attributed revenue (requires weekly effort)

If campaigns are producing >50% of your Klaviyo revenue, your flow stack is underdeveloped — fix flows before adding more campaign sends.

---

## Step 5: LTV Expansion Levers

**Repeat purchase rate and AOV are the two LTV multipliers.** The oft-cited claim that a 5% increase in retention produces 25–95% more profit traces back to a 1990 services-industry study (banking, insurance, auto repair) — it is not a DTC or e-commerce number, and no readable primary source was found to confirm the range still applies outside that original context. Treat the direction (retention compounds profit disproportionately) as sound and calculate your own sensitivity from Step 1's LTV formula rather than citing a borrowed percentage. Each lever has a natural implementation sequence:

For the four LTV levers in detail (Subscription / Subscribe & Save, Bundling and Upsell, Loyalty / Rewards, Price Architecture) and the sequencing between them, read `references/ltv-expansion-levers.md` before recommending any lever.

---

## Step 6: Acquisition Sequencing

**Step 1 set the gate — don't restate it, apply it.** Once the brand clears the unlock criteria (organic base, repeat rate, CAC under the payback ceiling), sequence channels instead of launching all three at once.

For the channel order (Meta, Google Shopping / Search, third channel), the signal-before-structure checks, the bidding volume rules, the creative and kill-rule guidance and how to use the ad accounts already connected in Bulldozer OS, read `references/acquisition-sequencing.md` before planning paid acquisition.

---

## Step 7: The 3-Operator Model

For the operator table (Retention / Lifecycle, Acquisition / Media, Creative), the hiring order and the one-person-one-number rule, read `references/operator-model-and-calendar.md`.

---

## Step 8: 90-Day Buildout Calendar

For the week-by-week 90-day buildout table (what to build and which gate to check at each stage), read `references/operator-model-and-calendar.md`.

---

## Rules

- **Sequence, don't parallelize.** Retention infrastructure (Steps 2–5) comes before acquisition spend (Step 6) — not because acquisition doesn't matter, but because it's the only order in which the CAC math means anything.
- **Never show a discount before the point the flow specifies.** Abandoned Cart trains customers to abandon on purpose the moment the discount appears earlier than the sequence calls for.
- **Model subscription churn before building the program**, not after the first cohort surprises you — 6.5–8.5% monthly is a reasonable overall starting point, but replenishable categories (coffee, consumables) run lower and meal kits/beauty boxes run as high as 15%; check Step 5 before assuming any single number is normal for your category.
- **Read every test — price, subject line, or campaign — at 95% significance, 80% power, over a minimum of two full weeks.** Stopping early because the number looks good is a bias, not a shortcut, even when significance is technically reached.
- **Don't touch a paid campaign's bid strategy under ~30–50 conversions/month.** Below that, the data is noise; consolidate instead of "optimizing."
- **One accountable operator per lever.** Splitting retention and acquisition ownership across the same person is how the playbook's opening warning actually happens in practice.
- **Every benchmark in this playbook is a starting range, not a target.** Category, price point, and channel change what "healthy" looks like — calculate your own from Step 1 before treating any number here as a goal.