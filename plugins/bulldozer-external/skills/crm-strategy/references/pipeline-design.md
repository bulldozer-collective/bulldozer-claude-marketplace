# Deal Pipeline Design

**Standard single pipeline (most sales-led B2B teams):**

| Stage | What it means | Entry criteria | Exit criteria | Required fields |
|-------|--------------|----------------|--------------|----------------|
| **Discovery** | Pain identified; fit being validated | Discovery call held | Pain confirmed + next step agreed | Pain description, champion name |
| **Demo/Solution** | Solution presented anchored to pain | Demo scheduled | Prospect acknowledges fit, requests next step | Key use cases validated |
| **Proposal** | Commercial terms in discussion | Proposal draft ready | Proposal sent + meeting scheduled to review | ACV estimate, contract length |
| **Negotiation** | Active close process | Verbal commitment or decision imminent | Signature or clear decision | Economic buyer confirmed, close date, competition |
| **Closed-Won** | Contract signed | Signed contract + payment initiated | — | Handoff doc completed |
| **Closed-Lost** | Deal dead | Decision made (chosen competitor, no decision, budget freeze) | — | **Closed Lost Reason** (required field — cannot be closed without it) |

**Attach a probability to every stage, and don't inherit the platform's install-time guess.** HubSpot's own deal-level field for this, `hs_deal_stage_probability`, is confirmed live on a real portal and described natively as defaulting to whatever probability is configured on the stage itself — a per-pipeline, per-stage setting, not a fixed platform constant. Most teams set that number once at setup off a gut feel and never touch it again. The better practice converging across 2026 RevOps guidance: after roughly a quarter of clean pipeline data, calculate the actual historical win rate at each stage from real closed deals and set the stage probabilities to match, then revisit quarterly, since win rates drift as the market, the product, or the sales process changes. The same low-volume caveat already applied to the lead scoring threshold below applies here too — recalculating a stage's win rate off a handful of closed deals fits noise, not signal; wait for enough closed deals at that stage before trusting the recalculated number over the installer default. An unexamined stage probability is the same failure mode as the "8 default lifecycle stages copied off the install screen" named above — a number that looks configured but was never actually decided.

**Pipeline discipline rules:**
- Deals advance only when exit criteria for the current stage are met — not when the rep "feels ready"
- Required fields at each stage enforced via CRM validation (HubSpot: Deal Stage Required Fields)
- A deal with no activity in 14 days triggers an automatic alert to the rep + manager
- **A pipeline is not the same thing as a segment.** If a "distinct" pipeline routinely carries only a handful of deals in a given quarter, it isn't a different sales motion — it's a filter on the main pipeline pretending to be one. Give it a picklist property (Deal Type, Segment) instead. A pipeline should only fork when the stages themselves are genuinely different, not when someone wants to slice the same stages by a different dimension. On HubSpot, the native `Deal Type` property already covers the coarsest cut of this for free — New Business vs. Existing Business by default. But "two values only" describes the shipped default, not a hard limit: `dealtype` is a portal-editable enum, and some accounts have already added their own values (Renewal, Upsell) on top of the two defaults. Call `get_properties(deals, [dealtype])` against the client's actual portal before assuming the binary — if custom values are already there, segment on them directly instead of layering a redundant custom picklist on top; only add a new property for a cut the portal's own `dealtype` genuinely can't express (renewal vs. expansion vs. cross-sell all fall under "Existing Business" on a default, unmodified portal).
