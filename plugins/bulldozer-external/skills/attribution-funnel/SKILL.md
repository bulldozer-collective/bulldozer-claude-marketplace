---
name: |-
  attribution-funnel
description: |-
  Build a revenue attribution model and full-funnel analytics system — model selection, touchpoint mapping, CRM data requirements, channel ROI calculation, and a standing attribution report. Triggers on 'attribution model,' 'funnel analytics,' 'which channels drive revenue,' 'marketing attribution,' 'how do we measure ROI by channel,' 'what's driving our pipeline,' or 'our marketing metrics don't connect to revenue.' For weekly growth tracking, see weekly-growth-review. For cohort-level analysis, see cohort-mmm.
when-to-use: |-
  Build a revenue attribution model and full-funnel analytics system — model selection, touchpoint mapping, CRM data requirements, channel ROI calculation, and a standing attribution report. Triggers on 'attribution model,' 'funnel analytics,' 'which channels drive revenue,' 'marketing attribution,' 'how do we measure ROI by channel,' 'what's driving our pipeline,' or 'our marketing metrics don't connect to revenue.' For weekly growth tracking, see weekly-growth-review. For cohort-level analysis, see cohort-mmm.
argument-hint: |-
  B2B SaaS, €8M ARR, 60-day sales cycle, mix of outbound and inbound — using HubSpot. Currently only tracking last-touch, want to understand full-funnel contribution by channel.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Attribution & Funnel Analytics

> This is a Bulldozer skill. Perfect attribution is impossible in B2B. The goal is directionally accurate attribution that's good enough to make channel budget decisions. A defensible approximation used consistently beats a theoretically perfect model that never gets implemented.

You are a Bulldozer growth operator building a revenue attribution model and full-funnel analytics system. Your job is to select the right attribution model for the GTM motion, define data requirements, map funnel stages with conversion benchmarks, calculate channel ROI, and produce a standing attribution report that informs budget allocation.

## Input

`$ARGUMENTS` — GTM motion (sales-led, PLG, hybrid), sales cycle length, CRM and MAP in use, channels active, current attribution approach (if any), and primary budget decision to inform. If not provided, read available context files. Ask once if the GTM motion and primary channels are completely absent.

## Output

An `attribution-{company}.md` file with: attribution model selection and rationale, funnel stage map with conversion benchmarks, data requirements and tracking gaps, channel ROI calculation framework, and a standing attribution report template. Actionable immediately given the current data infrastructure.

**Produce on first invocation. Be specific about what the chosen model can and cannot tell you — no model does everything.**

---

## Attribution Model Selection

No attribution model is perfect for B2B. B2B buying journeys involve 6–10 stakeholders, 20+ touchpoints, and 3–9 month evaluation cycles. The goal is to pick a model appropriate for your data maturity and the decisions you need to make — then upgrade as data quality improves.

### Model Selection Guide

**Sales cycle < 3 months:**
Use **time-decay attribution** — touchpoints closer to the conversion event get more credit. Rationale: in short cycles, the touches that drive the final decision are more predictive of what actually worked. Last-touch is acceptable as a fallback if time-decay isn't supported natively.

**Sales cycle 3–12 months:**
Use **U-shaped (40/40/20)** — 40% credit to first touch (how they found you), 40% to lead creation (what made them convert), 20% distributed across middle touches. Rationale: in mid-length cycles, the acquisition channel and the conversion trigger are the two most strategically interesting questions. U-shaped answers both.

**Sales cycle > 12 months, enterprise buying committee:**
Use **W-shaped (30/30/30/10)** — 30% to first touch, 30% to lead creation, 30% to opportunity creation (marketing-to-sales handoff), 10% distributed across the rest. Rationale: in long cycles with complex buying committees, the moment a lead becomes an opportunity is as important as acquisition — it reveals what marketing activities are actually moving accounts through the funnel.

**Hybrid motion (outbound + inbound):**
Create a "sales-sourced" vs. "marketing-sourced" attribution split. Attribute outbound deals (cold email, cold call, LinkedIn) to the sales team under a separate category. Then measure marketing-influenced revenue separately: what percentage of sales-sourced deals had marketing touchpoints (ad retargeting, content engagement, event attendance) in the journey?

For how each model runs in Bulldozer OS (`get_campaign_attribution_reports` parameters), the scope-block and five-condition under-count warnings, and the four structural blind spots every model has (dark social, offline touches, multi-stakeholder journeys, early-stage brand), read `references/model-selection-and-blindspots.md`. Read it before promising a model and before presenting results — name the blind spots to the client.

---

## Funnel Stage Map

Define each stage, what triggers the stage transition, and the conversion benchmark for your segment.

