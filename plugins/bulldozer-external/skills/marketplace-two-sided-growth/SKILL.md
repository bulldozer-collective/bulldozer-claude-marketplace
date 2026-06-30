---
name: |
  marketplace-two-sided-growth
description: |
  Design the growth strategy for a two-sided marketplace — supply-first cold start sequencing, liquidity threshold definition, demand-side acquisition phasing, take rate calibration, disintermediation defense, and the expansion model from beachhead to market. Triggers on 'marketplace growth,' 'two-sided platform,' 'chicken-and-egg problem,' 'supply and demand balance,' 'marketplace liquidity,' 'how do we grow our marketplace,' or 'we need buyers and sellers at the same time.' For broader retention strategy, see customer-health-expansion.
when-to-use: |
  Design the growth strategy for a two-sided marketplace — supply-first cold start sequencing, liquidity threshold definition, demand-side acquisition phasing, take rate calibration, disintermediation defense, and the expansion model from beachhead to market. Triggers on 'marketplace growth,' 'two-sided platform,' 'chicken-and-egg problem,' 'supply and demand balance,' 'marketplace liquidity,' 'how do we grow our marketplace,' or 'we need buyers and sellers at the same time.' For broader retention strategy, see customer-health-expansion.
argument-hint: |
  B2B marketplace connecting mid-market companies with fractional CFOs. 120 verified CFOs on supply side, 45 active buyer companies. Liquidity ratio is 28% (searches to completed matches). Supply density is too thin to run paid acquisition. Need a stra
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |
  high
---

# Marketplace Two-Sided Growth

> This is a Bulldozer skill. Most marketplace failures aren't product failures — they're sequencing failures. Founders build both sides simultaneously, spread too thin, and never generate the density needed for real liquidity. The cold start problem kills more marketplaces than bad product or weak demand. Solve supply density in one narrow category first. Prove unit economics. Then expand.

You are a Bulldozer growth operator designing a two-sided marketplace growth strategy. Your job is to sequence supply and demand acquisition, define and hit the liquidity threshold, calibrate take rate to unit economics, defend against disintermediation, and design the category-by-category expansion model.

## Input

`$ARGUMENTS` — marketplace category (what connects to what), current supply and demand counts, liquidity ratio (% of searches/requests finding a match), take rate or subscription model, beachhead geography or vertical, known problem (supply thin / demand thin / matching failure / disintermediation). If not provided, read available context files. Ask once if the marketplace category is completely absent.

## Output

A `marketplace-growth-{company}.md` file with: liquidity diagnostic, supply-first cold-start plan, demand unlock criteria, take rate calibration, disintermediation defense design, expansion sequencing, and the 90-day operating plan.

**Produce on first invocation. Diagnose the current liquidity ratio first — the growth prescription is different for a supply-thin marketplace vs. a matching problem vs. a demand-side acquisition failure.**

---

## Step 1: Liquidity Diagnostic

**Liquidity is the probability that a buyer finds what they need when they show up.** It is not a user count — it's a match rate. A marketplace with 10,000 buyers and 2 active suppliers has 0% liquidity. A marketplace with 50 buyers and 45 active suppliers has very high liquidity.

**Three liquidity metrics:**

```
Liquidity ratio = Completed transactions ÷ Total search/request sessions
Target: >50% before scaling demand. Flywheel activates at >60%.
Below 30%: marketplace is broken — buyers churn after 1–2 failed matches.

Supply density = Active suppliers ÷ Total potential demand in the category/geography
Target: 70%+ of searches have ≥3 supplier options to choose from

Time-to-match = Median time from buyer request to first supplier response
Target: <4 hours for B2B services, <24 hours for physical goods
```

**Liquidity problem vs. matching problem:**

| Symptom | Likely cause | Diagnosis |
|---------|-------------|-----------|
| Search-to-match rate <30% | Supply too thin | Supply concentration problem |
| Search-to-match rate 30–50% | Matching algorithm | Wrong suppliers surfaced for buyer's need |
| Search-to-match rate >50% but transaction completion low | Trust, pricing, or UX | Buyer/supplier friction in the close |
| High match rate but repeat transaction rate low | Quality problem | Supply quality curation gap |

---

## Step 2: Supply-First Cold Start

**The cold start problem kills more marketplaces than any other failure mode.** The sequence matters: invest in supply first, then activate demand. Investing in demand before supply produces buyer churn and brand damage that is extremely difficult to recover from.

**Why supply first:**
1. Supply quality determines demand experience — a buyer who can't find what they need churns and rarely returns
2. Concentrated supply in a narrow category achieves liquidity faster than fragmented supply across many categories
3. Supply curation defends against race-to-the-bottom pricing (quality over volume)

**Supply acquisition strategy:**

**Stage 1: Curated recruitment (0 → first liquidity threshold)**
- Do NOT use paid acquisition for supply at this stage
- Identify the 50–100 highest-quality suppliers who would give the marketplace credibility
- Hand-recruit each one via direct outreach: email + LinkedIn + phone
- Value proposition for early supply: "We'll send you your first 5 clients in 90 days, or no fee"
- Qualify aggressively — accept only suppliers who can deliver within your SLA standards
- Concierge onboarding: help them build their profile, set pricing, configure their availability

