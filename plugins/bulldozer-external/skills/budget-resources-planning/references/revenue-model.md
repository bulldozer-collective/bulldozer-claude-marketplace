# Revenue Model

## Step 1: Revenue Model

**Revenue model structure for B2B SaaS:**

```
New ARR = Net new logos × Average ACV
Expansion ARR = Existing ARR × NRR expansion rate (anything above 100%)
Churned ARR = Existing ARR × Churn rate (negative)
Net New ARR = New ARR + Expansion ARR − Churned ARR

Quarterly revenue target = (Annual target − Starting ARR) ÷ 4 quarters
+ account for seasonal skew (Q2 and Q4 typically stronger)
```

**ARR growth rate benchmarks by stage:**

| Stage | ARR | Target growth (YoY) | Efficient growth (Rule of 40) |
|-------|-----|--------------------|-----------------------------|
| Seed | <€1M | 200%+ | >40 (growth rate + profit margin) |
| Series A | €1–5M | 100–150% | >40 |
| Series B | €5–20M | 80–120% | >40 |
| Series C | €20–50M | 60–80% | >40 |
| Growth | €50M+ | 40–60% | >40 |

**NRR benchmarks:**
- <100%: Company is shrinking from existing base (churn exceeds expansion)
- 100–110%: Healthy for sales-led motions
- 110–120%: Strong — existing customers more than replace churn
- 120%+: Best-in-class — checked again 2026-09-30, unchanged since 2026-09-25 (WebSearch on both companies' most recent public disclosures and earnings calendars; pages themselves still blocked by this environment's egress proxy): this band still describes Snowflake (~125–127% NRR, FY2026, last reported Sept 2 2026), and HubSpot's 102% NRR (Q2 2026, reported Aug 5 2026) remains its latest disclosed figure — neither company has reported or pre-announced Q3 since, and both are weeks out from their next earnings (HubSpot ~Nov 5 2026, Snowflake ~early Dec 2026), so nothing here is due for another check until one of those lands. Usage-based pricing (Snowflake, and similar consumption models) keeps landing in this top band; a mature seat-based motion like HubSpot's now sits squarely in the "100–110%: healthy for sales-led motions" band above it, not this one. Don't cite a company by name as a benchmark without checking which band its most recent quarter actually falls in — the label can go stale even when the number itself hasn't moved much.

*Segment NRR by deal size before applying the bullets above — checked 2026-09-08: several named surveys (Bessemer's State of the Cloud, the High Alpha/OpenView SaaS Benchmarks report, the ICONIQ Growth survey, KeyBanc's private SaaS survey, as relayed by aggregator write-ups — none of the primary reports could be fetched directly in this environment) converge on a median private-SaaS NRR near 108%, but the figure moves a lot with ACV: roughly 97% for SMB motions (<€25K ACV), ~108% for mid-market (€25–100K ACV), ~118%+ for enterprise (€100K+ ACV). Held to the enterprise band, a mid-market motion looks worse than it is; held to the "110–120% strong" line above, an SMB motion is being judged against an enterprise standard. Ask which ACV band the company sits in before reading the bullets as a single scale.*

*The growth-rate bands above read as top-quartile / aspirational targets for VC-funded companies, not a median to expect — checked again 2026-09-25, unchanged since 2026-09-12 (WebSearch; the source pages themselves are still blocked by this environment's egress proxy, tried again this pass on a CDN-hosted copy of the report PDF, same block). ICONIQ's "State of Go-to-Market in 2026" report puts top-quartile YoY growth at 111% for companies under $50M ARR in H2 2025, dropping to 91% for $50–100M and 33% for $100M+ — a much steeper deceleration curve than the table shows. (A separate ICONIQ cut of the narrower $100M+ "Enterprise Five" cohort cites a much higher figure for that top slice — a different, smaller peer set, not a correction to the broader $100M+ band above; not worth folding in without the methodology to compare them properly.) Separately, SaaS Capital's 2026 growth-rate benchmark study — a broader population, mostly bootstrapped — puts the median growth rate across all companies surveyed at just 22% (20% bootstrapped, 25% equity-backed), a fraction of any band above. Neither report publishes a single stage-by-stage median that would let this table be rebuilt with sourced cutoffs, but both converge on the same warning: ask whether the company should be judged against a top-quartile, VC-funded peer set or a broader median before presenting a stage's band as "the" target — a Series A company growing at 60% isn't failing this table, it may be tracking the real median for a wider population.*

**The trap: chasing the band instead of fixing what it assumes.** The bands above implicitly assume a healthy base — NRR at or above 100%. A company sitting on sub-100% NRR that sets its New ARR target to hit the "Series A: 100–150%" band is compounding growth on top of a base that's shrinking underneath it: the net-new bookings needed to hit the headline number keeps climbing every quarter just to offset churn, and the budget built on that number understates the sales capacity actually required. If NRR is below 100%, sequence the plan around fixing retention before setting a growth-rate target from the table — a budget is the wrong place to paper over that gap.
