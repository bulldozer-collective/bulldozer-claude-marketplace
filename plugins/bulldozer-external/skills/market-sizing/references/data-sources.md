# Data Sources

### Free / Low Cost

- **LinkedIn Sales Navigator** — company counts by industry, size, geography, technology
- **US Census / Eurostat** — company counts by SIC/NAICS (US) or NACE (EU) classification
- **Crunchbase** — funding rounds, company counts in a category
- **G2 / Capterra categories** — vendor counts, review volumes as market signal
- **Statista** — aggregated market research (some free, some paid)
- **Google search + Wayback Machine** — market research executive summaries

### Paid / Research

- **Gartner, IDC, Forrester** — authoritative market reports, but access is sold as an annual subscription, not a one-off report purchase: Gartner doesn't sell single documents at all (enterprise subscriptions run $30K+/year), IDC subscriptions run roughly $15–75K+/year depending on coverage. Check library, business-school alumni, or a VC's portfolio-services access before assuming you can just buy the one report you need
- **PitchBook / CB Insights** — VC investment data as proxy for market activity
- **SimilarWeb / Semrush** — traffic-based estimates for digital markets

### Already Inside Bulldozer OS

For a project that has one, three analyses replace a manual pull with a real call rather than a fresh scrape:

- `bdzGetProjectOfferStructure` — market structure, top-3 share range, per-competitor estimated revenue/headcount (see Method 1's sanity-check above)
- `bdzGetProjectDemandIntensity` — search-demand tiers and volumes, for a SAM/SOM sanity-check grounded in actual query volume
- HubSpot `query_crm_data` — real ACV and deal counts from closed-won, when HubSpot is the connected CRM

None of these replace the company-count sources above — they ground the multipliers (ACV, capture rate, category structure), not the count of potential customers itself.
