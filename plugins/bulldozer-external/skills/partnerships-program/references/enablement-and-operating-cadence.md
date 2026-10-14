# Partner Enablement and Operating Cadence — Detail

**Enablement curriculum (certification required before first deal registration):**

| Level | Content | Duration | Gate |
|-------|---------|----------|------|
| **Certified partner** | Product overview, ICP definition, qualification framework, demo (basic) | 4–6 hours async + 1 live session | Quiz + mock discovery call with partner success team |
| **Advanced partner** | Competitive positioning, full demo, objection handling, QBR framework | Additional 4 hours + 2 live sessions | Live deal review with partner success team |
| **Joint sales certified** | Full co-sell motion, deal registration mechanics, pricing and negotiation guardrails, escalation paths | Additional 2 hours + shadow one live deal | Co-sell one real deal to close, signed off by both account executives |

**Recertification:** annual, tied to major product releases or competitive landscape shifts — not a calendar formality. A partner who hasn't touched the updated positioning or a new feature set will misrepresent the product in front of a prospect, which costs more trust to repair than the recertification costs to run.

**Enablement content lives in one place partners can self-serve** (portal, shared drive, or wiki) — not scattered across decks emailed ad hoc. If partners have to ask "do you have the latest battle card?", the enablement program has already failed its purpose.

## Operating cadence and tracking

| Level | Frequency | Who | Answers |
|-------|-----------|-----|---------|
| **Operational touchpoint** | Weekly | Partner success manager + partner's day-to-day contact | Which registered deals moved, which are stuck, what does the partner need this week |
| **Health review** | Monthly | Partner success manager + partner's manager | Is pipeline volume on track for the quarter, are certifications current, any early churn signal |
| **QBR** | Quarterly | Partner success manager + partner's leadership | Review commitments from the last QBR (done / not done / why), walk the live pipeline deal by deal, surface blockers (missing certification, missing content, pricing exceptions), set dated commitments for next quarter |
| **Renewal conversation** | Annually | Partner leadership on both sides | Does the relationship justify renewing on current terms, upgrading tier, or exiting |

**Internal reporting mirrors the same cadence, one level up:** partner performance rolls into the regular pipeline review the sales team already runs, not a separate partnerships-only meeting that never reaches revenue leadership. If partner-sourced pipeline isn't on the same dashboard as direct pipeline, it will get deprioritized the first time direct pipeline is under pressure.

**Track deal registration and partner-sourced pipeline in the tools you already run, not a spreadsheet next to them.** Bulldozer OS itself doesn't have a dedicated partner or channel object — the closest primitive is a lead list per partner (`bdzCreateLeadList`) with the free-text `source` field carrying the partner's name, and qualification limited to three states (to review / accepted / rejected) plus a note field — there is no native A/B/C/D or tier score, so encode tier-relevant detail in the note. Lead lists don't carry deal stage or closed-won revenue: that lives in the sales team's CRM. Before wiring deal registration into HubSpot, check the deal source property actually exists — a standard HubSpot portal ships an `Original Traffic Source` property (organic search, paid search, referrals, and similar channels) but not a dedicated partner/deal-source field, so registering deals against named partners typically requires creating that custom deal property first rather than assuming it's already there. (HubSpot does have a native object literally named `PARTNER_CLIENT` — don't reach for it here, on two counts beyond the name clash. First, the relationship: it models a HubSpot Solutions Partner, such as an agency, and the sub-portals that agency manages for its own clients — not the relationship a vendor builds with its own reseller or referral partners. Wrong model for this program even where the name suggests otherwise. Second, even where the relationship matched, it wouldn't be reachable: reading the object requires the portal itself to be configured as an active HubSpot Solutions Partner account, so on a standard customer portal it won't appear as readable at all — and its default commission fields describe what HubSpot pays the agency for managing that account, not a field this program could repurpose to track what the company pays its own partners.) In practice this is usually two custom fields, not one: a category-level source picklist with its own value for partnership-sourced deals (kept distinct from outbound, paid, and organic), plus a separate free-text field naming which specific partner gets the credit — that pairing is what a tier system in Step 4 needs to attribute pipeline per partner, a single generic "referral" bucket isn't enough.
