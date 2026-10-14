# B2B SaaS Example Pipeline and HubSpot Stage Notes

## B2B SaaS Example Pipeline

| Stage | Definition | % likely to close | Average days in stage |
|-------|-----------|:-----------------:|:--------------------:|
| Discovery | Initial qualification call completed | 10% | 0–14 days |
| Demo | Full product demo completed, next step agreed | 25% | 7–21 days |
| Evaluation | POC, trial, or deep evaluation running | 50% | 14–45 days |
| Proposal | Commercial proposal sent, terms being reviewed | 65% | 7–21 days |
| Negotiation | Business terms agreed, legal/procurement in process | 80% | 7–30 days |
| Closed Won | Contract signed | 100% | — |
| Closed Lost | Deal lost or disqualified | 0% | — |

**Stage hygiene**: Opportunities should not sit in a stage beyond the maximum days without activity. Set automated tasks to flag stale opportunities.

**If the CRM is HubSpot, "without activity" is not the same field as "not modified."** `hs_lastmodifieddate` on a deal flips on *any* property write — a nightly enrichment sync, a workflow, a hidden internal HubSpot property — so a deal nobody has touched in months can still read as freshly modified. The field that answers the actual question is `notes_last_updated` ("Last Activity Date": the last note, call, email, meeting, or task logged on the deal), with the narrower `notes_last_contacted` if the goal is contact touches specifically, not internal notes or tasks. Build the stale-opportunity alert on activity, and keep last-modified only to show the gap between the two when it's worth pointing out.

**A stage rename that makes the forecast look healthier is a known gaming move, not a process improvement.** If "Discovery" quietly becomes "Qualified Discovery" and the forecast jumps, nothing changed except the label. Periodically check stage-to-stage conversion against actual close outcomes for that specific pipeline — if the numbers don't move when the label does, the label was cosmetic.

**Treat the percentages above as a starting illustration, not a target to type into the CRM.** A HubSpot pipeline stores its own probability per stage (`hs_deal_stage_probability`), set per pipeline — and a portal that has been in use for a while has usually renamed and re-weighted its stages, sometimes several pipelines at once (sales, upsell, outbound, partner…) with unrelated stage sets. Read the real configuration before assuming any standard sequence like the one above matches what's actually in the tool.

**If the CRM is HubSpot, don't pull "Average days in stage" (here or in the dashboard metric below) from `hs_v2_time_in_current_stage` expecting a number of days back — despite the label, it's a *date* field, and on every deal checked it holds the exact same value as `hs_v2_date_entered_current_stage`.** A report built on it as "time already spent in this stage" silently reads the entry date instead of a duration. The real calculation is `NOW() minus hs_v2_date_entered_current_stage`, done on the reporting side, not read pre-computed off the object. HubSpot does store a genuine elapsed number for stages a deal has already *passed through* — `hs_v2_cumulative_time_in_<stageid>`, one property per stage per pipeline with a portal-specific ID — but sanity-check any value pulled from it before trusting it in a velocity report: it can return an obviously implausible figure (decades of cumulative time on a deal only weeks old) without throwing an error.
