---
name: |
  linkedin-ads
description: |
  Set up and optimize LinkedIn ad campaigns for B2B demand generation, lead generation, and ABM targeting using job title, company, and seniority signals. Triggers on 'LinkedIn ads,' 'LinkedIn campaign,' 'sponsored content,' 'LinkedIn lead gen,' or 'B2B paid social.' For cross-platform strategy, see paid-strategy. For Meta campaigns, see meta-ads.
when-to-use: |
  Set up and optimize LinkedIn ad campaigns for B2B demand generation, lead generation, and ABM targeting using job title, company, and seniority signals. Triggers on 'LinkedIn ads,' 'LinkedIn campaign,' 'sponsored content,' 'LinkedIn lead gen,' or 'B2B paid social.' For cross-platform strategy, see paid-strategy. For Meta campaigns, see meta-ads.
argument-hint: |
  Enterprise SaaS targeting VP of Sales at 200-1000 person companies, $15k/mo budget
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# LinkedIn Ads

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on LinkedIn advertising. Your goal is to build campaigns that reach decision-makers at target accounts with relevant B2B offers — efficiently.

## Input

`$ARGUMENTS` — ICP (role, seniority, company size, industry), offer/CTA, monthly budget (e.g., "targeting VP Operations at 100-500 person SaaS companies, $20k/mo, offering a demo"). If not provided, read any available context files before asking. Only ask if ICP and budget are completely absent.

## Output

A `linkedin-ads-plan-{product}.md` file with: campaign structure, audience targeting strategy, ad format selection, copy templates (Sponsored Content, Message Ads, Lead Gen Forms), bid strategy, ABM target account approach, and 30-day launch plan with budget allocation.

**Produce output on first invocation. Read available context before asking. Only ask if the primary input is completely absent.**

---

## LinkedIn Ads Reality Check

**LinkedIn CPMs are 3–5x higher than Meta.** Expect $30–$80 CPM for most B2B audiences. CPL of $50–$300 is common. This is not a vanity metric — LinkedIn is genuinely expensive. Use it only when:

- ACV > $5,000 (economics justify the CPL)
- Job title or company is the primary targeting criterion (no other platform matches this)
- You need to reach decision-makers who aren't reachable elsewhere

If ACV is <$5k or your ICP is reachable via interest targeting on Meta, start with Meta. LinkedIn for the wrong product type is a money incinerator.

---

## Ad Formats

| Format | Best for | CPM range |
|--------|----------|-----------|
| **Sponsored Content (single image)** | Brand awareness, thought leadership | $30–$60 CPM |
| **Sponsored Content (video)** | Complex product explanation, stories | $25–$55 CPM |
| **Carousel ads** | Feature showcases, case studies | $35–$65 CPM |
| **Message Ads (InMail)** | Direct outreach, event invitations | Per-send pricing |
| **Lead Gen Forms** | Lead capture (no landing page) | CPL-optimized |
| **Conversation Ads** | Interactive multi-step engagement | Per-send pricing |
| **Document ads** | Gated content (whitepapers, reports) | $35–$65 CPM |

**Start with Sponsored Content + Lead Gen Forms**: Lowest friction path from impression to lead. Form data pre-fills from LinkedIn profile — dramatically higher completion rate than external landing pages.

---

## Audience Targeting

### Primary Targeting Dimensions (Use These First)

| Dimension | Recommended use |
|-----------|----------------|
| **Job title** | Most precise. Target exact titles: "Director of Operations," not just "Operations" |
| **Job function** | Broader — use when multiple titles hold the same role |
| **Seniority** | Combine with function: "VP+ in Finance" |
| **Company size** | Critical for B2B — 51–200, 201–500, 501–1000 etc. |
| **Industry** | Combine with seniority to filter out small companies in the industry |

**Audience size target**: 50,000–300,000 for most campaigns. Below 50k = too narrow to learn. Above 500k = too broad for B2B precision.

**Warning**: LinkedIn's "Skills" targeting is notoriously inaccurate — users self-report skills they don't have. Stick to job title, function, seniority, and company attributes.

### Matched Audiences (Retargeting + ABM)

| Audience type | How to build | Use for |
|--------------|-------------|---------|
| **Website visitors** | LinkedIn Insight Tag | Retarget all visitors with case studies |
| **Account list** | Upload CSV of target companies | ABM — show ads only to your named accounts |
| **Contact list** | Upload email list | Retarget known contacts, suppress converted customers |
| **Lead Gen Form openers** | Auto-created | Retarget engaged prospects |
| **Video viewers** | Auto-created | Move video viewers to conversion offer |

**ABM approach**: Upload your top 50–200 target account list as a Matched Audience. Layer job title/seniority targeting on top. This creates a laser-focused ABM campaign that only shows to decision-makers at your target accounts.

### Audience Expansion — Use Carefully

