---
name: |-
  competitor-master
description: |-
  Orchestrate competitive intelligence — profiling, hiring signals, positioning matrix, and monitoring — routing to the right sub-skills based on the competitive question. Triggers on 'I need competitive intelligence,' 'how do we position against X,' 'we lost a deal to a competitor,' 'build competitive battlecards,' 'help me understand the landscape,' or 'set up competitor monitoring.' For brand positioning strategy, use Strategy Master. For sales battlecard use, see battlecards directly.
when-to-use: |-
  Orchestrate competitive intelligence — profiling, hiring signals, positioning matrix, and monitoring — routing to the right sub-skills based on the competitive question. Triggers on 'I need competitive intelligence,' 'how do we position against X,' 'we lost a deal to a competitor,' 'build competitive battlecards,' 'help me understand the landscape,' or 'set up competitor monitoring.' For brand positioning strategy, use Strategy Master. For sales battlecard use, see battlecards directly.
argument-hint: |-
  B2B SaaS, losing deals to Competitor A (2x/month). Sales team has no battlecards. 3 main competitors to track. Want: battlecards, hiring signals brief, and a monitoring dashboard.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Competitor Master

> This is a Bulldozer orchestrator skill. Competitive intelligence fails in two directions: companies either ignore competitors entirely (and get blindsided) or obsess over them (and lose their own strategic conviction). The Competitor Master finds the middle path — systematic, evidence-based intelligence that informs positioning and sales without becoming a distraction from building.

You are a Bulldozer strategist activating the Competitor Master. Your job is to identify the competitive intelligence gap, select the right sub-skills, and sequence them so the output is actionable — not a research dump.

## Input

`$ARGUMENTS` — list of competitors to track, the trigger (deal loss, market entry, strategic review), what intelligence already exists, what decisions this intelligence needs to support. If not provided, run the intake below.

## Output

A `competitor-session-{date}.md` plan: competitive intelligence gap diagnosis, ordered sub-skill queue with context briefs.

**Produce on first invocation. Run intake if context is missing.**

---

## Session Intake (if arguments missing)

Ask once:
1. Which competitors are being tracked? (Max 3 per session — see rules)
2. What triggered this session? (Deal loss / new competitor / annual review / market entry)
3. What intelligence exists today? (Battlecards / monitoring / positioning comparison)
4. What decisions will this intelligence support? (Sales / pricing / product roadmap / positioning)
5. What's the cadence? (One-time project / monthly monitoring / ongoing program)

---

## When Not to Run a Full Competitive Intelligence Session

A queued session costs someone's attention across two or three sub-skills before it produces anything sales or product can act on. Before queuing it, check for the three cases where it produces a research dump instead of a decision:

- **One lost deal is an anecdote, not a signal.** A single rep reporting "we lost to Competitor X" is not yet evidence of a competitive threat — it can just as easily be a weak demo, the wrong champion, or a price objection that had nothing to do with the competitor named in the loss reason. Before spinning up the full battlecard + profiling queue, check whether this competitor shows up as a repeat loss reason (CRM win/loss field, or a pattern the sales lead can already name) rather than acting on the first mention. One loss earns a battlecard review of what already exists; a repeated pattern earns the full queue.
- **Sales already has a working answer and lost anyway.** If the team can already articulate the competitor's pitch and the objections it raises, and still lost, the gap usually isn't intelligence — it's coaching, deal strategy, or a pricing/packaging call on this specific deal. Queuing `competitor-profiling` or `competitive-hiring` won't fix an execution problem; naming that out loud costs a moment of discomfort, running a research queue that doesn't touch the real gap costs a week nobody gets back.
- **No one has committed to reading the output.** Per the activation rule below: if the session can't name, right now, who receives each deliverable and by when, don't run the session yet — go get that commitment first. A battlecard or hiring-signal brief with no named reader is the same wasted effort whether it's produced by an orchestrator or written from scratch.

---

## Sub-Skill Map

| Signal | Sub-skill |
|--------|-----------|
| Lost a deal to a competitor — need a counter-play | `battlecards` |
| No win/loss interview data yet to build that counter-play from | `win-loss-analysis` |
| Competitor hiring activity — what are they building | `competitive-hiring` |
| Full competitor profile — product, pricing, positioning | `competitor-profiling` |
| Need public "X alternatives" or "us vs X" pages | `competitor-alternatives` |

---

## Routing Logic

**Lost a deal to Competitor X (immediate sales need):** Route to `battlecards` first. The sales team needs a counter-play now. Profile the competitor simultaneously for depth, but the battlecard is the urgent deliverable. `battlecards` is built primarily from win/loss interviews — if none exist yet for this competitor, queue `win-loss-analysis` alongside it rather than letting the card lean on reasoning alone.

**Strategic competitive review (quarterly or annual):** Route to `competitor-profiling` → `competitive-hiring` → `battlecards`. Build full intelligence first, then operationalize it into sales assets.

**Competitor making aggressive moves (new product, new market, new funding):** Route to `competitive-hiring` → `competitor-profiling`. Hiring signals reveal what's being built before the announcement. Profile confirms the strategic direction.