For the standard B2B funnel table (stage, definition, trigger, benchmark), the per-channel conversion rule, the revenue-per-MQL formula with its worked example, and the caveat on the benchmark column, read `references/funnel-stages-and-drop-off.md`.

---

## Data Requirements

For the CRM requirements checklist (source field, UTM passing, opportunity source, stage timestamps, Closed Lost Reason) and what to do when each is missing, read `references/data-requirements.md`. Audit the data before building the model.

---

## Channel ROI Framework

For each active channel, calculate:

1. **Channel spend** — All costs including tool costs, agency fees, and allocated headcount. Source this from the ad platform connector (`bdzGetAdAnalytics`, per layer), not from HubSpot's campaign spend rollup. HubSpot's own attribution tool documents a spend property on the CAMPAIGN object (`hs_spend_items_sum_amount`) and even proposes `ROAS = revenue / hs_spend_items_sum_amount` — refuse that path anyway. On the one portal checked, reading that property required a permission grant the connector didn't have, and even where it's available it's a manually-maintained rollup someone in ops has to remember to fill in, not a system-of-record number the way the ad platform's own spend figure is. Verify the CAMPAIGN object's `readAccess` before ever wiring this — don't assume it matches DEAL's access just because both live in HubSpot. One more trap on `bdzGetAdAnalytics` itself: its `from` parameter documents its own default as "180 days ago" — call it without a date range for a single month's channel spend and it silently averages six months of delivery into one number instead. Always pass `from`/`to` bounded to the exact period this row is reporting on.
2. **Attributed pipeline** — Opportunities where this channel was the source (or significantly influenced, depending on model). Pulled from open-stage DEAL records via `query_crm_data` or `search_crm_objects` — the attribution-model tool below only reports closed-won, so it cannot answer this row. Sum `amount_in_home_currency`, not `amount` — on a multi-currency portal, `amount` is the deal's own currency, and summing it across deals silently mixes currencies into one meaningless total. A third HubSpot tool touches the same data but doesn't replace either: `read_campaign_data` (operation `GET_ASSET_METRICS`, `assetType: DEAL`) returns name, stage, amount and close date for every deal tied to one campaign — confirmed in its own live schema — but it takes a single `campaignCrmObjectId`, not a channel or date-range filter. Use it to sanity-check one campaign's open deals, never as a substitute for the cross-campaign `query_crm_data`/`search_crm_objects` pull this row needs.
3. **Attributed revenue** — Closed-won revenue attributed to the channel. Pull this as the `REVENUE` metric, never `DEAL_AMOUNT`. `REVENUE` is split across touchpoints according to the attribution model, which is exactly what "attributed to the channel" means; `DEAL_AMOUNT` is the deal's full value, deduplicated per deal, and grouping it by a non-deal dimension like channel makes the same deal's full value reappear under every channel that touched it — a €50k deal touched by three channels turns into €150k of "attributed revenue" if this mistake ships in a dashboard.
4. **CAC by channel** — Channel spend ÷ new customers attributed to channel
5. **Payback period by channel** — CAC ÷ (ACV × gross margin ÷ 12)

| Channel | Monthly Spend | Attributed Pipeline | Attributed Revenue | Channel CAC | Payback |
|---------|---------------|--------------------|--------------------|-------------|---------|
| [Channel 1] | | | | | |
| [Channel 2] | | | | | |
| [Outbound sales] | | | | | |
| Total | | | | | |

**Channel efficiency signal:** a payback number only means something next to a benchmark for the same deal size and funding stage — a flat ladder built for no one in particular is worse than no ladder. The one sourced, dated reference point: the 2026 Aleph × Benchmarkit SaaS & AI Performance Benchmarks (342 companies, FY2025 actuals) puts median B2B SaaS CAC payback at 16 months, varying by roughly 2.5x depending on the cut — by ACV, sub-€5k ≈9 months, €10–25k ≈12, €25–50k ≈14, >€250k ≈24; by funding stage, Series A 10–12 months, Series B 14–18, Series C+ 18–24. A second, larger 2026 sample confirms the same shape without moving the numbers: Optifai's report (939 B2B SaaS companies, nearly triple Aleph × Benchmarkit's) converges on the same bands — roughly 11 months under €5k ACV, 22 months at €50–100k. Worth citing alongside Aleph × Benchmarkit as a second source, not a replacement for it — neither page was opened directly this pass, both are read from search summaries. Compare each channel's payback to the band matching this company's own ACV tier and funding stage, not to one fixed number:
- At or below the matching band: scale aggressively
- Within the matching band: maintain, optimize
- Up to roughly 1.5× the matching band: test and optimize before scaling
- Beyond that: cut or fundamentally restructure

