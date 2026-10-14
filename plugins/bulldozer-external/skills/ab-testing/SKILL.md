---
name: |-
  ab-testing
description: |-
  Design, run, and systematize A/B tests and experimentation programs. Triggers on 'A/B test,' 'split test,' 'run an experiment,' 'test this change,' 'statistical significance,' 'ICE score,' or 'experiment backlog.' For tracking implementation, see analytics-tracking. For page-level conversion optimization, see conversion-optimization.
when-to-use: |-
  Design, run, and systematize A/B tests and experimentation programs. Triggers on 'A/B test,' 'split test,' 'run an experiment,' 'test this change,' 'statistical significance,' 'ICE score,' or 'experiment backlog.' For tracking implementation, see analytics-tracking. For page-level conversion optimization, see conversion-optimization.
argument-hint: |-
  Homepage CTA button copy — want to test urgency vs. benefit framing
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# A/B Testing

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on experimentation and A/B testing. Your goal is to help design tests that produce statistically valid, actionable results.

## Input

`$ARGUMENTS` — what to test and where (e.g., "homepage hero CTA copy," "pricing page layout," "onboarding step 2"). If not provided, read any available context files (product-marketing.md, brief.md) before asking. Only ask if the test subject is completely absent.

## Output

A test spec document saved as `ab-test-{slug}.md` containing: hypothesis statement, variant descriptions, primary/secondary/guardrail metrics, sample size calculation, traffic allocation, implementation checklist, and analysis template. If an experimentation program is requested, output an `experiment-backlog.md` with ICE-scored hypotheses and a recurring cadence plan.

**Produce output on first invocation. Read available context before asking. Only ask if the primary input is completely absent.**

---

## Core Principles

### 1. Start with a Hypothesis
Every test needs a specific, falsifiable prediction — not "let's see what happens."

```
Because [observation/data],
we believe [change]
will cause [expected outcome]
for [audience].
We'll know this is true when [metrics].
```

**Weak**: "Changing the button color might increase clicks."
**Strong**: "Because heatmaps show users hesitating at the CTA (low click rate despite high scroll depth), we believe making the button larger with higher contrast will increase CTA clicks by 15%+ for new visitors. We'll measure click-through rate from page view to signup start."

**For an activation or onboarding test, the "expected outcome" has to be the actual activation event** — the action that, once taken, changes the rest of that user's numbers — not a proxy like "engagement" or "time in app." A test that moves engagement without moving the activation event hasn't proven anything about activation; it's proven the change is noticeable.

### 2. Test One Thing
Single variable per test. Otherwise you don't know what drove the result.

### 3. Statistical Rigor
Pre-determine sample size and duration before launch, then commit.

Standard thresholds: 95% significance, 80% statistical power, and a minimum run of two full weeks so the test captures at least one complete weekly cycle — a test read mid-week over- or under-samples whichever days it caught. Stopping before the pre-committed sample size is reached — even when the tool already flags "significant" — inflates false positives, and it risks reading a novelty effect or an incomplete business cycle as a real lift.

**These are the thresholds for a test run in a standard split-testing setup** (the site's own tool, GTM, a CMS's experiment feature). A platform's own native testing tool can set a different bar — Apple's Product Page Optimization is one documented example, with its own confidence threshold and no fixed duration — so check the tool's own documented methodology before applying this skill's generic thresholds to it. Details: `references/platform-native-thresholds.md`.

**The minimum detectable effect (MDE) is a shipping threshold, not just a sample-size input.** Set it by asking "if the real effect is exactly this size, is it still worth building and maintaining?" — not by picking whatever number the traffic can reach fastest. A homepage with heavy traffic can reach significance on a 1-2% lift; a low-traffic page may need 10%+ to ever reach it at all. Either way, an effect below the MDE the test was powered for can still show up as "significant" in the tool's output without being the effect that was actually detectable — read it as noise, not confirmation, until the next test is properly powered for it.

### 4. Measure What Matters
- **Primary metric**: tied directly to the hypothesis, determines call
- **Secondary metrics**: explain why/how the change worked
- **Guardrail metrics**: things that must not get worse (stop test if they do)

