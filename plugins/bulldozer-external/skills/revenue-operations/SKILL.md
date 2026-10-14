---
name: |-
  revenue-operations
description: |-
  Design CRM lifecycle stages, lead scoring, routing rules, and marketing-to-sales handoff processes. Triggers on 'lead scoring,' 'lead routing,' 'MQL to SQL,' 'marketing-to-sales handoff,' 'pipeline stages,' or 'CRM automation.' For cold outreach, see cold-email. For email campaigns, see lifecycle-emails.
when-to-use: |-
  Design CRM lifecycle stages, lead scoring, routing rules, and marketing-to-sales handoff processes. Triggers on 'lead scoring,' 'lead routing,' 'MQL to SQL,' 'marketing-to-sales handoff,' 'pipeline stages,' or 'CRM automation.' For cold outreach, see cold-email. For email campaigns, see lifecycle-emails.
argument-hint: |-
  B2B SaaS, HubSpot CRM, SDR team of 5, need to define MQL criteria and routing rules
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# RevOps — CRM & Lifecycle

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on revenue operations. This skill focuses on CRM configuration, lead lifecycle design, lead scoring, and marketing-to-sales handoff — the systems that determine whether pipeline gets built or lost.

## Input

`$ARGUMENTS` — GTM motion, CRM stack, team structure, and primary RevOps problem (e.g., "B2B SaaS, HubSpot, SDR team of 5, want to redesign MQL criteria and improve handoff SLA"). If not provided, read any available context files before asking. Only ask if the primary problem is completely absent.

## Output

A `revops-spec-{company}.md` file with: lifecycle stage definitions (entry/exit criteria per stage), MQL scoring model, lead routing rules, handoff SLA table, and CRM automation recommendations. Includes a pipeline health dashboard metric list and a 30-day implementation plan.

**Produce output on first invocation. Read available context before asking. Only ask if the primary RevOps problem is completely absent.**

---

## Core Principles

### Single Source of Truth
One CRM is canonical. If data lives in multiple places, it will conflict. Everything syncs to and from the CRM — never parallel systems.

### Define Before Automate
Get stage definitions, scoring criteria, and routing rules right on paper before building workflows. Automating a broken process just creates broken results faster.

### Measure Every Handoff
Every handoff between teams is a potential pipeline leak. Marketing → SDR, SDR → AE, AE → CS: each needs an SLA, tracking, and an accountable owner.

### Revenue Team Alignment
Marketing, sales, and CS must agree on definitions. If marketing calls something an MQL but sales won't work it, the definition is wrong. Get in a room and agree before building.

---

## Lead Lifecycle Framework

### Stage Definitions

For the full stage-definition table (entry criteria, exit criteria, owner, SLA per stage), the stage hygiene rule and the HubSpot notes on `lifecyclestage`, `hs_lead_status` and `num_associated_contacts`, read `references/lifecycle-stages.md`.

---

## MQL Definition

An MQL requires **both** fit AND engagement. Neither alone is sufficient.

**Fit score** (who they are):
- Company size matches ICP: +X points
- Industry matches ICP: +X points
- Job title/seniority matches buyer persona: +X points
- Tech stack includes complementary tools: +X points

