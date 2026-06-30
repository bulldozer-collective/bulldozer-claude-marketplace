---
name: |
  database-hygiene-enrichment
description: |
  Audit and fix a B2B CRM database — deduplication protocol, field completeness assessment, enrichment waterfall design, data decay prevention, validation rules, and a standing hygiene cadence. Triggers on 'database hygiene,' 'CRM cleanup,' 'our CRM data is bad,' 'data enrichment,' 'deduplicate contacts,' 'bad data in HubSpot,' 'contacts with missing fields,' or 'our outbound bounce rate is high.' For CRM architecture, see crm-strategy. For CRM configuration, see crm-setup.
when-to-use: |
  Audit and fix a B2B CRM database — deduplication protocol, field completeness assessment, enrichment waterfall design, data decay prevention, validation rules, and a standing hygiene cadence. Triggers on 'database hygiene,' 'CRM cleanup,' 'our CRM data is bad,' 'data enrichment,' 'deduplicate contacts,' 'bad data in HubSpot,' 'contacts with missing fields,' or 'our outbound bounce rate is high.' For CRM architecture, see crm-strategy. For CRM configuration, see crm-setup.
argument-hint: |
  Series B SaaS, 45K contacts in HubSpot. Bounce rate at 3.8% on outbound sequences. 40% of contacts missing industry or company size. Lead scoring broken because scoring fields are empty. Need a full audit + enrichment pass before next campaign.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |
  high
---

# Database Hygiene & Enrichment

> This is a Bulldozer skill. B2B data decays at 30% per year. That means one in three contacts in your CRM is wrong right now — job title changed, email bounced, company acquired, or person left. Dirty data doesn't just waste enrichment credits; it breaks lead scoring, misfires automations, produces inaccurate reports, and causes outbound sequences to fail. Hygiene is not a one-time cleanup. It's infrastructure.

You are a Bulldozer RevOps operator auditing and fixing a B2B CRM database. Your job is to diagnose the data quality state, run the deduplication and enrichment protocol, build validation rules that prevent future degradation, and design the standing hygiene cadence.

## Input

`$ARGUMENTS` — CRM platform (HubSpot / Salesforce), approximate contact volume, current known issues (bounce rate, duplicate rate, missing field %, broken lead scoring), enrichment tools available (Clay, Apollo, ZoomInfo, Clearbit). If not provided, read available context files. Ask once if the CRM platform is completely absent.

## Output

A `database-hygiene-{company}.md` file with: data quality scorecard (baseline metrics before any work), deduplication protocol, enrichment waterfall design, field completeness action plan, validation rule specifications, decay detection automation design, and a quarterly maintenance calendar.

**Produce on first invocation. Run the audit before the fix — attempting to enrich a database with 15% duplicate rate wastes enrichment credits on duplicate records.**

---

## Step 1: Data Quality Audit

**Before touching anything, measure the current state.** The audit produces the baseline scorecard. Every fix will be measured against it.

**6 dimensions of CRM data quality:**

| Dimension | Definition | How to measure | Target |
|-----------|-----------|---------------|--------|
| **Completeness** | Key fields populated | % of contacts with [email, company, job title, industry, employee count] filled | >85% on scoring fields |
| **Uniqueness** | No duplicate records | Duplicate rate (duplicates ÷ total records) | <5% (target <3%) |
| **Timeliness** | Records recently enriched | % of contacts last enriched <90 days ago | >90% |
| **Validity** | Correct format and value | Email bounce rate; % with valid email format | Bounce rate <2% |
| **Accuracy** | Data reflects current reality | % of contacts whose job title has changed in 12 months | Monitor quarterly |
| **Consistency** | Standardized values and formats | % of industry field using standardized picklist values | >95% |

**HubSpot audit commands:**
- Duplicate rate: Contacts → Actions → Manage Duplicates → view count before merging
- Completeness: Reports → Create Report → Contact → filter "property is unknown" per field
- Bounce rate: Email Health in Marketing → Email tool → Bounce summary
- Enrichment age: Custom report filtering "Last Enriched Date > 90 days ago"

**Salesforce audit commands:**
- Duplicate rate: Duplicate Management → Duplicate Jobs → run a scan
- Completeness: Reports → use "Record Count with Null" formula field
- Bounce rate: pull from connected email sequencer (Outreach, Salesloft, Groove)

**Produce a scorecard before fixing anything:**

```
Database Health Scorecard — [Date]
Total contacts: [X]
Estimated duplicates: [X] ([Y]%)
Missing email: [X] ([Y]%)
Missing company name: [X] ([Y]%)
Missing industry: [X] ([Y]%)
Missing employee count: [X] ([Y]%)
Contacts enriched in last 90 days: [X] ([Y]%)
Email bounce rate (last 90 days): [X]%
```

---

## Step 2: Deduplication Protocol

**Duplicates must be resolved before enrichment.** Enriching a database with a 15% duplicate rate wastes 15% of enrichment credits on records that will be merged out. De-dupe first.

**Matching priority (in order):**
1. Exact email match → auto-merge (same person, clear duplicate)
2. Fuzzy match: similar name + same company domain → flag for review (same person, slightly different name entry)
3. Same company domain, different names → do not auto-merge (different people at the same company)

