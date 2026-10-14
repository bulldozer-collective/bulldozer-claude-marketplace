# Closing and Negotiation

## Step 6: Closing and Negotiation

Negotiation starts the moment a prospect asks for a better price or better terms — not at contract redlines. The rule that matters more than any tactic: **never give a concession without getting something back.** A price drop with nothing attached teaches the buyer that the first number was never real.

**Before any negotiation conversation:**
- Know your walk-away point and your approval ceiling before the call, not during it
- Re-confirm the economic buyer is in the room or has delegated authority — negotiating with someone who can't approve the deal wastes both sides' time
- Anchor on the value case built in discovery and demo, not on the list price — the conversation should be about the cost of the problem, not the cost of the product

**Concession menu — what to trade instead of price:**

| If they ask for | Trade for |
|---|---|
| A lower price | A longer contract term, a faster signature date, or a case study / reference commitment |
| A shorter contract | A higher price or removal of a discount tier |
| More seats at no extra cost | A named executive reference call or a co-marketing mention |
| Extended payment terms | Upfront payment on a smaller portion, or a renewal commitment in writing |

Every concession is paired with a condition, stated out loud: "I can do that if we can get this signed by [date]" — not offered unconditionally.

**Naming the tactic.** Procurement and experienced buyers run a known set of hardball moves — documented lineage (Program on Negotiation, Harvard Law School), not a rep's improvisation. Naming the tactic to yourself turns an ambush into a read:

| Tactic | What it looks like | Counter |
|---|---|---|
| Appeal to higher authority | "I love it, but I need my boss to sign off" — banks the concession already given without anyone committing back | Ask who, then offer to join that conversation directly instead of handing over another concession into a void |
| Nibbling | A small, unbudgeted ask surfaces after the deal already feels agreed ("can you throw in X") | Treat it as a new ask, not a formality — trade for it like any other concession |
| Good cop / bad cop | One stakeholder pushes hard, another later "rescues" the deal by offering a smaller ask | Negotiate the substance, not the relief of the good cop showing up — the underlying ask hasn't changed |
| Deadline / time pressure | A sudden urgency appears from the buyer's side, unconnected to anything they'd named before | Verify it's real (a budget cycle, an internal deadline) before treating it as leverage — a fabricated deadline doesn't obligate a rep to drop the price to match it |

**Confirm the economic buyer before you negotiate, not during.** The `num_associated_contacts` check from Step 2/3 applies here too — walking into a price conversation with someone who can't approve the deal wastes the round entirely. Where it's tracked, `hs_buying_role` narrows it further: a Decision Maker or Budget Holder in the room is not the same as a Champion negotiating on their behalf.

**Negotiation rules:**
1. Never negotiate against yourself — if the prospect goes quiet after a counter, wait for their response before offering more
2. Discount from the list price, never from a number you invented on the spot — an unstructured discount in the room signals the real price was always negotiable
3. Route to legal/procurement as soon as either side raises contract terms — don't let the rep freelance non-standard clauses. This should rarely be a surprise: the Paper Process row in Step 3's MEDDPICC table is meant to map security review, legal redlines and signature authority back in discovery, not leave the rep discovering a three-week procurement cycle here
4. If the prospect stalls on price after the value case has been made twice, the objection is rarely really about price — go back to discovery: what changed, or what wasn't uncovered the first time
5. Stop revising the number after two rounds without new information from the buyer. A third price draft with nothing changed on their side doesn't move a stalled deal — ask directly what's actually holding it back instead of writing another version

**Getting to signature.** For a standard deal at standard pricing — the case a HubSpot Quote already covers — check whether the Quote's native e-signature is turned on (`hs_esign_enabled`) before reaching for a separate e-signature tool. Tracked through `hs_quote_esign_status` and the Quote's own expiration date rather than a deadline invented in an email, it gets to the same signed outcome without adding a tool the buyer has to trust. Once e-signature is on, `hs_esign_num_signers_completed` against `hs_esign_num_signers_required` tells the rep exactly who's left to sign without a manual check-in email — a multi-signer deal that's stuck at 1 of 2 names the missing signer directly instead of a generic "still waiting" nudge. Reserve DocuSign or a separate contract tool for what genuinely falls outside the Quote format — legal redlines, non-standard IP terms, a paper process the Quote can't represent — not as the default reflex for every signature.
