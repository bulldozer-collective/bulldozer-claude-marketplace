# Measuring a referral program in Bulldozer OS

Bulldozer OS has no dedicated referral object, but it does have a real path for the first four rows of the Key Metrics table before a paid tracking tool is wired in. Create one lead list per referral cohort (`bdzCreateLeadList`) and add referred signups to it (`bdzAddLeadToList`), using the free-text `source` field to carry the referrer or the campaign — the same mechanism already used for event and partner lead attribution. Qualification is limited to three states (to review / accepted / rejected) plus a free note, not a score, so "qualified referral" has to be encoded as accepted rather than as a field of its own.

## The `source` write only works once, per lead

Both `bdzAddLeadToList` and `bdzCreateLead` write `source` on first write only — if the referred person already exists in the OS (a prior outbound touch, an earlier list, a CRM import), adding them to the referral cohort's list will *not* overwrite their existing source with the referrer's name, and nothing in the response flags this. The lead silently keeps whatever source it already had, which quietly understates "% new customers from referrals" without ever throwing an error. `bdzUpdateLead(source=...)` is the only path that replaces an already-set source, so for anyone you suspect was already in the OS before the referral, set it explicitly there rather than trusting the list-add call to have carried it.

Separately, `bdzAddLeadToList` takes up to 100 leads per call and always answers success with a report (`created`/`failed`/`errors[]`) rather than failing the batch when one entry is bad (a company domain already claimed by someone else, an `http://` website) — check `errors[]`, not just that the call returned, or a dropped referral never shows up in the cohort at all.

## Revenue and funnel metrics

For "% new customers from referrals" and "LTV of referred customers," the lead list only gets you the top of funnel — the revenue side has to come from the CRM: where HubSpot is connected, `DEAL` exposes `hs_is_closed_won`, `amount_in_home_currency` and `days_to_close` as default, readable properties, joinable to `COMPANY` in one `query_crm_data` call, which is enough to compare closed-won revenue and cycle length for referred vs. non-referred accounts without an export.

For "Click → signup conversion," a GA4 report template built on the product's connected property gives the funnel step Bulldozer OS itself doesn't track natively — reference the click and signup metrics as `conversions`, the name Bulldozer OS's own curated GA4 catalog uses for a non-Google-Ads conversion event (Google's own product has called this a "key event" since March 2024, but that's not the field name this tool expects).
