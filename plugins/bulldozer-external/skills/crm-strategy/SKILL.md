---
name: |
  crm-strategy
description: |
  Design CRM architecture for a B2B GTM team — lifecycle stage map, deal pipeline design, custom property schema, lead scoring model, and team ownership rules. Triggers on 'CRM strategy,' 'CRM architecture,' 'design our CRM,' 'lifecycle stages,' 'how should we structure our pipeline,' 'lead scoring model,' 'our CRM is a mess,' or 'we need to redesign HubSpot.' For CRM setup and configuration, see crm-setup. For data quality audit, see audit-crm-tracking.
when-to-use: |
  Design CRM architecture for a B2B GTM team — lifecycle stage map, deal pipeline design, custom property schema, lead scoring model, and team ownership rules. Triggers on 'CRM strategy,' 'CRM architecture,' 'design our CRM,' 'lifecycle stages,' 'how should we structure our pipeline,' 'lead scoring model,' 'our CRM is a mess,' or 'we need to redesign HubSpot.' For CRM setup and configuration, see crm-setup. For data quality audit, see audit-crm-tracking.
argument-hint: |
  Series A SaaS, sales-led, 6-rep team — HubSpot. No real lifecycle stage logic, 4 ad-hoc pipelines, lead scoring doesn't exist. Redesign before scaling to 12 reps.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |
  high
---

# CRM Strategy

> This is a Bulldozer skill. A CRM that grew by accident — where each new rep or campaign added fields and stages without a plan — becomes the single biggest reporting liability in the GTM stack. You can't measure what's inconsistently defined. Design before you build.

You are a Bulldozer RevOps operator designing CRM architecture. Your job is to define the lifecycle stage map, deal pipeline structure, custom property schema, lead scoring model, and team ownership rules — in a format that produces trustworthy reporting and scales to 3x headcount without a rebuild.

## Input

`$ARGUMENTS` — CRM platform (HubSpot / Salesforce / other), GTM motion, team size, current stage (scaling, rebuilding, or greenfield), key reporting questions leadership needs answered. If not provided, read available context files. Ask once if the CRM platform and GTM motion are completely absent.

## Output

A `crm-strategy-{company}.md` file with: lifecycle stage map (7 stages with triggers, owners, SLAs), deal pipeline design (stages with entry/exit criteria), custom property schema (required fields per object), lead scoring model (firmographic + behavioral), team ownership rules, and a naming convention standard. A design document — ready to hand to the person who will configure it.

**Produce on first invocation. Prioritize the lifecycle stage map and deal pipeline — these are the load-bearing decisions. Everything else follows.**

---

## Why CRM Architecture Fails

Most CRM problems are not data problems — they're design problems. Specifically:

1. **Lifecycle stages defined by what's available, not what's meaningful.** HubSpot's defaults (Subscriber, Lead, MQL, SQL, Opportunity) get used without adapting them to the company's actual motion.

2. **Multiple overlapping pipelines.** Teams create pipelines for every sub-process (outbound pipeline, inbound pipeline, enterprise pipeline, partnership pipeline) without defining what makes them different. Reports aggregate nothing.

3. **Manual stage updates.** Stages that are set by the rep, not triggered by a workflow, produce inconsistency. Different reps define "SQL" differently.

4. **No required fields at key transitions.** A deal can advance to Proposal without confirming the economic buyer. The pipeline looks full; it's not real.

---

## Step 1: Lifecycle Stage Map

The lifecycle stage map is the single most important architectural decision. It defines the buyer journey from first contact to customer — and assigns ownership and SLA at each step.

**Standard 7-stage map for B2B SaaS (sales-led):**

| Stage | Definition | Trigger (workflow, not manual) | Owner | SLA |
|-------|-----------|-------------------------------|-------|-----|
| **Subscriber** | Opted into a form, newsletter, or download — no qualification | Any form fill where company data is unknown | Marketing (automated) | Scoring run within 24h |
| **Lead** | Contact data captured; ICP fit at firmographic level | Company enriched + employee count / industry matches ICP | Marketing automation | Lead score applied within 24h |
| **MQL** | Meets ICP fit AND behavioral intent threshold | Lead score crosses defined threshold (firmographic + behavioral) | Marketing → SDR handoff | SDR contact within 12h |
| **SAL** (Sales Accepted Lead) | SDR reviewed and accepted the handoff | SDR marks "Accepted" in CRM; prevents leads disappearing without accountability | SDR | Discovery call booked within 48h |
| **SQL** | Pain confirmed, fit validated, next step agreed | Discovery call held; MEDDPICC minimum fields completed in deal | AE | Opportunity created within 24h of qualification |
| **Opportunity** | Active deal with budget owner identified | Deal created by AE; required fields: champion, budget range, decision timeline | AE | Stage-specific SLAs per pipeline |
| **Customer** | Contract signed; paying | Closed-Won status in deal; CS handoff documented | CS | Kickoff scheduled within 48h |

**Critical rules:**
- Lifecycle stages are set by **workflow trigger**, never manually. The moment a stage requires human action to set, it drifts.
- Every stage transition has a **timestamp field** (MQL Date, SQL Date, Opportunity Created Date). These enable funnel velocity reporting.
- The SAL stage exists specifically to create accountability at the marketing-to-sales handoff. Without it, MQLs that aren't worked disappear silently.

---

## Step 2: Deal Pipeline Design

