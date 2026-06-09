---
name: |
  paid-strategy
description: |
  Select paid channels, allocate budget across platforms, and define measurement framework for a paid acquisition strategy. Triggers on 'which paid channel should I use,' 'media mix,' 'paid acquisition strategy,' 'how to allocate ad budget,' or 'paid growth strategy.' For platform-specific execution, see meta-ads, google-ads, or linkedin-ads.
when-to-use: |
  Select paid channels, allocate budget across platforms, and define measurement framework for a paid acquisition strategy. Triggers on 'which paid channel should I use,' 'media mix,' 'paid acquisition strategy,' 'how to allocate ad budget,' or 'paid growth strategy.' For platform-specific execution, see meta-ads, google-ads, or linkedin-ads.
argument-hint: |
  B2B SaaS $200/mo ACV, $20k/mo budget, trying to scale beyond content
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# Paid Acquisition Strategy

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on paid acquisition strategy. Your goal is to determine the right channel mix, budget allocation, and measurement approach before spending a dollar.

## Input

`$ARGUMENTS` — company context: product type, ACV, monthly budget, ICP, current traction (e.g., "B2B SaaS, $150 ACV, $30k/mo budget, targeting ops managers at 50-200 person companies"). If not provided, read any available context files before asking. Only ask if the budget and ICP are completely absent.

## Output

A `paid-strategy-{company}.md` file with: recommended channel mix with rationale, budget allocation by channel, testing vs. scaling phase plan, KPI framework by channel, attribution approach, and 90-day paid roadmap. Each channel recommendation includes: expected CPL/CPA range, timeline to optimization, and when to kill vs. scale.

**Produce output on first invocation. Read available context before asking. Only ask if the primary input is completely absent.**

---

## Platform Selection Framework

| Platform | Best for | Key signal | Typical CPA range |
|----------|----------|-----------|------------------|
| **Google Search** | High-intent demand capture | People actively search for your solution | $30–$300+ (varies wildly by industry) |
| **Meta (FB+IG)** | Demand generation, visual products, B2C | Creating demand; strong creative assets | $20–$150 consumer, $50–$500 B2B |
| **LinkedIn** | B2B, enterprise, decision-makers | Job title/company targeting matters; ACV >$5k | $50–$500+ CPL |
| **YouTube/Demand Gen** | Upper-funnel awareness, complex products | Audience benefits from video explanation | $15–$100 CPM |
| **Twitter/X** | Tech audiences, developer products | Audience is active on X; fast-moving news | Variable, generally lower volume |
| **TikTok** | B2C, 18–34, DTC, high-visual products | Audience skews younger; strong UGC creative | $15–$80 CPM |

### Channel Selection Rules

**Start with Google Search if**: Your product solves a known problem people actively search for. Keywords with commercial intent exist. You can write a landing page that converts cold traffic.

**Start with Meta if**: Your audience doesn't know they have the problem yet (demand gen). Product is visual. ACV is lower than $2k (volume matters more than targeting precision). You have strong creative capabilities.

**Start with LinkedIn if**: ACV is >$5k. Job title is the primary targeting criterion. You're selling to a clearly defined professional role at companies of a specific size.

**Don't start with all three**: Pick your best channel for 8 weeks. Prove unit economics before adding complexity.

---

## Budget Allocation

### Testing Phase (Weeks 1–8)

**Goal**: Find profitable channel(s) before scaling.

Allocation principle:
- 60% to your primary channel (best hypothesis)
- 30% to your second channel
- 10% reserve for learnings

**Minimum viable budget by platform**:
- Google Search: $3,000/mo minimum (below this, too few clicks to learn)
- Meta: $3,000/mo minimum ($100/day buys meaningful impressions)
- LinkedIn: $5,000/mo minimum (CPMs are high; need volume to learn)

**Kill signal**: If CPA is 3x+ your target after 6 weeks and creative has been tested, reallocate.

### Scaling Phase (After Proof)

When you've found a channel with CPA at or near target:
- Consolidate budget into winning channel first
- Increase budgets 20–30% at a time
- Wait 5–7 days between increases (algorithm learning)
- Only expand to second channel after primary is profitable and scaled

---

## KPI Framework

| Objective | Primary KPI | Secondary KPIs | Guardrail |
|-----------|-------------|----------------|-----------|
| Awareness | CPM | Video view rate, reach | Brand safety |
| Consideration | CPC, CTR | Time on site, pages visited | Bounce rate |
| Conversion (lead gen) | CPL | Lead quality (MQL rate) | Cost per MQL |
| Conversion (self-serve) | CPA | ROAS, LTV:CAC | Payback period |

**Target setting**: Don't set CPA targets before you have historical data. In testing phase, optimize for CPL and monitor lead quality. Set CPA targets after 4–6 weeks of data.

---

## Attribution Approach

**The attribution problem**: Every platform over-reports its contribution. Google claims more conversions than happen. Meta does the same. They all use different attribution windows.

**Practical solution**:
1. Use UTM parameters consistently on all ad URLs
2. Track blended CAC (total ad spend / new customers) in your own analytics
3. Compare platform-reported CPAs against blended CAC — expect 20–40% inflation per platform
4. Make budget decisions based on blended CAC trend, not platform-reported CPA alone
5. Run holdout tests for your biggest channels quarterly to measure true incrementality

**Attribution models**:
- Last-click: Easy to implement, under-credits upper-funnel. Fine for getting started.
- Data-driven (Google): Better for high-volume accounts, requires 30+ conversions/month
- Blended first-party: Best for understanding true channel contribution

---

## Naming Conventions

Consistent naming is non-negotiable for clean reporting. Use this structure:

```
[Platform]_[Objective]_[Audience]_[Offer]_[Date]

Examples:
GOOG_Search_Brand_Demo_2024Q2
META_Conv_Lookalike-Customers_FreeTrial_2024Q2
LI_LeadGen_CMOs-SaaS_Whitepaper_Mar24
```

---

## The 90-Day Paid Roadmap

**Weeks 1–2: Foundation**
- Set up conversion tracking and verify it's working
- Install UTM parameters on all URLs
- Create naming convention and apply to all campaigns
- Build campaign structure for primary channel

**Weeks 3–8: Test Phase**
- Run primary channel with 3+ creative angles
- Run secondary channel with validated creative from primary
- Review weekly: CPA vs. target, creative performance, audience performance
- Kill underperformers at week 6 if CPA is 3x+ target

**Weeks 9–12: Optimize or Expand**
- If primary channel is working: scale budget 20–30% every 7 days
- If primary channel is not working: audit creative → audience → landing page (in that order)
- If both channels show promise: refine budget split based on CPA

---

## Common Strategic Mistakes

- **Spreading budget across 5 channels at $5k/mo each** — none reaches the minimum needed to learn. Concentrate first.
- **Measuring CPA from platform dashboards** — inflated by attribution. Always cross-reference with blended CAC.
- **Scaling before proving unit economics** — spending $50k/mo on a channel with 3x target CPA just compounds the loss.
- **Changing budgets and creative simultaneously** — you can't learn what caused the change. One variable at a time.
- **Launching without conversion tracking verified** — campaigns optimizing for wrong event or no event = wasted spend.