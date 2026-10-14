# Dimension Deep Dives (Completeness, Accuracy, Consistency, Duplicates, Freshness)

## Step 2: Completeness

Incomplete critical fields are, in practice, the single most common CRM audit finding — and the "76% of CRM data is incomplete" figure that circulates in blog posts does trace back to a named source, just not to the claim it's usually quoted for. Validity's *State of CRM Data Management in 2025* (602 CRM users and admins surveyed across the US, UK and Australia) reports that 76% of organizations say less than half of their own CRM data is accurate and complete — an opinion survey of admins grading their own portal, at the organization level, not a measured share of individual incomplete records. Cite the report if you cite the number, and don't restate it as "76% of records are incomplete" — that's a more precise, different claim the report never makes. Compute this portal's own fill rate below; that number is the one worth tracking quarter over quarter.

## Step 3: Accuracy

- Closed Lost reasons: HubSpot ships `closed_lost_reason` as free multi-line text, not a picklist — so this checks two different things depending on setup. On the native field as installed, the only meaningful count is blank vs. filled; there's no "Other" bucket to measure because there's no bucket at all, only prose. Once the portal has a real picklist (native converted, or a dedicated custom property), then >30% blank or parked in a catch-all "Other"/"Price" is the finding — no loss analysis data, or a lazy list eating every real reason
- Deal amounts: if >15% of open deals have $0 or null amounts — forecasting is fictional. Read `amount_in_home_currency`, not `amount`, the moment more than one pipeline runs in more than one currency: `amount` holds the raw figure in whatever currency that deal was entered in, unconverted, so a mixed EUR/USD book will show deals that look tiny or huge next to each other for no reason except currency — a finding that no amount of enrichment fixes because it isn't a data problem

## Step 3b: Consistency

Consistency is the one dimension the scorecard asks for and the steps skip. It measures format, not presence: the same fact written the same way on every record. It never looks like a data problem — it looks like a reporting problem, because every filter, list and dashboard silently drops the records that spell things differently.

Check the fields where variation actually breaks something:

| Field | Variation to look for | What it breaks |
|-------|----------------------|----------------|
| Country / Region | "FR", "France", "france", "FRA" | Territory routing, regional reporting |
| Job Title | "VP Marketing", "V.P. Marketing", "Vice-President Marketing" | Persona segmentation, ICP filters |
| Industry | Free text alongside picklist values | Any segment-level analysis |
| Phone | +33 / 0033 / 06…, with and without spaces | Dialer integration, duplicate matching |
| Lead Source | Values created by reps on the fly, next to the official list | Attribution — the reason Step 2 fill rate can pass while reporting stays wrong |

**Verdict:** Pass when every critical picklist field is actually a picklist and the free-text ones show a handful of spellings per real value, not dozens. Fail as soon as one critical field is free text where it should be a dropdown — the field type is the finding, not the misspellings.

**The structural fix beats the cleanup.** Normalizing thousands of rows by hand buys a quarter. Converting the field to a dropdown, or fixing the format at the point of entry — form, import template, enrichment mapping — buys all of them. Clean the existing records only after the entry point is closed, or the cleanup becomes a recurring task nobody signed up for.

## Step 4: Duplicates

No analyst source gives a validated duplicate-rate benchmark, but vendor data at scale points the same direction: Plauti's 2021 analysis of over 12 billion Salesforce records found duplicate rates commonly in the 20–30% range for instances without an active dedup process — and far higher, up to 80%, specifically for records created via form and API integrations, versus roughly 19% for bulk imports. Treat 20–30% as a plausible range to sanity-check this portal's own count against, not a number to quote to the client.

**HubSpot**: reachable two ways — `Actions > Manage duplicates` from the contacts or companies home, or `Data Management > Data Quality`, which also carries the Data Quality Command Center overview. Start from the Command Center: it gives the portal-wide picture before you start clicking through pairs.
**Salesforce**: Use Duplicate Management rules. Match on Email (exact) + FirstName + LastName + Company (fuzzy).

