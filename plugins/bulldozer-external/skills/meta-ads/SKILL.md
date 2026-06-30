---
name: |
  meta-ads
description: |
  Set up, structure, and optimize Meta (Facebook + Instagram) ad campaigns for demand generation, lead generation, and DTC conversion. Triggers on 'Meta ads,' 'Facebook campaign,' 'Instagram ads,' 'Meta campaign setup,' or 'Facebook advertising strategy.' For cross-platform strategy, see paid-strategy. For Google Ads, see google-ads.
when-to-use: |
  Set up, structure, and optimize Meta (Facebook + Instagram) ad campaigns for demand generation, lead generation, and DTC conversion. Triggers on 'Meta ads,' 'Facebook campaign,' 'Instagram ads,' 'Meta campaign setup,' or 'Facebook advertising strategy.' For cross-platform strategy, see paid-strategy. For Google Ads, see google-ads.
argument-hint: |
  DTC skincare brand, $15k/mo budget, want to scale from awareness to DTC purchase
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |
  high
---

# Meta Ads

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on Meta (Facebook + Instagram) advertising. Your goal is to build campaigns that drive efficient customer acquisition at scale.

## Input

`$ARGUMENTS` — product/offer, target audience, budget, and objective (e.g., "B2B SaaS lead gen, targeting HR managers, $20k/mo, want demo requests"). If not provided, read any available context files before asking. Only ask if the objective and budget are completely absent.

## Output

A `meta-ads-plan-{product}.md` file with: campaign structure (campaign → ad set → ad level), audience strategy (cold + warm + lookalike), creative brief (angles, formats, specs), bid strategy, optimization guide, and a 30-day launch plan with budget milestones.

**Produce output on first invocation. Read available context before asking. Only ask if the primary input is completely absent.**

---

## Campaign Structure

```
Campaign (objective)
├── Ad Set 1: Cold audience — top of funnel
│   ├── Ad A: Creative angle 1
│   ├── Ad B: Creative angle 2
│   └── Ad C: Creative angle 3
├── Ad Set 2: Warm audience — website visitors
│   ├── Ad A: Case study / social proof
│   └── Ad B: Objection handling
└── Ad Set 3: Lookalike audience — customers
    ├── Ad A: Direct conversion offer
    └── Ad B: Trial / free offer
```

**Rule**: Maximum 5 ads per ad set. More than that splits the learning phase signal too thin.

### Campaign Objectives (Choose One)

| Objective | Use when | What Meta optimizes for |
|-----------|----------|------------------------|
| **Awareness** | Building brand recognition | Reach and impressions |
| **Traffic** | Driving page visits | Clicks (cheap, low-intent) |
| **Engagement** | Growing social following | Video views, reactions |
| **Leads** | Lead gen forms | Form fills (native or website) |
| **Sales** | E-commerce or self-serve SaaS | Purchase events |

**Avoid Traffic objective for conversion campaigns** — clicks are cheap but Meta doesn't optimize for purchase or signup intent.

---

## Audience Strategy

### Cold Audiences (New Prospects)

**Interest targeting**:
- Layer 2–3 interests together (OR logic): one interest = too broad; 5+ interests = too narrow to scale
- Combine interests with behavioral signals: "Engaged shoppers" + "Small business owners"
- Advantage+ Audience: Let Meta's algorithm find the audience based on your pixel data. Use when you have 50+ pixel conversion events — often outperforms manual interest targeting.

**Broad targeting**: For accounts with mature pixels (500+ events), running with no interest targeting and letting the algorithm optimize. Counterintuitive but effective when the pixel has sufficient data.

### Warm Audiences (Retargeting)

| Audience | Window | Message approach |
|----------|--------|-----------------|
| All website visitors | 30–90 days | Broad social proof or reminder |
| Pricing page visitors | 7–14 days | Urgency, objection handling, comparison |
| Product/feature pages | 14–30 days | Case studies, demos |
| Video viewers (75%+) | 30 days | Move to consideration content |

**Exclusion rules** (always set these):
- Existing customers
- Recent converters (7–14 day window)
- Bounced visitors (<10 seconds on site)

### Lookalike Audiences

**Build from best signals, in order of quality**:
1. Paying customers (highest quality — optimize for LTV)
2. Qualified leads or trial users
3. Website converters
4. Email list (all subscribers — lower quality than customers)
5. Video viewers (lowest quality — early use only)

**Lookalike size**: 1–2% for highest similarity, 3–5% for reach. Test both. Don't go above 5% — too diluted.

---

## Creative Strategy

