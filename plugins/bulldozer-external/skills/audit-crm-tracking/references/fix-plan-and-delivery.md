# Finding Format, Fix Plan Buckets and Delivery Checklist

## Output: Prioritized Fix Plan — findings, buckets, checklist

### Finding Format

The scorecard is the summary. The findings are what somebody actually works from, and each one carries the same five parts or it isn't a finding:

| Part | Example |
|---|---|
| Dimension | Completeness |
| Metric | Lead Source fill rate, contacts created in the last 90 days |
| Current | 41% |
| Target | ≥90% |
| Fix | Lead Source required on every form; backfill from UTM parameters where they were captured |

A finding with no metric is an opinion. A finding with no target has no end state, so nobody can tell when it is done. A finding with no named fix is a complaint.

### What Goes in Which Bucket

| Bucket | What qualifies |
|---|---|
| **This Week** | Stops the bleeding at the point of entry and touches no historical data: a required field turned on, a workflow turned off, a failure alert added to a broken integration. Minutes to hours, no migration, no decision from anyone else. |
| **Month 1** | Needs a decision from someone who isn't in the audit — stage entry/exit criteria, merge rules for duplicates, which properties get deprecated — plus the first backfill pass on the single worst critical field. |
| **Quarter Cleanup** | Anything that touches historical records at volume: mass merges, re-enrichment, property renaming or archiving, pipeline restructure. Slow, reversible only with effort, and worth nothing until the entry point above is fixed. |

Two arbitration rules for a fix that could sit in two buckets:

- **Entry point before backlog, always.** Cleaning history while the intake stays open isn't a fix, it's a subscription. If a fix appears in both, the entry-point half goes in This Week and the cleanup half waits.
- **One pipeline change at a time.** Stage changes, probability changes and required-field changes all move the forecast. Ship them in separate weeks, or the next forecast variance will be unattributable and the audit will have destroyed its own baseline.

### Before Delivering

- [ ] All six dimensions carry a number, including Consistency — an impression in one row discredits the other five
- [ ] Every number states its scope and date: a fill rate over all time and one over the last 90 days are two different findings, and the second is the one that says whether the problem is still happening
- [ ] The zombie deal output is a list with deal names, owners and amounts — not a count
- [ ] Every active workflow has a verdict: keep, fix, or off
- [ ] Closed Lost Reason sits on a structured picklist — native field converted, or a dedicated custom property — and is required on that field, not just flagged as mandatory while still free text; the audit names who owns making it so
- [ ] Every fix has an owner and a bucket
- [ ] Any measurement that couldn't be taken is written down as a gap with its reason named — access refused, property absent, tool unavailable — not silently dropped and never as a zero; an audit that hides its blind spots is worse than a short one
