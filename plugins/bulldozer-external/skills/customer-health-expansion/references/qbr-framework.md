# QBR Framework

## Step 4 — QBR Framework (Enterprise and Mid-Market)

**QBR cadence:**
- Enterprise accounts (top 20% by ARR): Quarterly
- Mid-market accounts (next 40% by ARR): Bi-annually (or quarterly if NRR at risk)
- SMB: Annual business review only

**5-Section QBR Structure:**

**Section 1: Business outcomes review (15 minutes)**
Not product metrics — business outcomes. "Did the customer's KPI move?" Show: the success criteria they named at purchase, the current performance against those criteria, and quantified value delivered in business terms. If you can't answer this, the QBR isn't ready. If the client bills this account through HubSpot's own Commerce Hub, pull the account's current `hs_arr`/`hs_mrr` from the subscription object before the meeting — it's what this account is actually paying today, not what it signed at close, and the two drift apart the moment a contract changes.

**Section 2: Adoption and usage analysis (10 minutes)**
Product telemetry mapped to their specific use case. Not feature activation percentages — which workflows are they using, which aren't they using, and what does each gap represent in terms of value the customer paid for but isn't capturing. Name the single highest-impact unused workflow and propose the next step to close it before the meeting ends.

**Section 3: Risks and open items (10 minutes)**
Everything that could cost the renewal, said out loud before the customer says it first: open escalations, roadmap asks that haven't shipped, champion status (still there? still engaged? still the right person to be talking to?), and any signal from the health score that dropped since the last QBR. This section only works if CS and the account team agree on the list beforehand — a QBR where the vendor is surprised by a risk the customer names is a QBR that was badly prepared.

Treat "the economic buyer hasn't been in a QBR for two cycles running" as its own line item, not something that only matters if another risk shows up. A champion who has carried the last two reviews alone, however positive those reviews were, is a single point of failure the moment they leave or get overruled — the account can look green on every dimension in Step 1 and still be one resignation away from a lost renewal. Check `hs_buying_role` on the account's contacts before the QBR, not during it — this field is what actually says who's tagged Champion, Decision Maker or Executive Sponsor today; a role that's now attached to someone new, or missing entirely, is a stakeholder change worth naming before the meeting starts, not discovering live in the room.

**Section 4: Roadmap alignment (5–10 minutes)**
Only the roadmap items relevant to this account's use case — not the company-wide roadmap deck. Map each item to a business outcome from Section 1, not to a feature name. If nothing on the roadmap moves this account's outcomes, say so rather than filling the slot with unrelated launches.

**Section 5: Commitments and next steps (10 minutes)**
Both sides leave with specific, dated commitments — not "let's stay in touch." From the account team: which of the Section 3 risks gets addressed, by whom, by when. From the customer: what they'll do to close the Section 2 adoption gap. Log every commitment against the account record so the next QBR opens by checking what was promised, not by starting from zero.

**What kills a QBR:** a deck the customer has never seen framed as a "review," no business outcome tied to a number, a champion in the room who isn't the economic buyer and can't commit to anything, and a Section 5 that produces applause instead of dates.
