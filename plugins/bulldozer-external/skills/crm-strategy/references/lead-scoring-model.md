# Lead Scoring Model

**Two-dimensional scoring: Fit (who they are) + Intent (what they've done).**

**Firmographic fit (max 50 points):**

| Criterion | Points |
|-----------|--------|
| Industry matches Tier 1 ICP vertical | +20 |
| Employee count in sweet spot range | +15 |
| Funding stage matches ICP (Series A–C) | +10 |
| Geography: target market | +5 |
| Tech stack: uses a positive-signal tool | +10 |
| Competitor customer (in stack) | -10 |
| Employee count outside range | -5 |

**Behavioral intent (max 50 points):**

| Criterion | Points |
|-----------|--------|
| Demo request / contact form | +40 |
| Pricing page view (any) | +30 |
| Pricing page view (2+ in 7 days) | +40 |
| Case study or ROI content page | +20 |
| Multiple stakeholders from same company in 7 days | +25 |
| Webinar attendance (completed) | +15 |
| Content download (relevant) | +10 |
| Unsubscribed from email | -20 |
| Competitor email domain | -50 (disqualify) |

**MQL threshold:** Composite score ≥ 65 triggers MQL lifecycle stage transition automatically.

**A manual override always exists alongside the score.** An executive referral, a warm intro from an existing customer, or a lead a founder flags directly shouldn't sit in the scoring queue waiting to cross 65 — let any rep or manager promote a contact to MQL by hand, logged with a reason. The score exists to catch what nobody would have flagged manually, not to gate what everybody in the room already knows is real.

**Check for a native intent signal before paying a third party for the same thing.** Breeze Intelligence's Intent Signals (`hs_intent_signals_enabled` / `hs_recent_intent_signals` on Company) track buying-intent behavior detected off the company's own domain — the same category Bombora or 6sense sell separately. It's a per-portal feature flag, not something HubSpot ships active everywhere: check `hs_intent_signals_enabled` before recommending a paid third-party intent subscription, and before assuming the signal exists at all. It lives on Company, so it feeds the firmographic/account layer above, not a replacement for any person-level behavioral row. The field itself is described as a rolling 30-day window — an empty list means no intent detected in the last 30 days, not confirmed disinterest; don't read an empty window the same way as a negative signal like "unsubscribed from email" above.

**Recalibrate quarterly:** Score distribution should produce 15–25% of engaged contacts reaching MQL. If MQL rate is consistently above 25%, the threshold is too low. If below 10%, it's too high. Adjust based on volume + SQL conversion rate from MQLs — treat that 15–25% range as a starting point to tune against this account's own numbers, not an industry figure: published MQL→SQL conversion benchmarks vary 3x or more across sources depending on how each one defines MQL, so none of them substitutes for this account's own funnel data. Recalibrating off a quarter with too few MQLs to begin with just fits the threshold to noise, not signal — if that quarter's MQL volume is in the low tens or less, extend the review window instead of adjusting on a small sample.
