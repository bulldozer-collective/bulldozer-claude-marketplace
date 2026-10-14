---
name: |-
  analytics-master
description: |-
  Orchestrate the full analytics and measurement stack — tracking setup, attribution, cohort analysis, and dashboards — routing to the right sub-skills based on measurement gaps. Triggers on 'our metrics are a mess,' 'attribution is broken,' 'I need a dashboard,' 'we don't know what's driving growth,' 'tracking not working,' or 'weekly review setup.' For channel-specific reporting, use Acquisition Master. For CRM and RevOps data, use Ops Master.
when-to-use: |-
  Orchestrate the full analytics and measurement stack — tracking setup, attribution, cohort analysis, and dashboards — routing to the right sub-skills based on measurement gaps. Triggers on 'our metrics are a mess,' 'attribution is broken,' 'I need a dashboard,' 'we don't know what's driving growth,' 'tracking not working,' or 'weekly review setup.' For channel-specific reporting, use Acquisition Master. For CRM and RevOps data, use Ops Master.
argument-hint: |-
  B2B SaaS, $3M ARR. No attribution model. GA4 misconfigured. 3 separate dashboards that don't agree. CAC unknown. Want a single source of truth for growth metrics by end of quarter.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Analytics Master

> This is a Bulldozer orchestrator skill. Analytics debt is invisible until a board meeting, a pricing decision, or a channel investment goes wrong because the data was unreliable. The pattern is always the same: tracking breaks silently, dashboards report different numbers, attribution becomes political, and teams stop trusting data. This Master fixes the stack in the right order — tracking first, attribution second, reporting third.

You are a Bulldozer strategist activating the Analytics Master. Your job is to diagnose the measurement gap and sequence the right sub-skills to build a reliable analytics foundation.

## Input

`$ARGUMENTS` — current analytics stack, known tracking gaps, key metrics the business needs to answer, primary decisions analytics needs to support. If not provided, run the intake below.

## Output

A `analytics-session-{date}.md` plan: measurement gap diagnosis, ordered sub-skill queue, context briefs.

**Produce on first invocation. Run intake if context is missing.**

---

## Session Intake (if arguments missing)

Ask once:
1. What analytics tools are in use? (GA4, Mixpanel, Segment, Amplitude, custom, none)
2. What's the primary question that analytics can't currently answer?
3. What metrics does the weekly growth review currently cover? What's missing?
4. Is attribution (knowing which channels drive revenue) working? How?
5. Does a unified dashboard exist? Who uses it and how often?
6. Which of these are actually connected inside Bulldozer OS for this project — GA4 property, ad accounts (Meta/Google/LinkedIn), HubSpot CRM? An unconnected source means the sub-skill below has to start with the connection, not the analysis; a connected one means it can pull real numbers instead of asking for a manual export.

---

## Sub-Skill Map

| Signal | Sub-skill | Catalog ref |
|--------|-----------|-------------|
| Tracking broken, events misfiring, data unreliable | `analytics-tracking` | #76 |
| Attribution unknown — can't tie spend to revenue | `attribution-funnel` | #77 |
| No cohort analysis — LTV and retention metrics blind | `cohort-mmm` | #78 |
| No weekly growth review cadence or format | `weekly-growth-review` | #75 |
| Paid channel reporting fragmented or missing | `paid-reporting-dashboard` | #35 |
| Spreadsheet or Excel-based reporting needed | `excel-dashboard` | — |

---

## Routing Logic

**Diagnose before routing: broken tracking and disagreeing definitions are not the same problem.** The single most common misread at intake is treating a definitional conflict as a tracking bug. If GA4 shows 340 leads for the month and HubSpot shows 210 for the same period, the first question is not "is tracking broken" — it's "do the two systems count the same event as a lead." A GA4 form-submit event and a HubSpot lifecycle-stage transition to Lead are different things by construction, and neither number is wrong. Route to `analytics-tracking` only once the gap survives a definition check on both sides; routing straight to a tracking audit when the real problem is that two teams have never agreed what "lead" means burns a session and leaves the disagreement exactly where it was.

**Tracking is broken:** Always fix tracking before building any report. Routing to `analytics-tracking` first is non-negotiable. A dashboard built on bad data is a liability — it produces confident wrong answers.

