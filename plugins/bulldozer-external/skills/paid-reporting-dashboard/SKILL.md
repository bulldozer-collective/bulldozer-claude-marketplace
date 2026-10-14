---
name: |-
  paid-reporting-dashboard
description: |-
  Builds and maintains the paid advertising reporting system for a B2B GTM team: UTM taxonomy, offline conversion upload, CRM attribution integration, a multi-platform dashboard connecting ad spend to leads, lead quality, pipeline and closed revenue (with period-over-period comparison), and benchmark scorecards with 30/90/180-day ROAS windows.
when-to-use: |-
  Trigger when the user asks to set up, update, fix, or rebuild a paid/ads reporting dashboard — including: 'set up our paid reporting dashboard', 'update our ad performance dashboard', 'connect ad spend to revenue', 'build our UTM taxonomy', 'what campaigns are working?', 'our paid reporting only shows impressions', 'we need a paid attribution setup', 'track our leads across Google and LinkedIn in one dashboard', 'build a multi-channel ad performance dashboard with period-over-period comparison', 'audit the quality of the leads our ads are producing'. Also trigger on any request comparing ad performance across multiple ad accounts/platforms, or one period against another. Not for audience segmentation → use audience-architecture. Not for attribution model selection → use attribution-funnel.
argument-hint: |-
  Series B SaaS, €80K/quarter on Google + LinkedIn. GA4 + HubSpot. Reporting only shows impressions and CPL. Leadership wants to see pipeline and closed revenue attribution per campaign before the next budget cycle in 3 weeks.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
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

For the full UTM taxonomy (required parameters, naming rules, GCLID auto-tagging, the re-launch trap, CRM UTM capture), read `references/utm-and-crm-attribution.md`.

---

## Layer 2: CRM Attribution Configuration

For the HubSpot configuration of original-source properties, the read-only rule and the data match target, read `references/utm-and-crm-attribution.md`.

---

## Layer 3: Offline Conversions

**This is the layer most B2B teams skip — and the most impactful.**

Offline conversions send CRM lifecycle stage changes back to the ad platforms as conversion signals. When a lead becomes an MQL, SQL, or Closed-Won deal, the ad platform learns which ads, audiences, and keywords produce those outcomes — not just which produce form fills.

**Result:** Smart Bidding shifts from optimizing for form fills to optimizing for SQLs and revenue — once it has enough of them to learn from (see the volume floor in the Benchmark Scorecard below). No public source ties a specific cost-per-SQL improvement percentage to this switch; treat the payoff as directional — better signal in, better spend allocation out — not as a number to promise leadership before you've measured it on this account.

For the Google Ads and LinkedIn offline conversion setup steps, the Bulldozer OS path and the 30-day validation, read `references/offline-conversions-setup.md`.

---

## Layer 4: Deal Attribution

**Connect the deal to the original ad source, not just the most recent touchpoint.**

In HubSpot, every deal has an associated contact. The contact has an `Original Source` field. If you've configured CRM attribution correctly (Layer 2), every deal is already associated with an ad source. Bulldozer OS can pull this directly with a SQL-style query against the DEAL object (`query_crm_data`) — group by Deal Source for the report below, or by `DATE_TRUNC` for a monthly cohort — instead of building a UI report by hand. **Test this on a throwaway query before building the report on it.** On a portal missing the right scope, `query_crm_data` fails outright on exactly this GROUP BY/DATE_TRUNC pattern — `Insufficient scope: required "crm.hubsql.execute reporting.full.read reporting.full.admin marketing.campaigns.revenue.lite.read marketing.campaigns.revenue.full.read"` — and it fails the same way whatever object or fields you query, not only on financial aggregation. If it fails, that's not the connector broken: name the missing scope to the client's HubSpot admin, and fall back to `search_crm_objects` filtered by Deal Source (paginate, aggregate client-side) — slower, but it works without that scope. One rule that matters either way: aggregate on the currency-converted deal amount (`amount_in_home_currency`), not the raw `amount` — a portal holding deals in more than one currency will silently mix them in the total otherwise.

**Required deal-level attribution fields:**
- `Deal Source` (single-select): inherits from associated contact's Original Source at deal creation — do not let reps change this
- `Influenced Channels` (multi-select): all utm_sources that touched any contact associated with the deal before close — captures multi-stakeholder influence
- `Paid-Attributed` (checkbox): true when Deal Source = any paid channel — enables single-filter paid attribution reports

**CRM deal report to build:** `Closed-Won deals by Deal Source` — this table, run monthly, shows which paid channels produce revenue (not just leads). This is the number that earns the marketing team a seat at the budget conversation.

---

## Dashboard Architecture

**4 dashboards, each for a different audience and decision cadence.**

For the four dashboard specifications (metrics, formulas, targets, which targets are sourced, OS tools to use), read `references/dashboard-specs.md`.

