---
name: |
  sales-playbook
description: |
  Build a B2B sales playbook — ICP and persona definitions, stage-by-stage process with entry/exit criteria, discovery framework, objection handling, demo structure, handoff to CS, and rep onboarding path. Triggers on 'sales playbook,' 'build our sales playbook,' 'document the sales process,' 'rep onboarding,' 'how should reps sell,' or 'our sales process is inconsistent.' For competitive positioning specifically, see battlecards. For ICP definition, see icp-builder.
when-to-use: |
  Build a B2B sales playbook — ICP and persona definitions, stage-by-stage process with entry/exit criteria, discovery framework, objection handling, demo structure, handoff to CS, and rep onboarding path. Triggers on 'sales playbook,' 'build our sales playbook,' 'document the sales process,' 'rep onboarding,' 'how should reps sell,' or 'our sales process is inconsistent.' For competitive positioning specifically, see battlecards. For ICP definition, see icp-builder.
argument-hint: |
  B2B SaaS, 5-rep sales team, no current playbook — ACV €20k, sales cycle ~60 days, two personas (VP Sales + Head of RevOps), using HubSpot
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |
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

Pull from existing ICP documentation if available. If not, build from the last 20 closed-won deals.

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

MEDDPICC is a qualification and deal-mapping framework, not a checklist. The goal is not to fill in every field — it's to know which fields are blank and why.

| Element | Questions | What you're mapping |
|---------|-----------|---------------------|
| **Metrics** | "What does success look like in numbers? What KPIs are you measured on?" | The quantified business outcome — this becomes the ROI story |
| **Economic Buyer** | "Who ultimately signs off on this? Who else needs to approve?" | Budget authority — not your champion |
| **Decision Criteria** | "What's most important in your evaluation? What would make you say no?" | Must-haves, nice-to-haves, deal-breakers |
| **Decision Process** | "Walk me through how you've made similar purchases. What's your timeline?" | Steps, stakeholders, legal/procurement involvement, timeline |
| **Identify Pain** | "What happens if you don't solve this? How much is this costing you?" | Urgency and cost of inaction |
| **Champion** | "Who internally is most invested in solving this?" | The person driving the deal from inside the account |
| **Competition** | "What else are you evaluating? What do you like about those options?" | Who you're competing against and on what criteria |

**Discovery call structure (45 minutes):**

| Time | Section | Goal |
|------|---------|------|
| 0–5 min | Rapport + agenda setting | Confirm why they agreed to meet, set expectations |
| 5–15 min | Current state + pain | Understand their world before your solution existed |
| 15–25 min | Impact + metrics | Quantify the cost of the problem |
| 25–35 min | Decision process + competition | Map the buying process and competitive landscape |
| 35–40 min | Solution bridge | Connect their specific pain to your capabilities (briefly — don't demo here) |
| 40–45 min | Next steps | Secure a specific next action with a date before leaving the call |

**The rule:** Never leave a discovery call without confirming the next step verbally and logging it in CRM within one hour.

---

## Step 4: Demo Structure

A demo is not a product tour. It's a story where the prospect is the hero and your product is the tool that gets them to their outcome.

**3-act demo structure:**

**Act 1: Before (5 minutes)**
Recap what you heard in discovery. "When we spoke, you mentioned X was your biggest challenge. Specifically, you said [their words]. Is that still the right framing?" Let them confirm or correct. Then transition: "What I want to show you today is exactly how we'd solve for that."

**Act 2: The demo (20–25 minutes)**
Show only the features that connect to the pain identified in discovery. Three workflows maximum — one per top pain point. Each workflow: show the problem state → show the solution → show the outcome in their language. Never show a feature you didn't hear referenced in discovery.

**Act 3: After (10–15 minutes)**
"Based on what you saw today, is this the right solution to [pain they named]?" Get a reaction before closing. Handle objections that surface. Confirm next steps: "What would need to happen on your end for us to move forward?"

**Demo anti-patterns:**
- Running through all features (prospect can't connect any of them to their problem)
- Not confirming their pain before showing anything (you may be solving the wrong problem)
- Ending without a decision or next step

---

## Step 5: Objection Handling

Use the ACRC framework: **Acknowledge → Clarify → Respond → Confirm**

1. **Acknowledge** — Show you heard them. "I understand why you'd feel that way."
2. **Clarify** — Probe the real concern. "Help me understand — what specifically concerns you about...?"
3. **Respond** — Address the actual concern with evidence (not defensiveness)
4. **Confirm** — Check it landed. "Does that address your concern, or is there something else underneath it?"

**Top objections and scripts:**

**"It's too expensive."**  
Clarify: "Is this about the total number, the per-seat cost, or how it fits your current budget cycle?"  
Respond: "Our average customer sees [specific ROI outcome] within [timeframe]. At your current [cost of the problem], the payback period is [X months]. Would it help if I put together the business case in writing?"

**"We're not r