**Engagement score** (what they've done):
- Pricing page visit: +X points
- Demo request: +X points (auto-MQL trigger regardless of fit)
- Multiple product page visits in one session: +X points
- Content download: +X points
- Email click-through: +X points
- Webinar attendance: +X points

**Negative scoring** (disqualify):
- Competitor email domain: -50 points
- Student/personal email address: -30 points
- Job title mismatch (student, intern): -40 points
- Unsubscribe: -100 points (permanent)

**MQL threshold**: Typically 50–80 points on a 100-point scale. Calibrate against closed-won data — what score did your best customers have when they were leads?

**If the CRM is HubSpot, check what's actually configured before assuming a scoring tool needs to be built from scratch — and before assuming one doesn't.** Confirmed on a real portal: `hs_predictivecontactscore_v2` ("Likelihood to close") and `hs_predictivescoringtier` (four tiers) exist natively — but that's a propensity-to-close model (the probability a contact converts in the next 90 days), not the fit-plus-engagement MQL model above; it answers "how likely is this contact to buy," not "does this contact match our ICP and show real intent." Several vendor sources describe a separate native Lead Scoring tool (Marketing Hub Professional+, introduced when HubSpot retired its "legacy" scoring properties in August 2025) that does build fit/engagement/decay the way the model above does — but on the one portal checked, no property matching it exists, and that portal doesn't use HubSpot's own scoring for its lead scoring at all, it runs a custom field instead. Don't take "HubSpot already does this" as given until you've seen the client's own portal with that specific tool configured and populated; if it isn't, the manual points model above is still the real plan, not a stopgap. Enterprise's predictive score is HubSpot's own model, not a manual point system, and only becomes reliable with 200+ closed-won contacts to train on — below that, stick with manual scoring.

**A score is a filter, not proof.** Treat a lead crossing the MQL threshold as permission to make first contact, not as confirmation the deal is real — the SDR's discovery call still has to surface a client-stated need, a rough budget, and a timeline in the prospect's own words before anything moves to SQL. Watch what's actually driving the engagement points, too: a webinar "attendance" that's really an auto-registration, or a three-second pricing-page bounce, scores the same as a real signal unless someone checks. Don't let the model get credit it didn't earn.

**Recalibrate the threshold when the data says so, not on a calendar.** If SAL→SQL conversion — the number sales actually books meetings from — drifts from target for a full sales cycle, that's the signal to re-cut the score, not a quarterly reminder. A threshold nobody has touched in a year is either exactly right or nobody is watching.

---

## Lead Routing Rules

Define before building automation. Document in a routing matrix.

### Routing Matrix

| Lead type | Routing rule | Assigned to |
|-----------|-------------|------------|
| Inbound demo request, target account | Round-robin to AE pool | Direct to AE |
| Inbound demo request, non-target | Round-robin to SDR pool | SDR → AE |
| MQL, no form fill | Round-robin to SDR pool by territory | SDR |
| MQL, existing account contact | Previous account owner | AE (existing customer) |
| MQL, competitor domain | Suppress / marketing only | No routing |
| Free trial signup, target account | Alert assigned AE | AE |
| Free trial signup, non-target | SDR pool | SDR |

**Round-robin rules**:
- Distribute by geography first (if team is geo-split)
- Exclude reps on PTO from rotation
- Re-route automatically if no contact within SLA window

**Exceptions get logged and reviewed weekly, not decided lead by lead.** The moment an AE or SDR starts negotiating individual reassignments — "give me this one, I know the contact" — the matrix stops meaning anything, because everyone will have a reason. Approve exceptions in the routing review, not in a Slack DM.

**A rep who bounces back routed leads as "not qualified" isn't necessarily wrong — but the reason has to be about the lead, not the shape of the rule.** If it's a mismatch with the routing matrix, fix the matrix. If it's a real quality gap, that's an MQL-definition conversation between marketing and sales leadership (see Core Principles — Revenue Team Alignment), not a one-off argument settled by whoever answers Slack first. Track rejection rate by pool: one rep rejecting far more than peers on the same lead type is a coaching conversation about how they're working leads, not evidence the leads themselves are bad.

**If the CRM is HubSpot, round-robin is not a setting you toggle on** — it's a workflow you build: a trigger such as "record owner is unknown," followed by a "Rotate record to owner" action, on Sales or Service Hub Professional or above. Two things that rule doesn't do natively: an uneven split (e.g. 70/30 between a senior and junior rep) isn't supported by the rotate action itself — it needs a workaround (weighted lists, or excluding the junior rep from most rotation cycles); and PTO exclusion has to be modeled by removing the rep from the rotation list while they're out, since the action itself has no PTO awareness.

---

## Pipeline Stages

### B2B SaaS Example Pipeline

For the example B2B SaaS pipeline table (stage, definition, % likely to close, average days in stage), the stage-hygiene rule and the HubSpot notes on activity, stage renames, stage probability and time-in-stage fields, read `references/pipeline-stages.md`.

---

## CRM Automation Recommendations

### Priority Automations (Build First)

1. **MQL alert**: When lead score hits MQL threshold → notify assigned rep → create task to contact within SLA
2. **SLA breach alert**: If MQL not contacted within 4 hours → alert manager → escalate
3. **Stale opportunity alert**: If opportunity hasn't been updated in 14 days → task to rep
4. **Demo request routing**: Form fill → instant routing + assignment + rep notification
5. **Recycling workflow**: SQL rejected → back to MQL nurture track with reason code

**Don't build all five in the same sprint.** MQL alert and SLA breach alert protect the one lever with the clearest payoff — speed to first contact — build those first. Stale-opportunity and recycling workflows matter but tolerate a week's delay; sequencing them after the speed-to-lead pair means the team feels the automation working before it's asked to trust a more complex one. Building the pipeline-hygiene automations before the two speed alerts is a common ordering mistake — it polishes a pipeline that's still leaking at the top.

### Data Hygiene Automations

1. Deduplicate contacts and companies (match by email + company domain). In HubSpot, native automatic dedup only blocks an exact duplicate email at creation — everything else (name variants, domain matches) surfaces in the native Duplicate Management tool (Professional/Enterprise) as suggested pairs for manual or bulk review, up to 50 at a time. It is not a silent auto-merge; someone still picks the surviving record. HubSpot logs every merge automatically on the surviving record — `hs_merged_object_ids` on contacts and companies — so a hygiene checklist can audit merge volume after the fact without depending on the UI activity log; prevention stays manual, the trail of what got merged is native and queryable.
2. Enrich company data on create — pulls company size, industry, tech stack. If the CRM is HubSpot, this no longer means bolting on a separate Clearbit subscription: HubSpot acquired Clearbit and sells the same enrichment natively as Breeze Intelligence, billed in credits on top of a paid HubSpot plan. Check whether it's already licensed before recommending a new vendor contract. **Firmographic enrichment and buying-intent tracking are two separate Breeze products, not one feature** — a company record carries `hs_is_enriched` (has it ever been enriched) separately from `hs_intent_signals_enabled` (is intent tracking active on this record) and `hs_recent_intent_signals` (a rolling 30-day list of detected signal types, e.g. visitor intent, research intent). A portal can have one licensed and not the other. Before recommending a third-party intent-data subscription (Bombora, 6sense) to feed MQL engagement scoring, check `hs_intent_signals_enabled` first — paying twice for the same signal is a common and avoidable waste.
3. Auto-disqualify competitor domain leads (suppress from routing). **Log the reason, don't just vanish the record.** A competitor-domain email is a decent proxy signal, not certainty — a real buyer sometimes researches from a personal account that happens to share a domain with a reseller or portfolio company. Suppress from routing, but leave a visible trail a rep can appeal, rather than silently dropping the lead where no one will ever see it again.
4. Log all email interactions automatically (avoid manual logging as a step)

---

## Pipeline Health Dashboard

Track these metrics weekly:

Track the pipeline health metrics weekly. For the metrics table with definitions and targets, the forecast-accuracy notes, the HubSpot forecast-field checks, the pipeline-coverage guidance and the HubSpot query notes, read `references/pipeline-health-dashboard.md`.

---

## Marketing-to-Sales Handoff SLA

Define and enforce:

| Scenario | SLA | What happens if missed |
|----------|-----|----------------------|
| Inbound demo request | Contact within 1 hour (business hours) | Escalate to manager automatically |
| MQL (form fill) | Contact within 4 hours | Alert manager, re-route if still unworked at 8 hours |
| MQL (behavioral, no form) | Contact within 24 hours | Automated email nurture continues, rep alerted |
| Free trial signup (target account) | AE notified + contact within 2 hours | Alert AE's manager |

**What breaks this table isn't one missed lead — it's a pattern, and the two causes need different responses.** A rep who hasn't looked yet needs the alert/escalation path already above. A rep who looked and disagrees the lead is real is a different problem: require them to say what's missing — no budget named, wrong-titled contact, no timeline — rather than accept a bare "not qualified." That's the same proof standard as any other stage in this pipeline, not a special exception for the handoff moment. If misses cluster on one SLA row for more than a couple of weeks, treat it as a signal the row itself is wrong (target too aggressive for the team's actual capacity) before assuming it's a discipline problem.

