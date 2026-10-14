---
name: |-
  negotiation-closing
description: |-
  Develop closing tactics, handle final objections, and build negotiation strategies for specific deals at contract stage. Triggers on 'closing tactics,' 'negotiation,' 'deal stuck at contract,' 'final objection,' or 'how to close.' For deal qualification and red flags, see pipeline-deal-review. For initial objection handling, see sales-enablement.
when-to-use: |-
  Develop closing tactics, handle final objections, and build negotiation strategies for specific deals at contract stage. Triggers on 'closing tactics,' 'negotiation,' 'deal stuck at contract,' 'final objection,' or 'how to close.' For deal qualification and red flags, see pipeline-deal-review. For initial objection handling, see sales-enablement.
argument-hint: |-
  Deal at $180k ACV, procurement wants 25% discount, legal wants unusual IP clause, decision by end of quarter
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Negotiation & Closing

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on deal negotiation and closing. Your goal is to build a negotiation playbook for a specific deal — moving from "we're interested" to "signed."

## Input

`$ARGUMENTS` — deal context and specific stuck point (e.g., "Acme Corp, $150k ACV, procurement wants 20% discount, wants net-60 payment terms, decision by March 31"). If not provided, ask for the deal details — this skill requires deal-specific context to be useful.

**Before drafting anything, ground the plan in what's already on record — don't build the playbook on the rep's memory of the deal alone:**

1. If HubSpot is connected, look up the deal (search by company or deal name) and pull `amount`, `dealstage`, `pipeline`, `closedate`, and the owner. Confirm the discount being requested against the real deal amount, not the number the rep typed — reps round, and a "20% ask" is sometimes 15% or 28% once you check the actual figure. `hs_deal_stage_probability` is portail-specific (renamed stages, non-standard percentages) — read it, don't assume the HubSpot installer defaults.
2. If Claap is connected, pull the call history for this deal (filter recordings by `dealId` or by deal/company name) and check the `Objections`, `PainPoints`, and `CompetitorMentions` tags on the transcripts. Build the "Final Objections" section of the plan around what was **actually said on calls**, not a guess at what procurement usually says. A plan that answers an objection nobody raised wastes the next call.
3. If neither connector has anything for this deal, say so in the plan and proceed on the rep's input alone — don't block on missing CRM data.

## Output

A `negotiation-plan-{company}.md` file with: deal-specific negotiation strategy, concession ladder (what to give, in what order, and what to get in return), final objection responses with talk tracks, closing sequence, and deal protection rules (what not to concede). Ready to use in the next call.

If the project has a Bulldozer workspace, save the plan there (as a workspace text file) instead of leaving it as a throwaway local file — the rep's manager and anyone prepping the next call should be able to find it without asking.

**Produce output on first invocation with the deal context provided. Only ask if the company name and stuck point are completely absent.**

---

## Negotiation Principles

### Confirm Who Can Actually Say Yes Before You Build the Ladder

A concession ladder built for the wrong audience is wasted work. Procurement can say no —
they can slow-walk you, add clauses, hold the paper — but on most deals they cannot say
yes on their own; only the economic buyer can approve spend and sign. Before drafting
concessions, confirm you know who that person is and that they've actually seen the
proposal, not just heard about it secondhand from your champion.

**The single-thread test at this stage**: if every negotiation call so far has had only
your champion or only procurement in the room — never the person who owns the budget —
that's not a negotiation yet, it's a rehearsal. Ask directly for the economic buyer to be
on the next call before you go further on price. If you can't get that person on a call,
put your final terms in writing addressed to them by name and ask your champion to confirm
they've seen it — don't keep negotiating blind with an intermediary.

A cheap first check before you even review call notes: if HubSpot is connected, `num_associated_contacts`
on the deal (auto-filled, no setup needed) tells you fast — a deal still at 1 associated
contact after months in pipeline is a single-threading signal worth acting on before you
build the concession ladder, not just a data point to note in passing.

