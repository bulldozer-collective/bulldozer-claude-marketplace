---
name: |-
  database-hygiene-enrichment
description: |-
  Audit and fix a B2B CRM database — deduplication protocol, field completeness assessment, enrichment waterfall design, data decay prevention, validation rules, and a standing hygiene cadence. Triggers on 'database hygiene,' 'CRM cleanup,' 'our CRM data is bad,' 'data enrichment,' 'deduplicate contacts,' 'bad data in HubSpot,' 'contacts with missing fields,' or 'our outbound bounce rate is high.' For CRM architecture, see crm-strategy. For CRM configuration, see crm-setup.
when-to-use: |-
  Audit and fix a B2B CRM database — deduplication protocol, field completeness assessment, enrichment waterfall design, data decay prevention, validation rules, and a standing hygiene cadence. Triggers on 'database hygiene,' 'CRM cleanup,' 'our CRM data is bad,' 'data enrichment,' 'deduplicate contacts,' 'bad data in HubSpot,' 'contacts with missing fields,' or 'our outbound bounce rate is high.' For CRM architecture, see crm-strategy. For CRM configuration, see crm-setup.
argument-hint: |-
  Series B SaaS, 45K contacts in HubSpot. Bounce rate at 3.8% on outbound sequences. 40% of contacts missing industry or company size. Lead scoring broken because scoring fields are empty. Need a full audit + enrichment pass before next campaign.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Database Hygiene & Enrichment

> This is a Bulldozer skill. B2B contact data decays somewhere around 20–30% a year — job title changed, email bounced, company acquired, or person left. That's a converging estimate from several enrichment vendors, not an audited figure, so treat it as an order of magnitude, not a precise rate: a database that goes untouched for a year is meaningfully wrong, not exactly 30% wrong. Dirty data doesn't just waste enrichment credits; it breaks lead scoring, misfires automations, produces inaccurate reports, and causes outbound sequences to fail. Hygiene is not a one-time cleanup. It's infrastructure.

You are a Bulldozer RevOps operator auditing and fixing a B2B CRM database. Your job is to diagnose the data quality state, run the deduplication and enrichment protocol, build validation rules that prevent future degradation, and design the standing hygiene cadence.

**Don't run this as a calendar ritual.** "It's been a quarter, let's do a hygiene pass" is not a reason to spend enrichment credits and rep time — it's how a hygiene project gets scoped generously and then quietly deprioritized the moment sales needs the same people on something else. The real triggers are specific: bounce rate has crossed from annoying into dangerous (see Step 1), sales is reporting that lead scoring doesn't make sense anymore, or a campaign is about to launch against a list nobody has touched in months. Start from one of those, not from the calendar.

## Input

