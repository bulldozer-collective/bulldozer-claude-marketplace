# Funnel Stage Map and Drop-Off Diagnostics

### Standard B2B Funnel (Sales-Led)

| Stage | Definition | Trigger | B2B SaaS Benchmark |
|-------|-----------|---------|-------------------|
| **Awareness** | Account in ICP is aware of your company | First recorded touchpoint (ad impression, content view, LinkedIn engagement) | Not tracked directly — proxy: ICP accounts reached per campaign |
| **MQL** | Lead matches ICP criteria and has shown intent | Form fill, demo request, content download with email, minimum engagement score | MQL→SQL conversion: 20–40% (lower end if marketing sets a loose MQL bar) |
| **SQL** | Sales-qualified: pain confirmed, fit validated, next step agreed | Discovery call held, MEDDPICC fields partially filled, opportunity created in CRM | SQL→Opportunity conversion: 60–80% (if SQL definition is tight) |
| **Opportunity** | Active deal in pipeline | Opportunity created in CRM with a real decision timeline | Opportunity→Proposal conversion: 50–70% |
| **Proposal** | Proposal or commercial terms sent | Proposal document sent or verbal pricing discussion | Proposal→Close conversion: 25–40% |
| **Closed-Won** | Contract signed | Signed contract or payment received | — |

**Stage conversion by channel (track these per channel):**

Each channel should have its own conversion rate at every stage. A channel that generates high MQL volume but low MQL→SQL conversion is producing quantity, not quality. The revenue contribution per MQL is the primary optimization signal.

```
Revenue contribution per MQL = ACV × MQL→SQL × SQL→Opportunity × Opportunity→Close
Example: €30,000 × 30% × 75% × 35% = €2,363 per MQL
```

This calculation transforms "which channel drives the most leads" into "which channel drives the most revenue per lead" — different answer, different budget allocation.

**The benchmark column above is a starting point, not a published number.** No analyst report (Gartner, Forrester, Benchmarkit, ICONIQ) publishes B2B SaaS conversion rates broken out by these five stages, and the agency content that does disagrees by more than 3x on the same step — MQL→SQL alone is reported anywhere from roughly 13% to 45% depending on the source, because each source is quietly using a different MQL definition. Use the ranges above to flag a stage that's obviously broken, then replace every cell with your own trailing-quarter conversion rate as soon as you have three months of data — your own funnel, consistently defined, is the only number worth deciding on.

Conversion rate drops at specific stages signal specific problems:

| Stage | Drop-Off Pattern | Most Common Root Cause | First Investigation |
|-------|-----------------|----------------------|---------------------|
| MQL → SQL | <20% conversion | MQL definition too loose, wrong ICP, marketing not qualifying | Pull last 20 MQLs that didn't convert — what disqualified them? |
| SQL → Opportunity | <50% conversion | Discovery calls not surfacing real pain, reps not updating CRM correctly | Spot-check 5 SQL-not-converted records — what happened? |
| Opportunity → Proposal | <50% conversion | Deals opened too early — no confirmed budget, no timeline, no economic buyer identified | Compare MEDDPICC field completeness on converted vs. stalled opportunities |
| Proposal → Closed-Won | <25% conversion | Pricing mismatch, no differentiation against the incumbent, single-threaded deal | Read the last 10 Closed Lost Reasons and group them: price / product / process / no-decision |
| Any stage | Time-in-stage 2× the median | The stage has no exit criteria — deals sit because nobody is required to move them | Plot time-in-stage by rep from the transition timestamps |

**Read drop-off by channel before reading it globally.** A 20% MQL→SQL rate across the board is a qualification problem — the MQL bar is too low. The same 20% concentrated in one channel is a channel quality problem, and the fix is budget reallocation, not a new MQL definition. Split every diagnostic above by source before acting on it.

**Fix one stage at a time.** Improving the worst-converting stage changes the volume reaching every stage below it, which invalidates the baseline you just measured. Fix, wait one full sales cycle, re-measure. Two simultaneous fixes and you will never know which one worked.
