## Sourcing the quote and the results — never invent them

Pull the quote from a real review for this account (`bdzListReviews` filtered on the
account's own `companyId`; called without it, the same page of results can mix in
reviews from other companies under the same project) or from a recorded call (Claap).
Pull the three results from that account's own numbers, not a number that merely sounds
plausible. If neither exists yet, mark the block `[Pending — needs a sourced customer]`
and say so rather than filling it with an invented name and metric.

## On a renewal or expansion one-pager, check revenue trajectory before falling back to reviews

If the client bills through HubSpot's Commerce Hub, the deal's `SUBSCRIPTION` record
carries `hs_arr`/`hs_mrr`/`hs_status` — this account's actual revenue since signature,
not a number rebuilt from memory. It's only there if the portal actually has Commerce
Hub Subscriptions active, so check with `get_properties` before leaning on it; where it
isn't, the review/Claap route above is still the way in.

## This is the champion's tool — it only helps if a champion exists

If HubSpot is connected, check whether any contact on the deal is actually tagged
`hs_buying_role: Champion` first — a native, multi-select Contact field reps may already
be filling in. An unset tag doesn't prove no champion exists (reps skip fields), so also
check the deal's `num_associated_contacts`: staying at 1 for months in pipeline, or Claap
showing the same single voice on every recorded call, is a cheap, auto-filled signal that
the account is single-threaded either way. A sharper one-pager doesn't fix that — the fix
is flagging the risk to the rep, not writing better internal-selling copy for someone who
may not exist.
