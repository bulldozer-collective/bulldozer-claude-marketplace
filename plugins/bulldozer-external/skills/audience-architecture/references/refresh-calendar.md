# Refresh Calendar and Cross-Platform Consistency

An audience architecture decays the moment it stops being touched: seeds go stale, the suppression lists miss last month's closed-won accounts, and the two platforms drift out of sync with each other. Put dates on it.

| Asset | Refresh cadence | Trigger to act, not just to look |
|---|---|---|
| Suppression lists (customers, active pipeline, closed-lost) | Weekly | List size moved more than expected week-over-week — investigate before assuming the CRM export is fine |
| Negative ICP exclusions | Monthly | A new confirmed non-fit pattern shows up in Closed Lost reasons |
| Closed-won seeds (Step 2) | Quarterly | Fewer than the seed's minimum company count after cleaning — rebuild the segmentation before uploading a thin seed |
| Account score tiers and offline conversion values (Step 5) | Monthly | Tier A volume drifts below the minimum for value-based bidding — collapse tiers rather than starve the algorithm |
| Audience segment library (Step 4) | Quarterly | A segment's conversion rate has stayed flat for two refresh cycles — retire or rebuild it, don't leave it running on inertia |

**Cross-platform consistency check (do this at every refresh, not just quarterly):** the same account should not be excluded on LinkedIn and still reachable on Google, or vice versa. Pull the current suppression list from each platform's own interface and diff them against the CRM export — a mismatch usually means one platform's upload silently failed or ran on stale data, not that the account genuinely belongs on one list and not the other.

**Don't chase every diff as a broken sync.** A handful of accounts out of alignment right after a weekly refresh is normal upload lag between two platforms that process CSV uploads on their own schedule, not a failure — re-check at the next refresh before escalating. Treat it as a real problem only when the same accounts are still mismatched two refresh cycles in a row, or the gap is a visible fraction of the list rather than a handful of names: that's the point where "it'll catch up" stops being a credible explanation and someone should look at why an upload is silently failing.
