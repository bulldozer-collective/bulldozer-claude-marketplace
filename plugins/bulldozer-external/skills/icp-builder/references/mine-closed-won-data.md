# Step 1 — Mine Closed-Won Data

Pull closed-won deals from the last 18–24 months. Minimum sample: 20 deals. Ideal: 50+.

**If HubSpot is the CRM connected to this Bulldozer project, query it directly — skip the manual export.** `discover_hubspot_schema` confirms DEAL carries `hs_is_closed_won`, `dealstage`, `closedate`, and `days_to_close` as default properties — `days_to_close` is the sales-cycle-length field below, already computed, not something to calculate by hand — plus `amount_in_home_currency` for ACV. Two more default DEAL properties feed this step directly and are easy to miss: `closed_won_reason` and `closed_lost_reason` — a structured field for exactly the "what were they doing before you" / "why did this one not close" data Step 1 asks for below, and `num_associated_contacts`, a ready proxy for buying-committee size before anyone opens the deal record by hand. COMPANY carries `industry`, `numberofemployees`, `annualrevenue`, and two ICP-specific flags, `hs_ideal_customer_profile` and `hs_is_target_account`. `query_crm_data` joins DEAL to COMPANY in one query (`OBJECT.property` syntax, two associated object types max) filtered on `hs_is_closed_won = true` — the whole mining pass in one call instead of waiting on an export. Funding stage is not a default property on either object: unless the portal has it as a custom field, treat it as an enrichment gap rather than assuming the CRM already has it. Keep the manual export as the fallback — when the connected CRM isn't HubSpot, or when the portal denies read access on these objects.

Before running the query on a real client portal, confirm the property names with `search_properties` rather than assuming the list above carries over unchanged — `DEFAULT_PROPERTIES` is a curated subset of a given portal's schema, not its full list, and an admin can rename or add fields underneath it. `query_crm_data` itself stays a single, plain filter: one object type in `FROM`, the DEAL–COMPANY join only through `OBJECT.property` (never `associations.OBJECT` in `SELECT`), no `JOIN`/`UNION`/subquery, no alias, no `CASE WHEN`. That covers this mining pass and Step 4's closed-lost variant below without trouble — but it means a request that also needs a computed bucket (a deal-size tier, a calculated status) or a list filter combined with an aggregate takes a second explicit query, never one clever all-in-one call.

One more gate worth checking before leaning on this path: `query_crm_data` carries its own OAuth scope (`crm.hubsql.execute`, alongside a couple of reporting scopes) that a HubSpot connection does not grant by default — `discover_hubspot_schema` and `search_properties` can both answer normally while `query_crm_data` itself still fails with a permissions error naming the missing scope. That is not a sign the connected CRM isn't really HubSpot, or that the query above is malformed — it means the scope needs to be checked when reconnecting the HubSpot app (and if it's greyed out, a HubSpot admin has to approve it for the app before reconnecting helps anyone). Until that is sorted on the client's portal, treat the manual export as the working fallback, not just the one for a non-HubSpot CRM.

**One caution on `closed_lost_reason`/`closed_won_reason`: it's the rep who worked the deal typing their own explanation, not an independent read.** The same bias that makes CRM-coded loss reasons an unreliable input to a positioning audit applies here — a rep tends to soften the reason toward something that isn't "I lost to the champion I never got to" or inflate a genuinely lucky win into a repeatable pattern. Use the field as a starting hypothesis to sort deals for the interviews in Dimension 3, not as a fact to feed Step 2's pattern-finding untriangulated.

For each deal, tag:

**Firmographic:**
- Industry vertical (be specific — "SaaS" is not useful, "B2B sales enablement SaaS" is)
- Employee count at time of purchase
- Revenue/ARR band at time of purchase
- Geography / HQ region
- Funding stage (bootstrap, seed, Series A/B/C, PE-backed, public)
- Growth rate if available (hiring velocity as a proxy)

**Technographic:**
- CRM in use (Salesforce, HubSpot, Pipedrive, other)
- Marketing stack (HubSpot, Marketo, Pardot)
- Outbound tools (Outreach, Salesloft, Apollo, Lemlist)
- Data tools (Clay, ZoomInfo, Clearbit)
- Key integrations that made your product relevant or irrelevant

**Deal shape:**
- ACV
- Sales cycle length (days from first touch to close)
- Number of stakeholders involved (buying committee size)
- Inbound vs. outbound source
- Champion role/title
- Economic buyer role/title
- What they were doing before you — a named competitor, a spreadsheet or manual process, an incumbent tool, or active non-decision. The status quo is the most frequent "competitor" in B2B, more often than any named vendor — capture it in the deal record itself, not only in a separate competitive analysis, or Step 3's Behavioral dimension will have no data to draw on.

**Outcome:**
- Retention status today (churned, active, expanding)
- Expansion ARR if any
- Advocacy (case study, referral, NPS)
