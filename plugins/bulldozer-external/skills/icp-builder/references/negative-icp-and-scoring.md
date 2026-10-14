# Negative ICP and Scoring Rubric

A negative ICP — who NOT to sell to — is often as valuable as the positive ICP. It protects sales cycle time and reduces churn.

**Open this section with one plain-language sentence, not just the criteria below.** "We don't chase pre-Series-A companies without a dedicated ops hire" gets repeated verbatim by a rep on a call; "excludes small companies with immature operations" gets skimmed and forgotten. A negative ICP that only lives in a table is a document nobody enforces — a negative ICP that reads as something a seller could say out loud is one that actually stops a bad deal from entering the pipeline.

**If HubSpot is the CRM connected to this project, Step 1's native query extends here too.** DEAL carries `hs_is_closed_lost` as a default property right alongside `hs_is_closed_won` — the same `query_crm_data` join used to mine closed-won in Step 1, filtered on `hs_is_closed_lost = true` instead, pulls the closed-lost pool directly for the patterns below, no second manual export needed.

Build negative ICP from:
- Churned customers: what do the churned accounts have in common?
- Long closed-lost patterns: what profile consistently loses to competitors or loses to "no decision"?
- Low-ACV, high-effort deals: accounts that take as long to close as your best deals but at 20% of the ACV

**Common negative ICP patterns:**
- Too small: no dedicated budget owner, no real pain, will churn when founder runs out of time
- Too large: procurement process, legal review, 9-month sales cycle — company isn't built for it
- Wrong tech maturity: expects a feature that doesn't exist, or has outgrown the product immediately post-sale
- Wrong industry: vertical-specific compliance or workflow requirements the product can't meet
- Wrong champion: no one with budget authority supports the deal — champion is enthusiastic but powerless

**Once the negative ICP is stable, store it as an anti-persona in Bulldozer OS.** `bdzCreateProjectIcpProfile` accepts `type: PROJECT_ICP_PROFILE_TYPE_ANTI_PERSONA` alongside the ICP type itself — same object, job titles, sectors, an employee-count range, and a 1,000-character note. It's a coarser encoding than the write-up above (no technographic or situational fields), so treat it as the canonical short version other parts of the OS reference, not a replacement for this section.

**Check `bdzListProjectIcpProfiles` before creating a new one.** The object this read returns carries more than what the create call can write: beyond the two documented types, real profiles of type `PROJECT_ICP_PROFILE_TYPE_BLIND_SPOT` and `_PRESCRIBER` exist in the OS, and each profile's `attributes` field can carry revenue band, maturity, situational triggers, buyer awareness, and a tier — none of which `bdzCreateProjectIcpProfile`'s own parameters (jobs/sectors/employee range/note) can set. A project can already hold a richer auto-generated or hand-entered profile than this tool would produce; read the list first so a new call doesn't duplicate or bury one.

Create a 100-point scoring model for every prospect. Assign weights based on your closed-won correlation analysis.

| Dimension | Weight | High-score criteria |
|-----------|--------|---------------------|
| Firmographic fit | 30% | Matches Tier 1 on industry + employee band + funding stage |
| Technographic overlap | 20% | Has the 2–3 stack indicators that correlate with closed-won |
| Buying trigger (situational) | 15% | Active situational trigger present (hire, funding, growth pain) |
| Intent signals | 15% | Engaging with your content, pricing page, or competitor content |
| Economic outcome fit | 10% | Predicted ACV matches your model, implementation timeline realistic |
| Negative ICP filter | 10% | Penalize for anti-ICP attributes (wrong size, wrong tech maturity) |

Score thresholds:
- 75–100: Tier 1 — prioritize immediately, rep-led, full ABM treatment
- 50–74: Tier 2 — automated sequences, monitor for signal upgrade
- <50: Tier 3 — nurture only, not worth rep time
