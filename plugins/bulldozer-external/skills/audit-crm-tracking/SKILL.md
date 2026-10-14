---
name: |-
  audit-crm-tracking
description: |-
  Full audit of a CRM instance (HubSpot or Salesforce) covering data quality, pipeline health, workflow integrity, and tracking setup. Triggers on 'CRM audit,' 'HubSpot audit,' 'Salesforce audit,' 'our CRM is a mess,' 'pipeline data is unreliable,' 'reporting is broken,' 'audit our tracking,' or 'data hygiene audit.' For RevOps setup from scratch, see revenue-operations.
when-to-use: |-
  Full audit of a CRM instance (HubSpot or Salesforce) covering data quality, pipeline health, workflow integrity, and tracking setup. Triggers on 'CRM audit,' 'HubSpot audit,' 'Salesforce audit,' 'our CRM is a mess,' 'pipeline data is unreliable,' 'reporting is broken,' 'audit our tracking,' or 'data hygiene audit.' For RevOps setup from scratch, see revenue-operations.
argument-hint: |-
  HubSpot audit for Acme — 12k contacts, 3 reps, pipeline reporting doesn't match actual revenue, lots of zombie deals
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
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

For the sourcing caveat on the "76% of CRM data is incomplete" figure, read `references/dimension-deep-dives.md` (section Step 2: Completeness) before quoting any such statistic.

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
Detailed red flags on Closed Lost reasons and deal amounts (including the multi-currency `amount_in_home_currency` rule): read `references/dimension-deep-dives.md` (section Step 3: Accuracy).
- Close dates: past close dates on open deals = stale pipeline that's never been reviewed

---

## Step 3b: Consistency

For the consistency checks (fields to inspect, what each variation breaks, verdict, structural fix), read `references/dimension-deep-dives.md` (section Step 3b: Consistency).

---

## Step 4: Duplicates

Duplicates are the silent killer. They split engagement history, inflate contact counts, confuse lead routing, and make attribution reporting unreliable.

Matching logic:
- Email domain: all contacts at the same domain should be linked to the same company account
- Company name variations: "Acme Inc," "Acme," "ACME Inc" are the same company — flag and merge
- Contact: same first name + last name + company = likely duplicate

For the duplicate-rate benchmark caveat, the HubSpot/Salesforce duplicate tooling, and why you must audit what has already been merged (not only the open queue), read `references/dimension-deep-dives.md` (section Step 4: Duplicates).

---

## Step 5: Freshness

Data that hasn't been updated in 6+ months is likely stale. B2B contact data decays at roughly 20–30% a year — HubSpot's own Database Decay Simulation, built on MarketingSherpa research, puts it near 22.5%/year; ZoomInfo's more recent pipeline research cites 25–30%/year. Every source names the same three drivers: job changes, company exits or acquisitions, title shifts.

Run a report: % of records where critical fields were last modified more than 90, 180, and 365 days ago.

Before running the freshness report, read `references/dimension-deep-dives.md` (section Step 5: Freshness) on which "last modified" property to use per object and who modified it.

**Thresholds:**
- <10% of records untouched >365 days: Pass
- 10–25%: Schedule quarterly re-enrichment for top accounts
- >25%: Systematic staleness — need enrichment workflow at point of entry

**The zombie deal diagnostic**: Pull all open deals, one pipeline at a time. Flag any deal that has:
- No activity logged in the last 30 days — `notes_last_updated`, not last-modified, for the reason above
- A close date more than 30 days in the past — `closedate`
- Deal stage unchanged for more than 2x the median sales cycle — use `hs_v2_date_entered_current_stage` (when it entered current stage) and compute the age yourself. Don't reach for `hs_v2_time_in_current_stage` expecting a duration: confirmed live on a real portal, it's typed `datetime` and always identical to `hs_v2_date_entered_current_stage` — a mirror of the entry date, not an elapsed time, despite its label

For the three time-in-stage traps behind the third flag, read `references/dimension-deep-dives.md` (section Step 5: Freshness).

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

Every pipeline check is scoped to one pipeline at a time. For the full pipeline method — stage distribution, the Closed Lost Reasons fix (structure before enforcement, the in-place conversion trap), forecast accuracy and the two-forecasts diagnosis (plus `hs_deal_score`) — read `references/pipeline-health.md`.

---

## Workflow Audit

