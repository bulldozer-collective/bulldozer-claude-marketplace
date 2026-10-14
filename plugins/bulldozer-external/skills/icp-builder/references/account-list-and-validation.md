# Target Account List and ICP Validation Test

From the ICP definition and scoring model, generate the target account list:

**Tier 1:** Tight ICP fit + active signal. Full ABM treatment — personalized outreach, direct content, rep ownership. Size it to what reps can actually work by hand, not to a round number — a Tier 1 list too large to personalize defeats the point of having one.

**Tier 2:** Strong ICP fit, no active signal yet. Monitored — route to Tier 1 the moment a signal fires. Eligible for automated sequences. Several times the size of Tier 1.

**Tier 3:** Broad ICP fit. Programmatic nurture only. Upgrade to Tier 2 on engagement. The largest tier by an order of magnitude — this is the pool the other two get promoted from, not a list anyone works directly.

This rep-led / automated / programmatic three-tier structure traces back to early ABM frameworks (ITSMA, SiriusDecisions). The exact account-count ranges per tier vary from source to source and don't agree with each other even within current material — size each tier to your own sales capacity and ICP pool rather than importing a fixed range from a blog post.

**Building the list inside Bulldozer OS:**
1. `bdzCreateLeadList` — one list per tier.
2. `bdzSourceLeadList` (type `LEAD_SOURCE_TYPE_FIND_PEOPLE`) — populates it, but read the filter set precisely: `findPeopleJobTitle`, `findPeopleCompanyDomain`, `findPeopleCompanyLinkedinUrl`, `findPeopleLocation`, and `findPeopleKeyword` are the only targeting filters, and `findPeopleSize` caps how many results one call returns — it is not an employee-count filter. The OS has no native filter for employee-count band or industry sector: the firmographic screen (Dimension 1) has to happen before this step — from the closed-won mining's account list, from an external firmographic source, or by pointing `findPeopleCompanyDomain`/`findPeopleCompanyLinkedinUrl` at accounts already identified as Tier 1/2 by name.

   A third implemented source on the same tool, `LEAD_SOURCE_TYPE_LINKEDIN_POST_REACTION`, sources a list from the reactors of one named LinkedIn post URL instead of a firmographic filter. It's the OS-native match for a Dimension 4 situational trigger that is itself a specific public post — a competitor's launch announcement, an industry report, a founder's own content — rather than a generic firmographic match: the people reacting to that exact post are showing the behavioral signal directly, not just fitting a filter that resembles it. Same credit metering as `FIND_PEOPLE`.
3. `bdzUpdateLeadListLead` — tier each result. Same ceiling as the scoring rubric above: only three states (`LEAD_MEMBERSHIP_STATE_TO_REVIEW` / `_ACCEPTED` / `_REJECTED`) plus a 2,000-character note, no native numeric score field. Encode the Step 5 score and tier in the note (for example `T1 — 82 pts`); reserve `ACCEPTED` for accounts that cleared Step 5, `REJECTED` for accounts that scored anti-ICP.
4. `bdzListLeadListLeads` (filtered by `state`) — reads a tier back.

**External sources for what the OS doesn't screen natively** — employee-count and industry filtering at the market level, funding and headcount-growth data, technographic profiling by tech stack:
- LinkedIn Sales Navigator (firmographic + technographic filters) — solid for that base filter, but weaker than the alternatives below on account-level intent signal
- Apollo or ZoomInfo (firmographic + email enrichment, and — more than Sales Navigator — intent data at the account level)
- BuiltWith (technographic filtering by tech stack — sees public-facing web tech only, not backend or intent; pair with another source for deeper stack coverage)
- Crunchbase (funding stage + headcount growth)
- Clay (enrichment + waterfall automation across providers)

Before declaring the ICP final, run this test:

1. Apply the ICP filter to your current open pipeline. Do the highest-scoring accounts convert at a higher rate than the rest?
2. Apply the ICP filter to the last quarter's closed-lost deals. Do low-scoring accounts appear disproportionately in closed-lost?
3. Ask 3 sales reps: "Does this ICP definition describe the deals you find easiest to close?" If the answer is no — the ICP was built from data but doesn't match lived sales experience. Re-interview them for the pattern the data missed — a champion trait, a workflow trigger, an objection they hear every time — and fold it into Dimension 3 or 4 before publishing. Data tells you what happened; reps tell you why.
4. Score last quarter's expansion and renewal accounts with the same rubric, not just new logos. An ICP tuned only on first-sale data can point sales at accounts that close but don't stick. Anything that scores high on acquisition and low on retention belongs in the negative ICP, not the target list.

If all three checks hold, publish the ICP and the target account list. If any one fails, the ICP isn't done — go back to Step 2 with the new information and re-cut the pattern. An ICP is a hypothesis until it survives contact with real pipeline data, closed-lost data, and the sales team saying it matches what they're actually seeing.

Re-run this test every time the closed-won pool grows by another 20–30 deals, or at least once a quarter — whichever comes first. An ICP built on last year's buyers can miss a shift already underway in who's actually closing.

**Don't wait for either of those triggers if a faster one shows up first.** Two consecutive months of declining win rate inside Tier 1, or the same new situational trigger appearing in three closed-won deals in a row that Dimension 4 doesn't already name, both mean the pattern has already moved — the quarterly cadence is a ceiling on how long you go without checking, not a floor on how soon you're allowed to.