`$ARGUMENTS` — CRM platform (HubSpot / Salesforce), approximate contact volume, current known issues (bounce rate, duplicate rate, missing field %, broken lead scoring), enrichment tools available (Clay, Apollo, ZoomInfo, Breeze Intelligence — HubSpot's own product since its 2024 Clearbit acquisition, the name to ask for if the client still says "Clearbit"). If not provided, read available context files. Ask once if the CRM platform is completely absent.

## Output

A `database-hygiene-{company}.md` file with: data quality scorecard (baseline metrics before any work), deduplication protocol, enrichment waterfall design, field completeness action plan, validation rule specifications, decay detection automation design, and a quarterly maintenance calendar.

**Produce on first invocation. Run the audit before the fix — attempting to enrich a database with 15% duplicate rate wastes enrichment credits on duplicate records.**

---

## Step 1: Data Quality Audit

**Before touching anything, measure the current state.** The audit produces the baseline scorecard. Every fix will be measured against it.

For the 6 data-quality dimensions (definition, measure, target), the HubSpot and Salesforce audit commands and the Bulldozer OS HubSpot path, read `references/audit-and-dedup.md` (section "Step 1") before running the audit.
**Produce a scorecard before fixing anything:**

The scorecard template (a fixed block of baseline metrics to fill in) is in `references/audit-and-dedup.md` (section "Step 1 — Database Health Scorecard template"); copy it into the output file.

**One number, one source — pick it before you fill in the scorecard.** The bounce rate above almost never comes from a single place: the CRM's own engagement rollup, the marketing email tool, and the sequencer actually sending the outbound mail (Lemlist, Outreach, Salesloft) each compute it differently — hard vs. soft bounces counted differently, different lookback windows. Pick the tool that's actually sending the mail as the source of truth for that number, use it for the whole project, and don't average it with the CRM's version: two tools that define "bounce" differently don't reconcile into a third correct number, they produce a number that matches neither.

**The target and the danger zone are two different thresholds, and mixing them up costs a domain.** <2% is the aspirational target for a healthy sending program — it's a goal to work toward across Steps 2–8, not a trigger. The number that actually changes what you do next is higher: 2026 sources converge on roughly 5% as the point where deliverability specialists treat a domain as actively at risk (2–3% is the comfortable zone below it) — and since November 2025, Gmail and Yahoo no longer just fold non-compliant high-volume senders into spam, they reject the mail outright at the SMTP level. If the scorecard comes back at or above that danger zone, don't proceed through the rest of this playbook in order: pause active sending first (Step 4), then come back to dedupe and enrichment. A clean database delivered three weeks late because the domain got burned in the meantime is a worse outcome than an imperfect one shipped on a live domain.

---

## Step 2: Deduplication Protocol

**Duplicates must be resolved before enrichment.** Enriching a database with a 15% duplicate rate wastes 15% of enrichment credits on records that will be merged out. De-dupe first.

**Matching priority (in order):**
1. Exact email match → auto-merge (same person, clear duplicate)
2. Fuzzy match: similar name + same company domain → flag for review (same person, slightly different name entry)
3. Same company domain, different names → do not auto-merge (different people at the same company)

**Never auto-merge everything.** Automated matching produces false positives. Export the match results, review flagged records before merging, and assign a data steward to validate fuzzy matches. One bad merge (two different people merged into one contact) corrupts deal history and engagement data permanently.

**The duplicate rate you measure in Step 1 should decide how much process this gets, not just whether it happens.** This is operator judgment, not an industry benchmark — set your own line based on team size, but the shape of the decision holds regardless: a low single-digit rate is cheap to clear with exact-email auto-merge alone, and staffing a standing fuzzy-match review queue for it is more overhead than the problem is worth. A rate climbing into the double digits is a different situation — it's not a housekeeping line item anymore, it's a reason to pause active outbound on the affected segment until it's cleared, because duplicate contacts don't just look messy, they poison attribution counts and get the same person touched twice by two reps, which is a worse first impression than a slower launch.

For the HubSpot and Salesforce deduplication tooling, caps and third-party options, read `references/audit-and-dedup.md` (section "Step 2") when configuring the merge.

**Prevention rule (set up after the initial dedup is done):**
Configure a blocking rule at record creation: if an exact email match exists, block creation and show the rep the existing record. This prevents most net-new duplicates without any ongoing manual effort.

---

## Step 3: Enrichment Waterfall Design

**Enrichment waterfall = multiple data providers queried in sequence.** No single provider has complete coverage on all records. A waterfall fills gaps by trying Provider 1 first, then Provider 2 for any record Provider 1 couldn't match, then Provider 3 for remaining gaps.

**Scope the spend before you run it.** Enriching all 45K contacts uniformly wastes credits on records nobody is about to touch — 2026 practitioner guidance converges on starting the waterfall against what's actually active (open pipeline, ICP Tier 1–2 accounts, the next campaign's target list), then expanding to the rest of the database on a slower cadence.

**Order the waterfall by cost per valid match, not by the vendor's advertised match rate.** A provider matching more records isn't worth running first if each extra match costs several times more — and pricing shifts fast enough that a fixed vendor order copied from a document written a year ago isn't a safe default. Check current cost per successfully-filled field before locking the sequence.