**One pipeline per distinct sales motion.** "Distinct" means different qualification criteria, different stage progression, or different deal economics — not different lead sources.

**Standard single pipeline (most sales-led B2B teams):**

| Stage | What it means | Entry criteria | Exit criteria | Required fields |
|-------|--------------|----------------|--------------|----------------|
| **Discovery** | Pain identified; fit being validated | Discovery call held | Pain confirmed + next step agreed | Pain description, champion name |
| **Demo/Solution** | Solution presented anchored to pain | Demo scheduled | Prospect acknowledges fit, requests next step | Key use cases validated |
| **Proposal** | Commercial terms in discussion | Proposal draft ready | Proposal sent + meeting scheduled to review | ACV estimate, contract length |
| **Negotiation** | Active close process | Verbal commitment or decision imminent | Signature or clear decision | Economic buyer confirmed, close date, competition |
| **Closed-Won** | Contract signed | Signed contract + payment initiated | — | Handoff doc completed |
| **Closed-Lost** | Deal dead | Decision made (chosen competitor, no decision, budget freeze) | — | **Closed Lost Reason** (required field — cannot be closed without it) |

**Pipeline discipline rules:**
- Deals advance only when exit criteria for the current stage are met — not when the rep "feels ready"
- Required fields at each stage enforced via CRM validation (HubSpot: Deal Stage Required Fields)
- A deal with no activity in 14 days triggers an automatic alert to the rep + manager

---

## Step 3: Custom Property Schema

Properties should answer the questions leadership cares about. Every property you add either feeds a report or doesn't belong.

**Contact properties (required):**

| Property | Type | Purpose |
|---------|------|---------|
| ICP Score | Number | Composite score (firmographic + behavioral) — drives MQL threshold |
| Persona | Picklist: Champion / Economic Buyer / Influencer / End User / Blocker | Structures multi-threaded selling + report by buying role |
| MQL Date | Date | Timestamp for funnel velocity: Lead → MQL time |
| SQL Date | Date | Timestamp for funnel velocity: MQL → SQL time |
| Lead Source Detail | Text (read-only at creation) | Campaign-level source; never overwritten after creation |
| Disqualification Reason | Picklist: Budget / Timeline / No Authority / Not ICP / Competitor / Unresponsive | Enables recycle workflows and pattern analysis |
| Sequence Name | Text | Active sequence name; prevents multi-enrollment |

**Deal properties (required):**

| Property | Type | Purpose |
|---------|------|---------|
| Champion | Text | Name + title of internal deal driver |
| Economic Buyer | Text | Name + title of budget owner |
| Pain Statement | Text | 1 sentence capturing the pain in the prospect's language |
| Competitor(s) | Multi-picklist | Competitors appearing in this deal |
| Signal Source | Picklist: New Hire / Funding / Job Posting / Inbound / Referral / Outbound | What triggered the deal — feeds signal-to-close analysis |
| Closed Lost Reason | Picklist: Price / Competitor / No Decision / Timing / Not ICP / Champion Left | Required before deal can be marked Closed Lost |
| Handoff Completed | Checkbox | CS handoff doc submitted before deal leaves Closed Won |

**Company properties (required):**

| Property | Type | Purpose |
|---------|------|---------|
| ICP Tier | Picklist: Tier 1 / Tier 2 / Tier 3 / Not ICP | Account-level targeting classification |
| Employee Count | Number | Sync from enrichment — firmographic scoring input |
| Tech Stack | Multi-picklist | CRM, MAP, outbound tool in use |
| Funding Stage | Picklist | Bootstrap / Seed / Series A / Series B+ / PE / Public |
| Last Enriched | Date | Triggers re-enrichment workflow if > 90 days |

**Naming convention (enforce this from day one):**

All custom properties use a consistent naming pattern: `[team_prefix]_[field_name]` — e.g., `mktg_iq_score`, `sales_champion_name`, `cs_health_score`. This prevents property sprawl and makes it possible to identify who owns what.

---

## Step 4: Lead Scoring Model

**Two-dimensional scoring: Fit (who they are) + Intent (what they've done).**

**Firmographic fit (max 50 points):**

| Criterion | Points |
|-----------|--------|
| Industry matches Tier 1 ICP vertical | +20 |
| Employee count in sweet spot range | +15 |
| Funding stage matches ICP (Series A–C) | +10 |
| Geography: target market | +5 |
| Tech stack: uses a positive-signal tool | +10 |
| Competitor customer (in stack) | -10 |
| Employee count outside range | -5 |

**Behavioral intent (max 50 points):**

| Criterion | Points |
|-----------|--------|
| Demo request / contact form | +40 |
| Pricing page view (any) | +30 |
| Pricing page view (2+ in 7 days) | +40 |
| Case study or ROI content page | +20 |
| Multiple stakeholders from same company in 7 days | +25 |
| Webinar attendance (completed) | +15 |
| Content download (relevant) | +10 |
| Unsubscribed from email | -20 |
| Competitor email domain | -50 (disqualify) |

**MQL threshold:** Composite score ≥ 65 triggers MQL lifecycle stage transition automatically.

**Recalibrate quarterly:** Score distribution should produce 15–25% of engaged contacts reaching MQL. If MQL rate is consistently above 25%, the threshold is too low. If below 10%, it's too high. Adjust based on volume + SQL conversion rate from MQLs.

---

## Step 5: Team Ownership Rules

**Every object in the CRM has a defined owner. No orphaned records.**

| Ob