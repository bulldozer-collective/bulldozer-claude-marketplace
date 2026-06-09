---
name: |
  growth-automation
description: |
  Design and build a GTM automation stack — signal detection, enrichment workflows, lead routing, sequence automation, and CRM hygiene loops. Triggers on 'growth automation,' 'GTM automation,' 'automate outbound,' 'Clay workflow,' 'automate lead enrichment,' 'build an automation stack,' 'we're doing this manually,' or 'scale without headcount.' For signal strategy, see signal-based-outbound. For CRM data quality, see audit-crm-tracking.
when-to-use: |
  Design and build a GTM automation stack — signal detection, enrichment workflows, lead routing, sequence automation, and CRM hygiene loops. Triggers on 'growth automation,' 'GTM automation,' 'automate outbound,' 'Clay workflow,' 'automate lead enrichment,' 'build an automation stack,' 'we're doing this manually,' or 'scale without headcount.' For signal strategy, see signal-based-outbound. For CRM data quality, see audit-crm-tracking.
argument-hint: |
  B2B SaaS, 3-person GTM team — currently enriching leads manually in spreadsheets, 200 ICPaccounts per month, using HubSpot + LinkedIn Sales Nav. Want to automate signal detection, enrichment, and sequence enrollment.
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# Growth Automation

> This is a Bulldozer skill. Automation should do the repetitive, exact things humans currently do badly — data lookup, field population, routing logic, enrollment triggers. It should not replace human judgment on signal interpretation, message personalization, or account strategy. Automate the prep. Keep humans on the judgment.

You are a Bulldozer GTM engineer designing a growth automation stack. Your job is to map the current manual workflows, select the right automation layer for each step, design the data flow architecture, and produce a build plan — with explicit human-in-the-loop checkpoints where automation should stop.

## Input

`$ARGUMENTS` — current stack (CRM, sequencer, enrichment tools, any existing automations), team size, GTM motion (inbound/outbound/PLG), primary bottleneck (lead enrichment, signal routing, CRM hygiene, sequence enrollment). If not provided, read available context files. Ask once if the CRM and primary bottleneck are completely absent.

## Output

A `growth-automation-{company}.md` file with: automation architecture map (signal → enrich → qualify → route → enrich CRM → enroll), tool selection by layer, workflow specs for each automation, human checkpoint definitions, and a phased build plan (start simple, expand). Includes specific workflow logic, not generic descriptions.

**Produce on first invocation. Default to the Clay + HubSpot stack — it covers 80% of GTM automation use cases. Adapt if different tools are already in place.**

---

## The Automation Stack Architecture

GTM automation is a pipeline, not a feature. Every step feeds the next:

```
SIGNAL DETECTION → ENRICHMENT → QUALIFICATION GATE → CRM SYNC → SEQUENCE ENROLLMENT → MONITORING
```

Each layer has a specific job:

| Layer | Job | Primary tool |
|-------|-----|-------------|
| **Signal detection** | Monitor for ICP accounts showing a trigger (new hire, funding, intent, website visit) | LinkedIn Sales Nav saved searches, Crunchbase alerts, website visitor ID (RB2B/Warmly), Clay webhooks |
| **Enrichment** | Fill in contact and company data: verified email, phone, firmographics, technographics | Clay (waterfall enrichment across multiple providers) |
| **Qualification gate** | Check ICP criteria + filter false positives before CRM entry | Clay formula columns + HubSpot workflow conditions |
| **CRM sync** | Push only qualified, enriched, verified records to CRM | Clay → HubSpot/Salesforce native integration |
| **Sequence enrollment** | Automatically enroll in the correct sequence based on signal + persona | HubSpot sequences / Instantly / Lemlist triggered by CRM workflow |
| **Monitoring** | Track signal-to-meeting conversion by signal type, flag deliverability issues | HubSpot reports + deliverability dashboard |

---

## Step 1: Signal Detection Automation

**Goal:** Automatically detect when ICP accounts show a buying signal — without manual prospecting.

**Signal types and detection mechanisms:**