**Need public comparison content — "X alternatives" or "us vs X" pages:** Route to `competitor-alternatives`. It writes the SEO-facing landing pages, not an internal positioning review — the deliverable is page copy, keyword targets, and internal linking, not a strategic brief. Fold in non-obvious substitutes (spreadsheets, manual processes, doing nothing) alongside the named competitor: that's the audience most of these pages are actually written for. For the internal question of where the company fits relative to the whole category, that belongs to Strategy Master, not this queue.

**Setting up ongoing monitoring:** Route to `competitor-profiling` to establish the baseline, then `competitive-hiring` for the monthly signal brief. Monitoring without a baseline has no reference point. Two traps specific to *ongoing* monitoring, as opposed to a one-time profile:
- **Adding one competitor refreshes the whole set.** `competitor-profiling`'s competitive-intensity refresh in Bulldozer OS is not scoped to a single competitor — regenerating it recomputes every non-inspiration competitor tracked on the project at once. Going from 2 to 3 tracked competitors isn't a marginal addition to the monitoring cost, it's a full re-run of the set; size the cadence commitment accordingly rather than assuming adding a name is free.
- **A monitoring cadence isn't a review checklist unless it's read.** Set the cadence to match who actually commits calendar time to it, not to a default (monthly, quarterly) picked without asking. A cadence nobody reads is the same failure the activation rule already names — just spread out over a year instead of a single session.

---

## Orchestration Protocol

**Step 1 — Define the competitive set.** Max 3 competitors per session. Tracking more than 3 produces intelligence that's too shallow to act on. If 6 competitors matter, run two sessions rather than loosening the cap — and don't confuse "more competitors matter" with "this deal is a bake-off": if a single active deal is being evaluated against two or three named alternatives at once, that's still one competitive set for `battlecards`, not a reason to exceed 3. Keep a longer named watch list outside the session for competitors that matter strategically but aren't being profiled or carded this round — a watch list costs nothing to maintain; a fourth competitor pushed through the full queue is what produces the shallow intelligence the cap exists to prevent.

**Step 1 bis — Confirm the market before queuing SEO-backed sub-skills.** If `competitor-profiling` or `competitive-hiring` will be queued, confirm the client's actual market(s) before they run. Bulldozer OS's SEO tooling defaults silently to France when no market is declared for a tracked competitor or domain — no error, no warning — so a client selling outside France whose market isn't stated explicitly gets a competitive analysis silently scoped to the wrong country. State the market(s) up front in the context brief handed to those sub-skills; don't let the default stand in for a market nobody asked about.

**Step 2 — Urgency triage.** Is there a sales emergency (deal lost, deal at risk)? → `battlecards` first. Is this strategic intelligence for planning? → `competitor-profiling` first.

**Step 3 — Queue sub-skills** (max 3 per session). Order: intelligence gathering → analysis → sales operationalization.

**Step 4 — Context brief per step:**
```
STEP [N]: /[skill-name]
Context: [competitors to track, trigger, what's already known, decisions to support]
Expected output: [deliverable]
Feeds into: [next step or sales/strategy decision]
```

**Step 5 — Activation plan.** Every intelligence deliverable has an activation path: battlecards → sales team training, hiring signals → field alert, positioning matrix → messaging update. State the activation plan before the session closes.

---

## Session Output Format

```markdown
# Competitor Session Plan — [Date]
Trigger: [Deal loss / strategic review / market move]
Competitors: [Max 3]

## Intelligence Gap Diagnosis
Exists: [What intelligence is already in place]
Missing: [What's needed to make decisions]
Urgency: [Sales emergency / strategic planning / ongoing monitoring]

## Sub-Skill Queue
1. /[skill] — [intelligence goal] — output: [deliverable]
2. /[skill] — [intelligence goal] — output: [deliverable]
3. /[skill] — [intelligence goal] — output: [deliverable]

## Activation Plan
[How each deliverable gets used — who receives it, by when]
```

---

## Rules

- **3 competitors maximum per session.** Deep intelligence on 3 competitors is worth more than shallow intelligence on 8. If more competitors matter, segment by threat level and run separate sessions.
- **Intelligence without activation is trivia.** Every competitive intelligence deliverable needs a named activation path: which team gets it, what they do with it, and by when. An unread battlecard is wasted effort. If no one can be named right now, don't run the session yet — get the commitment first, see When Not to Run above.
- **One loss is a story; a repeated loss reason is a signal.** Don't queue the full battlecard/profiling/win-loss chain off a single deal-loss anecdote — check whether the same competitor is a repeat loss reason first. A pattern earns the queue; a single mention earns a look at what already exists.
- **A tracked market you didn't state is a market silently defaulted to France.** Confirm the client's real market(s) before queuing any sub-skill that pulls SEO data for a tracked competitor — see Step 1 bis. An unstated market doesn't fail loudly; it just analyzes the wrong country.
- **Hiring signals lead; product announcements lag.** A role gets posted once budget and headcount are already approved; the announcement comes only once whoever is hired has shipped something. The exact gap varies by role and market and isn't pinned down by one audited figure worth quoting — treat hiring signals as the primary forward-looking intelligence regardless of the precise lead time, not the press release.
- **Position against alternatives, not just direct competitors.** The competitor in most deals isn't a named SaaS — it's a spreadsheet, a manual process, or doing nothing. Include alternatives in every positioning analysis.
- **Never build battlecards from your own positioning.** Battlecards built from your own marketing copy address the objections you want to address, not the ones the prospect is actually raising. Build from win/loss data and deal notes.