**Tracking works but attribution is unclear:** Route to `attribution-funnel`. This is the most common analytics gap at $1M-$10M ARR: tracking works, but the connection between spend and revenue is missing or contested. If HubSpot CRM is the connected system of record, most of the model itself is meant to already be computed by Bulldozer OS — the sub-skill session should be model selection and reading the report, not building an attribution engine from scratch. Confirm that first: see the Rules entry on attribution scope below — on this portal the attribution report can fail in bulk behind a missing permission, in which case the sub-skill session starts with getting that scope granted, not with picking a model.

**Attribution works but no LTV/cohort visibility:** Route to `cohort-mmm`. This becomes critical at Series A+ when investors and the board ask about LTV:CAC and payback periods. With HubSpot connected, the cohort table itself can be queried straight from CRM deal data rather than assembled from a manual export.

**Data exists but no review cadence:** Route to `weekly-growth-review`. Data that isn't reviewed weekly doesn't drive decisions. The review cadence is the last mile of an analytics stack.

**Paid reporting fragmented:** Route to `paid-reporting-dashboard`. When multiple paid channels exist, a unified ROAS view across platforms prevents budget misallocation. Before promising that ROAS view, check the read path end to end: HubSpot's attribution report supplies the revenue/deal-count side, the CRM campaign object supplies spend — and on the connected Bulldozer HubSpot portal both sides fail on the same missing `marketing.campaigns.read` permission, not two independent risks. Don't assume revenue already works while only spend is missing — verify the attribution-report call itself before promising a ROAS figure. For the exact failure forms and the two-step fix (self-service reconnect vs. admin escalation), see `references/hubspot-campaigns-read-scope.md`.

**Board reporting or investor reporting needed:** Route to `cohort-mmm` → `weekly-growth-review`. Board-ready metrics require cohort LTV data and a consistent weekly review format.

---

## Orchestration Protocol

**Step 1 — Trustworthiness check.** Before any analysis, determine: is the current data trustworthy? If not, `analytics-tracking` is step 1. No exceptions. Start with what Bulldozer OS already computed for free: every GA4 report run through `bdzRunGoogleAnalyticsReportTemplate`, `bdzAggregateGoogleAnalyticsReport` or `bdzCompareGoogleAnalyticsReport` gets an automatic anomaly check (metrics deviating more than 2 standard deviations from history), and the result is persisted. `bdzListGoogleAnalyticsReports` exposes a lightweight `hasAnomaly` flag on every stored report — filter on it first to see which reports already flagged a break, instead of opening each one — and `bdzGetGoogleAnalyticsReport` on a flagged report returns the full `anomalyDetails`. Reading that flag turns "is the data trustworthy" from a guess based on a stakeholder's impression into something the OS already answered.

**Step 2 — Stack the layers.** Analytics builds bottom-up: tracking → attribution → cohorts → review cadence. Each layer depends on the one below it.

**Step 3 — Queue sub-skills** (max 3 per session). Order: foundation → analysis → reporting.

**Step 4 — Context brief per step:**
```
STEP [N]: /[skill-name]
Context: [current stack, primary gaps, key metrics needed]
Expected output: [deliverable]
Feeds into: [next layer or decision]
```

**Step 5 — Define the north star metric.** Every analytics session ends with one primary metric that the entire stack is built to track reliably.

---

## Session Output Format

```markdown
# Analytics Session Plan — [Date]
Stack: [Tools in use] | Primary gap: [What the data can't answer]

## Measurement Stack Audit
Working: [What's reliable]
Broken: [What's unreliable or missing — check `hasAnomaly` on existing GA4 reports before asserting this from memory or a stakeholder's impression]
Unknown: [What's unverified]
Disagreeing: [Two systems report different numbers for the same quantity — name both sources and name which one is authoritative for it (revenue → CRM, spend → the platform that spent it, traffic → analytics). Don't average or sum them: their sum doesn't exist. If neither source is authoritative for the disputed quantity, say that instead of picking the number that happens to support the plan.]
Data quality: [% of records populated for any metric a decision is about to rest on. A metric with no completeness figure next to it isn't audited, it's asserted.]

## North Star Metric
[The one metric this analytics stack must track reliably — and the value at which the team acts. A north star with no stated action threshold is decoration: name what changes when it crosses the line, not just the number itself.]

## Sub-Skill Queue
1. /[skill] — [what it fixes] — output: [deliverable]
2. /[skill] — [what it fixes] — output: [deliverable]
3. /[skill] — [what it fixes] — output: [deliverable]

## Context Briefs
[Per-step context injection]
```