### 5. Trust the Tool Before You Trust the Test
A test's statistics are only as good as the tool computing them. Before relying on a new testing platform, a new tracking setup, or a fresh migration — run an A/A test: split real traffic into two groups shown the identical experience, and confirm the false-positive rate matches what the significance threshold promises (roughly 5% of A/A tests should read "significant" at a 95% threshold, purely by chance). It's a one-time calibration, not a permanent habit — repeat it after any change to the tool, the tracking, or the randomization logic, not on a fixed schedule.

### 6. Not Every Decision Needs a Fixed-Horizon A/B Test
Everything above assumes the classic fixed-horizon format: two variants, a pre-committed sample size, one winner at the end — right for a high-stakes, strategic change. It's the wrong tool for a short-lived, multi-variant decision where reallocating traffic toward whatever's winning *during* the test matters more than a confident effect-size read afterward (a subject-line test, a rotating set of ad creatives) — there, a multi-armed bandit reaches a usable answer faster, at the cost of a less generalizable estimate and a blind spot on any metric beyond the primary one. **Never run a pricing, paywall, or other guardrail-sensitive test as a bandit, and never for an activation/onboarding hypothesis** — Principle #1's real-activation-event requirement still applies, and a bandit's live reallocation can lock in a winner before there's been time to check it moved the real event. Full trade-off discussion: `references/bandit-vs-fixed-horizon.md`.

---

## Sample Size Quick Reference

Always calculate before starting — never run "until it looks good." For the baseline-conversion-by-lift-target table, the two-tailed 95%/80% assumptions behind it, and when CUPED can shrink the runtime on a traffic-constrained page, read `references/sample-size.md`.

---

## What to Test

| Category | High-impact examples |
|----------|---------------------|
| Headlines/copy | Message angle, value prop framing, specificity, tone |
| CTA | Button copy, size, placement, contrast |
| Visual design | Layout, imagery, hierarchy |
| Content | Social proof type, information order, FAQ vs. no FAQ |
| Offer | Free trial length, pricing display, feature bundling |

**ICE prioritization** — score each hypothesis 1–10 on:
- **Impact**: how much could this move the primary metric?
- **Confidence**: how strong is the data/reasoning behind it?
- **Ease**: how fast and cheap to ship and measure?

ICE Score = (Impact + Confidence + Ease) / 3. Run highest-scoring tests first.

ICE stays the right default for a backlog scored in minutes by one team. If the backlog mixes hypotheses that reach very different traffic volumes (a homepage test next to a step-3 checkout test), add Reach as a fourth factor (RICE) rather than letting Impact silently absorb it — otherwise a high-traffic page keeps winning the queue regardless of what it actually tests.

**Refuse standard per-visitor randomization when the two variants can interfere with each other.** A two-sided marketplace, a feature with social/referral effects, or anything drawing on shared inventory or capacity breaks the assumption that one visitor's variant doesn't affect another visitor's outcome — a per-visitor split will misattribute spillover between groups as a treatment effect. The fix is to randomize a bigger unit that contains the interference — by market/geography (cluster randomization) or by time period on the same unit (switchback testing) — not to run the test as designed and hope the effect is small. Documented case and the size of the risk: `references/interference-randomization.md`.

---

## Pre-Launch Checklist

- [ ] Hypothesis documented
- [ ] Primary metric defined and tracked
- [ ] Sample size calculated, MDE set as a shipping threshold, and duration estimated
- [ ] Randomization unit checked against interference risk (per-visitor by default; cluster or switchback if variants can affect each other)
- [ ] Variants implemented correctly
- [ ] Tracking verified on all variants
- [ ] QA completed across device types
- [ ] New tool, tracking setup, or migration? Run an A/A test first and confirm the false-positive rate

---

## Measuring With What's Already Connected

Bulldozer OS has no split-testing or feature-flag tool — it doesn't assign variants or split traffic. That still happens in the site's own test tool, in Google Tag Manager, or in the CMS's own experiment feature. What the OS *can* remove, once a GA4 property or the CMS is connected to the project, is the manual export on both ends of the test:

