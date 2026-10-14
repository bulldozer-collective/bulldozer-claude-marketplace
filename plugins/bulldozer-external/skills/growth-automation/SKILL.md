---
name: |-
  growth-automation
description: |-
  Design and build a GTM automation stack — signal detection, enrichment workflows, lead routing, sequence automation, and CRM hygiene loops. Triggers on 'growth automation,' 'GTM automation,' 'automate outbound,' 'Clay workflow,' 'automate lead enrichment,' 'build an automation stack,' 'we're doing this manually,' or 'scale without headcount.' For signal strategy, see signal-based-outbound. For CRM data quality, see audit-crm-tracking.
when-to-use: |-
  Design and build a GTM automation stack — signal detection, enrichment workflows, lead routing, sequence automation, and CRM hygiene loops. Triggers on 'growth automation,' 'GTM automation,' 'automate outbound,' 'Clay workflow,' 'automate lead enrichment,' 'build an automation stack,' 'we're doing this manually,' or 'scale without headcount.' For signal strategy, see signal-based-outbound. For CRM data quality, see audit-crm-tracking.
argument-hint: |-
  B2B SaaS, 3-person GTM team — currently enriching leads manually in spreadsheets, 200 ICPaccounts per month, using HubSpot + LinkedIn Sales Nav. Want to automate signal detection, enrichment, and sequence enrollment.
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - mcp__plugin_bulldozer_bulldozer__bdzListSignalTypes
  - mcp__plugin_bulldozer_bulldozer__bdzListSignals
  - mcp__plugin_bulldozer_bulldozer__bdzListSignalPersonas
  - mcp__plugin_bulldozer_bulldozer__bdzCreateSignal
  - mcp__plugin_bulldozer_bulldozer__bdzCreateLeadList
  - mcp__plugin_bulldozer_bulldozer__bdzEnrichContact
  - mcp__plugin_bulldozer_bulldozer__bdzEnrichLeadList
  - mcp__plugin_bulldozer_bulldozer__bdzGetLeadListEnrichment
  - mcp__plugin_bulldozer_bulldozer__bdzUpdateSignal
  - mcp__plugin_bulldozer_bulldozer__bdzDeleteSignal
---

# Growth Automation

> This is a Bulldozer skill. Automation should do the repetitive, exact things humans currently do badly — data lookup, field population, routing logic, enrollment triggers. It should not replace human judgment on signal interpretation, message personalization, or account strategy. Automate the prep. Keep humans on the judgment.

You are a Bulldozer GTM engineer designing a growth automation stack. Your job is to map the current manual workflows, select the right automation layer for each step, design the data flow architecture, and produce a build plan — with explicit human-in-the-loop checkpoints where automation should stop.

## Input

`$ARGUMENTS` — current stack (CRM, sequencer, enrichment tools, any existing automations), team size, GTM motion (inbound/outbound/PLG), primary bottleneck (lead enrichment, signal routing, CRM hygiene, sequence enrollment). If not provided, read available context files. Ask once if the CRM and primary bottleneck are completely absent.

## Output

A `growth-automation-{company}.md` file with: automation architecture map (signal → enrich → qualify → route → enrich CRM → enroll), tool selection by layer, workflow specs for each automation, human checkpoint definitions, and a phased build plan (start simple, expand). Includes specific workflow logic, not generic descriptions.

**Produce on first invocation. Default to Clay for signal enrichment and HubSpot for CRM — the common lean-stack pairing for 2026 GTM automation — plus a dedicated sequencer (HubSpot sequences, Instantly, or Lemlist). Clay has shipped its own native sequencer, but it currently sends only through a connected Google Workspace mailbox and covers basic step logic (no other ESP support observed yet) — not a substitute for a dedicated sequencer's broader ESP coverage and scale, so most teams still pair Clay with one; confirm Clay's current sequencer coverage with the client before assuming it's still a gap. Adapt if different tools are already in place, and check Bulldozer OS's own native signal engine first (see Step 1) before reaching for an external signal-detection tool.**

---

## The Automation Stack Architecture

GTM automation is a pipeline, not a feature. Every step feeds the next:

```
SIGNAL DETECTION → ENRICHMENT → QUALIFICATION GATE → CRM SYNC → SEQUENCE ENROLLMENT → MONITORING
```

Each layer has a specific job:

| Layer | Job | Primary tool |
|-------|-----|-------------|
| **Signal detection** | Monitor for ICP accounts showing a trigger (new hire, funding, intent, website visit) | Bulldozer OS native signals (funding, job postings) first; LinkedIn Sales Nav saved searches, Crunchbase alerts, website visitor ID (RB2B/Warmly), Clay webhooks for the rest |
| **Enrichment** | Fill in contact and company data: verified email, phone, firmographics, technographics | Clay (waterfall enrichment across multiple providers) |
| **Qualification gate** | Check ICP criteria + filter false positives before CRM entry | Clay formula columns + HubSpot workflow conditions |
| **CRM sync** | Push only qualified, enriched, verified records to CRM | Clay → HubSpot/Salesforce native integration |
| **Sequence enrollment** | Automatically enroll in the correct sequence based on signal + persona | HubSpot sequences / Instantly / Lemlist triggered by CRM workflow |
| **Monitoring** | Track signal-to-meeting conversion by signal type, flag deliverability issues | HubSpot reports + deliverability dashboard |