### The 3-Second Rule

If the first 3 seconds don't hook the viewer, the rest of the ad doesn't matter. Design the hook first.

**Hook types that work**:
- Bold problem statement: "Stop [common pain]"
- Unexpected visual or statistic
- Pattern interrupt (weird, surprising, contrarian)
- Direct address to ICP: "If you're a [role] who [problem]..."

### Creative Hierarchy (Test in This Order)

1. **Concept/angle** — biggest impact lever (problem-led vs. outcome-led vs. social proof-led)
2. **Hook/headline** — stop the scroll
3. **Visual style** — polished vs. UGC vs. screenshot
4. **Body copy length** — short vs. medium vs. long
5. **CTA copy** — last lever to test

Test concept first. Never test CTA copy before validating the concept works.

### Creative Formats

| Format | When to use | Specs |
|--------|-------------|-------|
| Single image | Product, offer, social-content proof | 1080x1080 (square) or 1080x1920 (vertical) |
| Carousel | Multiple products, feature list, before/after | 1080x1080 per card |
| Video (15–30 sec) | Complex products, storytelling, UGC | 1080x1920 vertical |
| Collection | E-commerce catalog | Auto-generated from product feed |

**Key insight**: Native/UGC-style content (selfie video, screen recording, text overlay) often outperforms polished studio creative. Test both — don't assume either wins.

### Ad Copy Framework

**Primary text** (above the image):
- Lead with the hook (problem, claim, or question)
- 1–3 short paragraphs maximum
- Include social proof (customer count, review quote, stat)
- End with CTA

**Headline** (below the image):
- Value proposition in one line
- Include the offer if there is one
- No more than 40 characters visible on mobile

**Description** (optional):
- Reinforcing detail or secondary benefit

---

## Bid Strategy

| Stage | Bid strategy | When to use |
|-------|-------------|-------------|
| Learning phase (0–50 events) | Lowest cost / Highest volume | Initial optimization |
| After 50+ events | Cost cap | Control CPA while scaling |
| Scaling (proven campaigns) | Bid cap | More control, less scale |

**Learning phase**: Campaigns need 50 conversion events per week to exit the learning phase. If your objective is purchase and you're getting 5/week, optimize for an upstream event (add to cart, lead) to get more signal.

**Budget changes**: Change budgets by ≤20% every 3–5 days. Larger changes reset the learning phase.

---

## Optimization Guide

**If CPA is too high**:
1. Check landing page first — is the problem post-click?
2. Tighten audience (too broad = low-quality visitors)
3. Test new creative angles (concept, not just copy)
4. Check ad relevance diagnostics (quality, engagement, conversion rate rankings)

**If CTR is low (<1% for feed, <0.5% for video)**:
- Creative isn't stopping the scroll → test new hooks
- Audience mismatch → try different targeting
- Ad fatigue → check frequency (>3x per week = refresh needed)

**If frequency is high (>3.5) with poor results**:
- Expand audience
- Refresh creative (new concepts, not just variations)
- Pause for 2–4 weeks if audience is exhausted

---

## Retargeting Windows

| Audience | Window | Frequency cap |
|----------|--------|--------------|
| Pricing/checkout abandoners | 1–7 days | Higher OK (4–7x/week) |
| Key page visitors | 7–30 days | 3–5x/week |
| General site visitors | 30–90 days | 1–2x/week |

---

## Tracking Setup Checklist

- [ ] Meta Pixel installed on all pages
- [ ] Events verified: PageView, Lead, Purchase (or equivalent)
- [ ] Conversions API (CAPI) set up for server-side tracking
- [ ] UTM parameters on all ad URLs
- [ ] Custom audiences created from customer list and pixel data
- [ ] Test purchase or lead event fires before launching conversion campaigns

**Why CAPI matters**: iOS 14+ killed ~30% of pixel data. Conversions API sends events server-side, recovering lost signal. Set up CAPI before running conversion campaigns.

---

## 30-Day Launch Plan

**Week 1**: Set up pixel + CAPI. Create custom audiences. Launch 1 campaign with 3 ad sets (cold interest, broad, retargeting) with 3 creative angles each.

**Week 2**: Monitor learning phase. Check for early signals — which creative concepts are getting engagement? Don't optimize yet.

**Week 3**: Kill bottom 50% of creatives by CPL/CPA. Increase budget on winners by 20%. Launch 2 new creative tests.

**Week 4**: Evaluate full-funnel CPA. If at or near target, begin scaling. If 2x+ target, audit landing page and audience before increasing spend.