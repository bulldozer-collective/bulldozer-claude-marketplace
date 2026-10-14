# When to Raise Prices — Signals, Strategies and In-App Subscription Rules

## When to Raise Prices

**Signals it's time:**
- Conversion or win rate meaningfully above your own historical trend (a ">40%" rule of thumb circulates in unaudited market aggregates — treat it as illustrative, not a threshold to hit)
- Churn well below your own historical trend for the segment
- Customers saying "it's so cheap"
- Competitors have raised prices
- Significant value added since last pricing change

**Price increase strategies:**
1. **Grandfather existing** — new price for new customers only
2. **Delayed increase** — announce 3–6 months out, grandfather for 90 days
3. **Tied to value** — raise price but add features simultaneously
4. **Plan restructure** — change plans entirely, allow existing customers to stay on old plan

**Selling as an in-app subscription (Apple App Store or Google Play)?** The rules above are for a direct-billed B2B relationship — a mobile subscription raised through a platform's own billing system runs on different mechanics, and Apple and Google Play are two distinct mechanisms, not one "mobile" rule. Getting either wrong misprices the increase or blindsides finance:
- **Apple** only requires the subscriber's explicit consent above a fixed threshold, in local currency, per country/region — not a universal percentage of the price. In the US, France and the UK the threshold is $5 for a non-annual subscription and $50 for an annual one; other countries have their own fixed amounts (e.g. ¥800/¥8000 in Japan). A handful of countries (Germany, Poland, South Korea confirmed) require consent for *any* increase, regardless of amount. Check the current threshold for the subscriber's country before assuming an increase is silent. Apple's revenue share on an auto-renewable subscription is not a flat cut either: it's 70% of the subscriber's first year of paid service in a subscription group, stepping up to 85% once that year is accumulated. App Store Small Business Program members get 85% from day one instead of waiting for the first-year step — but that status is conditional, not a permanent feature of being a small team: eligibility caps out at $1M of App Store proceeds (net of Apple's commission and certain taxes, combined across every developer account you control, not per app) in the trailing calendar year. Cross that cap mid-year and the standard 70/85 rate applies to sales from that point forward — the 85% floor only comes back the following calendar year if proceeds drop back under $1M. Don't pitch "small team = 85% forever" as an economic argument without attaching that ceiling. A lapse of more than 60 days separately resets the accumulated-service clock back to 70%. Model any iOS subscription price-increase economics against this 70/85 step and its cap, not a fixed commission rate.
- **Google Play has no currency threshold at all** — by default every price increase is opt-in, full stop, with no "small enough to be silent" amount the way Apple has. The subscriber must explicitly accept the new price; if they don't act by the renewal it would first apply to, Google Play automatically cancels and expires the subscription — it does not quietly keep billing the old price. An opt-out path (advance notice only, no explicit action required) exists in some countries, but only within limits on increase size/frequency and developer eligibility — treat it as an exception to confirm per market, not the default to plan around. Since Play Billing Library 9.0 (May 2026), Google Play can render the opt-in consent prompt itself as in-app messaging (shown from the first day the subscriber can accept it, at most once every 7 days) instead of requiring a custom-built consent screen. Google Play publishes no equivalent of Apple's 70%/85% revenue-share step — never carry that Apple mechanic over to an Android P&L. A product sold on both stores needs two separate price-increase playbooks, not one.
