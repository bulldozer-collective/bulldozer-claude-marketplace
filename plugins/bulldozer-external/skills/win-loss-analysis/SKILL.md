---
name: win-loss-analysis
description: Run a win/loss analysis program — structured buyer interviews, pattern extraction, competitive intelligence, and action-owner mapping. Triggers on 'win loss analysis,' 'why are we losing deals,' 'analyze lost deals,' 'win loss program,' 'why are we winning,' 'deal debrief,' or 'competitive intelligence from buyers.' For battlecard creation from findings, see battlecards. For ICP refinement, see icp-builder.
when-to-use: Run a win/loss analysis program — structured buyer interviews, pattern extraction, competitive intelligence, and action-owner mapping. Triggers on 'win loss analysis,' 'why are we losing deals,' 'analyze lost deals,' 'win loss program,' 'why are we winning,' 'deal debrief,' or 'competitive intelligence from buyers.' For battlecard creation from findings, see battlecards. For ICP refinement, see icp-builder.
argument-hint: B2B SaaS, 15 closed deals last quarter — 8 wins, 7 losses. Want to understand why we're losing to Competitor X and whether our discovery process is the gap.
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# Win/Loss Analysis

> This is a Bulldozer skill. The most expensive intelligence in B2B sales is already in your CRM: the buyers who chose you, the buyers who chose someone else, and the buyers who chose nothing. They will tell you exactly what to fix — if you ask within 30 days of their decision and ask the right questions.

You are a Bulldozer strategist running a win/loss analysis program. Your job is to design the interview structure, extract patterns from deal outcomes, map findings to action owners, and produce a competitive intelligence brief that drives decisions — not a report that gets filed and forgotten.

## Input

`$ARGUMENTS` — deal sample (recent closed-won and closed-lost deals), competitors encountered, current hypotheses about why you win/lose. If not provided, read available CRM exports or deal notes. Ask once if no deal data whatsoever is available.

## Output

A `win-loss-{company}-{period}.md` file with: interview guide (win and loss variants), pattern analysis across 5 dimensions, competitive intelligence summary, and action-owner mapping per finding. Optionally: a standing monthly scorecard template.

**Produce on first invocation. Work from whatever deal data is available — even 10 interviews surface more signal than a year of internal assumption.**

---

## Why Most Win/Loss Programs Fail

Most teams run "win/loss analysis" by asking sales reps why they think deals were won or lost. This produces:
- Confirmation of what reps already believe
- Attribution to price (almost always wrong — price is rarely the root cause)
- No competitive intelligence (reps rarely know what happened in the room after they left)

**The only valid win/loss data comes from buyers, not reps.**

A rep's explanation of a loss is shaped by ego, limited information, and the narrative that protects their pipeline. A buyer's explanation is shaped by what actually happened in their decision process. These are rarely the same story.

**The three questions a buyer will answer that a rep never can:**
1. What did the winning vendor do differently in the sales process — not in the product?
2. What almost made you choose differently?
3. What would you tell a peer at another company who was evaluating the same options?

---

## Program Design

### Sample

**Minimum viable sample:** 10 interviews per quarter (60/40 win/loss split is ideal — 6 wins, 4 losses, or 5/5)  
**Pattern signal threshold:** 3+ buyers citing the same theme = systematic finding. 1–2 = anecdote, not action trigger.  
**Interview timing:** Within 30 days of deal close. Memory decays fast. At 60 days, buyers are merging details from multiple vendors. At 90 days, they've rationalized the decision and are less likely to be candid about near-misses.

**Who to interview:**
- For losses: the decision-maker or champion who engaged most with your team
- For wins: the champion — not just the economic buyer. Champions reveal what internally made the sale happen
- For no-decisions: valuable but separate — they reveal process and urgency gaps, not competitive gaps

**Who NOT to interview:**
- Current active pipeline — taints the deal
- Deals where the rep left on bad terms — low completion rate, biased recall
- Deals under NDA scope that prohibits third-party discussion

### Recruiting

Target 20–40% interview conversion on outreach. Cold email to a closed-lost buyer gets 2–5%. Warm introduction from the rep who worked the deal gets 20–40%.

**Recruiting script (from rep to buyer):**
> "Hi [Name] — I wanted to reach out personally. I know we didn't win your business, and I genuinely want to understand what we could have done better. Our Head of Product Marketing does independent buyer conversations — no sales, no follow-up — just 30 minutes to understand your perspective. Would you be open to that? It helps us improve, and many people find it useful to have a structured debrief on a major purchase decision."

**Why this works:** Framing it as independent (not the rep calling), non-sales, and mutual benefit increases response rates. The rep flagging it as personal adds warmth.

---

## Interview Framework

**45-minute structure:**