**Zombie workflows are the most dangerous thing in a CRM.** They are running. They are affecting records. Nobody is watching them.

For every active workflow:
1. **Last modified date**: any workflow untouched for 12+ months that is still "On" needs a review
2. **Enrollment criteria**: does the trigger still reflect current lifecycle stage definitions? If lifecycle stages changed 6 months ago and the workflow references old ones, it's enrolling the wrong contacts. Note that HubSpot's own installed default already ships eight stages — Subscriber, Lead, Marketing Qualified Lead, Sales Qualified Lead, Opportunity, Customer, Evangelist, Other — not the five most audits assume; a portal that still has all eight isn't "running the defaults unchanged," it just hasn't built anything that moves a contact between them. The finding worth writing down is whether a workflow — or a habit — actually transitions contacts stage to stage, not whether Customer and Evangelist exist as options
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

## Where the Numbers Come From

The steps above describe clicks in the interface. That is fine for a walkthrough, but an audit made of screenshots can't be re-run next quarter to show whether anything improved. When the HubSpot connector is available in the session, query the numbers instead of asking the client for exports.

| What you need | Call |
|---|---|
| Which objects and fields this portal actually has | `discover_hubspot_schema`, then `search_properties` per object |
| A field's real type and, if it's a picklist, its valid values (Lifecycle Stage, Deal Stage — and Closed Lost Reason once it has actually been converted to one) | `get_properties` |
| Fill rate on a critical field | `search_crm_objects` filtered `NOT_HAS_PROPERTY` on that field — read the returned `total`, compare it to the unfiltered `total` |
| Counts, distributions, medians, records grouped by month or quarter | `query_crm_data` |
| Orphaned records — deals with no contact, contacts with no company | `query_crm_data` with an existence test on the association |
| Association counts per record | `search_crm_objects` on `num_associated_contacts` / `num_associated_deals` |
| Whether the owner a workflow notifies still works there | `search_owners` — the response carries an active flag |

Before writing the first query, read `references/data-sources-and-refusals.md`: the seven query rules, how to interpret refused calls (insufficient scope, permission modification, token expiry), and the three limits to state in the audit.

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

For the finding format, the bucket definitions with the two arbitration rules, and the pre-delivery checklist, read `references/fix-plan-and-delivery.md`.

---

## Rules

- **Closed Lost Reason needs a structured field before it needs enforcing.** The native property ships as free text, not a picklist — requiring it as-is only mandates prose. Every CRM audit ends with a curated closed-set property (native field converted, or a new one) required on Closed Lost — never a text field flagged mandatory and called done.
- **Never delete a duplicate without merging activity history first.** Deleting the "wrong" record destroys engagement context.
- **Zombie workflows must be reviewed, not just documented.** "We'll look at it later" is how a workflow keeps writing to records for another year. Every active workflow leaves the audit with one of three verdicts: keep, fix, off.
- **Fix the point of entry before the backlog.** A field cleaned while the intake stays open is dirty again next quarter. Every remediation names how the bad data got in, or it isn't finished.
- **Only critical fields count.** Scoring empty non-critical properties inflates the problem and buries the three fields that actually break routing and forecasting.
- **Zombie deals get a decision from their owner, not a bulk close.** Mass-closing them tidies the pipeline and destroys the reason each one stalled — the only thing in there that could make next quarter different.
- **Blending pipelines manufactures a funnel that doesn't exist.** Stage distribution, ghost-stage detection and forecast variance are read one pipeline at a time, never pooled — `dealstage` is one shared picklist across every pipeline on the portal, so pooling it mixes stages that don't measure the same thing.
- **A stage's name is not its probability.** Read `hs_deal_stage_probability`, never a percentage that happens to be baked into the stage's label — it drifts from the field it once mirrored, if it ever did.
- **Audit both forecasts or neither.** The probability-weighted forecast and the rep-set forecast category are two independent mechanisms; a variance number that doesn't say which one it measures sends the fix to the wrong team.
- **A refused call is never a zero.** No access, no such property and no records are three different answers that come back looking the same. Establish which one before a single number enters the scorecard.
- **Freshness is measured on activity, not on last-modified.** A nightly enrichment keeps every record technically fresh while nobody has spoken to any of them since last year.
- **Never report a number you obtained by clicking without saying where it came from.** The next audit has to reproduce it to prove anything improved.