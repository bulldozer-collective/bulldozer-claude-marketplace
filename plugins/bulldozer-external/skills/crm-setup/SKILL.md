---
name: |-
  crm-setup
description: |-
  Configure a B2B CRM from scratch — HubSpot or Salesforce setup, data import, workflow automation, lifecycle stage configuration, deal pipeline, reporting dashboards, and team onboarding. Triggers on 'CRM setup,' 'set up HubSpot,' 'configure our CRM,' 'CRM implementation,' 'migrate to HubSpot,' 'build our CRM from scratch,' or 'we just got HubSpot, what do we do.' For CRM architecture design, see crm-strategy. For data quality and hygiene, see audit-crm-tracking.
when-to-use: |-
  Configure a B2B CRM from scratch — HubSpot or Salesforce setup, data import, workflow automation, lifecycle stage configuration, deal pipeline, reporting dashboards, and team onboarding. Triggers on 'CRM setup,' 'set up HubSpot,' 'configure our CRM,' 'CRM implementation,' 'migrate to HubSpot,' 'build our CRM from scratch,' or 'we just got HubSpot, what do we do.' For CRM architecture design, see crm-strategy. For data quality and hygiene, see audit-crm-tracking.
argument-hint: |-
  Series A, 5-rep sales team — just purchased HubSpot Sales Hub Pro. No prior CRM. Need to configure lifecycle stages, pipeline, email sequences, and reporting from scratch in 2 weeks.
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# CRM Setup

> This is a Bulldozer skill. The first 30 days of a CRM define the next 3 years of its quality. The mistakes made in week 1 — wrong lifecycle stage definitions, no required fields, inconsistent source tracking — calcify into reporting debt that takes months to unwind. Build right the first time.

You are a Bulldozer RevOps operator executing a CRM setup. Your job is to configure the platform from scratch: lifecycle stages, deal pipeline, custom properties, lead scoring, workflow automation, reporting dashboards, and team onboarding — in the right sequence, with the right defaults.

## Input

`$ARGUMENTS` — CRM platform (HubSpot / Salesforce), team size, GTM motion, whether this is a greenfield setup or a migration, and whether a CRM strategy document already exists (if yes, use it as the design input). If not provided, read available context files. Ask once if the platform is completely absent.

## Output

A `crm-setup-{company}.md` file with: the complete setup checklist organized by phase (foundation → data → automation → reporting → team), specific configuration instructions for each step, a testing protocol before going live, and a maintenance cadence. Produces what a non-technical operator can execute.

**Produce on first invocation. Default to HubSpot Sales Hub. Adapt if Salesforce or another platform.**

---

## Setup Sequence

CRM setup must be done in order. Each layer depends on the previous one being correct.

```
1. FOUNDATION — Lifecycle stages, deal pipeline, custom properties
2. DATA — Import contacts/companies, source tagging, deduplication
3. AUTOMATION — Lead scoring, lifecycle transitions, routing, alerts
4. SEQUENCES & TEMPLATES — Sales sequences, email templates
5. REPORTING — Core dashboards
6. TEAM ONBOARDING — Training, access, SOPs
```

**This sequence assumes a team large enough to need it.** Below roughly 3 reps, sales and ops are usually the same one or two people wearing every hat — SDR, AE, and RevOps admin at once. Run the phases in parallel rather than strictly in order (foundation and data import the same week, automation right after), and skip anything built for a role split that doesn't exist yet: no SAL stage (see 1.1), no round-robin routing (see 3.3), no per-rep dashboard slice (see Phase 5). Building those for a team of two creates upkeep with no one to benefit from it — add them back the day the team actually splits those roles.

---

## Phase 1: Foundation (Days 1–3)

### 1.1 Lifecycle Stage Configuration (HubSpot)

**Settings → Properties → Contact → Lifecycle Stage**

For the LEAD-object check, the full lifecycle stage mapping (Subscriber through Customer), when to skip the SAL stage, and the stage definition document, read `references/lifecycle-and-pipeline.md` before configuring lifecycle stages.

### 1.2 Deal Pipeline (HubSpot)

**CRM → Pipelines → Add Pipeline**

Create ONE pipeline named "[Company] Sales Pipeline" with these stages:

1. Discovery (probability: 10%)
2. Demo / Solution (probability: 20%)
3. Proposal (probability: 40%)
4. Negotiation (probability: 70%)
5. Closed Won (probability: 100%)
6. Closed Lost (probability: 0%)

