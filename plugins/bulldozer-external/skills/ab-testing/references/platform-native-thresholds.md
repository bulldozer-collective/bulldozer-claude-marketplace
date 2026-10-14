# Platform-native testing thresholds differ from the 95%/2-week default

A platform's own native testing tool can set a different bar than the 95% significance / 80% power / two-week-minimum defaults this skill uses for a standard split-testing setup (the site's own tool, GTM, a CMS's experiment feature). Reading a platform-native tool against the borrowed 95%/2-week rule misreads what the tool already decided.

Apple's Product Page Optimization (App Store Connect) is one concrete, documented example: it calls a treatment "Performing Better" or "Performing Worse" at 90% confidence, not 95%, once it has at least 5 first-time downloads attributed to the test — using Bayesian methods, by Apple's own description, not the frequentist p-value this skill's own defaults assume. The "90% confidence" here is a posterior probability, not a p-value threshold on a different scale — don't present the two as the same kind of number just because both are called "confidence."

It also has no fixed minimum *or* maximum duration: a variant is only flagged "likely to be inconclusive" when, at its current rate, there won't be enough data within 90 days to call it — and Apple's own guidance is to extend the test past 90 days rather than end it early. Don't describe this as "running against a 90-day window": 90 days is a checkpoint for whether a call is likely, not a cutoff.

Check the tool's own documented methodology before applying this skill's generic thresholds to it — don't assume a platform-native tool follows the same rules as a standard split-testing setup just because the underlying math (significance, confidence) sounds the same.