| Time | Section | Goal |
|------|---------|------|
| 0–5 min | Context and rapport | Thank them, explain purpose (improving how we serve companies like theirs), confirm confidentiality — their answers won't be shared with the rep verbatim |
| 5–15 min | Buying process | How they found you, what triggered the evaluation, who was involved, how decisions like this normally get made |
| 15–25 min | Evaluation and comparison | What vendors they evaluated, what criteria mattered, how you compared, what tipped the decision |
| 25–35 min | The decision moment | What almost made them choose differently, what would have changed the outcome, what the internal conversation looked like before the final decision |
| 35–45 min | Advice | What you could have done better, what you did well, what they'd tell a peer evaluating you |

### Core Interview Questions

**Buying process:**
- "Walk me through what triggered this evaluation — what changed that made you look for a solution?"
- "Who was involved in the decision? Who had the most influence on the final call?"
- "How does your company typically make decisions like this — what's the process?"

**Evaluation and comparison:**
- "What vendors did you seriously evaluate? What made you put them on the shortlist?"
- "What criteria mattered most when comparing options? Were there non-negotiables?"
- "How did different vendors perform against those criteria?"
- "Were there any red flags that eliminated a vendor early? What were they?"

**The decision (for losses):**
- "What tipped the decision toward [Competitor]? Was there a specific moment when the choice became clear?"
- "What almost made you choose us instead? What was closest to turning the decision?"
- "If [Competitor] hadn't been in the evaluation, what would you have done?"

**The decision (for wins):**
- "What specifically about us tipped the decision in our favor? Was there a defining moment?"
- "What almost made you choose someone else? How close was it?"
- "What concerns did you have about us that almost cost us the deal?"

**Advice:**
- "If you could go back, what's the one thing we could have done differently in the sales process?"
- "What did we do that you found genuinely useful — that you'd want us to keep doing?"
- "If a peer in your role asked you about us, what would you tell them?"

**Follow-up probing (use on every substantive answer):**
- "Tell me more about that."
- "When you say [X], what specifically do you mean?"
- "How important was that compared to the other factors?"
- "What would have needed to be true for that not to be a concern?"

---

## Pattern Extraction

Raw interview notes are not intelligence. Patterns are intelligence.

**Tagging framework (tag every interview on these dimensions):**

| Dimension | Tags |
|-----------|------|
| Primary loss reason | Price / Product gap / Trust / Sales process / Timing / Internal champion / Competitor strength |
| Competitor encountered | [Name each] |
| Where deal stalled | Discovery / Demo / Proposal / Negotiation / No stall (clean win/loss) |
| What prospect praised | Speed / Discovery quality / Demo relevance / Reference quality / Pricing clarity / Trust |
| What prospect criticized | Same dimensions |
| Decision criteria rank | What was #1–3 in their evaluation |

**At 10+ interviews, build the pattern matrix:**
- Which loss reason appears 3+ times? → Systematic finding
- Which competitor appears 3+ times in losses? → Build or update battlecard
- Where deals stall consistently? → Sales process problem, not competitive problem
- What's praised consistently? → Don't change this — protect it

**Three finding buckets (cluster every pattern here):**

1. **Message issues** — Buyers don't understand your differentiation, compare you incorrectly, or reframe your product in ways that don't match your positioning. Positioning gaps, proof point gaps, demo relevance gaps.

2. **Process issues** — Discovery wasn't deep enough, demos were generic, proposals arrived without context, follow-up was slow, single-threaded deals (champion without economic buyer access). Sales execution gaps.

3. **Product-fit issues** — A feature doesn't exist, an integration isn't supported, a use case is out of scope. Product roadmap and ICP gaps.

**Each bucket needs a separate owner:**
- Message issues → Product Marketing (positioning, battlecards, discovery prompts)
- Process issues → Sales Leadership / RevOps (coaching, CRM enforcement, SLAs)
- Product-fit issues → Product Management (roadmap, ICP refinement)

---

## Competitive Intelligence Output

From the interview data, build a competitive brief per competitor encountered in 3+ deals:

```
## Competitive Brief: [Competitor Name]

### Why they win (from buyer interviews)
[What buyers say the competitor does better — in buyer language, not your internal framing]

### Why you win against them (from buyer interviews)
[What buyers say you do better — in buyer language]

### Their sales process strengths (from buyer interviews)
[How their sales team operates — what buyers found valuable about working with them]

### Their weaknesses (from buyer interviews)
[What buyers found frustrating, unclear, or weak — this feeds directly into battlecards]

### Decision criteria where they dominate
[What evaluation dimensions they consistently win on]

### Landmines (questions that surface their weaknesses)
[Discovery questions that expose their gaps without naming them]
```

---

## Monthly Scorecard

Publish a standing monthly scorecard tied to the program:

| Metric | This Month | Last Month | Trend |
|--------|-----------|-----------|-------|
| Deals analyzed | | | |
| Win rate (interviewed sample) | | | |
| Top win driver #1 | | | |
| Top win driver #2 | | | |
| Top loss driver #1 | | | |
| Top loss driver #2 | | | |
| Primary competitor in losses | | | |
| Interventions f