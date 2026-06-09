---
name: |
  crm-setup
description: |
  Configure a B2B CRM from scratch — HubSpot or Salesforce setup, data import, workflow automation, lifecycle stage configuration, deal pipeline, reporting dashboards, and team onboarding. Triggers on 'CRM setup,' 'set up HubSpot,' 'configure our CRM,' 'CRM implementation,' 'migrate to HubSpot,' 'build our CRM from scratch,' or 'we just got HubSpot, what do we do.' For CRM architecture design, see crm-strategy. For data quality and hygiene, see audit-crm-tracking.
when-to-use: |
  Configure a B2B CRM from scratch — HubSpot or Salesforce setup, data import, workflow automation, lifecycle stage configuration, deal pipeline, reporting dashboards, and team onboarding. Triggers on 'CRM setup,' 'set up HubSpot,' 'configure our CRM,' 'CRM implementation,' 'migrate to HubSpot,' 'build our CRM from scratch,' or 'we just got HubSpot, what do we do.' For CRM architecture design, see crm-strategy. For data quality and hygiene, see audit-crm-tracking.
argument-hint: |
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

---

## Phase 1: Foundation (Days 1–3)

### 1.1 Lifecycle Stage Configuration (HubSpot)

**Settings → Properties → Contact → Lifecycle Stage**

Default HubSpot stages don't need to be renamed — but their definitions need to be documented and their triggers need to be built into workflows:

- Subscriber: form fill, unknown company
- Lead: company data enriched + ICP match at firmographic level
- MQL: meets lead score threshold (build this in Phase 3)
- SAL: SDR marked "Accepted" in contact record
- SQL: discovery call held, deal created with minimum required fields
- Opportunity: deal created (auto-synced from Deal lifecycle stage)
- Customer: Closed-Won deal (auto-synced)

**Build a lifecycle stage definition document** (1 page) before configuring anything. Paste it into a pinned Slack channel so every rep can reference it.

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
- Closed Lost: Closed Lost Reason (picklist — required before stage can save)
- Closed Won: Handoff Completed checkbox

### 1.3 Custom Properties

Build in this order: Contact properties → Company properties → Deal properties. Keep to the essential list from your CRM strategy. Don't add more than 30 custom properties total in the first month — additional ones should be added only when a specific report requires them.

**Essential custom property setup commands (HubSpot):**
Settings → Properties → [Object] → Create Property

For each property: set field type, create dropdown options (picklists), set property group (Sales, Marketing, CS, RevOps), set "Used in reports" = Yes.

---

## Phase 2: Data Import (Days 3–5)

### 2.1 Pre-Import Cleaning

Before importing any data:
1. Deduplicate: remove duplicate rows by email domain + name
2. Normalize: standardize company name format, job title format
3. Tag source: add a column "Import Source" with value "[Import Name] - [Date]" for every row — this enables post-import analysis

**Do not import everything at once.** Import in batches by segment (existing customers, closed-won, active pipeline, contact database) so you can identify which batch created which records.

### 2.2 Import Order

1. Companies first (import by domain — HubSpot deduplicates companies by domain)
2. Contacts second (associate to companies during import using domain column)
3. Deals third (associate to contacts and companies)
4. Notes and activities last (import only recent 12 months — older activity creates noise)

### 2.3 Source Attribution

**For every imported contact, set the "Original Source" and "Original Source Detail" fields.**

HubSpot sets original source automatically for new contacts created via forms or integrations. For imported contacts, manually set it to the relevant category: "Offline Sources," "Direct Traffic," or create a custom import source value.

**This is the most commonly skipped step and the biggest reporting problem.** If 30% of your contacts have "unknown" as source, your attribution reports are unreliable.

### 2.4 Deduplication After Import

Run HubSpot's duplicate contact tool (Contacts → Actions → Manage Duplicates) immediately after import. Merge duplicates before building any automations — automations triggered on duplicates create data chaos.

---

## Phase 3: Automation (Days 5–8)

### 3.1 Lead Scoring

**Settings → Properties → Contact → HubSpot Score**

Build the two-dimensional scoring model from your CRM strategy:

**Firmographic score attributes:**
- Industry = [ICP Industry 1]: +20
- Employee count between [X] and [Y]: +15
- Funding stage = [Target Stage]: +10
- Technology: Uses [positive-signal tool]: +10

**Behavioral score attributes:**
- Demo request form submitted: +40
- Pricing page viewed: +30
- Pricing page viewed 2x in 7 days: +40 (additional)
- Case study page viewed: +20
- Multiple contacts from same company (2+) viewed site in 7 days: +25

**MQL threshold workflow:**

Workflow trigger: HubSpot Score ≥ 65 AND Lifecycle Stage is Lead  
Action: Set Lifecycle Stage → MQL, Set MQL Date → today, Create task for SDR team, Send Slack notification

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

### 3.3 Alert Workflows

**Unworked MQL alert:**
Trigger: Lifecycle Stage = MQL AND Last Contacted is unknown AND Time since MQL Date > 12 hours  
Action: Slack notification to SDR team manager with contact name and MQL score

**Stale deal alert:**
Trigger: Deal in active pipeline stage AND Last Activity Date > 14 days  
Action: Task created for deal owner "No activity in 14 days — update or mark Closed Lost"

**Deal closing soon:**
Trigger: Deal Close Date within 7 days AND Deal Stage ≠ Closed Won/Lost  
Action: Slack notification to AE + manager

### 3.4 Data Hygiene Automations

**Enrichment re-run trigger:**
Trigger: Company property "Last Enriched" > 90 days ago  
Action: Webhook to Clay enrichment workflow (if using Clay) or flag for manual review

**Closed Lost contact recycle:**
Trigger: Deal marked Closed Lost AND time since close > 180 days AND no active deal for this contact  
Action: Set Contact Lifecycle Stage back to Lead (enables future nurture)

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

Build 4 dashboards at launch. Nothing more — additional dashboards should be added only when a leadership question requires it.

**Dashboard 1: Pipeline (Sales)**
- Pipeline by stage (total value and count of deals)
- Deals created this month vs. last month
- Pipeline coverage ratio (open pipeline ÷ next quarter ARR target)
- Average deal age by stage

**Dashboard 2: Funnel (RevOps/Marketing)**
- Contacts by lifecycle stage
- Lead → MQL conversion rate (this month vs. last month)
- MQL → SQL conversion rate
- Avg days Lead → MQL, MQL → SQL, SQL → Opportunity

**Dashboard 3: Team Activity (Sales)**
- Calls logged by rep
- Emails sent by rep (sequences enrolled + manual)
- Meetings booked by rep
- Deals advanced by rep (moved to a later stage)

**Dashboard 4: Revenue (Leadership)**
- Closed Won ARR this month
- Win rate (Closed Won ÷ Closed Won + Lost)
- Avg sales cycle (days from opportunity created to close)
- Closed Lost Reason distribution

---

## Phase 6: Team Onboarding (Days 13–15)

### 6.1 Data Entry Standards

Document and publish before the team starts using the CRM:
- W