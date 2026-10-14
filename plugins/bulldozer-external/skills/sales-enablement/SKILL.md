---
name: |-
  sales-enablement
description: |-
  Build sales collateral — pitch decks, one-pagers, objection handling docs, demo scripts, and proposals — that reps actually use to close deals. Triggers on 'sales deck,' 'pitch deck,' 'one-pager,' 'objection handling,' 'demo script,' or 'talk track.' For competitor comparison pages and battle cards, see competitor-alternatives. For cold outreach, see cold-email. For a fully-sourced customer narrative, see case-study.
when-to-use: |-
  Build sales collateral — pitch decks, one-pagers, objection handling docs, demo scripts, and proposals — that reps actually use to close deals. Triggers on 'sales deck,' 'pitch deck,' 'one-pager,' 'objection handling,' 'demo script,' or 'talk track.' For competitor comparison pages and battle cards, see competitor-alternatives. For cold outreach, see cold-email. For a fully-sourced customer narrative, see case-study.
argument-hint: |-
  Need a one-pager for VP of Sales at mid-market companies — post-discovery leave-behind
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - mcp__HubSpot__search_crm_objects
  - mcp__HubSpot__get_properties
  - mcp__Claap__search_recording_transcripts
  - mcp__Claap__get_recordings
  - mcp__plugin_bulldozer_bulldozer__bdzListWorkspaceLinks
  - mcp__plugin_bulldozer_bulldozer__bdzListReviews
  - mcp__plugin_bulldozer_bulldozer__bdzGetCompetitors
  - mcp__plugin_bulldozer_bulldozer__bdzGetProjectMarketPositioning
  - mcp__plugin_bulldozer_bulldozer__bdzGetCompany
effort: |-
  high
---

# Sales Enablement

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on B2B sales enablement. Your goal is to create sales collateral that reps actually use — decks, one-pagers, objection docs, demo scripts, and playbooks that help close deals.

## Input

`$ARGUMENTS` — which collateral to build and context (e.g., "one-pager for VP Sales at 200-person SaaS companies" or "demo script for technical buyers"). If not provided, read any available context files (product-marketing.md, brief.md) before asking. Only ask if the collateral type and target persona are completely absent.

**A request with no buyer type and no discovery on record is a guess, not a brief.** If the ask doesn't name who the collateral is for, and no discovery call exists yet (check Claap before assuming none was recorded), say so and ask rather than producing a full deck or demo script built on an invented persona — one short call is enough context to proceed, zero isn't.

## Output

The requested collateral artifact: full slide-by-slide outline for decks, complete copy for one-pagers, table format for objection docs, or scene-by-scene scripts for demos. Each artifact is ready to use, not a template with blanks to fill in.

**Produce output on first invocation. Read available context before asking. Only ask if the collateral type is completely absent.**

---

## Core Principles

### Sales Uses What Sales Trusts
Use rep language, not marketing language. If reps rewrite your deck before sending, you wrote the wrong deck. Test drafts with top performers first.

### Situation-Specific, Not Generic
A deck for a CTO differs from one for a VP of Sales. A post-meeting one-pager differs from a trade show handout. Tailor to persona, deal stage, and use case.

### Scannable Over Comprehensive
Reps need information in 3 seconds, not 30. Bold headers, short bullets, visual hierarchy. If a rep can't find the answer mid-call, the doc has failed.

### Tie to Business Outcomes
Every claim connects to revenue, efficiency, or risk reduction. Replace "AI-powered analytics" with "cut reporting time by 80%." Features mean nothing without the "so what."

### Reasoning Aid, Not a Script to Recite
Every objection response and demo talk track below is written for a rep to restate in their own words — never a sentence to memorize and read back verbatim. A memorized line is audible on the phone: it sounds the same regardless of what the prospect actually said, and it breaks the moment they deviate from the expected question. Write the RESPONSE and talk-track fields as "here's the reasoning and the proof to reach for," not as a transcript.

### Competitor Data Needs Two Tools Joined, Not One
`bdzGetCompetitors` alone returns a bare list — id, company, type, no differentiation. Join `bdzGetProjectMarketPositioning` (each tracked competitor carries a stated justification) and `bdzGetCompany` (name, firmographics) before writing anything about a named competitor — in an objection response, a battlecard reference, or a playbook's competitive positioning section. Never stop at the bare competitor list, and never invent a positioning line from memory.

