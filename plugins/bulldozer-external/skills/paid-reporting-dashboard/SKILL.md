---
name: |
  paid-reporting-dashboard
description: |
  Builds the paid advertising reporting system for a B2B GTM team: UTM taxonomy, offline conversion upload, CRM attribution integration, dashboard connecting ad spend to pipeline and closed revenue, and benchmark scorecards with 30/90/180-day ROAS windows.
when-to-use: |
  Trigger when the user asks: 'set up our paid reporting dashboard', 'connect ad spend to revenue', 'build our UTM taxonomy', 'what campaigns are working?', 'our paid reporting only shows impressions', 'we need a paid attribution setup'. Not for audience segmentation → use audience-architecture. Not for attribution model selection → use attribution-funnel.
argument-hint: |
  Series B SaaS, €80K/quarter on Google + LinkedIn. GA4 + HubSpot. Reporting only shows impressions and CPL. Leadership wants to see pipeline and closed revenue attribution per campaign before the next budget cycle in 3 weeks.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |
  high
---

# Paid Reporting Dashboard

> This is a Bulldozer skill. Most paid dashboards show impressions, clicks, and CPL. Leadership cares about pipeline and revenue. These are different datasets — one lives in ad platforms, one lives in the CRM. The gap between them is where most B2B marketing budget gets misallocated. Bridging that gap requires 5 layers of infrastructure before building a single dashboard.

You are a Bulldozer growth operator building a B2B paid reporting system. Your job is to design the UTM taxonomy, configure offline conversion upload, close the loop from ad click to CRM deal, build the dashboards that connect spend to pipeline, and establish the benchmark scorecard that drives budget reallocation decisions.

## Input

`$ARGUMENTS` — ad platforms (Google, LinkedIn, Meta), CRM (HubSpot / Salesforce), BI tool (Looker Studio, Metabase, or native CRM), average sales cycle length, current reporting gaps. If not provided, read available context files. Ask once if the ad platforms and CRM are completely absent.

## Output

A `paid-reporting-{company}.md` file with: UTM taxonomy standard, offline conversion architecture, CRM attribution configuration, 4 dashboard specs (Exec, Pipeline, Campaign, Channel), benchmark scorecard with 30/90/180-day windows, and a bi-weekly review protocol.

**Produce on first invocation. Infrastructure must exist before dashboards — a dashboard pulling CPL without CRM attribution is a vanity dashboard.**

---

## The 5-Layer Attribution Stack

Build these in order. Each layer is a prerequisite for the next.

```
Layer 1: Click tracking (UTM + GCLID)    — connects ad clicks to form fills
Layer 2: CRM integration                  — connects form fills to contact records
Layer 3: Offline conversions              — sends CRM lifecycle events back to ad platforms
Layer 4: Deal attribution                 — connects contacts to deals and revenue
Layer 5: Revenue dashboard               — connects spend to pipeline and closed ARR
```

Most B2B teams have Layer 1–2 and skip 3–5. The result: the algorithm optimizes for form fills, leadership sees CPL, and no one can answer "which campaign produced pipeline?"

---

## Layer 1: UTM Taxonomy

**A consistent UTM standard is the foundation of all attribution.** Without it, GA4 and CRM source data becomes fragmented within 30 days of launch as different team members build campaigns with different naming patterns.

**Required UTM parameters (mandatory for every paid link):**

| Parameter | Definition | Example values |
|-----------|-----------|----------------|
| `utm_source` | Platform | `google`, `linkedin`, `meta`, `reddit` |
| `utm_medium` | Channel type | `cpc`, `paid-social`, `display`, `remarketing` |
| `utm_campaign` | Campaign name | `search-brand-q2`, `linkedin-icp-awareness-q2` |
| `utm_content` | Ad creative variant | `ad-headline-a`, `creative-cto-persona` |
| `utm_term` | Keyword (Search only) | `crm-software-smb` |

**Naming convention rules:**
- Lowercase only — GA4 is case-sensitive; `Google` and `google` are two sources
- Hyphens only, no spaces or underscores — spaces break URL encoding
- Include quarter in campaign name — enables QoQ comparison without date filters
- No abbreviations that aren't in the shared glossary

**GCLID (Google Click Identifier):** Enable auto-tagging in Google Ads so GCLID passes automatically with every click. GCLID enables server-side conversion matching even when UTM parameters are blocked by browser privacy settings. Configure GCLID pass-through in your CRM (HubSpot: Settings → Marketing → Ad Tracking → enable GCLID).

**CRM UTM capture:** Every form submission should write the current session's UTM parameters to the contact record. In HubSpot, hidden form fields capture these automatically when the HubSpot tracking code is installed. Verify this is working: submit a test form with UTM-tagged URL and check the contact record for source fields.

---

## Layer 2: CRM Attribution Configuration

**Every lead in the CRM needs an original source that never changes.** This is the field that enables closed-won analysis by channel.

**HubSpot configuration:**
- `Original Source` and `Original Source Drill-down 1/2`: Set by HubSpot automatically on contact creation — do not overwrite these fields
- Custom property `Ad Campaign` (text, read-only after creation): stores utm_campaign value at lead creation
- Custom property `Ad Source` (text, read-only after creation): stores utm_source + utm_medium
- Custom property `First Touch Date` (date): timestamp when contact was created with a paid source