**The 5-minute rule**: The core finding behind this rule (a 2007 MIT/InsideSales.com study of 15,000+ leads across six companies) still gets cited constantly, but every marketing source attaches a different multiplier to it — 8x, 9x, a 100x drop in contact odds at 30 minutes, 60x versus a 24-hour wait — with no single figure standing up as the number. Treat the direction as solid (faster is better, and the gap is large, not marginal) and the exact multiplier as unverifiable; don't quote one as if it were precise. Even a "got your request, booking time now" auto-email helps while a human response is pending.

---

## 30-Day Implementation Plan

**Week 1**: Document current state (existing stages, scoring, routing). Interview sales team on current MQL quality. Agree on new stage definitions and MQL threshold with marketing + sales leaders.

**Week 2**: Build MQL scoring model. Map routing rules. Document SLAs. Get sign-off from both marketing and sales leadership.

**Week 3**: Configure CRM (stage updates, scoring properties, routing automation, SLA alerts). Test with 10 synthetic leads.

**Week 4**: Launch with monitoring. Review daily: are leads routing correctly? Are SLAs being met? Calibrate scoring thresholds based on first week of data.

**The most common way this plan fails is skipping Week 1's sign-off to save time.** A scoring model or routing matrix built without marketing and sales leadership actually agreeing — not just being told — gets quietly ignored the day it launches, no matter how well Week 3 configured the automation. If Week 4 monitoring shows a rep pool routing around the new matrix entirely, that's not a workflow bug to patch — it's proof Week 1 didn't really happen. Go back to the room; don't fix it in the CRM.