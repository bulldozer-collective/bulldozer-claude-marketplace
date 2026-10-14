# Reporting Dashboards and Team Onboarding Details

## Phase 5 — Reporting Dashboards (details)

Build 4 dashboards at launch. Nothing more — additional dashboards should be added only when a leadership question requires it.

**Dashboard 1: Pipeline (Sales)**
- Pipeline by stage (total value and count of deals)
- Deals created this month vs. last month
- Pipeline coverage ratio (open pipeline ÷ next quarter ARR target)
- Average deal age by stage

Publish pipeline coverage ratio on day one, but don't let leadership act on it until at least one full quarter of real deal history sits behind it — a ratio built on week-one pipeline and a target nobody has hit yet is a placeholder wearing a real metric's clothes, and a headcount or budget call made off it is a call made off noise.

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
- Deal Lost Reason distribution (the custom enum property from 1.2, not the native free-text field)

## Phase 6 — Team Onboarding (details)

### 6.1 Data Entry Standards

Document and publish before the team starts using the CRM:
- Which fields are required to save a record, and at which stage — cross-reference the required-fields table in 1.2. Reps should never have to guess; the CRM already blocks the save.
- Naming convention for deal names: `[Company] – [Product/Package]`, not the rep's shorthand.
- Free text is banned wherever a picklist exists. A value typed three different ways ("SaaS," "Software," "software") cannot be rolled up in a report.
- One date format, one currency, one phone number format — set as property validation (Settings → Properties → [Property] → Validation), not left to individual convention.
- What a rep does when a required value is genuinely unknown: use an explicit "Unknown" picklist option, never leave the field blank hoping to fill it in later — a blank required field silently breaks the reports that depend on it.

### 6.2 Access and Permissions

**Settings → Users & Teams**

- Create teams by function (Sales, Marketing, CS) before assigning individual permissions. A permission set attached to a team survives a rep's departure; one attached to an individual has to be rebuilt every time someone joins or leaves.
- Sales reps: edit access to their own contacts and deals, read-only on the rest of the CRM object types.
- Sales managers: edit access to their team's records, plus access to team-level reporting.
- Admin / RevOps: full access, including property and workflow editing. Restrict this to one or two people even after launch — most CRM configuration damage comes from an admin permission held by someone who touches settings twice a year and forgets what a workflow does.

### 6.3 Training and SOPs

- Run one live session per Phase 1–5 configuration area (lifecycle stages, pipeline, automations, sequences, dashboards) rather than a single long session covering everything — retention drops sharply after the first block.
- Each session ends with the rep performing the action themselves in HubSpot: create a test deal, log a call, enroll a test contact in a sequence. Watching a walkthrough doesn't build the habit; doing it once does.
- Publish the lifecycle stage definitions (1.1) and the data entry standards (6.1) as pinned documents in the channel the team already uses daily — not in a wiki nobody opens in week one.
- Name one CRM champion per team to take questions during the first two weeks, so every question doesn't land on the admin.
