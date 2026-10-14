# Sample size reference

## Quick reference table

| Baseline conversion | 10% lift target | 20% lift target | 50% lift target |
|---------------------|:--------------:|:--------------:|:--------------:|
| 1% | 150k/variant | 39k/variant | 6k/variant |
| 3% | 47k/variant | 12k/variant | 2k/variant |
| 5% | 27k/variant | 7k/variant | 1.2k/variant |
| 10% | 12k/variant | 3k/variant | 550/variant |

These figures assume a two-tailed test at 95% significance / 80% power — the same defaults most public calculators start from. Change any of the three and the numbers move. Use [Evan Miller's calculator](https://www.evanmiller.org/ab-testing/sample-size.html) for the project's actual baseline and duration, and always calculate before starting — never run "until it looks good."

## CUPED, if the page is traffic-constrained

Ask whether the test tool supports CUPED before accepting a multi-month runtime. CUPED (variance reduction using each visitor's pre-experiment behavior as a covariate) is mainstream at this point — Statsig applies it automatically to experiments, Eppo ships it out of the box, and newer entrants (PostHog, Datadog) now document it too — and typically reaches the same power with 20–50% fewer visitors, because it strips out noise the test was never trying to measure. It isn't universal, and support isn't all-or-nothing even where it exists: most Shopify-focused testing apps still don't support it, and Optimizely's own CUPED only covers numeric metrics (revenue, order counts) — not a binary conversion-rate metric, which is what most of this skill's tests actually run on. Check the tool's own methodology page for which metric types it covers before assuming it silently applies to the primary metric.

**Don't confuse CUPED with Optimizely's "Stats Accelerator."** That's a different feature under a similarly-branded name: a multi-armed-bandit traffic-allocation mode (Optimizely's own term for what used to be called "Accelerate Learnings") that shifts visitor share toward the variant currently most likely to win, instead of holding the split fixed — not a variance-reduction technique at all. It carries the same bandit trade-offs discussed in Principle #6 (optimized for a faster read, not a confident effect-size estimate), and it's incompatible with checking a guardrail metric mid-flight the way a fixed-horizon test can.
