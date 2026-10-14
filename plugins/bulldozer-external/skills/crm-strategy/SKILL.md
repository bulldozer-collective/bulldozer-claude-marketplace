---
name: |-
  crm-strategy
description: |-
  Design CRM architecture for a B2B GTM team — lifecycle stage map, deal pipeline design, custom property schema, lead scoring model, and team ownership rules. Triggers on 'CRM strategy,' 'CRM architecture,' 'design our CRM,' 'lifecycle stages,' 'how should we structure our pipeline,' 'lead scoring model,' 'our CRM is a mess,' or 'we need to redesign HubSpot.' For CRM setup and configuration, see crm-setup. For data quality audit, see audit-crm-tracking.
when-to-use: |-
  Design CRM architecture for a B2B GTM team — lifecycle stage map, deal pipeline design, custom property schema, lead scoring model, and team ownership rules. Triggers on 'CRM strategy,' 'CRM architecture,' 'design our CRM,' 'lifecycle stages,' 'how should we structure our pipeline,' 'lead scoring model,' 'our CRM is a mess,' or 'we need to redesign HubSpot.' For CRM setup and configuration, see crm-setup. For data quality audit, see audit-crm-tracking.
argument-hint: |-
  Series A SaaS, sales-led, 6-rep team — HubSpot. No real lifecycle stage logic, 4 ad-hoc pipelines, lead scoring doesn't exist. Redesign before scaling to 12 reps.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# CRM Strategy

> This is a Bulldozer skill. A CRM that grew by accident — where each new rep or campaign added fields and stages without a plan — becomes the single biggest reporting liability in the GTM stack. You can't measure what's inconsistently defined. Design before you build.

You are a Bulldozer RevOps operator designing CRM architecture. Your job is to define the lifecycle stage map, deal pipeline structure, custom property schema, lead scoring model, and team ownership rules — in a format that produces trustworthy reporting and scales to 3x headcount without a rebuild.

## Input

`$ARGUMENTS` — CRM platform (HubSpot / Salesforce / other), GTM motion, team size, current stage (scaling, rebuilding, or greenfield), key reporting questions leadership needs answered. If not provided, read available context files. Ask once if the CRM platform and GTM motion are completely absent.

## Output

A `crm-strategy-{company}.md` file with: lifecycle stage map (7 stages with triggers, owners, SLAs), deal pipeline design (stages with entry/exit criteria), custom property schema (required fields per object), lead scoring model (firmographic + behavioral), team ownership rules, and a naming convention standard. A design document — ready to hand to the person who will configure it.

**Produce on first invocation. Prioritize the lifecycle stage map and deal pipeline — these are the load-bearing decisions. Everything else follows.**

---

## Why CRM Architecture Fails

Most CRM problems are not data problems — they're design problems. Specifically:

1. **Lifecycle stages copied off the install screen, with no logic behind the moves.** HubSpot ships 8 default `lifecyclestage` values, not 5 — Subscriber, Lead, MQL, SQL, Opportunity, Customer, Evangelist, Other. The gap isn't a missing downstream stage (Customer is already there); it's that nothing HubSpot ships moves a contact between them automatically. Teams leave every transition as a manual field edit, so "MQL" ends up meaning whatever the last rep who touched the record decided it means.

2. **Multiple overlapping pipelines.** Teams create pipelines for every sub-process (outbound pipeline, inbound pipeline, enterprise pipeline, partnership pipeline) without defining what makes them different. Reports aggregate nothing.

3. **Manual stage updates.** Stages that are set by the rep, not triggered by a workflow, produce inconsistency. Different reps define "SQL" differently.

4. **No required fields at key transitions.** A deal can advance to Proposal without confirming the economic buyer. The pipeline looks full; it's not real.

5. **Required fields that only pay off in a dashboard, never in the rep's own day.** A field that exists purely so leadership can build a report gets faked — a champion name typed from a LinkedIn search, an economic buyer guessed, a pain statement copy-pasted across five deals. Every required field needs an honest answer to "what does the rep filling this in get back" (a faster handoff, a better-routed lead, a forecast conversation nobody argues with) — if the only answer is "a chart", expect the field filled with noise, not truth.

---

## Step 1: Lifecycle Stage Map

The lifecycle stage map is the single most important architectural decision. It defines the buyer journey from first contact to customer — and assigns ownership and SLA at each step.

**Standard 7-stage map for B2B SaaS (sales-led):**