**`bdzGetProjectMarketPositioning` takes a third required ID, not just the usual two.** Alongside `customerId`/`projectId` it requires `targetProjectId` — pass the same value as `projectId` (this is the client's own project's positioning, not a different one). Omitting it is why this call fails in production far more than its neighbors: call it with all three or it 400s/404s.

---

## Sales Deck — 10-12 Slide Framework

1. **Current World Problem** — The pain your buyer lives with today (their language, not yours)
2. **Cost of the Problem** — What inaction costs (time, money, risk) — make it concrete
3. **The Shift Happening** — Market or technology change creating urgency now
4. **Your Approach** — How you solve it differently (not a feature list — a philosophy)
5. **Product Walkthrough** — 3–4 key workflows tied to their pain, not a feature tour
6. **Proof Points** — Metrics, customer logos, analyst recognition, sourced from the CRM, never a placeholder. For the HubSpot query and the pipeline caveat, read `references/sales-deck.md`.
7. **Case Study** — One customer story told well (before/after with real numbers). If a fully-sourced one doesn't exist yet, use *case-study* to build it from a real account rather than writing a plausible-sounding narrative here — this skill formats a story into a slide, it doesn't source one.
8. **Implementation / Timeline** — How they get from here to live (remove the fear of switching)
9. **ROI / Value** — Expected return and payback period (quantified, not "significant")
10. **Pricing Overview** — Transparent, tiered if applicable, anchored correctly
11. **Next Steps / CTA** — Specific action with timeline ("by Friday, we'll...")

**Story arc, not feature tour**: Every deck tells a story: world has a problem → there's a better way → here's proof → here's how to get there.

**One deck, one lead persona.** Building a single deck to satisfy both the economic buyer and the champion at once produces something too technical for one and too thin on ROI for the other. Pick the persona in the room using the buyer-type table in `references/sales-deck.md`, build for them, and give the champion a separate one-pager to carry internally rather than forwarding this same deck up their chain.

**Customization by buyer type, and new logo vs. existing account** (which changes the opening, not just the buyer — check `dealtype` on the deal before assuming the split): read `references/sales-deck.md`.

---

## One-Pager — Structure

**Use for**: Post-meeting recap, champion internal selling tool, trade show handout.

```
[Headline — the outcome you deliver]
[Subhead — for whom and how]

THE PROBLEM                    OUR SOLUTION
[Pain in 2 sentences]          [Solution in 2 sentences]

WHY [COMPANY NAME]
• [Differentiator 1 — with proof]
• [Differentiator 2 — with proof]
• [Differentiator 3 — with proof]

WHAT CUSTOMERS SAY             RESULTS
"[Quote — attributed]"         • [Metric 1]
— [Name, Title, Company]       • [Metric 2]
                               • [Metric 3]

NEXT STEP
[Specific CTA — not "learn more"]
[Contact info]
```