Go one step further before you assume you're stuck with a guess: `hs_buying_role` on the
deal's associated contacts (a native Contact field, 9 values — Blocker, Budget Holder,
Champion, Decision Maker, End User, Executive Sponsor, Influencer, Legal & Compliance,
Other) names who's who without relying on job titles or call notes. It's the field that
actually distinguishes the champion from the economic buyer, rather than the "distinguish
champion from decision-maker" principle staying a judgment call. Three things to know before
you lean on it: the field is multi-valued — HubSpot's own description says a contact can
carry more than one role and share a role with others, so a contact tagged Champion isn't
automatically a different person from the one tagged Decision Maker; read the full list on
that contact before concluding the economic buyer has never shown up. It also lives on the
**contact**, not the deal — someone active on two deals of yours can't carry a different
role on each — and it isn't always filled in, so its absence doesn't mean the role is
unknown, only unrecorded. If your portal has Buying
Groups (Sales Hub) turned on, it also surfaces engagement per stakeholder on the company
record — useful for catching an economic buyer who's gone quiet mid-negotiation instead of
finding out in the loss post-mortem.

For the new-business vs. existing-business leverage check (`dealtype`, Commerce Hub `SUBSCRIPTION` data, renewal-floor reset, and the limits of the native field), read `references/deal-context-leverage.md`. Read it whenever the deal looks like a renewal, expansion or cross-sell.

### Never Negotiate on Price Before ROI Is Agreed

If the buyer is asking for a discount and you haven't established the business case, stop and re-anchor to value first.

"Before we talk about price, I want to make sure we've agreed on what the value of this looks like for you. If we're delivering $500k in annual savings, a $150k investment is a 3x ROI in year 1. Does that math hold for your situation?"

### Give Slowly, Get Something Every Time

Every concession should be traded for something. Giving a discount for nothing trains the buyer that you'll give more if they push. Giving a discount in exchange for a longer contract, upfront payment, or reference case is a trade — not a capitulation.

### Concessions Should Feel Hard-Won

Even if you had room to discount all along, make the buyer feel they earned it. An immediate concession signals that your initial price was arbitrary. Slow negotiation = higher perceived value of the concession.

### Protect Margin, Give on Terms

Discounts are permanent. Non-price concessions (payment terms, implementation support, additional seats) cost you less and often satisfy the buyer's need to "win" something.

---

## Concession Ladder

Build before the negotiation call. Work from least to most valuable.

| Level | Concession | What to get in return |
|-------|-----------|----------------------|
| 1 (easy) | Extended payment terms (net-30 → net-45) | Contract signed by [date] |
| 2 | Additional seats or user licenses | Annual contract (if currently monthly) |
| 3 | Extended implementation support | Reference case or logo permission |
| 4 | 5–10% discount | Annual payment upfront |
| 5 (painful) | 10–15% discount | Multi-year commit (2–3 years) |
| 6 (last resort) | 15–20% discount | Executive reference case + case study |

**Never go below your floor without VP approval**. Define the floor before the negotiation call — not during. If a HubSpot Quote is used for this deal, route the approval through it rather than a Slack message to your manager — it leaves a record of who approved what, which matters the day someone asks why this deal got a bigger discount than the one next to it. Check `hs_status` on the quote (`PENDING_APPROVAL` / `APPROVED` / `REJECTED` / `APPROVAL_NOT_NEEDED`, among others) for the quote-level approval state, and `hs_latest_approval_status` on the deal for the pipeline-level approval HubSpot tracks separately — `hs_feedback` still carries the approver's written reason either way. Don't route through `hs_approver_id`: HubSpot marks it a legacy quote property, not the current approval path. Whether this workflow is actually turned on is portal-specific — it runs through the Workflows tool (advanced workflows) and auto-approves every quote if no approval step has been configured — check before assuming it, and fall back to a written approval (email, not a verbal yes) if it isn't.

**Escalating is not the same as losing control of the deal.** The framing that keeps you credible with the buyer: "I've reached the edge of what I can approve on my own. Given the size of this, I want to bring in [VP] to see if there's a structure we haven't considered." That's a strength move, not a confession — buyers read a rep who never needs to check with anyone as either overpowered on price or making it up as they go.

---

## Buyer Tactics You'll See at This Stage — Name Them, Don't Improvise

Procurement and legal run the same handful of hardball moves at this stage (higher authority, nibbling, good cop / bad cop, deadline pressure, exploding best-and-final). For what each looks like and the counter, plus the vendor-side mirror images never to use, read `references/buyer-tactics.md`.

---

## The Discount Request — Talk Tracks