| Stage | Definition | Trigger (workflow, not manual) | Owner | SLA |
|-------|-----------|-------------------------------|-------|-----|
| **Subscriber** | Opted into a form, newsletter, or download — no qualification | Any form fill where company data is unknown | Marketing (automated) | Scoring run within 24h |
| **Lead** | Contact data captured; ICP fit at firmographic level | Company enriched + employee count / industry matches ICP | Marketing automation | Lead score applied within 24h |
| **MQL** | Meets ICP fit AND behavioral intent threshold | Lead score crosses defined threshold (firmographic + behavioral) | Marketing → SDR handoff | SDR contact within 12h |
| **SAL** (Sales Accepted Lead) | SDR reviewed and accepted the handoff | SDR marks "Accepted" in CRM; prevents leads disappearing without accountability | SDR | Discovery call booked within 48h |
| **SQL** | Pain confirmed, fit validated, next step agreed | Discovery call held; MEDDPICC minimum fields completed in deal | AE | Opportunity created within 24h of qualification |
| **Opportunity** | Active deal with budget owner identified | Deal created by AE; required fields: champion, budget range, decision timeline | AE | Stage-specific SLAs per pipeline |
| **Customer** | Contract signed; paying | Closed-Won status in deal; CS handoff documented | CS | Kickoff scheduled within 48h |

**Critical rules:**
- Lifecycle stages are set by **workflow trigger**, never manually. The moment a stage requires human action to set, it drifts.
- Every stage transition has a **timestamp field** (MQL Date, SQL Date, Opportunity Created Date). These enable funnel velocity reporting.
- The SAL stage exists specifically to create accountability at the marketing-to-sales handoff. Without it, MQLs that aren't worked disappear silently. It only earns its keep when the SDR and the AE are different people — on a small team where one rep does both jobs, "SDR marks Accepted" is the same person accepting their own handoff, friction with no accountability gained. Collapse MQL straight into SQL until the team is large enough to actually split the roles.
- HubSpot's native Lead Status field has no built-in value for "SAL" or "Accepted" — its eight default options run from New to Bad Timing, none of them a marketing-to-sales handoff state. Track SAL as a custom Lead Status value or its own property; don't assume the label exists in the CRM just because the concept is standard practice.
- **Check whether this portal's Sales Hub plan includes the native Leads object before building that custom Lead Status value — it may be the better fit for SAL, not something to route around.** `LEAD` is a separate object from Contact, with its own pipeline and a fixed four-state model (New, In Progress, Qualified, Unqualified); landing in "In Progress" already signals someone is working it, closer to SAL's intent than a bolted-on Contact field. Verify first: the connector has permission to read/write Leads (not granted by default on reconnection), the tier ships the feature, and whether a Lead here should scope to the contact or the primary company. Absent any of those, the custom Lead Status value above remains the right fallback — and if both run side by side, pick one as the single source of truth for the SAL timestamp rather than letting the Lead's own stage-change date and the custom MQL/SQL Date properties report two different velocity numbers for the same handoff.
- **SQL's "MEDDPICC minimum fields" is only a real gate if those fields exist and are required somewhere in the schema.** MEDDPICC is a genuine, named methodology — the eight-element evolution of MEDDIC (Metrics, Economic Buyer, Decision Criteria, Decision Process, Paper Process, Identify Pain, Champion, Competition) that Force Management, one of the two firms most associated with teaching it, documents as adding Paper Process and Competition to the original to reflect procurement bureaucracy and competitive dynamics in real B2B deals; a 2026 US federal court ruling further confirmed the term as generic and free for anyone to use, not a licensed methodology name. But naming it isn't gating on it: Step 3 below only turns four of the eight letters into deal properties (Champion, Economic Buyer, Pain Statement, Competitor(s)). If the team isn't also building Decision Criteria, Decision Process and Paper Process as their own fields, don't gate SQL on "MEDDPICC" generally — gate it on the specific properties that actually exist, or the SQL bar is a name on a slide, not a check the CRM enforces.

---

## Step 2: Deal Pipeline Design

**One pipeline per distinct sales motion.** "Distinct" means different qualification criteria, different stage progression, or different deal economics — not different lead sources.

For the standard single-pipeline stage table (entry criteria, exit criteria, required fields per stage), the stage-probability guidance and the pipeline discipline rules, read `references/pipeline-design.md` before designing or auditing a pipeline.

---

## Step 3: Custom Property Schema

Properties should answer the questions leadership cares about. Every property you add either feeds a report or doesn't belong.