- **Before launch** — don't assume the metric named in the hypothesis exists as a trackable event. Pull the property's real conversion events (`bdzListGoogleAnalyticsConversionEvents`) and match the primary/secondary/guardrail metrics against actual event names; a metric that isn't a defined conversion event can't be reported on later. Add this check to the Pre-Launch Checklist above.
- **During/after the test** — build one GA4 report template scoped to the metrics needed (`bdzCreateGoogleAnalyticsReportTemplate`), then run it against the control window and the test window (`bdzRunGoogleAnalyticsReportTemplate`, one call per date range) instead of pulling a manual export each time. The report only returns raw counts — the significance calculation above still happens outside it. A `conversion_funnel` preset and built-in anomaly detection can speed this up further, with caveats: `references/ga4-report-template-tips.md`.
- **For lead-gen tests** — when the conversion is a form fill rather than an e-commerce event, the submission counts live in the CMS form data already synced to the project (`bdzListCmsFormSubmissions`, or the lead list it feeds) — read from there rather than asking whoever built the form for a CSV.

This doesn't replace the sample-size and stopping-rule discipline above — it only removes the manual pull between "test concluded" and "result documented."

---

## Analyzing Results

**Before reading the metric, check the split.** Compare the actual visitor count per variant against the configured allocation with a chi-square goodness-of-fit test at p<0.01 — deliberately stricter than the test's own 95% threshold. A mismatch is a Sample Ratio Mismatch (SRM): a bucketing or logging bug that invalidates every other number the test produced, no matter how clean the primary metric looks. Run this check first, every time — a clean SRM check doesn't prove the test is trustworthy, but a failed one proves it isn't. Calculator, worked example, and which platforms auto-detect it: `references/srm-check.md`.

| Result | Conclusion |
|--------|------------|
| Significant winner (95% CI) | Implement variant — unless a guardrail metric moved the wrong way (see below) |
| Significant loser | Keep control, learn why |
| No significant difference | Need more traffic or bolder test |
| Mixed signals | Dig into segments (mobile vs. desktop, new vs. returning) |

**A guardrail regression vetoes a win.** If the primary metric improved but a guardrail metric (page load time, unsubscribe rate, support ticket volume, downstream retention) moved against the business, that is not a marginal win to note in the playbook entry — it's a decision to make explicitly with whoever owns the guardrail, before shipping, not a footnote after the fact.

**Pricing and paywall tests need a longer guardrail than the rest of this checklist assumes.** A variant that lifts checkout or trial-start conversion can do it by pulling in a worse-fit customer — the win shows up in two weeks, the higher churn shows up months later, after the standard read window already closed the test. Add the converted cohort's downstream retention (30/60/90-day, whatever the sales cycle allows) as a guardrail metric on any pricing, packaging, or paywall test before calling the immediate conversion number a result.

**The peeking problem**: looking at results before sample size is reached inflates false positives. Pre-commit to sample size and trust it — this is the default rule and it requires no special tooling.

The one legitimate exception is a test tool built on sequential ("always-valid") testing rather than a fixed-horizon p-value — it can be monitored continuously without inflating false positives, by design, though it trades some statistical power for that safety. Don't assume a tool has it unless its own methodology documentation says so; if it doesn't, apply the fixed-sample rule above. Details and the calculator to use: `references/sequential-testing.md`.

---

## Experiment Playbook Entry

When a test concludes, document the pattern: date, hypothesis, sample size, result with p-value, guardrail outcomes, why it worked or failed, the reusable pattern, and where else it might apply. Full entry template in `references/experiment-playbook-entry.md`.

---

## Growth Experimentation Program

For teams running experiments continuously. Velocity and win-rate targets are health signals, not a floor to hit immediately — a young program with real backlog discipline can already be ahead of the median; see `references/growth-program-benchmarks.md` for the numbers and why they're not a goal in themselves.

**Cadence**:
- Weekly (30 min): check running tests for technical issues and guardrail metrics
- Bi-weekly: conclude completed tests, launch next from backlog
- Monthly: review velocity, win rate, replenish backlog
- Quarterly: audit the playbook, identify untested funnel areas

---

## Common Mistakes

- Testing too small a change (effect won't be detectable)
- Stopping early when a variant looks winning
- Changing things mid-test
- Cherry-picking favorable segments after the fact
- Not checking implementation before launch
- Reading a "significant" result without checking the traffic split first (see Sample Ratio Mismatch, above)
- Shipping a primary-metric win that quietly moved a guardrail metric the wrong way
- Splitting traffic per-visitor on a feature where one visitor's variant can affect another's outcome (marketplace, referral, shared inventory)