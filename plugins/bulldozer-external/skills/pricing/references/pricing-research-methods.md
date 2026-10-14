# Pricing Research Methods

## Pricing Research Methods

### Van Westendorp Price Sensitivity Meter

Four survey questions:
1. At what price would this be so expensive you wouldn't consider it? (too expensive)
2. At what price would this be so cheap you'd question the quality? (too cheap)
3. At what price would this start to feel expensive, but you'd still consider it? (getting expensive)
4. At what price would this feel like a bargain? (a bargain)

Plot the four curves. The "acceptable price range" is where "too cheap" and "too expensive" cross. Your sweet spot is between "getting expensive" and "a bargain." Needs enough responses per segment to mean anything — a curve built from a handful of answers is noise, not a result; treat a small-sample read as directional only, and don't build a pricing decision on it alone.

### Reading a Pricing or Paywall A/B Test

Read any pricing-page, tier-structure, or paywall test against the same bar as any other product test: minimum ~2 weeks, 95% significance, 80% power. A decoy or anchoring "win" read before that is noise, not a result — this is the same threshold that applies to any other conversion test, not a pricing-specific one.

But a statistically valid win on immediate conversion (checkout started, trial begun) is not the full result yet. A price or paywall change that wins on immediate conversion can be winning by pulling in a worse-fit customer — the conversion lift shows up in two weeks, the extra churn shows up months later, past the point where anyone is still looking at the test. Before banking the conversion number as a win, add the converted cohort's retention at 30/60/90 days (pick the horizon that matches the sales cycle) as a guardrail metric. This is consistent with treating price as a product decision rather than a spreadsheet exercise: a price test that trades retention for conversion hasn't found a better price, it's found a leakier one.

### Willingness-to-Pay Signals (without a formal study)

Treat these as directional signals, not universal thresholds — conversion rates and churn levels vary too much by ICP, channel and pricing model to transport a fixed number from one business to another. Compare each signal to your own trend over time, not to a market figure:

- Self-serve conversion climbing well above your own historical baseline, with no drop in activation quality → price is probably too low (some sources use ">40% conversion" as a rule of thumb, but that figure is an unaudited convergence, not a verified threshold — trust your own baseline over it)
- "It's so cheap!" feedback → raise price
- Prospects don't flinch at price → raise price
- Win rate doesn't change when you raise price → keep raising
- Losing deals on price consistently → check the CRM for the actual lost reason and which segment the losses concentrate in before concluding it's the price — losses clustered in one segment are usually an ICP problem, not a pricing one

### Measuring Your Own Signals in Bulldozer OS

Bulldozer OS gives a way to ground these signals in real data instead of guesswork, when the relevant connectors are set up on the project:

- **GA4** — the self-serve conversion trend over time, through the project's report templates. Google's own product calls this event type "key events" (renamed from "conversions" in the UI, March 2024) — but Bulldozer OS's curated GA4 metric catalog names the metric `conversions`, not `keyEvents`; build the report template around that name, not the UI label.
- **CMS traffic + forms** — the pricing page's own traffic and form-submission counts (by page, not just by form name — several forms often share a display name) measure that specific page's conversion rate directly, rather than inferring it from aggregate signups — but only once you've confirmed the page isn't sharing its form. Submission counts are pulled per form element, not per page, and the same form element sometimes serves more than one page (a shared template or symbol) — check the page list for that form element before trusting the count as the pricing page's own.
- **CRM via HubSpot** — when HubSpot is the connected CRM, deal data (closed-won/closed-lost, amount, close date) can be queried directly to check real win rate at the current price and where losses concentrate, instead of trusting sales' recollection of "we keep losing on price." HubSpot's DEAL object carries `closed_lost_reason` and `closed_won_reason` as default properties — pull those directly rather than asking sales to recall or re-tag the reason by hand. Read access depends on the client's portal scope — verify it's available before promising this in a brief.
