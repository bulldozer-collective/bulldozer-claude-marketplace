# Enrichment Waterfall Detail and Decay Detection Automation

## Step 3 — Standard waterfall, fields to enrich, post-run validation

**Step zero — Bulldozer OS's native enrichment layer.** Before building a Clay waterfall, check whether the client's contacts can already be enriched for free (in integration cost) through the OS itself. Three tools, one provider (Airscale), sourced entirely from the contact's LinkedIn profile:

- `bdzEnrichContact` — one contact. Requires the contact to already have a `linkedInUrl` (400 otherwise).
- `bdzCreateContactEnrichBatch` — up to 500 contacts in one call, asynchronous (poll `bdzGetContactEnrichBatch` for `CONTACT_ENRICH_BATCH_STATE_DONE`). Unlike the single-contact tool, a contact with no `linkedInUrl` here is resolved from its email instead, at a surcharge (+4 jetons) rather than a hard failure. This path is also how a list of people (e.g. LinkedIn post engagers) becomes a list of companies: once done, each contact's current employer is its `companyId`, and its full job history sits in `bdzListContactJobs`.
- `bdzEnrichLeadList` — every lead in a lead list at once, same async/poll pattern (`bdzGetLeadListEnrichment`).

**Cost, in jetons (the OS's enrichment credits, distinct from Clay's):** the LinkedIn profile read is 2 jetons — free if that contact was already enriched less than 7 days ago. `withEmail` and `withPhone` are each +2 jetons (+2 more per contact on the batch/list tools).

**The one trap that matters: `withEmail`/`withPhone` are refresh orders, not backfills.** They run even when the field is already filled, and they overwrite the existing value every time — unlike the profile read itself, which skips a contact enriched in the last 7 days. Never call `bdzEnrichLeadList` or `bdzCreateContactEnrichBatch` with either flag on as a mass "backfill" pass over a database that hasn't been scoped and deduped first (Steps 1–2): on a base the size this playbook's own example uses (45K contacts), that silently overwrites every already-correct email and phone on each pass, burning jetons to rewrite good data instead of filling the gaps the audit actually found.

**No failure state either.** A batch or a lead-list run reads `DONE` even when every contact in it failed — there is no failed/error state to catch that. Compare `errorCount` to `targetedCount` before trusting a `DONE` run; an entry with no `success` field on a `DONE` batch was never reached (usually "No jeton available").

**Where this fits the waterfall:** treat the native layer as step zero — already integrated, nothing to build — not a substitute for the Clay waterfall below. It's a single provider (LinkedIn-sourced only), so its ceiling is whatever Airscale's own coverage is; Clay's multi-provider waterfall still does the heavy lifting on the records it can't reach.

**Standard B2B enrichment waterfall (Clay):**

```
Step 1: Apollo.io
  → Match rate: 60–70% of B2B contacts
  → Best for: US companies, email + phone, job titles
  → Pull: email verification, job title, company name, employee count, industry

Step 2: LinkedIn Sales Navigator (for unmatched records)
  → Match rate: Additional 15–20% of records unmatched by Apollo
  → Best for: European contacts, senior executives, accurate current titles
  → Pull: current job title, LinkedIn URL, company LinkedIn
  → Proxycurl, long the standard low-cost scraping fallback in this slot, shut down in July 2025 under a permanent injunction after LinkedIn sued it for scraping via fake accounts — don't rebuild this step on a scraping API without checking its legal footing first. Sales Navigator's own export is the compliant path; a scraping-based alternative needs the same scrutiny that got Proxycurl shut down, not just a similar-sounding name.

Step 3: Breeze Intelligence (ex-Clearbit, HubSpot's own product since its 2024 acquisition) / ZoomInfo (for remaining gaps on company fields)
  → Match rate: Additional 5–10% of company-level fields
  → Best for: Firmographic data (revenue range, funding stage, tech stack)
  → Pull: annual revenue, employee count, industry, tech stack
```

**These per-step numbers are illustrative, not an audited benchmark.** They come from vendor and practitioner write-ups, not a named study, and no independent source pins down this exact three-step split by provider. What broader 2026 sources do converge on: a single provider alone typically matches somewhere in the 30–60% range, and a full multi-provider waterfall (3–5 providers) pushes cumulative match into the 85–95% range — the same shape as the split above, not a contradiction of it, but not a confirmation of the specific per-provider breakdown either. Use the shape to set expectations and calibrate against your own data as the waterfall runs; don't quote the per-step percentages to a client as an established fact.

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

**Records the full waterfall couldn't match don't stay in a retry loop.** Once a record has been through every step of the waterfall and still has nothing, running it against the same providers again next week won't produce a different answer — the data doesn't exist there. Suppress it from active outbound rather than leaving it cycling through re-enrichment jobs, and only revisit it when the waterfall itself changes (a new provider added, Step 8's annual review) or the next scheduled decay-driven pass comes around. Chasing the last unmatched few percent indefinitely is enrichment-credit spend with no plausible return.

## Step 4 — Decay detection automation

**Decay detection automation:**

**Job change detection (rolling 90-day):**
Trigger: Contact property "Last Enriched" > 90 days ago AND lifecycle stage is not "Customer"
Action: Re-run enrichment on the contact → if job title or company changed, flag the record for SDR review (contact may be a re-engagement opportunity at their new company)

**Email validity decay:**
Trigger: Contact email bounces (hard bounce in sequencer or email tool)
Action: Remove from all active sequences → flag email as invalid → enqueue for email re-enrichment → if new email cannot be found within 30 days, set lifecycle stage to "Disqualified" (prevents the record from re-entering workflows)

**This trigger is not optional housekeeping — it's a domain-protection control.** Since November 2025, Gmail and Yahoo have moved from folder-level filtering to outright SMTP rejection for high-volume senders with a poor complaint or bounce profile. A hard bounce left active in a sequence a week longer than it should be no longer just wastes a send — on a domain already trending toward the danger zone (Step 1), it's the kind of signal that gets the whole domain rejected outright, not just that message. If the per-contact trigger above is running but the aggregate bounce rate is already in the danger zone, that's a signal the trigger is reacting too slowly for the volume — pause sending at the domain level (per Step 1) rather than trusting the per-record workflow to catch up.

**Enrichment age trigger:**
Trigger: Company property "Last Enriched" > 90 days ago AND company is in ICP Tier 1 or Tier 2
Action: Webhook to enrichment tool → refresh company firmographic fields → update Last Enriched date

**HubSpot workflow pattern:**
Workflow trigger: "Last Enriched is more than 90 days ago" → Action: webhook to Clay or enrichment API → Clay writes updated fields back to HubSpot contact → Action: update "Last Enriched" to today
