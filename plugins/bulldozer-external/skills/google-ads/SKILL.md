---
name: |
  google-ads
description: |
  Set up and optimize Google Ads campaigns across Search, Shopping, Performance Max, and YouTube/Demand Gen. Triggers on 'Google Ads,' 'Search campaign,' 'Performance Max,' 'Google shopping,' or 'PPC on Google.' For cross-platform strategy, see paid-strategy. For Meta campaigns, see meta-ads.
when-to-use: |
  Set up and optimize Google Ads campaigns across Search, Shopping, Performance Max, and YouTube/Demand Gen. Triggers on 'Google Ads,' 'Search campaign,' 'Performance Max,' 'Google shopping,' or 'PPC on Google.' For cross-platform strategy, see paid-strategy. For Meta campaigns, see meta-ads.
argument-hint: |
  B2B SaaS project management tool, $15k/mo budget, want search campaigns for bottom-funnel keywords
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# Google Ads

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on Google Ads. Your goal is to build Search, Shopping, and Performance Max campaigns that drive efficient, high-intent customer acquisition.

## Input

`$ARGUMENTS` — product, monthly budget, target keywords or campaign type, and goal (e.g., "B2B SaaS, $10k/mo, want Search campaigns targeting 'project management software' keywords"). If not provided, read any available context files before asking. Only ask if budget and campaign type are completely absent.

## Output

A `google-ads-plan-{product}.md` file with: campaign type selection, keyword strategy (with match types), ad group structure, RSA copy (15 headlines + 4 descriptions), bid strategy recommendation, conversion tracking checklist, negative keyword list, and optimization cadence.

**Produce output on first invocation. Read available context before asking. Only ask if the primary input is completely absent.**

---

## Campaign Types

| Campaign type | Best for | When to use |
|--------------|----------|-------------|
| **Search** | High-intent, bottom-funnel | People actively searching for your solution |
| **Performance Max** | Full-funnel, cross-channel | Scaling conversion campaigns, e-commerce |
| **Shopping** | E-commerce product discovery | Physical or digital products with SKUs |
| **YouTube / Demand Gen** | Awareness, upper-funnel | Complex product that benefits from video explanation |
| **Display** | Retargeting, awareness | Remarketing to visitors, low CPM awareness |

**For most B2B SaaS starting out**: Begin with Search. It captures existing demand efficiently before creating demand.

---

## Search Campaign Structure

### Account Organization

```
Account
├── Campaign: Brand (your brand name keywords)
│   └── Ad Group: Brand exact
├── Campaign: Category — [Problem/Solution]
│   ├── Ad Group: Category broad keywords
│   └── Ad Group: Category specific long-tail
└── Campaign: Competitor — [Competitor Name]
    └── Ad Group: Competitor name + "alternative"
```

**Always run a Brand campaign** separately, even if you rank #1 organically. Competitors bid on your brand. Brand CPC is cheap. Protecting brand terms has near 100% ROI.

### Keyword Strategy

**Match types**:

| Match type | How it works | When to use |
|-----------|-------------|-------------|
| Exact [keyword] | Only shows for that exact query | Brand terms, high-value bottom-funnel |
| Phrase "keyword" | Shows when phrase is in query | Specific products, competitor terms |
| Broad keyword | Shows for related queries | Discovery; only with strong negative list |

**Match type progression**:
- Start with phrase and exact match
- Add broad match only after building negative keyword list
- Never run broad match without conversion data — Google's definition of "related" is very loose

### Negative Keywords (Build This Before Launch)

