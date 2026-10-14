# New Business vs. Existing Business — Leverage and Deal Type Checks

### New Business vs. Existing Business — Check the Leverage Before You Build the Ladder

If HubSpot is connected, `dealtype` (New Business / Existing Business, a native 2-value
field) tells you fast whether this is a net-new logo or a renewal/expansion on a live
account — and the two negotiations run on different leverage:

- On an **Existing Business** deal, don't re-litigate ROI from scratch with a borrowed case
  study — the buyer has already lived the value. Pull this account's actual usage and
  results (from the CRM or CS notes) and negotiate against what they've gotten, not a
  hypothetical. If the client bills through HubSpot Commerce Hub, the `SUBSCRIPTION` object
  (`hs_arr`, `hs_mrr`, `hs_status`) gives the real revenue trajectory since signature —
  check it before reconstructing the number from memory. It only carries a value when
  Commerce Hub Subscriptions is actually active on that portal; if it isn't, fall back to
  CS notes or the account's own reporting. The buyer's leverage is real too: churn risk on
  a live account often reads as more urgent internally than losing a prospect who never
  signed, so expect procurement to push harder here than on a first deal, not less.
- A discount on Existing Business isn't a one-time trade — it resets the floor the account
  will expect at the next renewal. Weigh it against that, not just against this quarter's
  number (see the multi-year renewal-economics check under Deal Protection Rules — it
  applies with more force here).
- `dealtype` only splits New Business from Existing Business — renewal, expansion, and
  cross-sell all fall under the same "Existing Business" value. If the ladder needs to
  treat a pure renewal differently from an expansion sell, read the deal's line items or a
  custom property; the native field alone won't make that distinction.
