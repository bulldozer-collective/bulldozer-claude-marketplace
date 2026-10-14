# Automation Workflow Details

## 3.1 Lead Scoring

**Check first: Marketing → Lead Scoring → Create score — and see what it actually shows on this portal, don't assume it's populated just because it's plausible.** HubSpot retired the legacy "HubSpot Score" contact property through 2025 and replaced it with a native Lead Scoring tool that builds separate Fit and Engagement scores (plus a Combined score), the exact two-dimensional model built by hand below. *(Direct WebFetch on HubSpot's own help page is still unreachable from this session — `ENOTFOUND` this pass, `EGRESS_BLOCKED` on every earlier attempt since late August 2026 — but a WebSearch this pass surfaced the page's actual wording rather than only third-party summaries: contact-level scoring is Marketing Hub only, AI-generated Fit/Engagement scores need Marketing Hub **Enterprise**, company-level scoring works on Marketing Hub **or** Sales Hub, and deal-level scoring (Sales Hub only) is limited to the Combined score. Multiple agency write-ups (not HubSpot's own docs) converge on the retirement timeline: announced Feb 18 2025, new legacy-style score properties blocked from May 1 2025, editing existing ones blocked from Jul 1 2025 (weakest-sourced date, one write-up only), and legacy scores frozen — not deleted — from Aug 31 2025. Exactly which paid tier (Starter vs. Professional) the Lead Scoring tool itself requires beyond "Marketing Hub" was not confirmed by an official source this pass — treat "Professional or Enterprise" as a plausible but unconfirmed floor, not a documented one.)*

