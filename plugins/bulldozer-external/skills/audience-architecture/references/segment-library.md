# Audience Segment Library

**Segment 1: ICP-Fit In-Market (highest priority)**
Definition: Accounts matching ICP firmographic criteria + showing purchase intent signals
Construction: Company list upload (ICP-fit accounts from CRM/enrichment) + behavioral signals (website visitors, G2 profile views, pricing page visitors)
Expected conversion rate: 3–5x above baseline
Usage: Bottom-funnel campaigns, demo request CTAs, highest bid multipliers

**Segment 2: Closed-Won Expansion (prospecting)**
Definition: platform-driven expansion (LinkedIn Predictive Audience / Google Optimized Targeting) from the closed-won customer seed
Construction: See Step 2
Usage: Top-funnel prospecting; use educational/awareness creative

**Segment 3: Competitor Displacement**
Definition: Companies confirmed using a named competitor product
Construction: Technographic list from Clay/Apollo filtered by competitor tool, combined with "alternatives" or "vs [competitor]" keyword intent
Usage: Competitive campaigns with explicit switching narrative; keep separate from generic prospecting

**Segment 4: Engaged Non-Converted**
Definition: Website visitors (excluding existing customers) who visited 2+ pages or spent 2+ minutes
Construction: Pixel-based retargeting + suppression of existing customers. **On LinkedIn, Bulldozer OS builds this natively**: `bdzCreateWebsiteRetargetingAudience` fills the audience itself from the ad account's Insight Tag, off a set of up to 50 OR'ed URL rules (exact / starts-with / contains) — check `bdzGetInsightTag` first, since a `STALE` tag (no domain reporting in the last week) means the audience would be built on dead traffic, not a configuration mistake to chase. It's targetable as soon as it exists (no 48-hour wait), but only under `AD_TARGET_FACET_AUDIENCE_MATCHING_SEGMENT`'s sibling facet `AD_TARGET_FACET_DYNAMIC_SEGMENT` — the facet this document's Step 1 flags as taking a raw URN with no lookup, which is exactly the id this tool returns. It still needs the same 300-visitor floor as any matched audience to actually serve. `bdzDeleteAudience` only archives it on LinkedIn (the platform can't delete a retargeting segment or its page set), so retiring one in Step 6 doesn't free up DMP segment headroom the way a Matched Audience would. Nothing here reaches Meta — a Meta ad account returns 400 on this tool; keep building that side's pixel audience in Ads Manager.
Usage: Retargeting creative; message shifts from awareness to proof (case studies, ROI calculators)

**Segment 5: Buying Committee Expansion**
Definition: Multiple contacts from the same account showing engagement
Construction: LinkedIn Account Targeting — match accounts with 2+ engaged contacts from the same company
Usage: Multi-stakeholder campaigns; content for influencers and economic buyers at accounts where only the champion has engaged

**Checking whether Segment 1 is reaching who you think it is (LinkedIn only).** `bdzGetAdDemographicAnalytics` breaks delivery down by JOB_TITLE, JOB_FUNCTION, SENIORITY, COMPANY, COMPANY_INDUSTRY, COMPANY_SIZE, COUNTRY, and REGION — the closest thing Bulldozer OS has to confirming the ICP-Fit In-Market audience above is actually landing on the ICP dimensions from Step 1, rather than trusting the targeting setup to have worked. Two hard limits keep it a shape check, not a second accounting: it's LinkedIn-only (Meta returns 400, and Bulldozer's Meta import doesn't declare any breakdown at ad creation either, so there'd be nothing to read there regardless), and it never reconciles with the account totals from `bdzGetAdAnalytics` — LinkedIn caps the report at the top 100 values per creative per day, drops any segment under 3 events, and doesn't adjust cost for over-delivery. Read it to see whether the JOB_FUNCTION/SENIORITY mix still looks like the ICP after a month of delivery — never to recompute total cost or impressions against the account total; summing its rows under-counts every time. It also lags 12–24h behind delivery and retains only 2 years of history (10 years for `bdzGetAdAnalytics`) — don't treat it as a live number or a long-term archive.
