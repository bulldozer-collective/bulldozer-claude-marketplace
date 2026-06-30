---
name: |
  dtc-shopify-playbook
description: |
  Build the operating system for a DTC Shopify brand — unit economics baseline, retention stack (email + SMS flows), paid acquisition sequencing, LTV maximization levers, and the 3-operator model for scaling from 7 to 8 figures. Triggers on 'Shopify playbook,' 'DTC strategy,' 'email and SMS for ecommerce,' 'Klaviyo setup,' 'how to scale a DTC brand,' 'our email revenue is low,' 'Shopify retention,' or 'how to improve LTV.' For broader retention strategy, see customer-health-expansion.
when-to-use: |
  Build the operating system for a DTC Shopify brand — unit economics baseline, retention stack (email + SMS flows), paid acquisition sequencing, LTV maximization levers, and the 3-operator model for scaling from 7 to 8 figures. Triggers on 'Shopify playbook,' 'DTC strategy,' 'email and SMS for ecommerce,' 'Klaviyo setup,' 'how to scale a DTC brand,' 'our email revenue is low,' 'Shopify retention,' or 'how to improve LTV.' For broader retention strategy, see customer-health-expansion.
argument-hint: |
  DTC skincare brand, €2.1M GMV on Shopify. Klaviyo installed but barely used — only welcome email live. Repeat purchase rate 11%. CAC €38, AOV €62. Email is 14% of revenue. Goal: get to 28% email revenue share and improve repeat rate to 20%.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |
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
| Repeat purchase rate | | 15–30% for healthy DTC | Email flow stack drives this |
| AOV | | Category-dependent | Bundling, upsell, subscription |
| Email as % of revenue | | 28–38% target | See Flow Stack below |

**Do not scale paid acquisition until:**
1. At least 100–200 customers acquired through founder/organic channels
2. Repeat purchase rate ≥ 8% (any lower means product-market fit issues)
3. CAC < 50% of first-order net margin (gross margin × AOV)

Scaling ads before these signals wastes €20–30K on a business that hasn't proven retention can sustain the economics.

---

## Step 2: Email + SMS Flow Stack

**Target: email + SMS should produce 28–38% of total store revenue.** Below 25% means the flow stack is underbuilt — usually a thin set of flows, not a campaign frequency problem. The gap is almost always in flows, not in campaigns.

**10-flow priority build order:**

### Priority 1 — Build First (week 1–2)

**Flow 1: Welcome Series**
- Trigger: New subscriber via pop-up, checkout opt-in, or lead magnet
- Sequence: 4–6 emails over 7–10 days
  - Email 1 (immediate): Deliver the incentive (discount code, lead magnet) + brand story
  - Email 2 (+48h): Best sellers + social proof (reviews, UGC)
  - Email 3 (+3 days): Product education — how to use / what makes it different
  - Email 4 (+5 days): Urgency on the incentive (if time-limited) or a second product introduction
  - Email 5/6 (+7 days): Community / brand values / what buying this says about them
- Target RPR (revenue per recipient): €4.50–€8.50
- SMS: Add a single SMS at +24h after email 1 if no purchase

**Flow 2: Abandoned Cart**
- Trigger: Cart created, checkout not completed, 1+ hour elapsed
- Sequence: 2–3 emails over 48 hours + 1 SMS
  - Email 1 (+1h): Soft reminder — "left something behind" — NO discount
  - Email 2 (+12h): Social proof / reviews for the specific product
  - Email 3 (+24h): Final reminder — serve the discount NOW (not earlier)
  - SMS (+24h if email not opened): Urgency trigger, discount revealed
- Target RPR: €8–€15
- Rule: Never show the discount before email 3 or SMS. Showing it early trains customers to abandon cart to get discounts.

**Flow 3: Browse Abandon**
- Trigger: Visited a product page (or category page), no add-to-cart, 1+ hour elapsed
- Sequence: 2 emails over 48 hours
  - Email 1 (+1h): Product reminder with content (blog post, how-to, review) related to that product
  - Email 2 (+24h): Social proof / bestseller framing
