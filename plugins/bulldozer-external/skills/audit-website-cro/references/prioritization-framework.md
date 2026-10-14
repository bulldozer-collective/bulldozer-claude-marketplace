# Prioritization Framework

Score every finding:

| Tier | Criteria | Action |
|------|----------|--------|
| **1 — Fix immediately** | High revenue impact, low effort: broken forms, missing CTAs, unclear headline, slow pages | Ship without testing |
| **2 — A/B test** | High revenue impact, medium-high effort: new layouts, pricing changes, CTA rewrites, checkout redesigns | Test before full rollout |
| **3 — Backlog** | Low/medium impact: minor copy tweaks, design preferences, secondary page elements | Document, revisit after Tier 1–2 |

Write hypotheses for every Tier 2 test: "We believe that [change] will [improve metric] because [evidence from audit]." No hypothesis = no test. Random testing is expensive and slow.

**Prioritize by revenue impact first, effort second.** A Tier 1 fix with modest impact still ships before a Tier 2 test with a bigger upside — the fix is certain, the test is a bet. Sequence the roadmap: all Tier 1 fixes this week, Tier 2 tests queued one at a time (running two tests on the same page at once confounds which change moved the number), Tier 3 documented and revisited only once Tier 1–2 are clear.

**Reading a test correctly matters as much as running it.** Standard practice is 95% statistical significance and 80% power — below that, a "winner" is noise wearing a costume. Let a test run at least a full business cycle (commonly two weeks minimum) before reading it, even if significance shows earlier: a Monday-to-Friday call misses weekend behavior, and a first week can carry a novelty effect that fades by the second. Stopping a test the moment it crosses significance, rather than at the pre-committed duration, inflates false positives — decide the stopping rule before launching, not while watching the dashboard.

**Don't recommend a test the page can't finish.** Before tiering a finding as "A/B test," check whether the page's current traffic and baseline conversion rate can reach the required sample size within a reasonable window — a page that would need several months to reach significance isn't a Tier 2 candidate, whatever its potential impact. Two honest alternatives exist, and both beat running an underpowered test and reading it early anyway: ship the higher-confidence variant directly as Tier 1 and monitor the trend, or hold the change until enough traffic (or enough pages pooled behind the same hypothesis) exists to test it properly.

**A conversion win on a pricing or checkout page isn't validated at the point of signup.** A change that lifts the immediate conversion rate can do it by attracting a worse-fit buyer — the lift shows up in two weeks, the extra churn shows up months later, past the point anyone reads the test again. Before calling a pricing/checkout test a win, check the converted cohort's retention at 30/60/90 days (or the sales cycle's equivalent) against the cohort it replaced — not just the checkout conversion rate.

**Findings should run out before the tiers do.** If an audit produces only Tier 3 items and nothing that rises to Tier 1 or Tier 2, that itself is the finding — either the page is genuinely already well-optimized (rare, worth saying plainly) or the evidence gathered in Layers 1–2 wasn't sharp enough to surface the real leak. Padding the report with template "best practices" to make Tier 1/2 look populated is the generic-checklist failure this audit exists to avoid — go back to the funnel data before manufacturing a finding.
