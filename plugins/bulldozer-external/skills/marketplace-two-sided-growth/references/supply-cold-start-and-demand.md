# Supply Cold Start and Demand Unlock — Detail

## Why supply first

**Why supply first:**
1. Supply quality determines demand experience — a buyer who can't find what they need churns and rarely returns
2. Concentrated supply in a narrow category achieves liquidity faster than fragmented supply across many categories
3. Supply curation defends against race-to-the-bottom pricing (quality over volume)

## Supply onboarding, the silent-supplier trap and OS tracking

**Supply onboarding checklist (before a supplier is "active"):**
- [ ] Profile complete (photo, bio, work samples or credentials, portfolio/case studies)
- [ ] Pricing defined (or range defined)
- [ ] Availability visible and accurate
- [ ] Response time commitment made (<4h for B2B services)
- [ ] First test transaction completed (internal or simulated)

**The trap this checklist doesn't catch: supply that goes silent after onboarding.** A supplier who cleared every box above and then stopped responding to real requests is still counted as "active" by most teams, because the checklist is a one-time gate, not a standing condition. That inflates the supply-density number in Step 3 with suppliers who won't actually answer a buyer — the density gate looks cleared while real time-to-match stays broken. Treat "active" as something a supplier can lose: pull anyone who hasn't responded to a live request within their committed SLA over the last recruiting window from the density count (not necessarily from the platform) until they respond again. Refuse to report supply density against the onboarded count when the responsive count is materially lower — that gap is the number to fix before adding more suppliers.

**Tracking curated recruitment in Bulldozer OS, if the project runs one:** a lead list
(`bdzCreateLeadList`) scoped to the beachhead category, with each candidate supplier added
via `bdzAddLeadToList` — its free-text `source` field captures where the candidate came
from (referral, directory, outbound), and `bdzUpdateLeadListLead` moves a candidate
through to_review → accepted/rejected as the qualification bar above is applied. That
gives a real count of "qualified but not yet active" vs. "active" instead of a hand-kept
spreadsheet, the same mechanism this playbook family already uses for waitlists and
event-sourced leads.

**`source` only writes once per candidate — it won't correct a channel after the fact.** Both `bdzAddLeadToList` and `bdzCreateLead` only set `source` the first time the OS ever sees that contact (deduplicated by email, then LinkedIn URL); adding an already-known contact to this recruitment list — one re-surfaced from a prior scan, a past outbound sequence, or another lead list — succeeds silently but leaves `source` on whatever it was first, even when this call passes a different value. Don't build the "where candidates came from" read on this field without checking whether the contact was new to the OS; use `bdzUpdateLead(source=...)` to correct it explicitly for a candidate who already existed before this list.

## Reading the gate scorecard, and the demand channel mix

**Read this as a starting scorecard, not a verified industry standard** — same caveat as
Step 1: no audited study sets a universal liquidity, density, or NPS gate for a
marketplace, and a threshold imported from a different category or ticket size can be
meaningless here. Set the five numbers once against this marketplace's own beachhead
cohort, then hold the line — the discipline of waiting for the gate matters more than the
precision of the number in it.

**Demand acquisition channel mix (once gates are met):**

| Channel | Role | B2B allocation |
|---------|------|---------------|
| Google Search (category keywords) | Captures buyers actively searching | 35–45% |
| LinkedIn Ads (target buyer persona) | Creates demand among buyers not yet searching | 20–30% |
| Content / SEO | Organic demand from category education | 15–25% |
| Referral (buyer-to-buyer) | Highest-quality demand — peer recommendation | 10–15% |
| Outbound SDR (enterprise buyers) | Direct sales for high-ACV buyer accounts | 10–20% |
