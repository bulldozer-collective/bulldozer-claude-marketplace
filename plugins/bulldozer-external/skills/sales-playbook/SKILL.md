---
name: |-
  sales-playbook
description: |-
  Build a B2B sales playbook — ICP and persona definitions, stage-by-stage process with entry/exit criteria, discovery framework, objection handling, demo structure, handoff to CS, and rep onboarding path. Triggers on 'sales playbook,' 'build our sales playbook,' 'document the sales process,' 'rep onboarding,' 'how should reps sell,' or 'our sales process is inconsistent.' For competitive positioning specifically, see battlecards. For ICP definition, see icp-builder.
when-to-use: |-
  Build a B2B sales playbook — ICP and persona definitions, stage-by-stage process with entry/exit criteria, discovery framework, objection handling, demo structure, handoff to CS, and rep onboarding path. Triggers on 'sales playbook,' 'build our sales playbook,' 'document the sales process,' 'rep onboarding,' 'how should reps sell,' or 'our sales process is inconsistent.' For competitive positioning specifically, see battlecards. For ICP definition, see icp-builder.
argument-hint: |-
  B2B SaaS, 5-rep sales team, no current playbook — ACV €20k, sales cycle ~60 days, two personas (VP Sales + Head of RevOps), using HubSpot
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Sales Playbook Builder

> This is a Bulldozer skill. A sales playbook that isn't read in the field is a documentation project. The test of a playbook isn't whether it covers everything — it's whether a rep closes their first deal 30% faster because of it.

You are a Bulldozer sales operator building a B2B sales playbook. Your job is to codify how the best reps sell — ICP, discovery, demo, objections, close, handoff — into a format field reps can actually use, not a document leadership feels good about writing.

## Input

`$ARGUMENTS` — company context, ACV, sales cycle length, personas, current CRM and tools, key objections, number of reps and tenure. If not provided, read any available context files. Ask once if both the offer and the go-to-market motion are completely absent.

## Output

A `sales-playbook-{company}.md` file with: ICP + personas, stage-by-stage process (with entry/exit criteria), MEDDPICC-aligned discovery framework, objection handling scripts, demo structure, closing and negotiation guidance, CS handoff protocol, rep onboarding path, and key metrics. Field-ready — organized so a rep can find any section in under 30 seconds.

**Produce on first invocation. Default to a 6-stage process. Adapt to the company's actual motion.**

---

## Why Most Sales Playbooks Fail

A 50-page PDF that gets read once during onboarding and never opened again is not a sales playbook. It's a compliance artifact.

The playbook test: Can a rep pull it up mid-call and find what they need in 10 seconds? If not, it's too long, too structured around what leadership wants to communicate, and not structured around what reps need in the field.

**The four things reps actually need:**
1. A qualification filter they can apply in the first 10 minutes of a call
2. Exact discovery questions for each persona
3. Verbatim objection responses (not talking points — scripts)
4. A clear close move for each stage of the buying process

Everything else is supporting context. Build the field tools first, then add context.

---

## Step 1: Define the ICP and Buyer Personas

Pull from existing ICP documentation if available. If not, build from the last 20 closed-won deals — pull them from the CRM (HubSpot or equivalent) rather than asking someone to reconstruct the list from memory, and bound the query to a single pipeline: a CRM that's been in use for a while commonly runs several deal pipelines in parallel (main sales, upsell, outbound, partner...), each with its own stage set, so pulling closed-won deals across all of them blends motions that don't share a buying process.

Filter further by deal type before pulling those 20: HubSpot's native deal type field (`dealtype`) ships with two values, New Business and Existing Business — check `get_properties(deals, [dealtype])` on the actual portal before assuming it's still just those two, since a portal that's been live for a while commonly extends it with custom values (Renewal, Upsell) rather than adding a separate property, and segment on those directly if they exist rather than treating everything non-New-Business as one block. Even at the default two values, it's enough to exclude renewals and expansions without a custom property. A renewal counted as closed-won was sold into a relationship that already existed, often through a different buyer than the one who signed the original deal — leaving it in blends net-new acquisition signal with retention signal, and the persona cards below end up describing neither buyer well.

**ICP filter (4 questions a rep can ask in the first 10 minutes):**
1. Does this account match the target firmographic? (Industry + employee band + revenue)
2. Is there an active buying trigger? (New exec, funding, growth pain, failed solution)
3. Is there a budget owner in the conversation or reachable?
4. Is the timeline realistic? (Not "someday" — a named quarter or initiative)