*(A fresh read of a real HubSpot portal's contact properties — widening the keyword search past `hs_lead_score`/`hubspotscore` for the first time to also try `score`, `scoring`, `fit_score`, `engagement_score` — still found both of those exact legacy names gone, but turned up two number properties never seen on this portal before: `rise_engagement_score` ("Rise · Score engagement") and `rise_icp_fit_score` ("Rise · Score fit ICP"), both with no description, both contact-only — an equivalent search on Company properties came back empty. That shape — a bare number property per score group, no enum, contact-level only, undescribed — is consistent with output the native Lead Scoring tool would generate for a score group someone named "Rise," but it isn't proof: nothing reachable from these MCP tools can open Marketing Hub → Lead Scoring and confirm the group exists there rather than being built by a workflow or another app reusing the same naming idea. Check that screen directly on the client's own portal before citing this pattern as confirmation the native tool is active — but when checking, this is now the concrete shape to look for, not just an absence of `hubspotscore`.)*

**If the native Lead Scoring tool is available:** build the Fit and Engagement scores there directly from the attributes below instead of the manual workflow — it already handles decay and thresholds, which removes most of Phase 3.1–3.2's manual plumbing.

**A separate predictive scoring feature also exists on Enterprise** (a native "Likelihood to close" score with a tier from Very High to Low — confirmed live on a real HubSpot portal, so the fields themselves are real) but it answers a different question than Fit/Engagement scoring — who's likely to close, not who's a good fit — and third-party write-ups agree it needs a real base of closed-won history to be statistically meaningful, but disagree sharply on how much: figures seen range from a 50-contact technical floor up to several hundred for the model to actually be reliable, with no single number confirmed against HubSpot's own documentation. Read that spread as "don't trust this on a thin pipeline," not as a specific headcount to hit. A team fresh off a first CRM setup has no meaningful closed-won history yet by definition. Build the rule-based Fit + Engagement model below for the first year regardless of tier, and revisit predictive scoring once enough real deal history exists to trust it — turning it on early just means trusting a model with nothing to learn from.

**If it isn't available on this portal's tier** (or the team wants the logic visible in workflows rather than inside the scoring tool), build the model manually with a custom numeric property (do not reuse the retired "HubSpot Score" property — create a new one, e.g. `lead_score`) and workflows that add or subtract from it:

**Firmographic score attributes:**
- Industry = [ICP Industry 1]: +20
- Employee count between [X] and [Y]: +15
- Funding stage = [Target Stage]: +10
- Technology: Uses [positive-signal tool]: +10

**Behavioral score attributes:**
- Demo request form submitted: +40
- Pricing page viewed: +30
- Pricing page viewed 2x in 7 days: +40 (additional)
- Case study page viewed: +20
- Multiple contacts from same company (2+) viewed site in 7 days: +25

**MQL threshold workflow:**

Workflow trigger: Lead score (native Fit+Engagement combined score, or the custom `lead_score` property built manually) ≥ 65 AND Lifecycle Stage is Lead  
Action: Set Lifecycle Stage → MQL, Set MQL Date → today, Create task for SDR team, Send Slack notification

## 3.3–3.5 Lead routing, alert workflows, data hygiene automations

Round-robin assignment in HubSpot is not a checkbox on the record — it's a workflow action (**Rotate record to owner**, or a custom owner property) triggered when a record has no owner. It requires Sales Hub or Service Hub Professional or above.

**MQL round-robin assignment:**
Trigger: Lifecycle Stage → MQL AND Contact owner is unknown  
Action: Rotate record to owner (SDR team, balanced or random distribution)

Two limits to plan around before promising this to the team: native rotation distributes evenly (or by open-ticket/record load) across everyone on the list — there's no built-in way to weight it unevenly (e.g. 70/30 for a ramping rep) without an external tool. And it doesn't know who's out — a rep on PTO still receives their share unless someone manually removes them from the rotation list first.

**Straight round-robin is the right call at launch, and the first thing outgrown.** For a handful of reps selling the same motion with no territory or vertical split, one flat rotation list is simpler to build and simpler to explain than anything smarter, and fairness complaints are rare when everyone's pool looks the same. Don't build a territory-then-round-robin layer on day one for a small team — that's solving a problem the team doesn't have yet. The signal to add it: reps start specializing by vertical, segment, or region, or someone can point to a specific rep converting a specific lead type meaningfully better than the rotation gives them credit for. Bolt the territory layer on then, not before.

### 3.4 Alert Workflows

**Unworked MQL alert:**
Trigger: Lifecycle Stage = MQL AND Last Contacted is unknown AND Time since MQL Date > 12 hours  
Action: Slack notification to SDR team manager with contact name and MQL score

**Stale deal alert:**
Trigger: Deal in active pipeline stage AND Last Activity Date > 14 days  
Action: Task created for deal owner "No activity in 14 days — update or mark Closed Lost"

**Deal closing soon:**
Trigger: Deal Close Date within 7 days AND Deal Stage ≠ Closed Won/Lost  
Action: Slack notification to AE + manager

**Single-threaded deal alert:**
Trigger: Deal Stage = Proposal or Negotiation AND `num_associated_contacts` = 1 AND Deal Created Date > 30 days ago  
Action: Task for deal owner's manager — "Only one contact on this deal at late stage — confirm who else has been in the room"

This one catches what the required champion/economic-buyer fields in 1.2 can't: a name typed in a text field proves nothing on its own, but a deal that's been open a month with only one associated contact is single-threaded no matter what those fields say. It's a cheap, automatic backstop for a risk that otherwise only surfaces in a pipeline review — see 1.2 for why the text fields alone aren't enough.

**A sharper version of the same alert reads `hs_buying_role` instead of just counting contacts.** `num_associated_contacts` catches a flatly single-threaded deal; it says nothing about a deal with five associated contacts where none of them is tagged Champion, Decision Maker, Budget Holder, or Executive Sponsor — five names in the CRM, still no one who can move the deal. Where reps are actually populating the property (it has to be set by hand; nothing fills it automatically), gate the alert on that combination instead of the raw count: contact count above 1 AND no associated contact carrying one of those four roles.

### 3.5 Data Hygiene Automations

**Enrichment re-run trigger:**
Trigger: Company property "Last Enriched" > 90 days ago  
Action: Webhook to Clay enrichment workflow (if using Clay) or flag for manual review. HubSpot's own enrichment (Breeze Intelligence — the product formerly sold as Clearbit, which HubSpot acquired) is already built into the CRM rather than being a separate tool to connect: it's a paid, credit-metered add-on on top of an existing HubSpot subscription, not included by default and not sold as a standalone API to new customers. Check whether it's already enabled on the portal before recommending Clay as if enrichment required a third-party tool from zero.

**Contact-level refresh is a separate gap from the trigger above.** The Company trigger catches firmographic drift — it says nothing about a contact's own stale fields (a job change, a missing email or phone). If the CRM runs on Bulldozer OS, that gap has a native option too, run outside HubSpot's own workflow engine rather than as a HubSpot trigger: `bdzEnrichContact` refreshes one contact from their LinkedIn profile (job history always, email and phone only on request — and each request overwrites the existing value rather than filling only a blank one), and `bdzEnrichLeadList` does the same across a whole list, skipping any contact already refreshed in the last 7 days to avoid paying for the same lookup twice. Both need a LinkedIn URL already on the contact and the account's basic subscription tier. Point this at contact staleness before reaching for the same Clay webhook a second time.

**Closed Lost contact recycle:**
Trigger: Deal marked Closed Lost AND time since close > 180 days AND no active deal for this contact  
Action: Set Contact Lifecycle Stage back to Lead (enables future nurture)