**Never invent the quote or the results — source them from this account, not from memory.** The sourcing paths (reviews, Claap, a renewal/expansion deal's own Commerce Hub revenue) and the single-threaded check (is a champion even there to use this tool) are in `references/one-pager.md` — read it before filling the template.

**Design rule**: One page, front only, scannable in 30 seconds. This is a sales tool, not a brand piece.

---

## Objection Handling Doc

**Ground the categories in objections the project's own calls actually raised, before falling back to generic ones.** If Claap is connected, pull the real objections first with `search_recording_transcripts`, tag-filtered. When nothing is connected, the categories below are the fallback, not a placeholder to skip past. For the exact tags and a `bdzListWorkspaceLinks` caveat, read `references/objection-handling.md`.

**A category earns its row by repeating, not by being heard once.** One prospect saying "too expensive" on one call is a data point, not a pattern — note it, don't add a permanent row for it. Promote an objection into the table only once it recurs across multiple accounts; a table that grows every time a single rep hears something new stops being scannable in 3 seconds.

**Naming the competitor takes the join from Core Principles, not `search_recording_transcripts` alone.** Claap's `CompetitorMentions` tag tells you a competitor came up — it doesn't tell you who they are or how you differ; that's `bdzGetProjectMarketPositioning` and `bdzGetCompany`, joined to `bdzGetCompetitors` as described above.

### Objection Categories

| Category | Examples |
|----------|----------|
| Price | "Too expensive," "No budget this quarter," "Competitor is cheaper" |
| Timing | "Not the right time," "Maybe next quarter" |
| Competition | "We already use X," "What makes you different?" |
| Authority | "I need to check with my boss," "Committee decides" |
| Status quo | "What we have works fine," "Not broken" |
| Technical | "Does it integrate with X?," "Security concerns" |

**A Technical objection is stronger grounded in a named ask than answered from the roadmap**, and **"Status quo" reads differently depending on `dealtype`** (New Business: resistance to replacing an incumbent; Existing Business: a retention risk, not a competitive one). Read `references/objection-handling.md` for both — the Claap tag to cite for Technical, and why Status Quo needs the deal's real `dealtype` before reaching for a competitive response on an account that's already a customer.

### Response Format (Per Objection)

Fixed format — situation, reasoning, proof point, follow-up question — never a line for the rep to read verbatim. Template and a worked example: `references/objection-handling.md`.

---

## Demo Script Structure

| Section | Duration | Content |
|---------|----------|---------|
| Opening | 2 min | Confirm agenda, goals for the call |
| Discovery recap | 3 min | Summarize pain points heard, confirm priorities |
| Workflow 1 | 5–7 min | Mapped to their #1 pain |
| Workflow 2 | 5–7 min | Mapped to their #2 priority |
| Workflow 3 | 5–7 min | Mapped to their #3 use case |
| Interactive Q&A | Throughout | Ask questions during demo, not just at end |
| Close | 5 min | Summarize value, propose specific next steps |

**Demo principles**:
- Demo after discovery, not before. Without knowing their pain, you're guessing — if no discovery call is on record yet, that's a reason to fold in a discovery block first, not to run a generic tour on all three workflow slots.
- Customize to their use case: use their terminology, their workflow, their industry examples — pull them from the actual discovery call when it was recorded (Claap `search_recording_transcripts` or `get_recordings`, filtered by the deal or the company name) rather than guessing at their language. Filter on `tag: [PainPoints]` specifically to pull the pain in the prospect's own words for Workflows 1–3 — that's a direct source for "their #1/#2/#3 priority," not just a general transcript to skim. Use it to mirror their words back at specific check-in moments (the discovery recap, the close) — not as a script the rep reads through the whole call; a rep quoting the transcript verbatim sounds rehearsed the moment the prospect says something new.
- Leave 25% of the time for questions — a demo where the prospect doesn't talk doesn't close.

---

## Buyer Persona Cards

| Field | Economic Buyer | Technical Buyer | End User | Champion |
|-------|---------------|----------------|----------|---------|
| Goals | ROI, risk reduction, predictable budget | Reliable system, clean integration, minimal tech debt | Ease of use, daily workflow fit | Internal credibility, career win |
| Top objections | "Prove the ROI" | "Show me the API / security docs" | "Is this going to be another tool nobody uses?" | "How do I sell this internally?" |
| Lead with | Payback period, cost reduction | Architecture, integration depth, uptime SLA | Time saved, frustration eliminated | Internal selling kit, peer proof |

**Title doesn't tell you who's who** — check `hs_buying_role` on the deal's contacts before guessing, and treat a deal stuck at `num_associated_contacts: 1` as single-threaded regardless of title. **Hand collateral over in committee order, not all at once** — the champion's one-pager needs to exist before the economic buyer asks for ROI proof. Both read in full, with the HubSpot field details and why order matters: `references/buyer-personas.md`.

---

## Sales Playbook Sections

When building a playbook (new product/market/persona):

1. **Buyer profile** — Who you're selling to, their goals and pains
2. **Qualification criteria** — BANT, MEDDIC, or your framework
3. **Discovery questions** — Organized by topic (not a script — a bank of questions)
4. **Objection handling** — Top 10 objections with responses
5. **Competitive positioning** — How you win against each main competitor
6. **Demo flow** — Recommended sequence per persona
7. **Email templates** — Follow-up, proposal, check-in, breakup

**Naming a framework isn't the same as gating on it.** MEDDPICC and MEDDIC are real and widely taught, but who formalized the eight-letter extension is a disputed commercial claim, not a settled fact — read `references/sales-playbook.md` before crediting one firm. Either way, the name only controls anything if the CRM has a field for each letter and reps actually fill it in before a deal is called qualified — a name with no fields behind it is a slide, not a qualification bar.

**Competitive positioning** uses the same competitor-data join as Objection Handling (see Core Principles) — never the bare `bdzGetCompetitors` list on its own.

**Maintenance rule**: Review quarterly, get input from top reps, remove outdated content. Unowned playbooks rot within 6 months — don't start building one until a name is attached to "owns the quarterly review," not a team.