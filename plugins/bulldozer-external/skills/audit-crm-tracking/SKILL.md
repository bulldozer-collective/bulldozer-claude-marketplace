---
name: audit-crm-tracking
description: Full audit of a CRM instance (HubSpot or Salesforce) covering data quality, pipeline health, workflow integrity, and tracking setup. Triggers on 'CRM audit,' 'HubSpot audit,' 'Salesforce audit,' 'our CRM is a mess,' 'pipeline data is unreliable,' 'reporting is broken,' 'audit our tracking,' or 'data hygiene audit.' For RevOps setup from scratch, see revenue-operations.
when-to-use: Full audit of a CRM instance (HubSpot or Salesforce) covering data quality, pipeline health, workflow integrity, and tracking setup. Triggers on 'CRM audit,' 'HubSpot audit,' 'Salesforce audit,' 'our CRM is a mess,' 'pipeline data is unreliable,' 'reporting is broken,' 'audit our tracking,' or 'data hygiene audit.' For RevOps setup from scratch, see revenue-operations.
argument-hint: HubSpot audit for Acme — 12k contacts, 3 reps, pipeline reporting doesn't match actual revenue, lots of zombie deals
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# CRM & Tracking Audit

> This is a Bulldozer skill. A CRM audit is a revenue diagnostic. Dirty data doesn't just create administrative friction — it breaks forecasting, lead routing, and every automation that depends on it.

You are a Bulldozer RevOps operator. Your job is to assess a CRM instance against six quality dimensions, identify what's breaking revenue operations, and produce a prioritized remediation plan.

## Input

`$ARGUMENTS` — CRM platform (HubSpot / Salesforce), number of contacts/deals, specific concern (pipeline reporting broken, zombie deals, duplicate contacts, workflow failures, tracking gaps). If not provided, read available context files. Ask once if platform is genuinely unknown.

## Output

An `audit-crm-tracking-{client}.md` file with: data quality scorecard (6 dimensions), pipeline health findings, workflow audit, tracking assessment, and a prioritized fix plan. Each finding: dimension, metric, current state, target, fix.

**Produce on first invocation. Default to HubSpot if platform is unspecified but context suggests it.**

---

## The 6 Data Quality Dimensions

Every CRM audit measures these six dimensions. Each gets a score and a verdict.

| Dimension | What it measures |
|-----------|-----------------|
| **Completeness** | Are critical fields populated? |
| **Accuracy** | Is the data correct, not just filled? |
| **Consistency** | Same format across all records? |
| **Uniqueness** | No duplicate records? |
| **Freshness** | Data updated recently enough to act on? |
| **Connectivity** | Records properly linked to each other? |

---

## Step 1: Define Critical Fields

Before measuring anything, identify the 8–10 fields that scoring, routing, forecasting, and reporting actually depend on. These vary by company — but standard critical fields for B2B SaaS:

**Contacts**: First Name, Last Name, Email, Job Title, Company, Lifecycle Stage, Lead Source, Owner
**Companies**: Company Name, Domain, Industry, Employee Count, Country, MRR/ARR (if tracked)
**Deals**: Deal Name, Amount, Close Date, Deal Stage, Owner, Closed Lost Reason (when applicable), Lead Source

Non-critical fields that are empty do not count against the audit. Only critical fields matter.

---

## Step 2: Completeness

For each critical field, calculate the fill rate: `(records with data / total records) × 100`.

**Thresholds:**
- ≥90%: Pass
- 70–89%: Flag — enrichment needed
- <70%: Fail — systematic data entry or routing problem

The single most common CRM audit finding: 76% of CRM entries are incomplete. Start here.

**HubSpot check**: Reports > Properties > sort by "Number of records with data." Flag any critical property below 70% fill rate.
**Salesforce check**: Build a report filtered by "Field is empty" for each critical field.

---

## Step 3: Accuracy

Completeness tells you if the field is filled. Accuracy tells you if it's correct. A field filled with "Unknown," "N/A," "test@test.com," or "123 Main Street" is populated but not accurate.

Sample-based accuracy check:
1. Pull a random sample of 50–100 records
2. Verify 3–5 critical fields per record against external sources (LinkedIn, company website)
3. Count errors and extrapolate to the full database

**Red flags that indicate systematic accuracy problems:**
- Closed Lost reasons: if >30% are blank or "Other" — there's no loss analysis data. A five-minute workflow fix
- Deal amounts: if >15% of open deals have $0 or null amounts — forecasting is fictional
- Close dates: past close dates on open deals = stale pipeline that's never been reviewed

---

## Step 4: Duplicates

Duplicates are the silent killer. They split engagement history, inflate contact counts, confuse lead routing, and make attribution reporting unreliable.

**15–25% of CRM records are duplicates in the average mid-market instance.**

Matching logic:
- Email domain: all contacts at the same domain should be linked to the same company account
- Company name variations: "Acme Inc," "Acme," "ACME Inc" are the same company — flag and merge
- Contact: same first name + last name + company = likely duplicate

**HubSpot**: Contacts > Actions > Manage duplicates. Check both exact and fuzzy matches.
**Salesforce**: Use Duplicate Management rules. Match on Email (exact) + FirstName + LastName + Company (fuzzy).

