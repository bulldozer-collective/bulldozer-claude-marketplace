## Sourcing proof points from the CRM

Before writing a placeholder number for **Proof Points** (slide 6), check the CRM for a
real one: if the project has HubSpot connected, `search_crm_objects` on `DEAL` filtered
to `hs_is_closed_won` gives real accounts, and their industry or size, to point to — a
pipeline is portal-specific, so read `pipeline`/`dealstage` on what comes back rather
than assuming a standard set of stages.

## Customization by buyer type

| Buyer | Lead with | De-emphasize |
|-------|-----------|-------------|
| Technical | Architecture, security, API, integrations | ROI calculations |
| Economic | ROI, payback period, total cost, risk | Technical details |
| Champion | Internal selling points, quick wins, peer proof | Deep technical/financial |

## New logo vs. existing account changes the opening, not just the buyer

HubSpot's native `dealtype` field ships with two default values (New Business, Existing
Business) — but that's the installer default, not a guarantee of what a given portal
actually has: `get_properties` on `deals` for `dealtype` before assuming the split is
that flat. If the client's portal still carries only the two defaults, use them
(Existing Business doesn't separate a renewal from an expansion, so treat any Existing
Business deal the same way here); if the portal already has custom values for renewal
vs. upsell, cut the opening on those directly instead of collapsing them back into one
bucket. Either way, on an Existing Business deal swap slides 1–2: don't re-argue that the
problem exists, open on the account's own usage since they signed and what more budget
buys them next. A customer sitting through the new-logo problem narrative reads it as the
rep forgetting who they're talking to.
