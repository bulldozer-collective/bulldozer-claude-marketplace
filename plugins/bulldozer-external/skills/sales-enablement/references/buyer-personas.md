## Title doesn't tell you who's who

A VP title doesn't guarantee economic-buyer authority, and the most senior person in the
room is sometimes the champion, not the buyer. If HubSpot is connected, check
`hs_buying_role` on the deal's contacts before guessing — a native, multi-select Contact
field (Champion, Decision Maker, Budget Holder, Executive Sponsor, Influencer, End User,
Legal & Compliance, Blocker, Other) reps may already have tagged. It lives on the
Contact, not the deal, so a contact working two deals at once can't carry a different
role on each there — for a role scoped to this deal specifically, that's the Contact:Deal
association label or HubSpot's Buying Groups tool (Sales Hub), not this field. Where it's
unset, confirm with a direct question ("who else needs to sign off on this before it
moves forward?") rather than assuming from the org chart. And treat a deal where
`num_associated_contacts` has stayed at 1 for months, or where every recorded call shows
the same single voice, as single-threaded regardless of title or tagged role — no
persona card fixes a deal that has never reached the actual economic buyer.

## Hand collateral over in committee order, not all at once

Once the persona table in the main skill says who's in the room, the champion's
one-pager and case study need to exist before the economic buyer asks for ROI proof, and
the technical buyer's architecture/security answers need to be in front of them before
the deal reaches legal review — not because any piece changes, only because a champion
who has to go back and ask you for the case study *after* their CFO already requested it
stalls the deal on a document that could've already existed. Build the suite in the
order the persona table's roles actually get pulled into a real deal, not in whatever
order is easiest to write first.