---

## Step 1: Signal Detection Automation

**Goal:** Automatically detect when ICP accounts show a buying signal — without manual prospecting.

**Check Bulldozer OS's own signal engine before reaching for an external tool.** `bdzListSignalTypes` lists all 32 native signal types (label, category, config parameters, credits/lead) available directly in the platform — call it first for every row below before wiring up an external alert. Two of the five detection needs already have a native match; the other three do not, and stay on the external tool.

**Signal types and detection mechanisms:**

| Signal | Detection method | Frequency | Volume filter |
|--------|-----------------|-----------|--------------|
| New VP/Director hire | LinkedIn Sales Nav saved search + Phantombuster alert (no native Bulldozer OS equivalent for a named executive) | Daily | Only director+ in relevant functions |
| Funding round | **Bulldozer OS native signal, type Fund Raising (~2 credits/lead)** — fall back to Crunchbase email alerts only for accounts the native signal doesn't cover | Real-time | Only Series A+ or amounts >€1M |
| Job posting match | **Bulldozer OS native signals, Job Offers / Recruitment Campaign / Republished Job Offers (~2-3 credits/lead)** — fall back to a LinkedIn Jobs keyword alert only if none of the three match | Daily | Only new postings, not reposts |
| Website visitor | RB2B / Warmly / Vector — identify company + LinkedIn profile (no native Bulldozer OS equivalent) | Real-time | Only ICP-match companies |
| CRM contact visits pricing page | HubSpot → contact activity trigger | Real-time | Contacts with email in CRM only |

Before creating or scoping any signal, read `references/native-signals-and-enrichment.md` (section Step 1): the native signal mechanics of `bdzCreateSignal`, the plan-tier and traffic-geography check for external identification tools, when native stops being the default (arbitrage), and lifecycle discipline (`dailyLeadLimit`, pausing, monitoring).

**Output:** Raw signal data — company name, domain, signal type, date. This is not yet a sequence trigger. It's an input to the enrichment layer.

**Key rule:** Every signal goes through the enrichment and qualification gate before any outreach is triggered. Automating bad signals at speed is worse than manual.

---

## Step 2: Enrichment Automation (Clay)

**Clay is the enrichment layer.** It runs waterfall enrichment — checking multiple data providers in sequence until a record is complete. This keeps cost low while maximizing data quality.

For the native alternative for contacts Bulldozer OS already knows (`bdzEnrichContact`), read `references/native-signals-and-enrichment.md` (section Step 2).

**Standard waterfall sequence:**
1. Check low-cost database first (Apollo / Prospeo) — covers 70% of B2B contacts
2. If email not found: check mid-tier provider (Hunter / Findymail)
3. If still not found: premium scrape from LinkedIn (Clay LinkedIn enrichment) — use sparingly, most expensive
4. Verify email with deliverability check (NeverBounce / ZeroBounce)

For the standard enrichment fields per contact, read `references/workflow-templates.md` (section Step 2).

**Qualification gate (Clay formula column):**
Build a boolean column that evaluates to `TRUE` only when:
- Email deliverability = verified
- Company employee count is within ICP range
- Industry matches ICP industry list
- Title seniority matches target persona
- Domain not in disqualification list (competitors, existing customers)

Only rows where gate = `TRUE` proceed to CRM sync.

---

## Step 3: CRM Sync

**Only qualified, enriched, verified records enter the CRM.** Unqualified records never touch CRM — they are the noise that inflates the pipeline and creates false positives in reporting.

**HubSpot sync configuration:**
- Contact created with all enriched fields populated
- Company created or matched by domain (never create duplicate companies)
- Source field: signal type (e.g., "Signal: New VP Sales hire" or "Signal: Funding round")
- Signal date: when the trigger was detected
- Enrollment status: "Pending review" until CSM/rep confirms (for Tier 1 signals)

**For Tier 1 signals (high-precision, fast-decay):** Slack notification to the owner rep immediately + contact created in CRM. Human reviews and approves enrollment.

**For Tier 2 signals (medium-precision):** Contact created in CRM + auto-enrolled in Tier 2 sequence within 24 hours. No human review required if qualification gate passed.

**For Tier 3 signals (low-precision):** Contact added to static list for monitoring. No outreach until a Tier 1/2 signal fires from the same account.

---

## Step 4: Sequence Enrollment

**Sequence enrollment is triggered by CRM data, not manual action.**

For the HubSpot auto-enrollment workflow logic (trigger, conditions, actions per signal type, delay), read `references/workflow-templates.md` (section Step 4).

**Sequence-to-signal mapping is mandatory.** A funding announcement sequence is not the same as a job posting sequence. Different angles, different timing, different evidence. If your system routes all signals into the same sequence, you're sending automated generic outreach with a false warm premise — which is worse than cold.

---