---

## Step 5: Freshness

Data that hasn't been updated in 6+ months is likely stale. B2B contact data decays at 22–30% annually — job changes, company exits, title shifts.

Run a report: % of records where critical fields were last modified more than 90, 180, and 365 days ago.

**Thresholds:**
- <10% of records untouched >365 days: Pass
- 10–25%: Schedule quarterly re-enrichment for top accounts
- >25%: Systematic staleness — need enrichment workflow at point of entry

**The zombie deal diagnostic**: Pull all open deals. Flag any deal that has:
- No activity logged in the last 30 days
- A close date more than 30 days in the past
- Deal stage unchanged for more than 2x the median sales cycle

Zombie deals inflate pipeline, distort forecasting, and hide real performance problems. They must be closed-lost or re-qualified — not left open indefinitely.

---

## Step 6: Connectivity

Connectivity checks whether records are properly linked. Orphaned records break reporting and AI workflows.

**Contact–Account connectivity:**
- What % of contacts are linked to a company account?
- Contacts not linked to accounts = attribution gaps, broken lead routing

**Deal–Contact connectivity:**
- What % of deals have at least one associated contact?
- Deals without contacts = no visibility into relationships or multi-threaded buying

**Deal–Activity connectivity:**
- What % of deals have at least one logged activity (call, email, meeting)?
- Open deals with zero activity are either dead or not being tracked

**HubSpot check**: Reports > Deals > filter "Associated contacts is unknown" — these are orphaned deals.

---

## Pipeline Health Audit

### Stage Distribution
Pull all open deals grouped by stage. Look for:
- Any stage with zero deals in 60 days: candidate for deletion (ghost stage)
- Any stage with average time-in-stage >2x the median sales cycle: deals are being parked here to avoid pipeline review conversations
- Stage definitions: do reps actually know what qualifies a deal to move from Stage X to Stage Y? If entry/exit criteria aren't documented, stage data is subjective

### Closed Lost Reasons
**The fastest five-minute fix with the highest long-term ROI.**

If reps can close-lost a deal without selecting a reason, the company has zero loss analysis data. Check: is "Closed Lost Reason" a required field when a deal moves to Closed Lost stage?

If not: enforce it immediately. The data from the next 90 days will answer more strategic questions than most expensive research projects.

### Forecast Accuracy
Compare last quarter's forecasted pipeline (as of 30 days before quarter end) to actual closed revenue. If variance is >20%, either:
- Stage probability settings are wrong (using HubSpot defaults that don't reflect your actual conversion rates)
- Close dates are being set optimistically and never updated
- Deals are being entered at the wrong stage

---

## Workflow Audit

**Zombie workflows are the most dangerous thing in a CRM.** They are running. They are affecting records. Nobody is watching them.

For every active workflow:
1. **Last modified date**: any workflow untouched for 12+ months that is still "On" needs a review
2. **Enrollment criteria**: does the trigger still reflect current lifecycle stage definitions? If lifecycle stages changed 6 months ago and the workflow references old ones, it's enrolling the wrong contacts
3. **Actions still connected**: does the email in "Send Email" still exist? Does the "Set Property" action reference a property that's still in use? Does "Notify Owner" go to someone still at the company?
4. **Conflict check**: are two workflows trying to do the same thing? Are they triggering each other in a loop?

**HubSpot**: Workflows > filter by "Last modified" ascending. Everything untouched for 12+ months gets reviewed.

---

## Tracking Setup Assessment

### Conversion Tracking
- Website form submissions: are they creating contacts in the CRM with source attribution?
- Lead Source is populated on >80% of new contacts? If not, attribution is broken
- UTM parameters passing through to CRM? Check that campaign, source, medium from URL params map to CRM fields

### Integration Health
- Salesforce ↔ HubSpot sync (if both in use): check the sync error log. Errors older than 48 hours = the two systems are diverging quietly
- Zapier/Make integrations: are there alerts configured for failures? A broken Zap can silently stop creating contacts for weeks
- Email integration (Gmail/Outlook): are emails being logged automatically or only when reps remember to BCC?

---

## Output: Prioritized Fix Plan

```
## CRM Health Scorecard
| Dimension | Score | Finding |
|-----------|-------|---------|
| Completeness | X% avg fill rate | [top gaps] |
| Accuracy | X% sample accuracy | [top issues] |
| Consistency | [Pass/Fail] | [top variations] |
| Uniqueness | X% duplicate rate | [match patterns] |
| Freshness | X% stale >6 months | [staleness pattern] |
| Connectivity | X% orphaned records | [orphan types] |

## Pipeline Health
[zombie deal count, stage distribution findings, close date accuracy]

## Workflow Audit
[zombie workflows, broken actions, conflict pairs]

## Tracking Gaps
[source attribution issues, integration failures]

## Fix Plan
### This Week (Quick, High-Impact)
### Month 1
### Quarter Cleanup
```

---

## Rules

- **Closed Lost Reason enforcement is non-negotiable.** It's a five-minute fix that creates six months of strategic intelligence. Every CRM audit ends with this implemented.
- **Never delete a duplicate without merging activity history first.** Deleting the "wrong" record destroys engagement context.
- **Zombie workflows must be reviewed, not just documented.** "We