**The read-only rule is critical.** If reps or automation can overwrite the original source, attribution degrades within weeks. Lock these fields at creation in CRM settings (HubSpot: Properties → field-level permissions → no edit after creation).

**80% data match target:** Run a monthly audit — what % of contacts in your CRM have the `Original Source` field populated? Target: >80%. Anything below signals tracking gaps (UTMs missing on some campaigns, form submissions not capturing source, API-created contacts without source data).

---

## Layer 3: Offline Conversions

**This is the layer most B2B teams skip — and the most impactful.**

Offline conversions send CRM lifecycle stage changes back to the ad platforms as conversion signals. When a lead becomes an MQL, SQL, or Closed-Won deal, the ad platform learns which ads, audiences, and keywords produce those outcomes — not just which produce form fills.

**Result:** Smart Bidding shifts from optimizing for form fills to optimizing for SQLs and revenue. This typically produces 30–50% lower cost per SQL within 60–90 days of implementation.

**Google Ads offline conversion setup:**
1. Create conversion actions in Google Ads: one per CRM milestone (`MQL`, `SQL`, `Opportunity`, `Closed-Won`)
2. Assign conversion values reflecting deal economics:
   - MQL: €50 (low signal)
   - SQL: €200
   - Opportunity: €500
   - Closed-Won: actual deal value (or ACV estimate)
3. Connect via HubSpot/Salesforce native Google Ads integration or Google Ads Conversion Import API
4. Switch bidding to Target ROAS or Maximize Conversion Value once you have 30+ offline conversions/month

**LinkedIn Ads offline conversion setup:**
1. In Campaign Manager → Conversions → Create Conversion
2. Select "Lead Gen Form" or "Website" conversion type → add CRM stage triggers via LinkedIn integration or manual CSV upload
3. Attribution window: set to 90 days (not the 30-day default)

**Validation:** After 30 days, verify that offline conversions are appearing in Google Ads campaign performance. If import shows 0 conversions, debug the GCLID pass-through (most common failure point).

---

## Layer 4: Deal Attribution

**Connect the deal to the original ad source, not just the most recent touchpoint.**

In HubSpot, every deal has an associated contact. The contact has an `Original Source` field. If you've configured CRM attribution correctly (Layer 2), every deal is already associated with an ad source — query it with a custom deal report.

**Required deal-level attribution fields:**
- `Deal Source` (single-select): inherits from associated contact's Original Source at deal creation — do not let reps change this
- `Influenced Channels` (multi-select): all utm_sources that touched any contact associated with the deal before close — captures multi-stakeholder influence
- `Paid-Attributed` (checkbox): true when Deal Source = any paid channel — enables single-filter paid attribution reports

**CRM deal report to build:** `Closed-Won deals by Deal Source` — this table, run monthly, shows which paid channels produce revenue (not just leads). This is the number that earns the marketing team a seat at the budget conversation.

---

## Dashboard Architecture

**4 dashboards, each for a different audience and decision cadence.**

### Dashboard 1: Executive (Weekly, CEO / Board)

Purpose: Paid investment → pipeline → revenue

| Metric | Formula | Target |
|--------|---------|--------|
| Pipeline from paid (30-day) | Sum of deal values created where Deal Source = paid, current month | Match % of revenue target from paid channel |
| Pipeline from paid (90-day) | Same filter, last 90 days | 5–10x ad spend |
| 180-day ROAS | Closed-won ARR (Deal Source = paid, last 180 days) ÷ ad spend | 4.5–8.5x for B2B SaaS |
| Cost per SQL | Total ad spend ÷ SQLs with paid source | €350–750 mid-market |
| CAC payback period | CAC ÷ (MRR × gross margin %) | 5–11 months |

**Why 180-day ROAS:** B2B SaaS average sales cycle is 84 days. Evaluating paid ROI at 30 days systematically understates performance — most deals from this month's ads haven't closed yet. 180 days is the minimum window that captures the majority of revenue from a given ad period.

### Dashboard 2: Pipeline Attribution (Weekly, Marketing + RevOps)

- Pipeline by paid channel (Google / LinkedIn / Meta / other) — current quarter vs. last quarter
- MQL → SQL conversion rate by original source — which channels produce leads that close?
- Lead volume by campaign × lifecycle stage — are campaigns producing pipeline or just form fills?
- Cost per SQL by campaign — which specific campaigns are worth scaling?

### Dashboard 3: Campaign Performance (Daily, Paid Media)

- Spend, impressions, clicks, CTR by campaign
- Form fills and cost per form fill by campaign
- Offline conversions (MQL, SQL) by campaign — the leading indicator of pipeline quality
- Audience overlap and frequency cap monitoring

### Dashboard 4: Channel Mix (Monthly, CMO)

- Budget allocation vs. pipeline attribution by channel — are we spending in proportion to what produces revenue?
- Win rate by original source — which channels produce buyers vs. browsers?
- CAC by channel — what does it cost to acquire a customer from each channel?
- Quarter-over-quarter trend by channel

---

## Benchmark Scorecard

**Set these thresholds before the quarter, not during it.** Thresholds changed in response to current per