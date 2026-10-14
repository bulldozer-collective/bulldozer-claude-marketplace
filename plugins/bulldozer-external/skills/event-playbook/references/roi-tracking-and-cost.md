# ROI Tracking Setup, Field-Score Mapping and Cost per Opportunity

## Tracking Setup (T-6 Weeks)

**Create one dedicated lead list for the event** — not a shared "conference leads" bucket that mixes events together. In Bulldozer OS this is `bdzCreateLeadList`, named for the event (e.g. "SaaStr Europe 2026 — Attendee Outreach"). Every contact touched before, during, or after the event goes into this one list, so the event's numbers can be pulled in one query instead of reconstructed from memory.

**Log every contact into it as you go**, not in a batch after the event. `bdzAddLeadToList` (or `bdzCreateLead` if a contact is being created fresh) carries a free-text `source` field meant exactly for this — write the event name into it (e.g. "SaaStr Europe 2026"), so the contact's origin survives even if it's later merged into other lists or a CRM.

**This only works for a contact the OS has never seen before.** Both tools write `source` on first write only — if the contact already exists from prior outbound or a previous list (the same account you've been sequencing into for weeks, say), adding them to the event list will *not* overwrite their existing source with the event name. For a contact you already had before the event, put the event name in the per-lead qualification note instead (see the field-score mapping below) — don't rely on `source` to prove they were touched at this event.

**A successful-looking call can still drop a contact.** `bdzAddLeadToList` takes up to 100 leads in one call and always answers success with a report (`requested`/`created`/`failed`/`errors[]`) rather than failing the whole batch when one entry is bad — a company domain already claimed by a different company in the CRM, or a website given as `http://` instead of `https://`, silently lands that one lead in `errors[]` and nothing else. Whoever logs the attendee list — same-day, one by one or in a batch — checks that report, not just that the call returned. A contact missing from `errors[]` review shows up later as a gap in "attendees engaged" with no record of why.

**Map the field-score to what the list actually tracks.** A lead list membership in Bulldozer OS carries one of three states — to review, accepted, rejected — plus a single free-text note per lead, not a native four-tier field. Translate the A/B/C/D qualification from the on-site protocol into that structure at the point of logging:

| Field score | Lead list state | Note field |
|---|---|---|
| A (opportunity) | accepted | qualification tier + agreed next step, e.g. "A — demo booked Tue 10am" |
| B (qualified lead) | accepted | qualification tier + what's outstanding, e.g. "B — needs security review before demo" |
| C (unqualified contact) | rejected | reason, e.g. "C — no budget owner in room" |
| D (not a fit) | rejected | reason, e.g. "D — <50 employees, below ICP floor" |

This makes `bdzListLeadListLeads` filtered to the accepted state the operational view of "who gets follow-up" — the same list the 48-hour and 8–30 day sequences above work from.

## Pipeline Math — cost per opportunity and renewal decision

**Cost per opportunity** = total event budget (travel, sponsorship, booth, team time if you cost it) ÷ opportunities created. Compare it to your next-best channel's cost per opportunity — not to a benchmark you haven't measured yourself.

**The renewal decision for a recurring event uses this same number.** No audited industry threshold exists for when to drop a recurring event — treat any specific multiplier seen elsewhere as someone else's benchmark, not yours to quote to a client. The workable rule: run this comparison for two consecutive years. If this event's cost per opportunity is still worse than the next-best channel's both years, stop renewing — the relationships built there are not a reason to keep paying for the booth, and the account owners can keep them warm without it.

**What Bulldozer OS won't tell you:** it holds the lead list, the contact, and the qualification note — it does not hold deal stage or closed-won revenue. Opportunity and revenue attribution past the lead list has to be read from wherever the sales pipeline actually lives (the CRM the sales team runs). Pull that number from there before reporting the event's ROI; don't estimate it from the lead list alone.