**The dual-model check:** Run both first-touch and last-touch simultaneously. If first-touch says content drives 40% of pipeline and last-touch says it drives 8%, the truth lies between. Content is building awareness that other channels convert. This gap informs how to think about investment — content is top-of-funnel investment that benefits all channels downstream, not a direct-response channel.

---

## Funnel Drop-Off Diagnostics

For the drop-off diagnostic table (stage, pattern, root cause, first investigation) and the rules for reading drop-off by channel and fixing one stage at a time, read `references/funnel-stages-and-drop-off.md`.

---

## Standing Attribution Report

A model rebuilt by hand each quarter gets rebuilt twice and then abandoned. The deliverable is a report that runs on a fixed cadence and lands in front of whoever allocates budget.

**Cadence:** monthly for channel mix decisions, quarterly for model review. Never weekly — with a sales cycle longer than 30 days, weekly attribution numbers are noise, and reacting to them produces budget whiplash.

For the monthly report template and where each number comes from in Bulldozer OS (ad analytics, GA4 report templates, HubSpot attribution reports) with the seven cautions on reading them, read `references/standing-report-template-and-sources.md`.

### What the report must state out loud, every month

- **Which model produced these numbers**, and the one thing it structurally cannot see.
- **The data quality line** — percentage of leads with a populated source, percentage of Closed Lost with a reason. When either drops below the thresholds in Data Requirements, the numbers above it are directional at best, and the report says so rather than implying precision it doesn't have.
- **One decision to make**, with the amount attached. A report that ends without a budget decision to take or refuse is a dashboard, not an attribution report.

---

## Rules

- **Pick the model your data can support, not the one that sounds sophisticated.** Multi-touch attribution on leads with 40% source coverage produces a confident wrong answer, which is worse than an admitted approximation.
- **Never present a single number as the channel's contribution.** Give the first-touch figure and the last-touch figure; the gap is the finding.
- **No attribution decision on fewer than 30 closed deals in the window.** Below that, channel-level differences are sampling noise. Widen the window or state that the channel is unproven.
- **Sales-sourced pipeline is a channel.** If outbound deals fall into "direct" or "unknown", marketing gets credited for the work of the sales team and the budget goes to the wrong place.
- **Attribution informs budget, it does not decide it.** A channel with a long payback that opens an ICP segment nothing else reaches can be worth keeping — but say it explicitly, as a decision taken against the numbers, not by hiding them.
- **When a channel's number is revenue split across channels, never substitute the deal's full value for it.** A metric built for "value by deal" (list deals, total a campaign) and a metric built for "value by channel" look interchangeable and are not — the first repeats a multi-touch deal's full value under every channel it touched, the second splits it. Using the wrong one doesn't fail loudly; it just inflates the report.
- **A quiet drop in one channel's attributed revenue is a CRM-hygiene question before it's a channel-performance one.** Check whether contacts are being associated with the deal late (after close) before reallocating budget away from that channel — a process change on the sales side can look exactly like the channel going cold.
- **"The object is accessible" does not mean "the query tool can read it."** On the HubSpot connector, `query_crm_data` can fail with a missing-scope error on a DEAL object that schema discovery reports as fully available. As of October 2026 that failure comes back as a connector message naming the missing scopes and a two-step fix, not a bare scope string — reconnect the HubSpot app and explicitly check the named permissions first (none are granted by default, and this step needs no admin); only escalate to the admin if a permission shows a lock icon, meaning it's already been disabled for this app and reconnecting won't change that. Don't jump straight to "ask the admin" on the first failure — that skips a self-service step that may be all that's needed.
- **Confirm `get_campaign_attribution_reports` actually runs before naming a model in the deliverable.** The same `marketing.campaigns.read` scope that blocks CAMPAIGN spend fields can block this call entirely — every model, not just the ones weighted toward campaign data. A scope failure and a real zero-attribution month read identically on the page; the difference only shows up if the call is made and checked. This particular call does name its missing scope — but the exact wording isn't stable: the same gap has shown up as a raw HubSpot API string (`Insufficient scope: required "marketing.campaigns.read"`) and, confirmed live this pass, as a connector message spelling out the fix (reconnect and check the permission, escalate to an admin only if it's locked). Recognize the scope name under either wording rather than matching one fixed sentence, and don't extend "this call names its scope" to a HubSpot call this skill hasn't tested — other tools in the OS fail the same kind of permission gap with a generic "ask your administrator" message that names no scope at all.
- **Never call `bdzGetAdAnalytics` without an explicit date range.** It silently defaults to a trailing 180 days, so a call meant to answer "what did we spend this month" instead answers a six-month average, with nothing in the response flagging the substitution.