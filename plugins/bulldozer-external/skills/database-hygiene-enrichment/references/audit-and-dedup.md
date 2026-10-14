# Audit Dimensions, Platform Commands and Deduplication Tooling

## Step 1 — The 6 dimensions of CRM data quality and how to pull each number

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

**Via Bulldozer OS, if the client's HubSpot is connected:** the same completeness numbers can be pulled without building a UI report by hand — but not necessarily by SQL. `SELECT COUNT(*) FROM CONTACT WHERE industry IS NULL` is the query you'd reach for first for a missing-field count, but the SQL path through this connector requires a specific OAuth scope (`crm.hubsql.execute`, bundled with three reporting/campaign-revenue scopes) that isn't granted by default. On a portal missing it, that exact query — no financial or campaign field anywhere in it — fails outright with an insufficient-scope error, the same failure this connector produces on a revenue query against DEAL: the block isn't limited to financial aggregation, it can take out a trivial COUNT just as easily. Run one query and read what comes back before building the rest of the audit on this path. When it's blocked, `search_crm_objects` with a `NOT_HAS_PROPERTY` (or `HAS_PROPERTY`) filter on the field reaches the same missing-field count without SQL — read its `total`, not the records it returns — and is the safer default to reach for first, not a fallback to discover mid-audit. One query = one object type = one number either way, never a blend across objects. For the enrichment-age check, query the custom "Last Enriched Date" property this playbook's decay-detection workflow writes (Step 4) — not a native modified-date field. Two reasons why. First, the name isn't stable across objects: on this connector's own portal, `hs_lastmodifieddate` exists on deals but querying it on `CONTACT` returns `propertiesNotFound` — the equivalent contact field is the unprefixed `lastmodifieddate` — so a query written for one object and reused on another fails outright rather than returning a wrong number. Second, and more important for this step specifically, any native modified-date field (`lastmodifieddate` or `hs_lastmodifieddate`) flips on *any* property change on the record, including a workflow, an integration sync, or the enrichment run itself — a database re-enriched every night scores 100% "fresh" on that field with zero human activity in a year. Neither problem shows up by guessing; confirm the exact property name for the object you're querying — `search_crm_objects` filtered on that property works for this check the same way SQL would, when SQL doesn't — and use the dedicated enrichment-date property for staleness, not a general-purpose modified-date field. This reads the client's live CRM through the OS's HubSpot connector — it requires that connector to be authorized on the project, and neither path replaces the native duplicate scan: there's no fuzzy matching in either one, grouping by email to spot exact duplicates is the closest either gets, and even that needs the results filtered by hand since neither supports a having-style filter.

## Step 1 — Database Health Scorecard template

```
Database Health Scorecard — [Date]
Total contacts: [X]
Estimated duplicates: [X] ([Y]%)
Missing email: [X] ([Y]%)
Missing company name: [X] ([Y]%)
Missing industry: [X] ([Y]%)
Missing employee count: [X] ([Y]%)
Contacts enriched in last 90 days: [X] ([Y]%)
Email bounce rate (last 90 days): [X]%  — target <2% | danger zone: see below, pause sending if crossed
```

## Step 2 — Platform deduplication tooling (HubSpot, Salesforce, third-party)

**HubSpot deduplication:**
- Native: Contacts → Actions → Manage Duplicates. HubSpot scans daily on email, name, phone, country, zip code, and company name, and surfaces pairs ranked by a confidence score for you to merge or reject — available on a Sales/Marketing Hub Professional or Enterprise subscription, capped at 10,000 duplicate pairs shown.
- Advanced: Data Hub (HubSpot renamed Operations Hub to Data Hub in 2025 — same underlying tools, same pricing tier structure) → Duplicate Management for programmatic matching rules and bulk resolution beyond the native cap (30,000 pairs on Data Hub Professional, 100,000 on Enterprise).
- Third-party: Insycle for bulk fuzzy matching with review workflow (Dedupe.io, sometimes still listed alongside it in older comparisons, shut down in 2023 — don't send a client looking for it)

**Salesforce deduplication:**
- Native: Duplicate Management → Duplicate Rules + Matching Rules
- Third-party: Cloudingo, DemandTools, or Insycle for bulk dedup with custom matching logic