**Do not audit the duplicate rate as if nobody had looked yet.** HubSpot compares record properties automatically, every day, against a fixed default set — for contacts: First Name, Last Name, Email, IP Country, Phone, Zip, Company Name; for companies: Domain, Company Name, Country/Region, Phone, Industry. Two consequences the audit has to state separately:

- **The queue is not the duplicate rate.** What Manage Duplicates shows is what that default comparison happened to catch. The classic miss is exactly the case listed above — the same company written three ways in a free-text Company Name field, or the same person under a personal and a work address — so a portal reporting a small queue and a portal with few duplicates look identical from the tool. Cross-check the queue against your own count on the matching logic above before scoring Uniqueness.
- **Check whether anyone has set custom matching rules.** They can be created, and a portal still on the defaults after years of imports is the normal case, not a misconfiguration to report as a failure. The finding is the mismatch: which of this portal's real duplicate patterns the default rules cannot see.

**Audit what has already been merged, not only the backlog still open.** HubSpot stamps every merge — manual, bulk, or via Manage Duplicates — onto the surviving record's `hs_merged_object_ids` property (`Merged Contact IDs` on contacts, `Merged Company IDs` on companies), filled in automatically by HubSpot itself. Read it with `search_crm_objects` or `query_crm_data` to size and date real merge activity instead of taking a client's "we already deduped this" at face value — a property that hasn't grown in six months means the process everyone thinks is running has stopped.

## Step 5: Freshness

**"Last modified" is not one field, and on HubSpot it is not even one name.** Two things to settle before running that report, because getting either wrong produces a freshness score that is confidently wrong rather than obviously missing:

- **The name differs by object.** On deals the property is `hs_lastmodifieddate`. On contacts that name does not exist at all — the field is `lastmodifieddate`, without the prefix. A query written with the wrong one returns nothing and reads exactly like a database with no dates in it. Confirm the name on each object before writing the query, every time.
- **Modified by whom.** `lastmodifieddate` / `hs_lastmodifieddate` means *any* property changed — including by a workflow, an enrichment sync, or an internal HubSpot property the client never sees. A base that is re-enriched nightly will score 100% fresh while no human has touched a record in a year. The field that answers the question the audit is actually asking is `notes_last_updated` (labelled "Last Activity Date": last note, call, email, meeting or task logged), with `notes_last_contacted` as the narrower variant that ignores notes and tasks. Score staleness on activity, and use last-modified only to show the gap between the two — that gap is the finding.

Three traps in that third line. **The two current-stage properties are not a date-and-duration pair, whatever their labels suggest.** `hs_v2_date_entered_current_stage` is a `datetime`, as expected — but `hs_v2_time_in_current_stage` is typed `datetime` too, and its value is identical, down to the second, to `hs_v2_date_entered_current_stage` (confirmed live: `get_properties` returns `datetime` for both, on the same deal). "Time in current stage" reads like a duration; it's a mirror of the entry date instead. Compute the actual age yourself as NOW() minus `hs_v2_date_entered_current_stage` — never read `hs_v2_time_in_current_stage` as elapsed time. **Time in stage comes in two flavours, but only once you're down at the named-stage level**, and there HubSpot does expose two genuinely number-typed fields, in seconds: a "latest time in" (since it last entered) and a "cumulative time in" (all its visits summed). A deal that slid backwards and returned looks young on the first and old on the second — and it is the one you most want to catch, so read the cumulative figure and say which one you used. Sanity-check it before trusting it, too: a cumulative value wildly out of proportion to how recently the deal was created is a bad read on the field, not a bad deal. **And the per-stage properties are named per pipeline**: alongside the two current-stage properties there is a whole family, `hs_v2_date_entered_<stage>` / `hs_v2_latest_time_in_<stage>` / `hs_v2_cumulative_time_in_<stage>`, one set per stage of each pipeline, whose labels carry that pipeline's own stage names. Resolve them from the portal rather than guessing a stage key, and take it as one more reason the whole pipeline audit is run one pipeline at a time. For the median sales cycle the threshold refers to, `days_to_close` on closed deals is the field to take the median of — again per pipeline.
