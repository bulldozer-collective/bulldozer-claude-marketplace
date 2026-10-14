# Layer 2: Targeting & List Quality

### ICP Alignment
- Pull the current active lead lists (`bdzListLeadLists`, then `bdzGetLeadList` / `bdzListLeadListLeads` for each). What % of contacts match the stated ICP (industry, company size, role, buying trigger)? There's no native numeric ICP-fit score in the OS — the review state (`LEAD_MEMBERSHIP_STATE_TO_REVIEW` / `_ACCEPTED` / `_REJECTED`) and its free-text note are what carries the qualification call, so read the note field, don't expect a score.
- Compare the ICP definition on paper to the last 5 closed-won deals: do they match? ICP drift (lists that have wandered from the original segment) is the fastest way to tank reply rates without touching a word of copy
- Flag roles that are off-target: sending to "Marketing Manager" when the buyer is "VP Sales" = structural mismatch
- **Is this list driven by a real trigger, or is it a static filter with a name that sounds like one?** Check `bdzListSignals` for the project. A lead list that's actually populated off a signal (funding round, hiring surge, a LinkedIn post reaction) is a different animal from a firmographic list that was pulled once and is being worked cold for the third month — the latter decays into Market Saturation below regardless of how good the copy is.
- **If the fix is "switch to signal-based targeting," price it before recommending it.** Signal types in the OS are not uniform cost: per-lead pricing spans roughly a 24x range across the catalog (`bdzListSignalTypes`) — cheap passive-engagement signals at one end, expensive company-level signals (tech adoption, tech displacement) at the other, with optional enrichment lookups (email, phone, tech detection) adding on top of the base cost per lead. Recommending an expensive signal to populate a broad, low-priority segment is a common audit mistake — reserve the expensive ones for small, high-priority account lists (ABM, Tier 1) and use the cheap ones for wide top-of-funnel scanning.

### List Quality
- B2B contact data decay estimates vary widely by source (roughly 22% to 70%+ per year depending on how it's measured) with no single figure that holds as ground truth; the lower end (~22–30%/year) is the most repeated across vendors, but treat it as an order of magnitude, not a fact to quote back to a client
- Verify emails before send: real-time verification reduces bounce risk. Catch-all domains are risky — treat them as Tier 2 if sender reputation is under pressure
- Data completeness: are first names, companies, and relevant context fields populated for personalization? Generic merge tags ("Hi {FirstName},") on bad data = "Hi ,"
- Duplicate contacts: are the same contacts in multiple sequences simultaneously? This triggers spam complaints and confuses reply handling

### Market Saturation
- How many times has this contact list been contacted in the last 90 days? Over-contacted lists produce diminishing returns regardless of copy quality
- If the TAM for the segment is <5,000 companies, the list may be exhausted — time to expand the ICP or move to a new segment
- **Check what happens to a lead when the sequence ends without a reply — this is the finding teams skip.** Most contacted accounts will never respond; a list with no defined exit for them doesn't shrink, it gets recontacted blind next quarter and quietly rots. Confirm non-responders actually get moved out of active rotation — in the OS, that means updating `bdzUpdateLeadListLead` to `LEAD_MEMBERSHIP_STATE_REJECTED` (or a dated note explaining the pause) rather than leaving them `ACCEPTED` to be pulled into the next campaign untouched. If the audit can't find where completed-sequence leads go, that's a Layer 2 finding on its own, not a footnote to write up later.
