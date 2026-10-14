# Data Import Details

## Phase 2 — Pre-import cleaning, import order, source attribution, deduplication

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

**This is the most commonly skipped step and the biggest reporting problem.** Don't estimate the damage — measure it: if the CRM is HubSpot and read access is available through a connected reporting tool, count contacts where the original-source property is empty directly (a `WHERE ... IS NULL` count grouped by import batch) instead of eyeballing a sample. A rising empty-source share after import means the leak is upstream of the import step, not a rounding error to write off.

### 2.4 Deduplication After Import

Run HubSpot's native duplicate management tool (**Data Management → Data Quality** — requires Professional or Enterprise) immediately after import: it flags contacts by matching name/email and companies by matching domain, for manual or batched review and merge. This is a periodic review tool, not an automatic block — it won't stop a duplicate from being created, so plan to run it as a recurring habit (see Maintenance Cadence), not a one-time pass. Separately, HubSpot already refuses two contacts sharing the exact same email address at creation time regardless of this tool — that strict, automatic check has nothing to do with the review tool above. Merge duplicates before building any automations — automations triggered on duplicates create data chaos.

**The native tool's queue isn't the only way to see the scope of the problem before committing to a review cycle.** If the CRM is HubSpot and a connected query/reporting tool has read access, `GROUP BY email, COUNT(*)` (or by company domain) surfaces every duplicate cluster in one pass — HubSpot's query layer doesn't filter groups server-side (no `HAVING`), so pull the grouped counts back and keep only the rows above 1 client-side rather than expecting the query to do it. That gives a real number — how many clusters, how big — instead of sizing the problem by eyeballing the native tool's queue. It only catches exact-value matches, though: normalizing near-matches (the same person or company spelled two ways) still isn't something a single query does, and stays inside the native tool or a manual pass.

Every merge — manual or batched — leaves a trace worth knowing exists: HubSpot writes the merged records' IDs onto the surviving record automatically, in a standard property (`hs_merged_object_ids` on both Contact and Company). Nobody has to remember to log a merge for it to be auditable later — when someone eventually asks how much duplication the import actually created and where, that property answers it without depending on the UI activity log.