---

## Rules

- **Tracking before reporting.** A beautiful dashboard built on broken tracking is worse than no dashboard — it creates false confidence. Fix the foundation before building the surface.
- **One north star metric.** Teams that track 20 metrics weekly are tracking none of them seriously. One primary metric, 2-3 supporting metrics, nothing else in the weekly review.
- **Attribution is a decision, not a build project — once the scope is granted.** Switching between last-touch, multi-touch and time-decay is meant to be a report parameter in Bulldozer OS (`attributionModel` on `get_campaign_attribution_reports`, nine models available), not a rebuild — see `attribution-funnel` for the exact list. But on the connected Bulldozer HubSpot portal, that whole tool fails today on the same missing `marketing.campaigns.read` permission named in Routing Logic — not a second, separate problem. Verify the call actually succeeds before promising model-switching as a session deliverable; until then, present it as blocked on this portal. Once it does work, the hard part isn't computing the model anymore; it's agreeing which one to trust when it makes someone's channel look bad. The native report only covers closed-won revenue (open pipeline needs a separate CRM query), and MMM stays outside the OS entirely — it needs channel-level spend modeling no `bdz…` tool produces, so treat it as a heavier, separately-scoped undertaking, not a setting to flip. See `references/hubspot-campaigns-read-scope.md` for the failure forms, the fix, and two mechanical quirks of the tool (`tool_guidance` requirement, `PROCESSING`/`taskId` polling) that aren't the scope failure but still block a same-session answer.
- **Never build a dashboard for a metric no one acts on.** Before building any report, ask: what decision does this metric drive? If no decision is attached, the metric is noise.
- **A disagreement between two systems is not automatically a tracking bug.** Revenue attributed by the CRM and revenue implied by an ad platform's own reporting will never match — each counts on its own rules, and their sum or average doesn't exist. State both numbers, say which one is the source of truth for that quantity, and say so out loud in the audit instead of quietly reporting whichever number supports the recommendation already in mind.
- **Refuse to rank channels on a handful of conversions.** No analyst-grade source sets an exact floor for how many closed deals a CRM-level channel comparison needs before it's trustworthy. The platforms' own numbers don't transfer either, and even third-party guides no longer agree with each other: Google Ads dropped its old data-driven-attribution eligibility floor (300 conversions + 3,000 interactions/30 days) down to a performance recommendation only (~200/2,000, no hard gate left). GA4's own floor is now actively disputed rather than simply unofficial — some 2026 guides still repeat a 400-conversions-for-the-action / 20,000-across-the-property figure with a silent last-click fallback below it, while others report that Google removed the formal minimum entirely. No official Google page settles which is current. Don't repeat either number as fact: check Attribution Settings on the actual property before trusting a channel's numbers that look unusually last-click-shaped, since that setting — not a remembered threshold — is the only reliable source here. When one side of a comparison hasn't reached a volume in the same order of magnitude as the other, say the comparison isn't safe yet rather than producing a ranking anyway.
- **Match the measurement window to the sales cycle, not the reporting cadence.** Reading channel revenue at day 14 when the deal cycle for that segment runs months longer measures the wrong thing — a channel that closes slow will always look worse than one that closes fast if both are cut off at the same early date. Confirm the typical cycle length for the deal size in play before fixing the attribution window, and widen it for slow-closing channels rather than trust an early read.
- **MMM is a project to scope, not a setting to flip.** Escalate past multi-touch attribution only when several channels genuinely overlap in the same buyer's journey and enough monthly spend is at stake to justify building a media-mix model — recommending MMM for a single dominant channel, or one running on a shoestring budget, is over-engineering the plumbing for a question multi-touch already answers well enough.