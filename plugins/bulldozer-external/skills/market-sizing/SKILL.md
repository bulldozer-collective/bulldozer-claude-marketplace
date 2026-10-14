---
name: |-
  market-sizing
description: |-
  Quantify TAM, SAM, and SOM for a market or business — bottom-up and top-down approaches. Triggers on 'market size,' 'TAM SAM SOM,' 'how big is the market,' 'total addressable market,' 'addressable opportunity,' or 'market sizing.' For category dynamics and competitive forces, see market-category. For early macro signals, see market-signals.
when-to-use: |-
  Quantify TAM, SAM, and SOM for a market or business — bottom-up and top-down approaches. Triggers on 'market size,' 'TAM SAM SOM,' 'how big is the market,' 'total addressable market,' 'addressable opportunity,' or 'market sizing.' For category dynamics and competitive forces, see market-category. For early macro signals, see market-signals.
argument-hint: |-
  B2B SaaS for ops teams — quantify TAM, SAM, SOM with bottom-up approach
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
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

## When Sizing Is the Wrong Move Right Now

Run this before you run the numbers.

- **No settled ICP yet.** Bottom-up sizing is built entirely out of ICP filters (size, industry, geography). Running it against a fuzzy or shifting ICP produces a number that looks precise and isn't — fix the ICP first (see `icp-builder`), then size against it. Market and customer are coupled: don't let a top-down TAM substitute for the customer definition you haven't done yet.
- **Nobody will decide anything from the output.** A sizing exercise built to fill a pitch-deck slide, with no one who'll use the SOM to set a hiring plan or a quota, is a framework filled in for itself. If the real question is "does this look big enough to raise on," size only what that question needs — don't run the full exercise for its own sake.
- **The category doesn't exist yet.** Don't size a market you'd have to invent a category to describe — that decision belongs to `market-category`, not to this skill. Sizing an invented category first just launders a made-up number as if it were observed.
- **You already have the number that matters.** If the project has closed-won deals and a stable ICP, the SOM answer is closer to "next 12 months of pipeline at the current win rate" than a multi-year SAM percentage — reach for that lighter calculation before the heavier exercise.

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

### Sanity-Check with Bulldozer OS, When the Project Has One

If the project has a Bulldozer OS profile, `bdzGetProjectOfferStructure` and `bdzGetProjectDemandIntensity` ground the top-down pass in something observed rather than a purchased report — a market-concentration verdict with a top-3 share range and per-competitor revenue/headcount estimates, and real search-demand tiers and volumes with their own error margin. Both are async jobs with real prerequisites, a `targetProjectId` parameter that's easy to miss, a freshness field that isn't the one you'd guess, and a correction wrapper to check before quoting anything. For all of that — prerequisites, the `SUCCESS`/`RUNNING`/`ERROR` fallback, judging freshness by `startedAt` not `createdAt`, and reading `{value, override, overridden}` correctly — read `references/bulldozer-os-sanity-check.md` before calling either tool.

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
- SIC/NAICS industry classification data (US Census) — Eurostat uses its own NACE codes, not SIC/NAICS, for the same purpose in the EU
- G2 category pages (shows how many vendors serve the space → proxy for market size) — an external, manual lookup; Bulldozer OS does not track G2/Capterra data natively
- Job posting counts (companies hiring for a specific role signal the ICP) — inside Bulldozer OS this is `SIGNAL_TYPE_JOB_OFFERS` / `SIGNAL_TYPE_JOB_OFFERS_WATCHLIST` (Signals), which turns this from a one-off scrape into a running lead list rather than a static count

Bulldozer OS has no tool that counts companies by firmographic filter (`bdzListLinkedInCompanies` and `bdzSearchCompanies` only look up a company you already have a name, URL, or website for) — the external sources above remain the only way to get a company count.

If the project already has ICP profiles declared (`bdzListProjectIcpProfiles`), pull the firmographic ranges (jobs/sectors/employee count) from there before asking the user to redefine them — it's the project's own stated targeting, not a blank filter. The same call also returns anti-personas (`type: PROJECT_ICP_PROFILE_TYPE_ANTI_PERSONA`) mixed in with real ICPs — check `type` before using a profile's ranges, an anti-persona describes who to exclude, not a segment to size. It also requires a `targetProjectId` alongside the usual `customerId`/`projectId` — pass the project's own id again there, or the call is rejected.

