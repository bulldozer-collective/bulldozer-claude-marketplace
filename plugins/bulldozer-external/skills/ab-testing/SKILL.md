---
name: |
  ab-testing
description: |
  Design, run, and systematize A/B tests and experimentation programs. Triggers on 'A/B test,' 'split test,' 'run an experiment,' 'test this change,' 'statistical significance,' 'ICE score,' or 'experiment backlog.' For tracking implementation, see analytics-tracking. For page-level conversion optimization, see conversion-optimization.
when-to-use: |
  Design, run, and systematize A/B tests and experimentation programs. Triggers on 'A/B test,' 'split test,' 'run an experiment,' 'test this change,' 'statistical significance,' 'ICE score,' or 'experiment backlog.' For tracking implementation, see analytics-tracking. For page-level conversion optimization, see conversion-optimization.
argument-hint: |
  Homepage CTA button copy — want to test urgency vs. benefit framing
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
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

### 2. Test One Thing
Single variable per test. Otherwise you don't know what drove the result.

### 3. Statistical Rigor
Pre-determine sample size. Don't peek early. Commit to the methodology before launch.

### 4. Measure What Matters
- **Primary metric**: tied directly to the hypothesis, determines call
- **Secondary metrics**: explain why/how the change worked
- **Guardrail metrics**: things that must not get worse (stop test if they do)

---

## Sample Size Quick Reference

| Baseline conversion | 10% lift target | 20% lift target | 50% lift target |
|---------------------|:--------------:|:--------------:|:--------------:|
| 1% | 150k/variant | 39k/variant | 6k/variant |
| 3% | 47k/variant | 12k/variant | 2k/variant |
| 5% | 27k/variant | 7k/variant | 1.2k/variant |
| 10% | 12k/variant | 3k/variant | 550/variant |

Use [Evan Miller's calculator](https://www.evanmiller.org/ab-testing/sample-size.html) for precise figures. Always calculate before starting — never run "until it looks good."

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

---

## Pre-Launch Checklist

- [ ] Hypothesis documented
- [ ] Primary metric defined and tracked
- [ ] Sample size calculated and duration estimated
- [ ] Variants implemented correctly
- [ ] Tracking verified on all variants
- [ ] QA completed across device types

---

## Analyzing Results

| Result | Conclusion |
|--------|------------|
| Significant winner (95% CI) | Implement variant |
| Significant loser | Keep control, learn why |
| No significant difference | Need more traffic or bolder test |
| Mixed signals | Dig into segments (mobile vs. desktop, new vs. returning) |

**The peeking problem**: Looking at results before sample size is reached inflates false positives. Pre-commit to sample size and trust it.

---

## Experiment Playbook Entry

When a test concludes, document the pattern:

```markdown
## [Experiment Name]
**Date**: [date]
**Hypothesis**: [the hypothesis]
**Sample size**: [n per variant]
**Result**: [winner/loser/inconclusive] — [primary metric] changed by [X%] (p=[value])
**Guardrails**: [any guardrail metric outcomes]
**Why it worked/failed**: [analysis]
**Pattern**: [reusable insight — e.g., "urgency CTAs outperform benefit CTAs on pricing pages"]
**Apply to**: [other pages where this pattern might apply]
```

---

## Growth Experimentation Program

For teams running experiments continuously:

**Velocity targets**:
- 4–8 experiments launched per month
- 20–30% win rate is healthy (higher may indicate overly safe hypotheses)
- 2–4 week average test duration
- 20+ hypotheses in backlog at all times

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