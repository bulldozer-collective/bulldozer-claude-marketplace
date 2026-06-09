---
name: |
  market-sizing
description: |
  Quantify TAM, SAM, and SOM for a market or business — bottom-up and top-down approaches. Triggers on 'market size,' 'TAM SAM SOM,' 'how big is the market,' 'total addressable market,' 'addressable opportunity,' or 'market sizing.' For category dynamics and competitive forces, see market-category. For early macro signals, see market-signals.
when-to-use: |
  Quantify TAM, SAM, and SOM for a market or business — bottom-up and top-down approaches. Triggers on 'market size,' 'TAM SAM SOM,' 'how big is the market,' 'total addressable market,' 'addressable opportunity,' or 'market sizing.' For category dynamics and competitive forces, see market-category. For early macro signals, see market-signals.
argument-hint: |
  B2B SaaS for ops teams — quantify TAM, SAM, SOM with bottom-up approach
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# Market Sizing

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on market sizing. Your goal is to produce defensible TAM/SAM/SOM estimates using both top-down and bottom-up approaches — not to fabricate optimistic numbers for a deck, but to understand the real opportunity.

## Input

`$ARGUMENTS` — product description and target market (e.g., "B2B SaaS for ops teams — quantify TAM, SAM, SOM with bottom-up approach"). If not provided, read any available context files. Only ask if the product and market are completely absent.

## Output

A `market-sizing-{market}.md` file with: market definition, TAM/SAM/SOM calculations (both methods), key assumptions (labeled with confidence), data sources, and strategic implications. Numbers are shown with full math — not just conclusions.

**Produce output on first invocation. Read available context before asking. Only ask if the market is completely absent.**

---

## The Three Numbers

| Metric | Definition | What It Tells You |
|--------|-----------|-------------------|
| **TAM** (Total Addressable Market) | Total revenue opportunity if you captured 100% of the market | The theoretical ceiling — useful for category positioning |
| **SAM** (Serviceable Addressable Market) | The portion of TAM you can actually reach with your product and go-to-market | Your real opportunity given current product/GTM constraints |
| **SOM** (Serviceable Obtainable Market) | The portion of SAM you can realistically capture in 3–5 years | Your practical target — what investors and operators care about |

**Use SAM and SOM for planning. Use TAM only for framing the category.**

---

## Method 1: Top-Down

Start from published market data and narrow down.

### Process

1. Find a credible market research report (Gartner, IDC, Forrester, CB Insights, or industry associations)
2. Identify the closest matching market category and its total value
3. Apply narrowing filters to reach SAM:
   - Geography filter (if you're not global)
   - Segment filter (company size, industry, use case you serve)
   - Product fit filter (% of the category that your specific approach serves)
4. Apply realistic capture rate to reach SOM

### Example

```
TAM: Global project management software market — $7.3B (Gartner 2024)
SAM: English-speaking SMBs (10–200 employees) in professional services — 
     30% of market × $7.3B = $2.2B
SOM: Realistic 3-year capture at current growth trajectory — 
     2% of SAM = $44M ARR opportunity
```

### Top-Down Limitations

Market research reports are often:
- Outdated (published 18–24 months ago)
- Based on broad category definitions that don't match your specific product
- Optimistic (analysts have incentives to show growth)

Use top-down as a sanity check, not a foundation.

---

## Method 2: Bottom-Up (preferred)

Build from first principles — number of potential customers × revenue per customer.

### Process

```
TAM = Total potential customers in the category × Average contract value
SAM = TAM × % reachable with your current product and GTM
SOM = SAM × Realistic capture rate (3–5 year horizon)
```

### Step 1: Count Potential Customers

Sources for company counts:
- LinkedIn Sales Navigator (filter by company size, industry, geography)
- Apollo.io or ZoomInfo (filter by firmographic criteria)
- SIC/NAICS industry classification data (US Census, Eurostat)
- G2 category pages (shows how many vendors serve the space → proxy for market size)
- Job posting counts (companies hiring for a specific role signal the ICP)

### Step 2: Establish Average Contract Value

- If you have customers: use your actual ACV
- If pre-revenue: use competitor pricing as a proxy, adjusted for your positioning
- Show a range: best case / base case / conservative

### Step 3: Apply Filters

| Filter | Reduces |
|--------|---------|
| Geography | Only the markets you operate in |
| Company size | Your ICP size range |
| Technology fit | Companies using the stack your product requires |
| Budget availability | Companies that can afford your ACV |
| Propensity to buy | Companies that have the problem your product solves |

### Example

```
Total companies with 50–500 employees in US + EU professional services: 180,000
× Average ACV ($12,000/year)
= TAM: $2.16B

SAM: English-speaking, cloud-first, using the tools we integrate with (~35%)
= $2.16B × 35% = $756M

SOM: Realistic 5-year capture with current growth, 2 AEs, founder-led sales
= $756M × 1.5% = $11.3M ARR
```

---

## Key Assumptions — Required for Every Sizing

Every market sizing has assumptions. Surface them explicitly — this is what separates defensible analysis from made-up numbers.

For each assumption, label confidence:

| Confidence | Criteria |
|------------|----------|
| **High** | Based on direct data (actual customer counts, published data, your own metrics) |
| **Medium** | Reasonable estimate with one data point as reference |
| **Low** | Assumption with no data — flag explicitly, show sensitivity |

**Sensitivity analysis**: For low-confidence assumptions, show what happens if they're 2× higher or 2× lower. Does the conclusion hold?

---

## Data Sources

### Free / Low Cost

- **LinkedIn Sales Navigator** — company counts by industry, size, geography, technology
- **US Census / Eurostat** — company counts by SIC/NAICS code
- **Crunchbase** — funding rounds, company counts in a category
- **G2 / Capterra categories** — vendor counts, review volumes as market signal
- **Statista** — aggregated market research (some free, some paid)
- **Google search + Wayback Machine** — market research executive summaries

### Paid / Research

- **Gartner, IDC, Forrester** — authoritative market reports ($2–5K each, or check library access)
- **PitchBook / CB Insights** — VC investment data as proxy for market activity
- **SimilarWeb / Semrush** — traffic-based estimates for digital markets

---

## Strategic Implications

A market sizing is only useful if it changes how you think. Answer these:

1. **Is this market big enough to build a venture-scale business?** (Rule of thumb: SAM > $1B for VC-backable, SAM > $50M for bootstrapped)
2. **What's the realistic revenue ceiling in 5 years given your current GTM?**
3. **Which segment of the market is most accessible first?** (Beachhead)
4. **What would you need to change to expand SAM?** (New geography, new segment, new product line)
5. **Is the market growing or contracting?** A $500M growing-at-30%/year market beats a $2B shrinking market.

---

## Common Mistakes

- **Starting from TAM**: Investors and operators care about SOM. TAM is for category framing, not planning.
- **Using report numbers uncritically**: "The market is $X billion" without understanding what's included.
- **Confusing revenue with units**: A "$5B market" might be 5 million customers at $1,000 each or 500 customers at $10M each — completely different implications.
- **Not showing the math**: Conclusions without calculations are not credible.
- **Optimistic capture rates**: SOM capture rates above 5% over 5 years are almost always wrong for new entrants.