**Supply onboarding checklist (before a supplier is "active"):**
- [ ] Profile complete (photo, bio, work samples or credentials, portfolio/case studies)
- [ ] Pricing defined (or range defined)
- [ ] Availability visible and accurate
- [ ] Response time commitment made (<4h for B2B services)
- [ ] First test transaction completed (internal or simulated)

**Resist broadening supply before hitting density in the beachhead.** Every marketplace that launched in 10+ categories simultaneously burned cash without hitting density in any of them. 70%+ supply density in one category → prove unit economics → expand to category 2.

---

## Step 3: Demand Unlock Criteria

**Do not invest in demand acquisition before these gates are met:**

| Gate | Threshold | How to measure |
|------|-----------|---------------|
| Supply density | 70%+ of searches have ≥3 supplier options | Query your search/matching engine for % of requests with 3+ viable matches |
| Liquidity ratio | ≥40% of requests result in a completed transaction | Completed transactions ÷ initiated requests, last 30 days |
| Time-to-match | ≤4h median for B2B services | Median time from request creation to first supplier response |
| Repeat supply rate | ≥50% of first-time buyers transact a second time | Repeat transaction rate for cohort of first buyers |
| NPS > 40 | Satisfied buyers are required before paid acquisition scales | Survey buyers after first completed transaction |

**If any gate is not met:** do not start demand-side paid acquisition. Every dollar spent on demand before supply can absorb it produces bad buyer experiences that are expensive to recover from.

**Demand acquisition channel mix (once gates are met):**

| Channel | Role | B2B allocation |
|---------|------|---------------|
| Google Search (category keywords) | Captures buyers actively searching | 35–45% |
| LinkedIn Ads (target buyer persona) | Creates demand among buyers not yet searching | 20–30% |
| Content / SEO | Organic demand from category education | 15–25% |
| Referral (buyer-to-buyer) | Highest-quality demand — peer recommendation | 10–15% |
| Outbound SDR (enterprise buyers) | Direct sales for high-ACV buyer accounts | 10–20% |

---

## Step 4: Take Rate Calibration

**The take rate is the percentage of transaction value the marketplace earns.** Too low and you can't sustain operations. Too high and suppliers migrate off-platform or price buyers out.

**Take rate benchmarks by B2B marketplace type:**

| Marketplace type | Typical take rate | Sustainable range |
|-----------------|------------------|------------------|
| Professional services (fractional execs, consulting) | 15–25% of first placement | 15–30% |
| Vendor procurement (B2B products) | 5–12% of transaction | 3–15% |
| SaaS / software distribution | 10–30% revenue share | 10–30% |
| Staffing / talent (hourly) | 20–35% of hourly rate | 15–40% |

**Take rate vs. subscription hybrid:**
Many B2B marketplaces layer a subscription fee on top of transaction fees:
- Subscription (supplier): ensures suppliers are committed to the platform; covers platform overhead regardless of transaction volume
- Transaction fee: aligns platform incentive with supplier success; scales with supplier GMV
- Most durable model: subscription + reduced transaction fee (15% base → 10% after hitting monthly subscription)

**Take rate calibration process:**
1. Calculate current contribution margin per transaction: (transaction value × take rate) − (cost to acquire supplier match + payment processing + support cost)
2. Target: ≥5% net contribution margin per transaction at steady state
3. If take rate is producing negative contribution margin: either raise take rate or reduce per-transaction cost
4. If suppliers are churning due to take rate: the platform is not delivering enough value to justify the fee — improve matching quality or supply utilization before attempting to raise rates

---

## Step 5: Disintermediation Defense

**The existential threat for every marketplace.** If the platform's only value is the initial match, sophisticated buyers and suppliers will eventually transact directly, eliminating the platform's revenue. Disintermediation typically begins after a buyer and supplier have transacted 3+ times.

**Disintermediation signals to monitor:**
- Communication moving off-platform (buyers/suppliers asking for direct contact details in early messages)
- Transaction volume growth slowing for repeat pairs (matched parties transacting less frequently on-platform)
- Supplier churn after 6–12 months despite high buyer demand
- Buyers contacting suppliers they met on-platform by email or LinkedIn

**Disintermediation defense playbook:**

**Layer 1: Payment protection**
Process all transactions through the platform. Buyers get payment protection (supplier doesn't get paid until delivery is confirmed). Suppliers get payment guarantee (no chasing invoices). Both sides have a financial reason to stay on-platform.

**Layer 2: Trust infrastructure**
Reviews, ratings, dispute resolution, and credentials verification make the platform the authoritative source of supplier quality. A supplier with 47 five-star reviews on the platform can't replicate that signal in a direct relationship.

**Layer 3: Workflow integration**
The deeper the platform is embedded in the transaction workflow — communication, project management, contract signing, invoicing — the higher the switching cost. A buyer and supplier communicating through the platform's messaging system can't easily take that history off-platform.

**Layer 4: Value-added services**
Insurance, compliance, background checks, certifications, and payment financing are services that buyers and suppliers can't replicate in a direct relationship. Add these b