# Partner Tiering and Deal Registration — Detail

**Tier criteria (assign weights):**
- Partner-sourced qualified pipeline (last 12 months) — 40%
- Closed-won revenue from partner deals (last 12 months) — 30%
- Active certifications (sales + product) — 15%
- Joint customer satisfaction on partner-managed accounts — 15%

**Never tier on:** Training completions without evidence of selling, number of registered employees, events attended, or other inputs with no output correlation.

**Tier benefits (make benefits reduce cost to sell, not just signal status):**

| Tier | Benefits |
|------|---------|
| **Gold** (top 20% by pipeline + revenue) | Dedicated partner success manager, prioritized SE support for joint deals, co-marketing budget, fast-track deal registration (24h), access to roadmap briefings |
| **Silver** (next 30%) | Pooled partner success team, standard SE support, deal registration (48h), joint case study eligibility |
| **Bronze** (remainder) | Self-serve portal access, standard deal registration (72h), quarterly webinar updates |

**Offboarding is part of the tier system, not an exception to it.** A partner who has fallen below Bronze criteria for two consecutive QBRs, despite an enablement fix agreed at the first one, is not a training problem anymore — it's a fit problem. The deciding question is whether the fix agreed at the first QBR (new content, a re-certification, a named champion on their side) was actually delivered and pipeline still didn't move: if it was and nothing changed, offboard; if it was never delivered, that's a capacity conversation with the partner, not a reason for a third chance on the same terms. Either way, exit gracefully — clear notice, honor in-flight registered deals through their protection window, no public callout. Every partner still in the program is watching how the ones who leave are treated.

**Partner submission (required fields):**
1. Target account name and website
2. Primary contact: name, title, email
3. Use case or trigger (what problem / what prompted them to look)
4. Dated next step (meeting scheduled, intro agreed — not "plan to reach out")
5. Partner's role in the deal (referral only, or staying involved)

**Your team's review process (48-hour SLA — the default before tiering exists; once Step 4's tiers go live, the tier-specific SLA there replaces this baseline for tiered partners):**
- Verify account is not in existing direct pipeline or CRM
- Verify contact is not already in an active conversation with your sales team
- Confirm account fits ICP criteria
- Approve or reject with explanation

**Registration is a source tag, not a qualification.** Approving a registration protects the partner's claim to the account — it does not mean the deal is real pipeline yet. The registered contact still has to clear the same bar as any other lead before it counts in forecast: is there a champion, and is there a named or nameable economic buyer? A partner who registers a logo with no identified buyer has flagged an account worth working, not delivered a qualified opportunity. Treat it accordingly in pipeline reviews — same test as a direct-sourced lead, not a lighter one because a partner brought it.

**This test doesn't end at registration — apply it every review cycle the deal stays open.** A partner-sourced deal that survives several pipeline reviews without ever surfacing a named economic buyer is single-threaded through the partner relationship instead of yours, and it dies the same way any single-threaded deal dies: late, and without warning. If the CRM is HubSpot, check `hs_buying_role` on the deal's associated contacts first — it's a native enum (Champion, Decision Maker, Budget Holder, Economic/Executive Sponsor, among others) that says directly who's been tagged beyond Champion, instead of inferring it from headcount. Two caveats, not one: it's multi-select — HubSpot's own description says a contact "can have multiple roles, and can share roles with others" — so a contact tagged Champion can also be the Budget Holder on the same deal; don't read the Champion tag as ruling out that an economic buyer has already been identified. And the field is scoped to the Contact, not the deal — a contact active on two deals can't carry a different role on each — so if you need the distinction tracked per deal, that's the Contact:Deal association label or HubSpot's Buying Groups tool (Sales Hub Enterprise). Where the field isn't populated, the number of contacts associated with the deal is still a cheap fallback screen before reading call notes — a partner-sourced deal still sitting on one associated contact after more than a review cycle or two in pipeline is worth a direct question to the partner (who else have you actually talked to?) before it reaches forecast.

**Conflict resolution rules:**
- Partner-registered deal vs. direct prospect already in pipeline: notify partner, honor existing direct relationship, offer goodwill gesture (MDF credit)
- Two partners register the same account: first-to-register wins, notify second partner within 24 hours
- Partner-registered deal where you initiated the contact first: your deal, partner receives nothing — communicate this clearly in the program agreement to prevent disputes