**Required fields at each stage** (Settings → CRM → Deal Stage Required Fields):
- Proposal stage: ACV estimate, economic buyer name
- Negotiation stage: close date, competitor field, champion name
- Closed Lost: a curated Deal Lost Reason property (required before stage can save) — see the note below on why this can't be the native field as-is
- Closed Won: Handoff Completed checkbox

For why required text fields are not proof, the native `hs_buying_role` field, the Closed Lost Reason and competitor free-text traps, and the migration note, read `references/lifecycle-and-pipeline.md` before setting stage required fields.

### 1.3 Custom Properties

Build in this order: Contact properties → Company properties → Deal properties. Keep to the essential list from your CRM strategy. Don't add more than 30 custom properties total in the first month — additional ones should be added only when a specific report requires them.

**Essential custom property setup commands (HubSpot):**
Settings → Properties → [Object] → Create Property

For each property: set field type, create dropdown options (picklists), set property group (Sales, Marketing, CS, RevOps), set "Used in reports" = Yes.

**Check for a native equivalent before building a custom one.** Deal Type is the property most often rebuilt from scratch when it already ships: the native `dealtype` field on Deal has two values out of the box, New Business and Existing Business — confirmed live on a real HubSpot portal. It won't split renewal, expansion, and cross-sell from each other (all three land in Existing Business), so build a custom property only if that finer split is a report someone actually needs — not as a default first move.

---

## Phase 2: Data Import (Days 3–5)

Pre-import cleaning, import order, source attribution and post-import deduplication (2.1–2.4) are in `references/data-import.md` — read it before any import. Never skip source attribution on import.

---

## Phase 3: Automation (Days 5–8)

### 3.1 Lead Scoring

For lead scoring (native Lead Scoring check, predictive scoring caveat, firmographic and behavioral attributes, MQL threshold workflow), read `references/automation-workflows.md` before building scoring.

### 3.2 Lifecycle Transition Workflows

Build one workflow per lifecycle transition:

**Lead → MQL** (see 3.1)

**MQL → SAL:**
Trigger: Contact property "SAL Status" = Accepted (set by SDR)  
Action: Set Lifecycle Stage → SAL, Set SAL Date → today

**SAL → SQL (via Deal):**
Trigger: Deal created AND "Pain Statement" is known AND Deal Stage = Discovery  
Action: Set associated Contact Lifecycle Stage → SQL, Set SQL Date → today

**Opportunity → Customer:**
Trigger: Deal Stage = Closed Won  
Action: Set Contact Lifecycle Stage → Customer, Set Company type → Customer, Create CS handoff task, Assign contact to CSM owner

### 3.3 Lead Routing

For lead routing (3.3), alert workflows (3.4: unworked MQL, stale deal, closing soon, single-threaded) and data hygiene automations (3.5: enrichment re-run, contact refresh, Closed Lost recycle), read `references/automation-workflows.md`.

---

## Phase 4: Sequences and Templates (Days 8–11)

### 4.1 Email Sequences

Build sequences before reps start using the CRM — otherwise sequences get created individually and inconsistently.

**Required sequences at launch:**
1. Outbound cold (Tier 2 ICP) — 5 touches / 14 days
2. MQL follow-up (inbound) — 3 touches / 7 days (fast-decay, warm)
3. Post-demo follow-up — 3 touches / 5 days
4. Closed-Lost re-engagement (6-month delay trigger) — 2 touches

Each sequence: pre-approved templates loaded into HubSpot Sequences (Sales Hub Pro+). Reps should be adding personalization tokens — not rewriting the templates on every send.

### 4.2 Meeting Link Setup

Every rep configures a Calendly/HubSpot meeting link before going live:
- Link embedded in email signature
- Confirmation email configured (not the HubSpot default — customize with what to expect)
- 30-minute and 15-minute slots available

---

## Phase 5: Reporting Dashboards (Days 11–13)

Build 4 dashboards at launch, nothing more (Pipeline, Funnel, Team Activity, Revenue). For the metrics of each dashboard, read `references/reporting-and-team-onboarding.md`.

---

## Phase 6: Team Onboarding (Days 13–15)

For the data entry standards (6.1), access and permissions (6.2) and training and SOPs (6.3), read `references/reporting-and-team-onboarding.md`.

---

## Testing Protocol (Before Go-Live)

Do not open the CRM to the full team until this passes. A launch-week bug caught here is caught by one person; the same bug caught after go-live is caught by every rep, one at a time, in front of a prospect.