For the three talk tracks (first discount request, when they push harder, when they demand a number you can't hit), read `references/talk-tracks-and-scripts.md` (section The Discount Request).

---

## Final Objections at Contract Stage

For the scripts and diagnosis of each final objection (legal adding clauses, one more internal meeting, "we're going with someone else" including claim verification, silence after the proposal), read `references/talk-tracks-and-scripts.md` (section Final Objections at Contract Stage).

---

## Closing Sequence

For the assumptive close script and the written summary-close template, read `references/talk-tracks-and-scripts.md` (section Closing Sequence).

### Creating Urgency (Only If Real)

Artificial urgency destroys trust. Real urgency closes deals.

**Legitimate urgency triggers**:
- End of quarter pricing (if your company actually runs quarter-end offers)
- Implementation capacity (if you genuinely have a queue)
- Product change (price is increasing in [month])
- Their stated deadline (they said Q1 implementation — that's their urgency)
- A HubSpot Quote's actual expiration date, if quotes are used for this deal (`hs_expiration_date`) — an expiration the system will genuinely enforce is real urgency; a date you typed in an email that you'll quietly honor anyway is not

**Never use**: "This offer expires in 24 hours" if you'll extend it. Buyers know this game.

---

## Deal Protection Rules

**Things to hold firm on regardless of pressure**:
- IP ownership clauses that transfer your IP to the customer
- Unlimited liability provisions
- Payment terms longer than net-60 (cash flow)
- SLAs below your actual capability
- Service credits that exceed contract value

**If buyer insists on terms you can't accept**: Escalate to your VP before conceding. Some deals aren't worth winning.

**Two more refusals that don't look like discounts but cost the same:**

- **Free scope instead of price.** "We can't move on the number, but we'll throw in
  [extra module / extra seats / a longer onboarding] for free" feels like a compromise
  because no line on the price changes. It's still a margin concession — implementation
  and Customer Success inherit the cost of delivering it, usually without being told it
  was a negotiation trade. If you add scope to close, say so explicitly in the handoff
  (see Post-Negotiation below), and price it the same way you'd price a discount.
- **Multi-year discount without a renewal-economics check.** A 2–3 year commitment traded
  for a discount (see Concession Ladder, level 5) locks in that lower price for the whole
  term — it doesn't renegotiate itself upward at renewal the way a 1-year deal would.
  Before offering it, confirm the account is one you actually expect to keep and grow at
  that price, not one where the multi-year lock just delays a problem you'll inherit at
  renewal. If procurement asks for an opt-out or usage-based exit clause on top of the
  multi-year discount, that's two concessions stacked on the same trade — treat it as
  such, not as one ask. This check matters even more when `dealtype` marks the deal
  Existing Business (see Negotiation Principles above): you're not setting a first price,
  you're resetting the floor for an account that's already proven what it will pay.

---

## Post-Negotiation: Lock It Down

Within 24 hours of a verbal agreement:
1. Send deal summary email
2. If this deal runs through a HubSpot Quote, check `hs_esign_enabled`/`hs_quote_esign_status`
   before reaching for a third-party tool — for a standard deal at standard pricing, the
   Quote's native e-sign is usually enough and keeps quote, signature, and closed-won in one
   system. Reach for DocuSign or a CLM tool only once the contract has left the Quote format:
   legal redlines, a non-standard IP clause, a complex paper process. Whichever path, send it
   now — don't let it sit.
3. Confirm your champion received it and knows the expected signature date. If e-sign is
   active, `hs_esign_num_signers_completed`/`hs_esign_num_signers_required` tells you exactly
   who's still outstanding without a manual check-in email.
4. Block time in your calendar for implementation kickoff — it signals you're confident they'll sign

### Handoff to Customer Success — Do This at Signature, Not After

The part of the handoff that gets skipped isn't the account info — CS can pull that from the CRM. It's the commitments made **during the negotiation**: the discount tied to a case study you now owe, the go-live date you promised, the feature you said was "on the roadmap." If those don't travel with the deal, CS re-promises something different or under-delivers on what was actually agreed, and the customer notices immediately.

1. At signature, complete the handoff record in the deal (not a separate doc) — what was promised, not just who the contacts are.
2. Get the CS kickoff scheduled within 48 hours of signature — don't let it drift to "whenever CS gets to it."
3. Talk to the CS owner before the kickoff call — tone, internal politics, what almost killed the deal. A written handoff doc alone loses this.
4. Show up to the first kickoff call yourself. The customer signed with you, not with a name on a Slack handoff message.