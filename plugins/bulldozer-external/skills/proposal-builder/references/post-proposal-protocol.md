# Post-Proposal Protocol Details

## Post-Proposal Protocol

**Send the proposal in a scheduled call, never by email alone.** A proposal sent as a cold email attachment has a fraction of the close rate of a proposal reviewed together in a scheduled walkthrough. "Let me send it over and you can review" is not a close motion.

**The proposal review call structure (30 minutes):**
- 5 minutes: "Walk me through your reactions to the executive summary — does this capture what we discussed?"
- 15 minutes: Walkthrough of investment and ROI section — address questions and objections live
- 10 minutes: Timeline and next steps — "What would need to happen on your end to move forward by [close date target]?"

**Handle objections live, on the call — never let them arrive by email after the fact.** An objection typed into an email thread has no tone, no follow-up question, and no way to probe what's really behind it. If a stakeholder raises a concern during the walkthrough, treat it as the real signal it is:

1. **Acknowledge without conceding.** "That's a fair question" — not "You're right, that's a problem."
2. **Ask what's behind it.** "Is that a budget constraint, a timing constraint, or a trust-in-the-approach constraint?" The three require different answers, and guessing wrong wastes the rest of the call.
3. **Answer with the proposal, not around it.** Point back to the specific section — the ROI model, the case study, the timeline — that already addresses it. If the proposal doesn't address it, that's a gap to note for the next version, not something to improvise past.
4. **Confirm the objection is resolved before moving on.** "Does that answer it, or is there more underneath?" Moving to the next agenda item without confirming leaves the objection alive and unspoken.

**A proposal review call surfaces objections that a proposal read alone in the champion's inbox would not.** Reading a proposal in silence lets doubts sit for days before they can be understood, which is exactly the risk a scheduled walkthrough removes.

**After the call: send a one-paragraph recap within the hour**, not a re-send of the proposal. It confirms what was agreed, restates the next step and the date, and gives anyone who wasn't on the call a written summary to forward internally — this is what actually gets forwarded to the CFO, not the 15-page document.

**Silence after the call is not agreement — treat it as an open question, not a stalled deal.** A prospect who goes quiet after a proposal review has not necessarily disengaged; they may be running an internal process you can't see. Don't interpret silence as a signal to walk away, and don't interpret it as a signal to wait passively either.

**Follow-up cadence when the prospect goes quiet:**

```
Day 2 after the call: Short, specific check-in — not "just checking in."
  "Following up on [specific point from the call] — did that land with [stakeholder]?"

Day 5: Add value, don't just nudge.
  Share something new and relevant: a relevant case study, an answer to a question
  that came up, an article. A check-in with nothing new attached reads as pressure.

Day 10: Ask the direct question.
  "Is this still moving forward on your side, or has something changed?"
  A direct question that invites a real answer — including "no" — moves the deal
  out of limbo faster than another soft nudge.

Day 15+: Disengage or requalify.
  If there's still no substantive answer, stop chasing on the same cadence.
  Either the deal has gone cold — deprioritize it and revisit in a quarter — or
  something changed on their side that a fresh discovery conversation would surface.
```

**Never re-send the same proposal as a bump.** Forwarding the identical PDF with "following up on this" signals that nothing has moved since the walkthrough. If a follow-up is warranted, it should carry something new — an answer, a case study, an adjusted option — or it shouldn't be a document at all, just a question.

**Update the CRM the moment the proposal goes out, not at the next pipeline review.** If HubSpot is connected, move the deal to its "proposal sent" stage (`dealstage`) immediately, and update the deal amount if the prospect steered toward a different tier than the one first modeled. A stage that's stale by two weeks is what turns the next pipeline review (see `pipeline-deal-review`) into a guessing exercise instead of a fact-based one.

**Check the native e-signature path before reaching for an external tool.** For a standard deal priced through a HubSpot Quote, the Quote itself can carry its own e-signature flow (`hs_esign_enabled`, `hs_quote_esign_status`) — check whether it's turned on for this portal before defaulting to DocuSign or a separate contract tool. Once it's live, `hs_esign_num_signers_completed` and `hs_esign_num_signers_required` say exactly how many signatures are still outstanding — check those two fields before sending a manual "who else still needs to sign?" message, the Quote already knows. Reach for an external e-signature or CLM tool only when the agreement leaves the Quote format entirely — legal redlines, a non-standard IP clause, a paper process with multiple internal approvers — not as a reflex for every signature.

**Stop revising after two price-only rounds.** If a prospect comes back a third time asking to move the number with no new information about scope, budget, or timeline, don't write a third pricing revision — have the direct conversation instead: ask what changed, or whether the budget described in discovery still exists. A third revision on price alone usually means one of two things — the deal is negotiating against itself, or there's no real budget behind it — and a fourth version of the same document resolves neither.

**If proposals are sent through a tracked-document tool rather than a static file, use the view data — don't guess at engagement.** Interactive proposal platforms with open and section-level view analytics have become common practice for this exact reason: they tell you whether the champion actually opened the ROI section before you call, instead of you finding out live. This isn't something Bulldozer OS provides natively — treat it as an external tool choice, not a step this skill can execute on its own.