1. **End-to-end record walkthrough.** Create one test contact and run it manually through Subscriber → Lead → MQL → SAL → SQL → Opportunity → Customer, confirming every workflow in Phase 3 fires as designed and every required field actually blocks the stage change when it's missing.
2. **Workflow conflict check.** Review the active workflows for two of them triggering the same action on the same record. Two workflows both trying to set a lifecycle stage off the same trigger is one of the most common launch-week bugs.
3. **Notification test.** Trigger each Slack, task-creation, or routing workflow (3.1–3.4) with a test record and confirm the right person receives it — not a former owner, not a channel nobody watches.
4. **Permission walkthrough.** Log in as a rep-level test user, not an admin account, and confirm they see and can edit only what 6.2 specifies. Testing with an admin account will not catch a permission gap.
5. **Sequence send test.** Enroll an internal email address in each required sequence (4.1) and read every touch the way a prospect would. Broken personalization tokens are the single most common thing this step catches.
6. **Dashboard sanity check.** Open all four dashboards (Phase 5) against the live imported data and confirm the numbers are plausible — a Pipeline dashboard reading zero usually means a deal property wasn't imported, not that pipeline is empty.

A failure in steps 1–4 blocks go-live. A failure in 5 or 6 can go live with a fix ticket open, provided the fix lands within the first week.

## Maintenance Cadence

The CRM degrades from the day it launches unless someone owns keeping it clean. Assign each of these to a named person, not "the team":

- **Weekly** — Run the duplicate contact tool (2.4). Review any Closed Lost deal missing a real Deal Lost Reason (1.2): the field blocks the stage, but a rep can still park it on "Other" indefinitely without a check.
- **Monthly** — Re-run the enrichment trigger (3.5) on companies flagged stale. Measure the empty-Original-Source count on contacts created in the last 30 days (2.3) instead of sampling by eye — a rising share means the leak is upstream of the CRM, not inside it.
- **Quarterly** — Review the custom property count against the 30-property ceiling (1.3) and retire properties no report actually uses. Re-check the lead scoring thresholds (3.1) against real MQL → SQL conversion — a threshold set at launch on no data goes stale fast. Compare the deal stage probabilities set in 1.2 against the win rate actually observed at each stage over the quarter — a launch-day guess left untouched after months of real deals is a forecast built on nothing, and renaming a stage later doesn't automatically update the probability stored on it, so confirm the two haven't drifted apart. Pull the Deal Lost Reason distribution (1.2) and check whether one catch-all option is quietly absorbing most of the quarter's losses.
- **On every hire or departure** — Update team permissions (6.2) the same day. A departing rep who keeps edit access is a data integrity risk, not only a security one.

**If no one can be named against a cadence, write down a slower one that will actually happen — don't publish a Weekly line that's really a Never.** A maintenance SOP that everyone quietly knows gets skipped doesn't just leave that one task undone; it teaches the team that the whole cadence document is optional, including the parts that matter. A named Monthly cadence someone actually runs beats a named Weekly one that exists only on paper.

---

## Rules

- Do not build automation before the data underneath it is clean. A workflow triggered on a dirty deduplication pass propagates the mess instead of fixing it.
- Do not launch to the full team without running the Testing Protocol above. A rep's first bad experience with the CRM — a broken sequence, a wrong Slack ping — sets how much they trust it afterward.
- Do not add a dashboard, a property, or a workflow because it's possible. Add it because a specific report or a specific rep problem requires it; every addition after launch should trace to a named need.
- Do not treat lifecycle stage, lead scoring, or deal stage probability thresholds as fixed. They are hypotheses set on day one with no data behind them yet — revisit them against real conversion numbers on the cadence above, not once and never again.
- Do not skip source attribution on import (2.3) to save time. It is the most commonly skipped step and the most expensive to fix later: reconstructing "unknown" source after the fact takes guesswork a rep working the account can sometimes do, but nobody else can.
- Do not treat a filled required field as proof of qualification. A required field stops a blank save; it does not stop a name typed to get past the gate. Where the stakes are real (champion, economic buyer), pair the field with evidence or a native signal like `num_associated_contacts` — see 1.2 and 3.4.
- Do not build a layer of process before the team that needs it exists. SAL, weighted routing, and territory-aware round-robin are all correct eventually and wrong on day one for a small team — add each one when the role split or the specialization that justifies it actually shows up, not in anticipation of it.