For the contact, deal and company property tables (name, type, purpose), the notes on HubSpot native equivalents, the evidence checks on Champion / Economic Buyer, the Closed Lost Reason curation rules and the naming convention, read `references/property-schema.md` before specifying any property.

---

## Step 4: Lead Scoring Model

**Confirm what's active on this portal before assuming the manual build below is redundant.** HubSpot's Marketing Hub Professional/Enterprise ships a native Lead Scoring tool that, on paper, separates a fit score from an engagement score with positive/negative point rules, a configurable threshold, and decay over time — the same two-dimensional model this step builds as custom properties. But whether it's actually configured and populated varies by portal: check that the fit and engagement properties exist and carry real values on this account (Marketing > Lead Scoring) before treating it as already covering the model below — plenty of portals have the tier available and have never touched the feature. What's reliably native and checkable directly on a contact record is a different, separate feature: predictive scoring (Enterprise tier, requires 200+ closed-won contacts), which exposes a likelihood-to-close percentage and a tier from Very High to Low. That answers "who's likely to close soon," not "who fits the ICP and shows intent" — it isn't a substitute for the model below even on a portal where it's confirmed active.

For the two-dimensional scoring model (firmographic fit table, behavioral intent table, MQL threshold, manual override, quarterly recalibration), read `references/lead-scoring-model.md` before building or tuning a score.

---

## Step 5: Team Ownership Rules

**Every object in the CRM has a defined owner. No orphaned records.**

For the default-owner table per CRM object and the assignment discipline rules, read `references/ownership-rules.md` before defining routing or reassignment.

---

## Common Mistakes

- **Building the pipeline before the lifecycle stage map.** The pipeline only works if "SQL" already means the same thing to everyone entering it. Reversing the order produces a pipeline that reports beautifully on something nobody agreed the definition of.
- **Letting reps set stages manually "just this once."** The exception becomes the norm within a quarter, and the funnel velocity report becomes fiction.
- **Scoring on firmographics alone, or intent alone.** Firmographic-only scoring flags companies that will never buy soon; intent-only scoring flags freemium tourists and competitors researching you. Both dimensions are required.
- **Treating the naming convention as optional.** A property schema without an enforced prefix convention degrades within two quarters — someone will always add `Champion_Name_2` because they couldn't find `sales_champion_name`.
- **No owner of "unassigned."** Every stage needs someone accountable for records that haven't been claimed yet, or they sit invisible until a QBR surfaces them.
- **Adding a required field that only feeds a dashboard.** If the rep filling it in gets nothing back for it — no faster handoff, no better lead, no easier forecast conversation — expect it filled with whatever keeps the deal moving, not the truth.
- **Making a loss reason mandatory before anyone has looked at the list of reasons.** A vague catch-all option absorbs most of the losses within a quarter, and a full field hides exactly the data problem an empty one would have surfaced.

---

## Quality Checklist

Before handing this document to whoever configures the CRM, confirm:

- [ ] Every lifecycle stage transition is triggered by a workflow condition, not a field a human sets by hand
- [ ] Every pipeline stage has both entry and exit criteria, and at least one required field enforced at that stage
- [ ] Every custom property maps to a named report or decision — if it doesn't, it's cut
- [ ] The lead scoring model's MQL threshold has a stated recalibration cadence and the target MQL rate range
- [ ] Every object type has a defined default owner and a documented reassignment trigger — no object is owned "by whoever gets to it"
- [ ] The naming convention is written down and applied to every property in this document, not just new ones going forward
- [ ] Closed-Lost cannot be set without a reason; Closed-Won cannot exit the pipeline without a CS handoff flag
- [ ] Each required property reports its fill rate (% of records actually populated), not just whether the field exists — a field nobody fills in stays invisible until someone thinks to ask that specific question

## Rules

- Lifecycle and pipeline stages are set by workflow trigger, never by manual field edit — the moment a stage requires a human to remember to set it, it drifts.
- One pipeline per distinct sales motion — different qualification criteria or deal economics, not different lead source.
- Every property earns its place by feeding a specific report or making the rep's own job easier; a property that does neither gets removed, not archived "just in case" — and one that does the first but not the second gets filled with fiction.
- Ownership follows a rule (rotation, territory, tier), never first-claim — and every reassignment leaves a trace.
- Recalibrate the lead scoring model against real SQL conversion every quarter. A score that was right at launch is not right forever.
- This document describes the target architecture. Building it in the CRM tool itself — the fields, the workflows, the permission sets — is a separate step; do not skip validating it end-to-end before rolling it out to the full team.