## Step 5: CRM Hygiene Loop

**The data that enters the CRM degrades over time.** Contacts change jobs, companies get acquired, emails go stale. A CRM hygiene loop is an automation that keeps the data current without manual effort.

**Standard hygiene loops:**

**Stale contact loop (quarterly):**
- HubSpot workflow identifies contacts last updated > 90 days ago with no recent activity
- For the native option to check before wiring a Clay re-enrichment webhook into the stale contact loop, read `references/native-signals-and-enrichment.md` (section Step 5).
- If job change detected: flag in HubSpot for human review + create note
- If email bounced on re-check (or the requested email lookup comes back empty): mark unsubscribed, remove from sequences

**Duplicate company cleanup (weekly):**
- HubSpot report: companies with identical domains
- Merge duplicates automatically (Clay or HubSpot native deduplication)
- Alert RevOps if merge count > 10 in a week (signals bad data entry at the source)

**Closed Lost reactivation trigger:**
- HubSpot identifies Closed Lost opportunities > 6 months old
- Clay checks for signal: new exec, funding, job posting at the account
- If signal found: create new contact task for account owner to review

---

## Step 6: Inbound Lead Automation

For teams with inbound volume, automate the lead-to-sequence path:

**Trigger:** Form submission or demo request

**Clay enrichment workflow:**
1. Form data → Clay (via Zapier webhook or native HubSpot integration)
2. Clay enriches: company size, funding stage, tech stack, ICP match score
3. Clay ICP scoring (formula column): Employee count × industry weight × tech stack bonus
4. Score > threshold → route to AE queue with enriched record + signal context
5. Score < threshold → route to self-serve sequence or product-led nurture

To calibrate the routing threshold against real outcomes, read `references/workflow-templates.md` (section Step 6).

**HubSpot output:**
- Contact created with enrichment
- ICP score field populated
- Deal created (if high score)
- Sequence enrolled automatically based on score tier

---

## Build Phases

The build runs in three phases (Foundation weeks 1–2, First automation weeks 3–4, Expand and harden weeks 5–8); do not start a phase before the previous one is complete. For the phase checklists, read `references/build-phases-and-mistakes.md` (section Build Phases).

---

## Common Mistakes

For the list of common mistakes (automating a broken process, skipping the Tier 1 human checkpoint, one sequence for every signal, scaling before the gate is proven, native-signal and enrichment pitfalls), read `references/build-phases-and-mistakes.md` (section Common Mistakes).

---

## Rules

- **Every signal passes through enrichment and the qualification gate before any outreach fires.** Automating unqualified signals at speed is worse than not automating at all.
- **Only qualified, enriched, verified records enter the CRM.** Unqualified records are noise that inflates pipeline counts and breaks reporting.
- **Sequence-to-signal mapping is mandatory.** A signal type without its own sequence gets no automated outreach until one is built — it does not fall back to a generic sequence.
- **Test on a small batch before enabling auto-enrollment for any new workflow.** 50 contacts is the standard floor from Phase 2; use a smaller number only when the total addressable volume for that signal is itself small.
- **Build one workflow end-to-end before starting the next.** A half-built signal-to-sequence pipeline for five signal types is worth less than one fully working pipeline for the highest-volume signal.
- **Tier 1 signals keep a human review step.** Precision and decay speed are exactly why the highest-value signals are not the ones to fully automate first.
- **Check `bdzListSignalTypes` before building an external signal-detection integration.** Funding round and job posting signals already have a native, credit-metered equivalent — an external tool is the fallback for the signals native Bulldozer OS doesn't cover, not the default for every row.
- **Check `bdzEnrichLeadList` before wiring the stale-contact loop to Clay.** It re-enriches an entire native lead list in one call and skips (free) any contact refreshed less than 7 days ago — reach for Clay only for contacts outside a lead list, or a field the native call doesn't cover.
- **Set a `dailyLeadLimit` on every new native signal before it goes live**, especially during Phase 2 validation — it's a cost and volume guardrail that costs nothing to set and nothing to leave in place once the workflow is proven.
- **Pause, don't delete, a native signal that needs to stop temporarily.** `bdzUpdateSignal` status changes are free and reversible; `bdzDeleteSignal` is not.
- **Calibrate any ICP-score routing threshold (Step 6) against closed-won accounts, not a round number** — see `Common Mistakes`.
- **Confirm an external tool's current plan tier and geography coverage before scoping around it, not just that Bulldozer OS lacks a native equivalent.** A vendor's free-tier feature set and coverage change over time — see the RB2B example in Step 1.
- **Confirm the client's subscription capability before proposing a native enrichment call.** `bdzEnrichContact` requires `SUBSCRIPTION_CAPABILITY_BASICS` — a plan below that tier fails the call outright, so this is a build-time check, not a runtime surprise to debug later.
- **Use the `value` from `bdzListSignalPersonas`, not its `label`, in `targetPersonas`/`deliverPersonas`.** `bdzCreateSignal` also returns 409 on a duplicate signal `name` in the project — check `bdzListSignals` before retrying a failed create instead of assuming the conflict is a platform problem.