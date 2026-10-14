# Interference between variants — documented case and the size of the risk

A two-sided marketplace, a feature with social/referral effects, or anything drawing on shared inventory or capacity breaks the assumption that one visitor's variant doesn't affect another visitor's outcome. A per-visitor split will misattribute spillover between groups as a treatment effect: a 2020 *Management Science* study on an Airbnb pricing experiment found individual-level randomization overstated the effect by at least 20% once interference was accounted for.

The fix is to randomize a bigger unit that contains the interference — by market/geography (cluster randomization) or by time period on the same unit (switchback testing) — not to run the test as designed and hope the effect is small.