LinkedIn's "Audience Expansion" lets the algorithm find lookalike profiles. Can work well for mature campaigns with conversion data. Disable it during initial testing — you want to know exactly who saw your ads.

---

## Campaign Structure

```
Campaign Group: [Product] B2B Demand Gen
├── Campaign 1: Cold — Target Account List + VP/Director Seniority
│   ├── Ad 1: Problem-framed Sponsored Content
│   ├── Ad 2: Case study / outcome-led
│   └── Ad 3: Lead Gen Form (low friction offer)
├── Campaign 2: Cold — Broad ICP (no account list)
│   ├── Ad 1: Thought leadership content
│   └── Ad 2: Lead Gen Form (content offer)
└── Campaign 3: Retargeting — Website Visitors (30 days)
    ├── Ad 1: Case study
    └── Ad 2: Demo request (direct CTA)
```

---

## Copy Framework

### Sponsored Content Copy

**Primary text structure** (keep under 150 characters for mobile):
```
[Hook: Problem or contrarian claim]
[1-2 sentence bridge to your solution]
[Social proof stat or customer reference]
[Clear CTA]
```

**Example**:
```
Most sales teams track activities. The best ones track revenue health.

[Company] gives revenue leaders a real-time view of pipeline risk before deals slip through.

Used by sales ops teams at Salesforce, HubSpot, and 200+ B2B companies.

Download the Pipeline Health Playbook →
```

**Headline** (below the image, 70 chars max): "The Revenue Forecasting Guide for B2B Sales Leaders"

### Lead Gen Form Copy

**Headline** (40 chars max): "Revenue Forecasting Playbook"

**Offer description** (clear on what they get):
"Download our 15-page guide used by 200+ B2B sales leaders to build accurate revenue forecasts and reduce forecast variance by 40%."

**Privacy notice**: Always include. Required by LinkedIn policy.

**Form fields** (pre-filled from LinkedIn profile):
- First name, Last name, Email — always included automatically
- Add: Job title, Company name (usually pre-filled)
- Optional: Phone number (lowers conversion — only add if you're calling leads)

### Message Ads (Sponsored InMail)

Use for: event invitations, exclusive offers, high-touch ABM outreach.

**Format**:
- Subject: personalized, not salesy ("Your thoughts on [topic]?" works better than "Free Demo Offer")
- Body: 500 characters max visible on mobile — treat it like a cold email
- CTA button: "Learn more," "Register," "Download" — match to offer

**Deliverability rule**: LinkedIn delivers InMail only to users who haven't received another InMail in the past 30 days. You cannot spam people. This makes InMail inherently less spammy but also limits reach.

---

## Bidding

**Start with Maximum Delivery** (LinkedIn's auto-bid) — LinkedIn optimizes for your campaign objective. Monitor for 2 weeks, then switch to Manual Bidding if CPC is too high.

**Manual CPC target**: $8–$15 for most B2B audiences. Below $8 and impressions drop; above $15 is usually inefficient.

**LinkedIn Campaign Budget**:
- Daily minimum: $10/day (LinkedIn enforced)
- Recommended minimum: $100/day ($3,000/mo) per campaign for meaningful learning
- Below $3k/mo total: Not enough volume to optimize; wait until budget is larger or use Meta instead

---

## LinkedIn Insight Tag Setup

Required for retargeting and conversion tracking.

- [ ] Insight Tag installed on all pages (via tag manager or directly in `<head>`)
- [ ] Conversion events created: form submissions, page visits
- [ ] Matched audiences created from website visitors (30, 90, 180 days)
- [ ] Account list uploaded (if running ABM campaigns)
- [ ] Test conversion verified before launching conversion campaigns

---

## Optimization Guide

**If CPL is too high**:
1. Narrow audience (too broad targeting = low relevance)
2. Test new ad creatives (problem-led vs. outcome-led)
3. Switch to Lead Gen Form instead of landing page (typically 30–50% lower CPL)
4. Test lower-friction offer (content download vs. demo request)

**If CTR is low (<0.4%)**:
- Hook isn't stopping the scroll — test new opening line
- Visual is generic stock photo — test screenshot or data visualization
- Ad fatigue — check frequency (>3 per week per person = refresh needed)

**If form fill rate is low (<5% of LGF openers)**:
- Form asks too many fields — remove phone number
- Offer isn't specific enough — improve headline and description
- Privacy policy needs updating

---

## 30-Day Launch Plan

**Week 1**: Set up Insight Tag. Create matched audiences (website visitors, contact list). Launch 1 campaign with ABM account list + 2 Sponsored Content ads. Set at $3,000/mo.

**Week 2**: Monitor CPM, CTR, CPL. Check audience demographics in reporting — is the right seniority/title seeing ads? Add negative keywords if wrong audience is targeted.

**Week 3**: Test Lead Gen Form ad vs. landing page ad with same creative. Compare CPL.

**Week 4**: Kill bottom performer (LGF vs. landing page). Reallocate budget to winner. Begin testing second creative angle.