**Always exclude**:
- Job-related: jobs, careers, hiring, salary, resume
- Education: course, certification, degree, training (unless you offer these)
- Competitors (in non-competitor campaigns)
- Irrelevant use cases specific to your product
- Free versions (if you don't have one): "free," "open source"

Build a 50–100 term negative list before launch. Add from search terms report weekly for the first month.

### Ad Group Structure

Each ad group = one tightly themed keyword group. Mix of match types for the same theme.

```
Ad Group: "project management software"
- [project management software]
- "project management tool"
- project management app
- project management platform

→ 1 RSA + 1–2 variants
```

---

## RSA (Responsive Search Ads) — Writing Headlines

Google assembles 15 headlines and 4 descriptions into combinations. Write each headline as standalone — they appear in random positions.

### 15 Headline Formula

**Primary value proposition (3–4 headlines)**:
- "[Product Name] — [Primary Benefit]"
- "[Outcome] in [Timeframe]"
- "[Number] Users Trust [Product Name]"
- "The [Category] Built for [ICP]"

**Feature/benefit highlights (4–5 headlines)**:
- "No Credit Card Required"
- "Free [X]-Day Trial"
- "[Key Feature] That [Competitors] Don't Have"
- "[Specific number] integrations"
- "[Guarantee or Risk Reducer]"

**CTA headlines (2–3 headlines)**:
- "Start Free Trial Today"
- "Get a Demo in 24 Hours"
- "See [Product] in Action"

**Social proof (2–3 headlines)**:
- "Rated [X]/5 on G2"
- "Trusted by [X]+ Companies"
- "[Specific customer win, e.g., 'Cut reporting time by 60%']"

**Character limit**: Each headline max 30 characters. Each description max 90 characters.

**Pin headline 1**: Your most important message (brand name + core value prop). Pinning ensures it always appears in position 1.

### 4 Description Formula

- **Description 1**: Expand on core value prop + primary CTA
- **Description 2**: Address key objection (price, setup time, switching)
- **Description 3**: Social proof + secondary CTA
- **Description 4**: Feature-specific for high-intent searchers

---

## Bidding Strategy

| Stage | Strategy | When to use |
|-------|----------|-------------|
| No conversion data | Manual CPC | First 2–4 weeks; gather data |
| 30+ conversions/month | Target CPA | Main optimization goal |
| 50+ conversions/month | Target ROAS | E-commerce or revenue-based optimization |
| Scaling | Maximize Conversions (with target) | After tCPA is proven |

**Start manual or enhanced CPC** — automated bidding needs 30–50 conversions/month minimum to work. Below that, it guesses wildly.

**Setting CPA targets**: Don't set them lower than your observed CPA until you've had 50+ conversions. Setting too-low targets causes Google to reduce impressions dramatically.

---

## Quality Score

Quality Score (1–10) directly impacts CPC. A QS of 8 costs ~40% less per click than a QS of 5 for the same position.

**QS components**:
- **Expected CTR** (most important): Does your ad match what people expect to see?
- **Ad relevance**: Does ad copy match the keyword?
- **Landing page experience**: Does the landing page match the ad and keyword?

**Improving QS**:
- Match headline to keyword (if keyword = "project management software," headline should include those words)
- Ensure landing page headline matches ad headline (message match)
- Improve landing page load speed and mobile experience

---

## Performance Max

Use Performance Max (PMax) when:
- You have 30+ conversions/month in Search
- You want to expand to Shopping, Display, YouTube, Gmail
- E-commerce with product feed

**PMax best practices**:
- Provide high-quality creative assets (images, logos, headlines, descriptions, videos)
- Use audience signals (customer list, website visitors) to guide targeting
- Exclude brand keywords from PMax (run Brand campaign separately)
- Give PMax 4–6 weeks before evaluating — longer learning phase than Search

**PMax caveat**: Limited visibility into where spend goes. Supplement with Search campaigns for bottom-funnel keywords.

---

## Conversion Tracking Checklist

- [ ] Google Ads tag installed on all pages
- [ ] Conversion actions created: Lead (form submit), Purchase, or equivalent
- [ ] Conversion action verified with a test conversion
- [ ] Import conversions from GA4 (recommended for cleaner data)
- [ ] "Enhanced conversions" enabled (improves accuracy post-cookie changes)
- [ ] UTM parameters in all ad final URLs
- [ ] Cross-device conversions enabled

**Why this matters**: Google optimizes for what you tell it to optimize for. If you don't set up conversion tracking, Google will optimize for clicks — cheap, high-volume, low-intent.

---

## Weekly Optimization Checklist

**Every week**:
- [ ] Review Search Terms report — add new negatives
- [ ] Check budget pacing (on track? under/over?)
- [ ] Review auction insights (competitive pressure)
- [ ] Pause ads with CTR <1% after 500+ impressions
- [ ] Check impression share — are you losing to budget or rank?

**Every 2 weeks**:
- [ ] Review Quality Score per keyword
- [ ] Add new ad variants to best-performing ad groups
- [ ] Adjust bids on manual campaigns based on performance data

**Every month**:
- [ ] Review keyword performance — pause consistent underperformers
- [ ] Test new keyword themes from search terms report
- [ ] Update negative keyword list
- [ ] Review device performance — adjust mobile bid modifiers if needed