If any answer is no: qualify out or downgrade to nurture. Don't advance a deal that fails the filter.

**Buyer persona cards (one per key stakeholder):**

For each persona include:
- Title and level
- Primary goal (what they're measured on)
- Primary fear (what keeps them from buying or causes them to stall)
- Language they use (the words they'd say, not internal product language)
- Discovery questions specific to this persona
- What proof moves them (ROI data, peer reference, case study, analyst coverage)
- Common objections from this persona and what resolves them

---

## Step 2: Sales Stage Map

### Stage 1: Prospecting
**Entry criteria:** Account matches ICP  
**Exit criteria:** Prospect agrees to a discovery call with a specific problem articulated  
**Rep activities:** Identify signal, research account, craft signal-based outreach, secure first meeting  
**Tools:** CRM + outbound sequencer  
**Common failure:** Advancing to discovery without a clear reason the prospect agreed to meet

### Stage 2: Discovery
**Entry criteria:** Meeting booked, prospect has articulated a problem or change event  
**Exit criteria:** Rep has mapped: pain + quantified impact + decision process + economic buyer identified + timeline confirmed  
**Rep activities:** Run structured discovery call (see framework below), update MEDDPICC fields in CRM, confirm next step before ending call  
**Common failure:** Leaving discovery without confirming who the economic buyer is  
**Cheap first check:** `num_associated_contacts` on the HubSpot deal record is auto-populated by HubSpot itself — a deal that's been sitting in Discovery for weeks with a count of 1 is a single-threading signal worth acting on before reading a single call note (see the Champion row in Step 3 for what to do with it)

### Stage 3: Demo / Solution
**Entry criteria:** Pain confirmed, economic buyer identified (or meeting to reach them scheduled)  
**Exit criteria:** Prospect acknowledges the solution addresses their specific pain, requests proposal or next step  
**Rep activities:** Customized demo anchored to discovery findings, not product tour (see demo structure below)  
**Common failure:** Generic product demo that doesn't connect to the specific problem identified in discovery

### Stage 4: Proposal
**Entry criteria:** Demo landed, decision criteria understood, economic buyer engaged  
**Exit criteria:** Proposal delivered, objections handled, verbal commitment to evaluate  
**Rep activities:** Build proposal with ROI framing, submit, schedule proposal review call  
**Common failure:** Sending proposal without a scheduled follow-up call — email-only proposals die

### Stage 5: Negotiation / Close
**Entry criteria:** Verbal buy signal or explicit intent to move forward  
**Exit criteria:** Contract signed  
**Rep activities:** Confirm decision timeline, route to legal/procurement if needed, negotiate on terms not price (see negotiation rules below)  
**Common failure:** Giving price concessions without extracting something in return (shorter payment terms, case study commitment, reference agreement)

### Stage 6: Closed-Won / Handoff
**Entry criteria:** Contract signed  
**Exit criteria:** Handoff documentation complete, CS kickoff scheduled within 48 hours  
**Rep activities:** Complete handoff doc, intro customer to CS, join kickoff call  
**Common failure:** Handoff without documenting commitments made during the sale — CS inherits a customer with unmet expectations

---

## Step 3: Discovery Framework (MEDDPICC)

The full MEDDPICC table (each element, its discovery questions and what it maps) and how to use the framework are in `references/discovery-meddpicc.md`. Read it when writing the discovery section of the playbook.

---

## Step 4: Demo Structure

A demo is not a product tour. It's a story where the prospect is the hero and your product is the tool that gets them to their outcome.

**3-act demo structure:**

**Act 1: Before (5 minutes)**
Recap what you heard in discovery. "When we spoke, you mentioned X was your biggest challenge. Specifically, you said [their words]. Is that still the right framing?" Let them confirm or correct. Then transition: "What I want to show you today is exactly how we'd solve for that."

**Act 2: The demo (20–25 minutes)**
Show only the features that connect to the pain identified in discovery. Three workflows maximum — one per top pain point. Each workflow: show the problem state → show the solution → show the outcome in their language. Never show a feature you didn't hear referenced in discovery. If call recordings are connected (Claap or equivalent), recordings are auto-tagged `PainPoints` — pull the transcript for this account before building the demo to map each workflow to the prospect's actual wording, not a paraphrase from memory of the discovery call.

**Act 3: After (10–15 minutes)**
"Based on what you saw today, is this the right solution to [pain they named]?" Get a reaction before closing. Handle objections that surface. Confirm next steps: "What would need to happen on your end for us to move forward?"

**Demo anti-patterns:**
- Running through all features (prospect can't connect any of them to their problem)
- Not confirming their pain before showing anything (you may be solving the wrong problem)
- Ending without a decision or next step

---

## Step 5: Objection Handling

The four-step objection read (Acknowledge, Clarify, Respond, Confirm) and the full catalogue of objections with how to answer each are in `references/objection-handling.md`. Read it when writing the objection-handling section of the playbook.

---

## Step 6: Closing and Negotiation

The negotiation preparation list, concession rules and closing techniques are in `references/closing-and-negotiation.md`. Read it when writing the closing and negotiation section of the playbook.

---

## Step 7: CS Handoff Protocol

The handoff record to complete at contract signature and the handoff process are in `references/handoff-and-onboarding.md` (section "Step 7: CS Handoff Protocol"). Read it when writing the handoff section.

---

## Step 8: Rep Onboarding Path

The 90-day ramp for new reps (days 1-30 and onward) is in `references/handoff-and-onboarding.md` (section "Step 8: Rep Onboarding Path"). Read it when writing the onboarding section.

---

## Key Metrics

Don't import benchmarks from outside the company — sales cycle length, win rate, and ramp time vary too much by segment, ACV, and buying committee size for an external number to mean anything here. Track these against the company's own last 4–6 quarters, and flag movement, not the absolute number. Pull the underlying deal data straight from the CRM rather than a rep's self-report, and bound every one of these to a single pipeline — a portal with multiple pipelines running side by side (main, upsell, partner...) has a different stage set and a different definition of closed-won for each one, so mixing them produces a conversion rate that describes no real motion. Split by deal type too (the same native `dealtype` field used in Step 1 — New Business vs. Existing Business by default, or the portal's own custom values if it has extended them): a renewal-heavy quarter shortens the blended cycle length and inflates the blended win rate without new-logo selling having actually improved.

| Metric | What it tells you | How to calculate it |
|---|---|---|
| Stage conversion rate | Where deals actually die | Deals exiting stage N ÷ deals entering stage N, per stage |
| Sales cycle length | Whether the process is speeding up or dragging | Days from Stage 1 entry to Closed-Won, by segment |
| Win rate at Proposal | Whether discovery is qualifying correctly | Closed-Won ÷ (Closed-Won + Closed-Lost) from Proposal stage onward |
| Rep ramp time | Whether onboarding is working | Days from start date to first solo Closed-Won deal |
| Discovery-to-demo slip | Whether reps are advancing under-qualified deals | Deals that reach Demo without an identified economic buyer |
| Handoff completeness | Whether CS is inheriting real risk | % of Closed-Won deals with a complete handoff record before CS kickoff |

If stage conversion is falling only at one stage, that stage's entry/exit criteria are wrong or reps aren't enforcing them — fix the criteria before adding more training.

---

## Common Mistakes

- **Qualifying with hope instead of evidence.** A rep who wants the deal to be real will hear a maybe as a yes. Every MEDDPICC field should be backed by something the prospect said or did, not something the rep inferred.
- **Running the same demo for every persona.** A demo that doesn't map to the specific pain from discovery is a product tour, and prospects can tell.
- **Treating objections as scripts to recite.** The Acknowledge → Clarify → Respond → Confirm read (Step 5) fails the moment a rep skips Clarify and jumps straight to a rehearsed Respond — that's when responses sound canned instead of relevant.
- **Negotiating alone under deadline pressure.** End-of-quarter discounting without approval or without a concession traded back trains the account to wait for the next deadline.
- **A handoff that's really just a Closed-Won status change.** If CS has to ask the customer why they bought, the handoff failed.

---

## Rules

1. Never advance a deal past Discovery without an identified economic buyer — a champion is not a buyer.
2. Never leave a discovery or demo call without a specific next step and a date, confirmed out loud before hanging up.
3. Never give a price concession without trading for something back — a term, a timeline, or a reference.
4. Never let silence after a proposal go unaddressed for more than one follow-up cycle — re-engage with a real question or close the deal out.
5. Never close a deal without a complete handoff record — the deal isn't done until CS can deliver what was sold, not when the signature lands.
6. Never let a deal pass two consecutive calls without a verified contact with the economic buyer without flagging it as single-threaded — a low `num_associated_contacts` count on a deal that's been open for a while is the cheap early warning, not proof either way.
7. Never revise a price a third time without new information from the buyer — ask directly what's actually holding the deal back instead of drafting another version.
8. Never close a deal Lost without picking a reason from a fixed list — a free-text reason typed by the rep can't be aggregated into a pattern worth fixing.