**Never auto-merge everything.** Automated matching produces false positives. Export the match results, review flagged records before merging, and assign a data steward to validate fuzzy matches. One bad merge (two different people merged into one contact) corrupts deal history and engagement data permanently.

**HubSpot deduplication:**
- Native: Contacts → Actions → Manage Duplicates → review matches HubSpot detected
- Advanced: Operations Hub → Duplicate Management for programmatic matching rules
- Third-party: Dedupe.io or Insycle for bulk fuzzy matching with review workflow

**Salesforce deduplication:**
- Native: Duplicate Management → Duplicate Rules + Matching Rules
- Third-party: Cloudingo, DemandTools, or Insycle for bulk dedup with custom matching logic

**Prevention rule (set up after the initial dedup is done):**
Configure a blocking rule at record creation: if an exact email match exists, block creation and show the rep the existing record. This prevents most net-new duplicates without any ongoing manual effort.

---

## Step 3: Enrichment Waterfall Design

**Enrichment waterfall = multiple data providers queried in sequence.** No single provider has complete coverage on all records. A waterfall fills gaps by trying Provider 1 first, then Provider 2 for any record Provider 1 couldn't match, then Provider 3 for remaining gaps.

**Standard B2B enrichment waterfall (Clay):**

```
Step 1: Apollo.io
  → Match rate: 60–70% of B2B contacts
  → Best for: US companies, email + phone, job titles
  → Pull: email verification, job title, company name, employee count, industry

Step 2: LinkedIn Sales Navigator / Proxycurl (for unmatched records)
  → Match rate: Additional 15–20% of records unmatched by Apollo
  → Best for: European contacts, senior executives, accurate current titles
  → Pull: current job title, LinkedIn URL, company LinkedIn

Step 3: Clearbit / ZoomInfo (for remaining gaps on company fields)
  → Match rate: Additional 5–10% of company-level fields
  → Best for: Firmographic data (revenue range, funding stage, tech stack)
  → Pull: annual revenue, employee count, industry, tech stack
```

**Fields to enrich per object:**

Contact-level:
- Email (verified, not just guessed)
- Job title (current — run through job change detection)
- LinkedIn URL
- Phone (direct line preferred over main line)

Company-level:
- Employee count
- Industry (standardized to your picklist values)
- Funding stage
- Annual revenue range
- Tech stack (CRM, MAP, sales tools — feeds lead scoring and ICP tiering)
- HQ country / region

**Enrichment validation after the run:**
- What % of previously empty fields are now filled? (completeness delta)
- What % of enriched emails are now verified as deliverable? (validity improvement)
- Did any job titles come back as "[Former Employee]" or "Consultant" — indicating the contact left the company?

---

## Step 4: Data Decay Prevention

**Enrichment fixes the database today. Prevention keeps it clean tomorrow.**

**30% annual decay rule:** In any given year, 30% of B2B contacts change job title, email address, or company. In a post-AI hiring environment, decay may be faster. A database that is never re-enriched is 30% wrong after 12 months and 50% wrong after 18.

**Decay detection automation:**

**Job change detection (rolling 90-day):**
Trigger: Contact property "Last Enriched" > 90 days ago AND lifecycle stage is not "Customer"
Action: Re-run enrichment on the contact → if job title or company changed, flag the record for SDR review (contact may be a re-engagement opportunity at their new company)

**Email validity decay:**
Trigger: Contact email bounces (hard bounce in sequencer or email tool)
Action: Remove from all active sequences → flag email as invalid → enqueue for email re-enrichment → if new email cannot be found within 30 days, set lifecycle stage to "Disqualified" (prevents the record from re-entering workflows)

**Enrichment age trigger:**
Trigger: Company property "Last Enriched" > 90 days ago AND company is in ICP Tier 1 or Tier 2
Action: Webhook to enrichment tool → refresh company firmographic fields → update Last Enriched date

**HubSpot workflow pattern:**
Workflow trigger: "Last Enriched is more than 90 days ago" → Action: webhook to Clay or enrichment API → Clay writes updated fields back to HubSpot contact → Action: update "Last Enriched" to today

---

## Step 5: Validation Rules

**Validation prevents garbage-in at the point of entry.** Rules that require minimum field quality before a record can be saved eliminate most hygiene debt before it starts.

**Required validation rules (configure in CRM settings):**

| Rule | Where it applies | What it enforces |
|------|-----------------|-----------------|
| Email format | All contact creation | Must match email format (@ symbol, domain) |
| Company name required | Contact creation | Cannot save a contact without a company name |
| Industry picklist only | Contact + company | Industry must be from approved list — no free text |
| Phone number format | Contact creation | Strip non-numeric chars, enforce country code format |
| Closed Lost Reason required | Deal stage advancement | Cannot move to Closed Lost without selecting a reason |
| ACV required at Proposal stage | Deal stage advancement | Deal cannot advance to Proposal without an ACV estimate |

**HubSpot:** Settings → CRM → Properties → field validation → enable required fields per form + deal stage validation under Pipeline settings

**Salesforce:** Validation Rules in Object Manager → define formula + error message for each rule

**The right strictness level:** Start with warn-not-block for the first 30 days. Observe what breaks and what generates support tickets. Then switch to block for the fields where incomplete data causes the most downstream damage.

---

## Step 6: Field Standardization

**Inconsistent field values break segmentation, scoring, and reports.** If "Saa