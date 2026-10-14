# Logo Retention Cohort Table: Definitions, Structure and Reading

**What counts as "active" is a decision, not a given.** Billing and subscription systems carry more states than a simple active/churned split. HubSpot's own Subscription object, for instance, tracks `active`, `past_due`, `unpaid`, `paused`, `canceled`, `expired`, and `scheduled` — a customer 45 days past due hasn't chosen to leave, but counting them as active overstates retention, and counting them as churned the moment a card fails overstates churn from what might just be an expired card. Pick the policy once, before building a single cell — for example: "past_due beyond one full billing cycle = churned for this analysis," "paused = excluded from the denominator, not counted as churned." Whatever the rule, apply it identically to every cohort; changing the definition mid-table to make one vintage look better is the fastest way to lose the reader's trust in the whole report.

**A downgrade is not automatically a churn, and treating it as either one by default is still a choice.** A customer who drops from the Enterprise plan to the free tier hasn't cancelled in a billing sense, but they've left in every sense that matters commercially — a logo retention table that only counts full cancellations will read healthier than the business actually is. Decide upfront whether a downgrade past some threshold (e.g. below the price of the lowest paid plan) counts as a logo churn here, and say so in the output's methodology section rather than leaving it implicit.

**Table structure:**

| Cohort | M0 | M1 | M2 | M3 | M6 | M12 |
|--------|----|----|----|----|----|----|
| Jan 2024 | 100% | X% | X% | X% | X% | X% |
| Feb 2024 | 100% | X% | X% | X% | X% | — |
| Mar 2024 | 100% | X% | X% | X% | — | — |

Each cell: percentage of cohort still active (paying) in that month.

**Reading the table:**

| Pattern | What it means | Action |
|---------|--------------|--------|
| Large M0→M1 drop (>15%) | Onboarding failure — customers not reaching activation | Fix onboarding: time-to-value, first-week experience |
| Steady decline throughout | Normal churn — product may not be "sticky" enough | Investigate engagement; consider usage-based triggers |
| Flat after M3 | Customers who survive onboarding become loyal | Optimize early-stage experience to push more through onboarding |
| Newer cohorts declining faster | Acquisition quality dropping OR product regressed | Segment by channel — is the problem ICP drift or product? |
| Newer cohorts improving | Onboarding or product improvements working | Quantify the improvement; protect the changes that drove it |
