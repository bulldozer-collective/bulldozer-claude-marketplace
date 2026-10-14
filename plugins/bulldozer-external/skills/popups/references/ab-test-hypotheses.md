# A/B Test Hypotheses, Calling a Test and Killing a Popup

**Test 1 — Trigger**: Exit intent vs. 50% scroll depth for the same email capture offer. Hypothesis: scroll-triggered outperforms exit intent because user is engaged, not leaving.

**Test 2 — Incentive type**: Discount code vs. content lead magnet on pricing page exit popup. Hypothesis: on pricing pages, discount outperforms content because purchase intent is higher.

**Test 3 — Decline copy**: "No thanks" vs. "I'll figure it out myself." Hypothesis: self-deprecating decline copy increases conversions by creating mild contrast (unverified — test this).

### When to Call the Test

A popup gets little traffic relative to a full page, so the temptation to call a winner early is strongest exactly where the risk of reading noise is highest. Don't call a test until:

- **Statistical significance ≥ 95%** and **power ≥ 80%** — the standard CRO pair, not a house number.
- **A minimum of 2 full weeks**, even if significance is reached sooner — this covers one full weekly cycle (weekday vs. weekend traffic and intent differ) and guards against a novelty effect (people react to a new popup differently in its first days).
- **Never stop a test early because it hit significance** — early stopping is itself a bias: the check is "did we reach the pre-set sample size and duration," not "did the p-value cross the line yet."

This is the same discipline as any page-level CRO test — see `ab-testing` and `conversion-optimization` for the full method. A popup that "wins" after 3 days on 40 conversions hasn't won anything yet.

**A rising fill rate is not the finish line.** The same guardrail already applied to pricing and paywall tests holds here: a variant that lifts email-capture rate but feeds leads that progress to trial, MQL, or paying customer at a *lower* rate than the site's other channels isn't winning — it's changing who gets captured, at the cost of quality the capture-rate number can't see. Where HubSpot is connected, pull the popup-sourced leads' 30-day downstream status (trial start, MQL, first meeting booked) before declaring a variant the winner, not just its fill rate at test-end.
