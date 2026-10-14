# Custom Property Schema

**Contact properties (required):**

| Property | Type | Purpose |
|---------|------|---------|
| ICP Score | Number | Composite score (firmographic + behavioral) — drives MQL threshold |
| Persona | Picklist: Champion / Economic Buyer / Influencer / End User / Blocker | Structures multi-threaded selling + report by buying role |
| MQL Date | Date | Timestamp for funnel velocity: Lead → MQL time |
| SQL Date | Date | Timestamp for funnel velocity: MQL → SQL time |
| Lead Source Detail | Text (read-only at creation) | Campaign-level source; never overwritten after creation |
| Disqualification Reason | Picklist: Budget / Timeline / No Authority / Not ICP / Competitor / Unresponsive | Enables recycle workflows and pattern analysis |
| Sequence Name | Text | Active sequence name; prevents multi-enrollment |

**HubSpot already ships a native Buying Role property — check it before building Persona as a from-scratch custom field.** `hs_buying_role` exists out of the box on Contact, and per HubSpot's own field description contacts "can have multiple roles, and can share roles with others" — a multi-value field, not a single picklist. Its nine options (Blocker, Budget Holder, Champion, Decision Maker, End User, Executive Sponsor, Influencer, Legal & Compliance, Other) are a finer cut than this schema's five-value Persona: it splits Budget Holder from Decision Maker, where this document lumps both into a single "Economic Buyer," and adds two roles (Executive Sponsor, Legal & Compliance) that don't exist here at all. Adopt the native field instead of shipping a parallel custom one; only add a custom picklist for a role this enum genuinely can't express. One real limitation to design around, not paper over: it lives on the Contact record, so a contact working two deals at once can't hold a different role on each through this field alone. HubSpot's own answer to that is deal-scoped, not a second contact property — a Contact-to-Deal association label (e.g. a "Champion" label on that specific deal-contact pairing, shown on the contact's card on the deal) and the Sales Hub Buying Groups view, both anchored to the deal rather than the contact. Don't confuse this field with the separate native property also labeled "Persona" in the UI (`hs_persona`) — that one belongs to the Marketing Hub personas tool, ships with zero options until someone defines marketing personas in Settings, and has nothing to do with buying-committee roles.

**Deal properties (required):**

| Property | Type | Purpose |
|---------|------|---------|
| Champion | Text | Name + title of internal deal driver |
| Economic Buyer | Text | Name + title of budget owner |
| Pain Statement | Text | 1 sentence capturing the pain in the prospect's language |
| Competitor(s) | Multi-picklist | Competitors appearing in this deal |
| Signal Source | Picklist: New Hire / Funding / Job Posting / Inbound / Referral / Outbound | What triggered the deal — feeds signal-to-close analysis |
| Closed Lost Reason | Picklist: Price / Competitor / No Decision / Timing / Not ICP / Champion Left | Required before deal can be marked Closed Lost |
| Handoff Completed | Checkbox | CS handoff doc submitted before deal leaves Closed Won |

**Company properties (required):**

| Property | Type | Purpose |
|---------|------|---------|
| ICP Tier | Picklist: Tier 1 / Tier 2 / Tier 3 / Not ICP | Account-level targeting classification |
| Employee Count | Number | Sync from enrichment — firmographic scoring input |
| Tech Stack | Multi-picklist | CRM, MAP, outbound tool in use |
| Funding Stage | Picklist | Bootstrap / Seed / Series A / Series B+ / PE / Public |
| Last Enriched | Date | Triggers re-enrichment workflow if > 90 days |

**ICP Tier has a native HubSpot equivalent too — `hs_ideal_customer_profile` on Company, confirmed live on a real portal, three enum values out of the box (Tier 1, Tier 2, Tier 3) with the same meaning this document assigns them.** It only covers three of this schema's four values: there's no shipped "Not ICP" option. Check whether this portal's admin settings allow adding a fourth option to that native enum before building the custom picklist above from scratch for all four values — if the native field can take the extra option, add "Not ICP" there instead and skip the custom property entirely.

**A name in the Champion or Economic Buyer field is not proof anyone confirmed it.** A rep under quota pressure will type a plausible name pulled from a LinkedIn search rather than admit they haven't found the real budget owner. Pair both fields with a one-line evidence note — a quote, an email thread, a meeting they actually attended — rather than trusting the name alone. A field that can be filled from hope is a checkbox, not a qualification.

**Check the native contact count before auditing evidence by hand.** On HubSpot, the deal-level `Number of Associated Contacts` property (`num_associated_contacts`) is set automatically — no workflow to build, no custom field to add. A deal sitting at 1 several months into the pipeline is a single-threading signal on its own, before anyone reads a call note or checks whether the Champion/Economic Buyer fields have evidence behind them. Use it as the first, free filter; it doesn't replace the evidence check above, it just tells you where to spend the time checking it. Named-source estimates of buying-committee size all land well above 1 for a complex B2B deal — Gartner puts large-enterprise groups at 11–20 people, Forrester's 2024 State of Business Buying study at roughly 13 on average, a Forrester/6sense analysis at a median of 11.2 above $50K deals, Forrester's 2023 B2B Buying Study at 14–23 above $1M — but every one of those is an enterprise-ACV figure, not a target sized for a Series A sales-led team's typical deal. Read them as a direction (multi-threaded, not solo), not a pass/fail line to import wholesale; that's exactly why `num_associated_contacts` stays a filter to investigate, not a number with a threshold attached.

**Curate the Closed Lost Reason list before making it required, not after.** A required picklist with a vague catch-all option (a generic "Price" or "Other") ends up absorbing most of a quarter's losses — you trade a visible gap (an empty field, easy to spot and chase down) for a false sense of precision (a full field that says nothing useful). Review the distribution after the first full quarter and split whichever option is absorbing more than its share into reasons a rep can actually attribute a specific deal to.

**This is a custom property on purpose — HubSpot's native `Closed Lost Reason` field ships as free text, not a picklist.** Requiring the native field as-is doesn't produce a curated list; it produces a paragraph of unstructured prose per deal, which is worse for reporting than a messy enum because it can't be aggregated at all. Build the picklist above as its own property rather than trying to convert the native field. If a team converts the native field anyway: clear or migrate the historical free-text values first. HubSpot won't let a picklist value be set on a deal that's already closed and still carries the old free text, so every deal closed before the conversion shows the new field as required-and-empty.

**When Closed Lost Reason is Competitor, the Competitor(s) property above is what answers "which one" — resist the urge to bolt on a third field to capture the name after the fact.** A gap worth naming from a real portal built without this cross-reference in mind: reps still needed to name the competitor somewhere, so someone added a second free-text property just for that ("lost to competitor — if so, which one?") — still ungoverned text, still not something a quarterly battlecard review or a win-loss report can filter on reliably (a text search for a competitor's name catches typos and casing inconsistently at best). This schema already avoids that trap by making Competitor(s) a multi-picklist from day one. Keep it curated against the same reviewed competitor list as any other competitive reporting in the org, and a battlecards-style query ("every deal lost to Competitor X last quarter") can run directly against it instead of grepping free text.

**Every enum property above will eventually be used as a filter in a workflow or a list — hand over its stored internal value next to the label, not just the label.** HubSpot's segment/list filters match on the property's internal stored value (e.g. `tier_1`), never the display label ("Tier 1"). Feed the wrong one in and the filter doesn't error — it saves and silently matches zero records, invisible until someone wonders why a list or a routing workflow built on Disqualification Reason, Closed Lost Reason, Signal Source or ICP Tier is sitting empty. Document the internal value column alongside this schema for whoever builds the first filter on top of it.

**Naming convention (enforce this from day one):**

All custom properties use a consistent naming pattern: `[team_prefix]_[field_name]` — e.g., `mktg_iq_score`, `sales_champion_name`, `cs_health_score`. This prevents property sprawl and makes it possible to identify who owns what.