- Target RPR: €2–€4

### Priority 2 — Build Second (week 3–4)

**Flow 4: Post-Purchase (New Customer)**
- Trigger: First purchase completed
- Sequence: 3 emails over 10 days
  - Email 1 (+1h): Confirmation + "what to expect" (shipping, packaging)
  - Email 2 (+3 days): How to get the most from the product (education, reduces returns)
  - Email 3 (+10 days): Ask for a review + introduce a complementary product
- Goal: Reduce buyer's remorse, generate UGC, and introduce the next product

**Flow 5: Repeat Purchase Prompt**
- Trigger: X days after first purchase (calibrate to product replenishment cycle — for skincare: 30–45 days)
- Sequence: 2–3 emails
  - Email 1: "How's [product] working for you?" + gentle repurchase prompt
  - Email 2 (+5 days): Repurchase prompt with social proof
  - Email 3 (+5 days): Incentive for second purchase (if not converted)
- Goal: Drive repeat purchase before the customer forgets

**Flow 6: Win-Back**
- Trigger: Customer has not purchased in 90–120 days (set based on average repeat purchase interval × 1.5)
- Sequence: 3 emails over 14 days
  - Email 1: "We miss you" + what's new
  - Email 2: Your best sellers — reminder of what they loved
  - Email 3: Last chance incentive — "here's 15% back"
  - Optional: Sunset email after flow ends with no purchase (clean the list)

### Priority 3 — Build Third (week 5–8)

**Flow 7: VIP / High-LTV Segment**
- Trigger: 2+ orders AND spending above threshold (e.g., total spend >€200)
- Sequence: Ongoing 1:1 treatment — early access to launches, exclusive offers, personal thank-you
- Goal: Retain and expand best customers; reduce churn on highest-LTV segment

**Flow 8: Cross-Sell**
- Trigger: Purchased Product A but never purchased Product B (where B is naturally complementary)
- Sequence: 2 emails over 7 days introducing Product B with a reason-to-believe tied to Product A purchase

**Flow 9: Subscription / Subscription Lapse** (if subscription product exists)
- Trigger: Subscription paused or cancelled
- Sequence: 3 emails over 7 days with benefit reminder and a lower-friction alternative (skip, pause, reduce frequency)

**Flow 10: Post-Purchase (Repeat Customer)**
- Trigger: Second or third purchase
- Sequence: 2 emails — thank you + request for referral/UGC
- Goal: Turn repeat buyers into advocates

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
- [ ] Dedicated SMS keyword for opt-in (e.g., "text SKIN to 12345")
- [ ] Quiet hours configured (no sends 9pm–8am local time)
- [ ] Opt-out rate monitored weekly — pause if >1% per send
- [ ] SMS branches live in: Welcome, Abandoned Cart, Win-Back

---

## Step 4: Campaign Rhythm

**8–12 email campaigns per month** is the sustainable cadence for DTC brands between €2M and €20M GMV. Below 6/month: list goes cold. Above 14/month: unsubscribe rate climbs without proportional revenue lift.

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

**Repeat purchase rate and AOV are the two LTV multipliers.** A 5% increase in retention can produce 25–95% more profit. Each lever has a natural implementation sequence:

**Lever 1: Subscription / Subscribe & Save**
- Best for: Beauty, supplements, coffee, food — anything replenishable
- Converts 5–15% of customers into recurring revenue
- Tool: ReCharge or Bold Subscriptions
- Churn: 5–15% monthly on subscriptions — model this before building, since high subscription churn can hurt more than it helps
- Lock in a subscriber at 15% discount, and even with 10% monthly churn, you're typically ahead by month 3

**Lever 2: Bundling and Upsell**
- Cart upsell: Display a complementary product at checkout (Shopify native or Zipify OCU)
- Po