### Step 2: Establish Average Contract Value

- If you have customers: use your actual ACV
- If the project's CRM is HubSpot and read access is available, `discover_hubspot_schema` / `query_crm_data` can pull `amount_in_home_currency` on closed-won deals directly — a real ACV from the pipeline instead of a guess, without waiting on a manual export
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

**Propensity to buy is the easiest filter to fool yourself on.** For most B2B categories, the real alternative isn't a competitor's product — it's a spreadsheet, the incumbent already in place, or doing nothing. Before counting a company as addressable, check what it's doing about the problem today: one already paying a competitor is a different (stronger) SAM entry than one duct-taping a spreadsheet, which is different again from one that hasn't noticed the problem yet — treating all three as equally reachable inflates the filter.

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

## Reconciling Top-Down and Bottom-Up

Run both when time allows, then compare — don't average them into one "best" number.

- **A wide gap is a diagnostic, not noise to smooth over.** If the two land far apart, one of them has a broken assumption — most often an overbroad category match in the top-down pass (a report on "project management software" that includes consumer tools you'll never sell against), or a wrong company-count or ACV in the bottom-up pass. Go find which one before reporting either figure. As a rough practitioner rule of thumb — indicative, not an audited study, same caveat as the VC-backable thresholds below — a gap beyond roughly 2–3× is the signal to stop and dig, not to average away.
- **Bottom-up carries the weight.** It forces you to defend the ICP, the ACV, and the channel; a top-down figure borrows credibility from a report you didn't write. Lead with bottom-up, use top-down only as the sanity check.

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

**When to stop and go get real data instead of publishing.** If flipping a single low-confidence assumption 2× changes the strategic conclusion (venture-scale or not, worth pursuing or not), that assumption — not the rest of the model — is the actual open question. Don't publish a sizing whose headline conclusion rests on one unverified number; go narrow that one assumption (a real customer count, an actual competitor's pricing, a demand-intensity run) before the sizing is usable for a decision.

---

## Data Sources

Three tiers, cheapest first: **free/low-cost** lookups (LinkedIn Sales Navigator, US Census/Eurostat, Crunchbase, G2/Capterra, Statista, Google + Wayback Machine); **paid research** (Gartner/IDC/Forrester — sold as an annual subscription, not a one-off report purchase; PitchBook/CB Insights; SimilarWeb/Semrush); and, for a project that has one, three analyses **already inside Bulldozer OS** that replace a manual pull with a real call — `bdzGetProjectOfferStructure`, `bdzGetProjectDemandIntensity` (see Method 1's sanity-check above), and HubSpot `query_crm_data` for real ACV from closed-won. None of the three OS calls replace the company-count sources above — they ground the multipliers (ACV, capture rate, category structure), not the count of potential customers itself. Full list with every caveat, including real subscription pricing: `references/data-sources.md`.

---

## Strategic Implications

A market sizing is only useful if it changes how you think. Answer these:

1. **Is this market big enough to build a venture-scale business?** Recent pitch-deck guidance (indicative, not an audited study) puts the entry bar closer to TAM > $1B and SAM > $100M for a venture-scale story at seed/Series A, SAM > $50M as a workable floor for a bootstrapped one. Growth-stage investors ask for more, not less: several 2026 sources describing what Series B+ funds look for cite TAM well above $1B, sometimes $10B+, precisely because the SOM math needs more room to keep compounding after the early capture. Don't treat any of these as hard cutoffs — they vary by investor and stage.
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
- **Picking a capture rate instead of deriving one**: "SAM × 2%" with no math behind the 2% is a guess wearing a percentage. Derive SOM instead from what the GTM can actually execute — reps × realistic deals per rep per year × ACV — then check that figure against the percentage of SAM it implies. If the capacity-derived SOM needs three times the sales team the plan can actually hire in the window, the SOM is the capacity number, not the percentage: a sizing that assumes headcount the team doesn't have isn't ambitious, it's a different plan wearing this one's numbers.