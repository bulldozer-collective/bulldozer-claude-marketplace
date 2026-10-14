# CRM Data Requirements

Attribution only works if the data exists. Audit before building the model.

### CRM Requirements

- [ ] **Source field on every contact** — First touch source (channel + campaign) captured at lead creation. This is the foundation of first-touch attribution. If source isn't populated on >80% of leads, first-touch attribution is unreliable.
- [ ] **UTM parameters passing to CRM** — All inbound digital traffic must pass UTM source, medium, and campaign to the CRM contact record. Verify this with a test: create a test lead via a UTM-tagged link and confirm the field populates in CRM.
- [ ] **Opportunity source field** — Beyond contact source, the opportunity should have a source field for outbound-created deals (so sales-sourced opportunities are attributed to the sales team, not "direct" or "unknown").
- [ ] **Stage transition timestamps** — Each funnel stage transition must have a timestamp. Without timestamps, you can't calculate stage velocity (how long deals spend at each stage) or identify where deals stall. On HubSpot, don't source this from `hs_v2_time_in_current_stage`: despite the name, it's typed as a datetime and its value is always identical to `hs_v2_date_entered_current_stage` — it's the entry date, not an elapsed duration. Compute time-in-stage as now minus that entry date. The per-stage cumulative fields (`hs_v2_cumulative_time_in_<stageid>`, one per stage per pipeline, portal-specific) do store a real duration in seconds — but sanity-check the value before using it; one observed on a real portal read roughly 40 years for a deal three weeks old.
- [ ] **Closed Lost Reason field** — Required for funnel drop-off analysis. If Closed Lost Reason isn't filled on >70% of lost deals, you're flying blind on why pipeline converts at its current rate.

### What to Do with Missing Data

If UTM parameters aren't passing to CRM: implement immediately. It's a 2-hour technical fix with multi-year payoff. Until it's fixed, run attribution from campaign-level CRM reports (match lead creation date to campaign run dates) — imprecise but directional.

If source field isn't populated on historical leads: add a CRM workflow that retroactively segments by email domain or first page viewed. Imperfect but recoverable.

If Closed Lost Reason is empty: fix at the CRM level (make it a required field before a deal can be marked Closed Lost) and run a 30-minute rep session to back-fill the last 90 days.