---

## Benchmark Scorecard

**Set these thresholds before the quarter, not during it.** Thresholds changed in response to current performance defeat the point of having them — you can no longer tell whether a channel improved or whether the bar just moved to match whatever happened last month.

**Escalation bands, derived from the Dashboard 1 targets above.** Same caveat as there: only the CAC payback row is backed by a named source — treat the ROAS, pipeline-multiple and cost-per-SQL bands as a placeholder until your own trailing data replaces them.

| Metric | Healthy | Investigate | Critical |
|--------|---------|-------------|----------|
| 180-day ROAS | ≥4.5x | 3–4.5x | <3x |
| Cost per SQL | €350–750 | €750–1,000 | >€1,000 |
| CAC payback period | ≤18 months | 18–24 months | >24 months |
| MQL → SQL conversion (by source) | Within 20% of the best-performing channel | 20–40% below | >40% below |

**Investigate** means: pull the campaign-level breakdown (Dashboard 3) before touching budget — a channel-level number in the Investigate band is often one or two campaigns dragging the average down, not the whole channel underperforming. Before touching budget at the campaign level either, rule out a creative problem wearing a channel problem's clothes: one fatigued or off-message ad dragging down an otherwise sound audience and bid setup looks identical to a bad channel on this scorecard, and the fix is a new creative test, not a smaller budget (see `ad-creative` for how to run that test — this scorecard shows where the money went, not why an ad did or didn't convert). **Critical** means: the reallocation conversation happens at the next review, not at the next quarter — and two Critical reads in a row for the same channel, above the volume floor both times, is the trigger to actually move the budget at that second review, not a third data point to wait for. A stopping rule that only ever gets discussed and never pulled isn't one.

**The volume floor applies before any of this.** A channel with fewer offline conversions per month than Smart Bidding needs to exit learning (~30–50 conversions/month per campaign) hasn't generated enough signal for the ad platform to optimize on, let alone for this scorecard to judge. Below that floor, the only correct action is to keep spending and wait — moving budget off a channel because its 180-day ROAS looks weak with 8 offline conversions in the window is reading noise as signal. There is no equally solid published floor for the CRM-side metrics (cost per SQL, MQL→SQL rate) — treat a channel with fewer than a handful of closed or qualified deals in the period the same way: wait for volume before concluding, rather than applying a borrowed number.

---

## Bi-Weekly Review Protocol

For the bi-weekly review cadence and agenda, and the multi-touch second view with its tool-contract traps, read `references/review-protocol-and-multitouch.md`.

---

## Rules

- **Revenue comes from the CRM, spend comes from the ad platform — never blend them into one number.** Each counts by its own rules; a "true cost" that adds ad spend to a CRM-derived figure is a number nobody can audit.
- **Original Source and Deal Source lock at creation — no exception for a rep or an automation, ever.** The day either can overwrite them, every dashboard built on this stack degrades, and it degrades silently, so no one notices until the numbers stop making sense months later. The one narrow exception that's allowed is an audited data-ops merge of duplicate contact records — that's cleanup, not an override.
- **Never reallocate off Dashboard 3.** It's built to catch a tracking break appearing overnight, not to render a performance verdict — a bad day's CTR there can sit next to a perfectly healthy cost per SQL that only shows up downstream. Reallocation decisions live in the Bi-Weekly Review, on the 90- or 180-day windows, never in the dashboard someone happens to already have open.
- **A weak scorecard number is a flag to investigate, not a verdict on the channel — rule out one fatigued or off-message creative before touching budget.** Two Critical reads in a row, above the volume floor both times, is what actually triggers the reallocation; waiting for a third read past that point isn't diligence, it's the stopping rule not being followed.
- **No reallocation decision on the 30-day window.** It exists to catch a tracking break, not to judge a channel. Judge on 90-day pipeline and 180-day ROAS — the sales cycle doesn't care what fits neatly in a monthly report.
- **Below the volume floor, wait — don't optimize.** A channel judged on a handful of conversions is being judged on noise, whatever the resulting number looks like.
- **Every metric on the scorecard needs an action attached to its Critical band, decided before the quarter starts.** A dashboard that only reports numbers without saying what happens when one crosses the line is decoration, not a reporting system.
- **A benchmark without a named source is a placeholder, not a target.** CAC payback here comes from a dated industry report; the ROAS, pipeline-multiple and cost-per-SQL targets don't — replace them with your own trailing 2–3 quarters as soon as you have them, and never let a client hold the team to an unsourced range as if it were a promise.
- **Multi-touch attribution is a second view, not a replacement for Deal Source.** Keep the single-touch field as the number everyone in the room trusts; use multi-touch to catch influence it would otherwise miss, not to relitigate which channel gets credit.