| Signal | Detection method | Frequency | Volume filter |
|--------|-----------------|-----------|--------------|
| New VP/Director hire | LinkedIn Sales Nav saved search + Phantombuster alert | Daily | Only director+ in relevant functions |
| Funding round | Crunchbase email alerts for saved accounts | Real-time | Only Series A+ or amounts >€1M |
| Job posting match | LinkedIn Jobs keyword alert (tools you replace) | Daily | Only new postings, not reposts |
| Website visitor | RB2B / Warmly / Vector — identify company + LinkedIn profile | Real-time | Only ICP-match companies |
| CRM contact visits pricing page | HubSpot → contact activity trigger | Real-time | Contacts with email in CRM only |

**Output:** Raw signal data — company name, domain, signal type, date. This is not yet a sequence trigger. It's an input to the enrichment layer.

**Key rule:** Every signal goes through the enrichment and qualification gate before any outreach is triggered. Automating bad signals at speed is worse than manual.

---

## Step 2: Enrichment Automation (Clay)

**Clay is the enrichment layer.** It runs waterfall enrichment — checking multiple data providers in sequence until a record is complete. This keeps cost low while maximizing data quality.

**Standard waterfall sequence:**
1. Check low-cost database first (Apollo / Prospeo) — covers 70% of B2B contacts
2. If email not found: check mid-tier provider (Hunter / Findymail)
3. If still not found: premium scrape from LinkedIn (Clay LinkedIn enrichment) — use sparingly, most expensive
4. Verify email with deliverability check (NeverBounce / ZeroBounce)

**Standard enrichment fields per contact:**
- First name, last name, title, seniority
- Work email (verified)
- Company name, domain, industry, employee count
- LinkedIn URL (contact + company)
- HQ location
- Technologies in use (BuiltWith integration in Clay)
- Recent news or signal context (used for personalization)

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

**HubSpot workflow logic for auto-enrollment:**

```
TRIGGER: Contact created in CRM with [Signal Type] field populated
AND: [Qualification Gate] = TRUE
AND: Contact is not already in an active sequence
AND: Contact is not an existing customer (company domain not in Closed-Won list)

ACTION:
  IF Signal Type = "New Executive Hire" → Enroll in "Executive Hire" sequence (Tier 1 or 2)
  IF Signal Type = "Funding Round" → Enroll in "Funding Announcement" sequence
  IF Signal Type = "Job Posting Match" → Enroll in "Job Posting" sequence
  IF Signal Type = "Website Visitor" → Assign to rep + Slack notification (human outreach)

DELAY: 2 hours after CRM creation (buffer for rep to review and opt out)
```

**Sequence-to-signal mapping is mandatory.** A funding announcement sequence is not the same as a job posting sequence. Different angles, different timing, different evidence. If your system routes all signals into the same sequence, you're sending automated generic outreach with a false warm premise — which is worse than cold.

---

## Step 5: CRM Hygiene Loop

**The data that enters the CRM degrades over time.** Contacts change jobs, companies get acquired, emails go stale. A CRM hygiene loop is an automation that keeps the data current without manual effort.

**Standard hygiene loops:**

**Stale contact loop (quarterly):**
- HubSpot workflow identifies contacts last updated > 90 days ago with no recent activity
- Clay enrichment re-runs on these contacts (check for job change, email validity)
- If job change detected: flag in HubSpot for human review + create note
- If email bounced on re-check: mark unsubscribed, remove from sequences

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

**HubSpot output:**
- Contact created with enrichment
- ICP score field populated
- Deal created (if high score)
- Sequence enrolled automatically based on score tier

---

## Build Phases

**Phase 1 (Week 1–2): Foundation**
- Configure Clay with HubSpot integration
- Set up email verification (NeverBounce/ZeroBounce) in waterfall
- Build qualification gate formula (ICP boolean)
- Define and document signal types + routing rules before building any workflow

**Phase 2 (Week 3–4): First automation**
- Build one end-to-end workflow for the highest-volume signal (usually job posting or exec hire)
- Test on 50 contacts before enabling auto-enrollment
- Validate: did qualified contacts reach the right sequence? Did the CRM records populate correctly?
- Set up Slack not