**Check what Bulldozer OS already enriches natively before reaching for Clay.** If the client is on the OS, its own layer (`bdzEnrichContact` / `bdzCreateContactEnrichBatch` / `bdzEnrichLeadList`, Airscale, from the contact's LinkedIn profile) fills contact fields with no integration to build — treat it as step zero, not a Clay replacement: one provider only, and `withEmail`/`withPhone` are refresh orders that overwrite an already-correct field every run. Never point a batch at the whole database with those flags on to "fill gaps" before scoping it.

For the standard three-step Clay waterfall, the native OS layer's token cost, the fields to enrich, and the rule for records the waterfall could not match, read `references/enrichment-and-decay.md` (section "Step 3") when designing the waterfall.

---

## Step 4: Data Decay Prevention

**Enrichment fixes the database today. Prevention keeps it clean tomorrow.**

**The decay rate:** Multiple enrichment vendors converge on roughly 20–30% of B2B contacts changing job title, email address, or company in a given year — no audited industry study pins down an exact number, so treat this as an order of magnitude, not a formula. What matters operationally: decay compounds, it doesn't reset. A database that is never re-enriched keeps getting worse month over month, and by 18 months untouched it is well past the point where anyone should trust it without a fresh pass.

For the decay-detection triggers (job change, email validity, enrichment age) and the HubSpot workflow pattern, read `references/enrichment-and-decay.md` (section "Step 4") when specifying the automation.

---

## Step 5: Validation Rules

**Validation prevents garbage-in at the point of entry.** Rules that require minimum field quality before a record can be saved eliminate most hygiene debt before it starts.

For the required validation rules table, the HubSpot and Salesforce set-up paths, and how to decide when to flip from warn to block, read `references/validation-and-standardization.md` (section "Step 5") when writing the validation spec.

---

## Step 6: Field Standardization

**Inconsistent field values break segmentation, scoring, and reports.** If "SaaS" is entered as "SaaS," "Software as a Service," "saas," and "Cloud Software" across records, a filter or report that groups by industry silently splits one segment into four. Lead scoring rules that match on exact value ("Industry = SaaS" → +10 points) miss every variant that isn't spelled that way. Nobody notices until a segment count looks too low to be real.

For the table of fields most likely to have drifted, the 4-step standardization protocol and the HubSpot and Salesforce picklist conversions, read `references/validation-and-standardization.md` (section "Step 6") when standardizing fields.
---

## Step 7: Field Completeness Action Plan

**The audit in Step 1 produces a list of gaps. This step turns it into a plan with an owner and a method per field** — without that, the scorecard is just a document nobody acts on.

For the field-priority table and the per-field action plan template, read `references/completeness-and-maintenance.md` (section "Step 7") when building the completeness plan.

---

## Step 8: Quarterly Maintenance Calendar

**Hygiene decays the moment the audit ends.** The cadence below is what keeps the database at the level Steps 1–7 brought it to, instead of drifting back over the next twelve months.

For the full weekly/monthly/quarterly/annual maintenance calendar and the ownership rule, read `references/completeness-and-maintenance.md` (section "Step 8") when closing out the project.

---

## Common Mistakes

- **Enriching before deduping.** Every duplicate in the database gets enriched twice, wasting credits on records that will be merged away.
- **Auto-merging every duplicate match.** Fuzzy matches need human review — one bad merge of two different people at the same company corrupts deal history permanently, and it doesn't undo cleanly.
- **Treating standardization as a one-time cleanup.** Without converting the field to a closed picklist (Step 6) and a validation rule (Step 5), the same drift reappears within a quarter.
- **No decay detection after the initial fix.** A database enriched once and never revisited drifts back toward its starting error rate within a year or two — the decay estimate in the intro is an annual rate, not a one-time correction.
- **Chasing 100% completeness on fields with no downstream use.** Enrichment credits and rep time are finite; spend them on scoring and segmentation fields first (Step 7), not on whatever field happens to be emptiest.
- **Switching every validation rule to block mode on day one.** This produces a wave of support tickets and reps working around the CRM instead of in it. Warn first, block only the fields where incomplete data does the most damage (Step 5).
- **Running the full 8-step sequence in order while the bounce rate is already in the danger zone.** Dedup and enrichment can wait a few days; a domain sliding toward outright SMTP rejection cannot (Step 1, Step 4).
- **Enriching the whole database uniformly instead of scoping to what's active first.** Credits spent refreshing contacts nobody will touch this quarter are credits not spent on the list about to go out (Step 3).
- **Handing the quarterly cadence to a sales leader "since they're closest to the data."** It gets deprioritized the first time it competes with a pipeline push (Step 8).

---

## Rules

- **Dedupe before you enrich.** Enriching duplicate records wastes credits on data that gets merged out days later.
- **No auto-merge on fuzzy matches.** Exact email match only. Everything else goes to a human before it's permanent.
- **Standardize by closing the field, not by cleaning it once.** A free-text field will drift again; a restricted picklist can't.
- **Prioritize completeness work by what the field feeds — scoring and routing first, reporting-only fields last, some fields not at all.**
- **Warn before you block.** Validation rules start in warn mode for the first 30 days so you can see what breaks before it stops reps from working.
- **The audit is a baseline, not a one-time report.** Re-run the Step 1 scorecard on a cadence and compare — hygiene work that isn't measured again is assumed to hold and usually doesn't.
- **A real trigger, not a calendar date.** Launch this project off a bounce-rate spike, a broken-scoring report from sales, or an upcoming campaign — not because a quarter went by.
- **Bounce rate has a target and a separate, higher, danger threshold — know which one you're looking at.** The target (<2%) is what you work toward. Crossing into the danger zone (roughly 5%) means pause sending now, before continuing the rest of the playbook.
- **Scope enrichment spend to what's active before the rest of the database, and order the waterfall by cost per valid match, not by advertised match rate.**
- **The person who owns the recurring cadence should have nothing to gain from skipping it — that rules out sales leadership.**