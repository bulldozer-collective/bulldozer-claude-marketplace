---
name: |-
  market-signals
description: |-
  Scan for early macro signals — regulatory shifts, technology inflection points, and behavioral changes that will reshape a market before they're obvious. Triggers on 'weak signals,' 'early signals,' 'macro trends,' 'what's coming,' 'horizon scanning,' 'strategic foresight,' or 'emerging threats.' For current market category dynamics, see market-category. For market size, see market-sizing.
when-to-use: |-
  Scan for early macro signals — regulatory shifts, technology inflection points, and behavioral changes that will reshape a market before they're obvious. Triggers on 'weak signals,' 'early signals,' 'macro trends,' 'what's coming,' 'horizon scanning,' 'strategic foresight,' or 'emerging threats.' For current market category dynamics, see market-category. For market size, see market-sizing.
argument-hint: |-
  B2B SaaS in HR tech — scan for weak signals that could reshape the market in 12-24 months
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Weak Signals Scan

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on strategic foresight. Your goal is to identify early signals — not obvious trends, but the early indicators that something is changing before it becomes consensus — so decisions can be made before the market moves.

## Input

`$ARGUMENTS` — industry or product domain and time horizon (e.g., "B2B SaaS in HR tech — scan for signals that will reshape the market in 12–24 months"). If not provided, read any available context files. Only ask if the industry is completely absent.

## Output

A `signals-scan-{domain}-{date}.md` file with: signal inventory (categorized by type), signal strength assessment, implications per signal, strategic options triggered by each signal, and a prioritized watch list. Signals are labeled by confidence and urgency.

**Produce output on first invocation. Read available context before asking. Only ask if the domain is completely absent.**

---

## When Not to Run a Full Six-Category Scan

A scan is not free — it costs the time of whoever reads the output, and every OS Signal it triggers for a named account costs real credits (see the Bulldozer OS notes below). Don't run the full six-category sweep when:

- **Nothing has moved since the last review.** If the previous quarterly watch-list review produced zero new corroborating evidence on any tracked signal, re-scanning all six categories from scratch is busywork — re-check the existing watch list first (see Watch List below) and only open a fresh full scan if that check itself turns up something new.
- **Nobody can act on what it finds.** A scan commissioned by a team with no mandate or budget to change direction produces a document nobody uses. If the real question is "should we act on trend X we already suspect," that's a narrower, one-signal question — answer it directly instead of dressing it up as a full scan.
- **The domain is genuinely stable.** A mature, slow-moving market (regulation settled, technology plateaued, competitors static) doesn't reward the same cadence as a market moving fast. Scale the scan to how much the domain actually moves, not to a fixed calendar habit.

When in doubt, scan narrower and more often rather than wide and rare: a scan of one or two categories that's actually read beats a six-category report that becomes a quarterly ritual nobody opens.

---

## What Is a Weak Signal?

A weak signal is an early, ambiguous indicator that something important is changing — before that change becomes widely recognized and priced into competitive behavior.

**Strong signal**: "AI is disrupting X" — everyone knows this. Not useful.

**Weak signal**: "Three enterprise HR teams quietly replaced vendor X for a no-name AI tool in Q4" — anomalous, specific, early. Useful.

The value of weak signals is that they allow decisions before competitors react. By the time a trend is on Gartner's Hype Cycle cover, it's too late to build advantage from it.

> **Naming note**: Bulldozer OS has its own feature also called "Signals" (`bdzCreateSignal`, `bdzListSignalTypes`) — a lead-generation tool with 32 types that drop matching leads into a lead list. Only a couple of those types watch a named list of companies you already track; most discover companies by ICP filter instead (see the Competitive Signals section below for which is which). It is one source among several for the Behavioral and Competitive categories below — not a synonym for the macro/domain-level weak signals this skill scans for.

---

## Signal Categories

Scan across these six domains:

For the six categories to scan — Technology, Regulatory, Behavioral, Competitive, Customer, Macro / Economic — read `references/signal-categories.md`: the signal-type table and sources for each, plus the Bulldozer OS notes on which Signal types watch a named account list and how to spend credits (Competitive Signals section). Read it before building the source inventory.

---

## Signal Strength Assessment

For each signal identified, rate:

| Dimension | Questions | Rating |
|-----------|-----------|--------|
| **Strength** | How clear and specific is the evidence? | Weak / Moderate / Strong |
| **Urgency** | How quickly will this impact the market? | 6 mo / 12 mo / 24 mo / 3+ yr |
| **Reach** | How broadly will this affect the market? | Niche / Segment / Broad |
| **Confidence** | How confident are you in the signal? | Low / Medium / High |

Prioritize: High confidence × High urgency × Broad reach.

**Corroboration matters more than any single mention.** Current horizon-scanning practice treats one blog post or one job posting as noise, not a signal — confidence rises when independent source types point the same way (e.g. a hiring pattern *and* a pricing change *and* a changelog shift, not three mentions of the same event). Don't rate a signal High confidence off a single source, however specific it sounds.

**Don't invent a conversion rate for how many signals turn out to matter.** There is no reliable published figure for what share of raw signals are noise, or what share of watched signals eventually become a real strategic priority — searches for exact numbers here consistently turn up only unaudited vendor content, not a named study. State the ratio you actually observed on this scan if it's useful context ("6 of the 20 raw signals collected made it past Step 3's pattern matching"), never a general benchmark percentage borrowed from a blog.

---

## Signal Output Format

For each signal:

```markdown
### Signal: [Name]

**Category**: [Technology / Regulatory / Behavioral / Competitive / Customer / Macro]
**Strength**: [Weak / Moderate / Strong]
**Urgency**: [6mo / 12mo / 24mo / 3yr+]
**Confidence**: [Low / Medium / High]

**Evidence**:
- [Specific observation 1 — source, date]
- [Specific observation 2 — source, date]

**What It Means**:
[1–2 sentences: if this signal strengthens and becomes mainstream, what changes in the market?]

**Strategic Options**:
- [Option 1: offensive — how to capitalize]
- [Option 2: defensive — how to protect against]
- [Option 3: watch — what would confirm or deny this signal]

**Watch Indicators**:
- [What to look for in the next 60 days that would confirm this signal]
```

---

## Scan Process

### Step 1 — Source Inventory

Before scanning, list the sources you'll check for this domain. Good sources per category:

| Category | Sources |
|----------|---------|
| Technology | arxiv.org, Hacker News, AI newsletters (import AI, Last Week in AI) |
| Regulatory | Federal Register, FTC/DOJ press releases, EU AI Act tracker |
| Behavioral | Reddit subs for your ICP, LinkedIn posts by power users, customer interviews; Bulldozer's job-offers watchlist Signal for a named account list, its growth/departure/recruitment Signals for broader ICP-filtered discovery |
| Competitive | Competitors' changelogs, job boards, Crunchbase, SEC filings; Bulldozer competitor tracking, public ads, competition-intensity score, and the competitor-relationship Signal for tracked competitors |
| Customer | Your CRM, NPS data, churn interviews, support tickets; HubSpot deal/company data via the CRM connector, if connected |
| Macro | McKinsey Global Institute, FRED data, industry reports |

### Step 2 — Signal Collection

Search each source for anomalies — things that don't fit the current narrative. Don't look for confirmation of what you already know. Look for contradictions.

### Step 3 — Pattern Matching

Group signals by theme. Three unrelated signals pointing in the same direction is stronger than one obvious one.

### Step 4 — Implication Mapping

For each signal cluster: if this plays out, what changes? Who wins? Who loses? Where is the asymmetric opportunity?

**A blank answer is a valid answer here.** If a cluster's evidence doesn't actually support a "who wins / who loses" call, write "insufficient evidence to map implications yet" rather than inventing a plausible-sounding story to fill the template. A framework filled in for its own sake is worse than an honest gap — it's the gap dressed up as an answer, and it's what gets a scan wrongly acted on.

---

## Watch List

The scan output includes a **prioritized watch list** — the top 3–5 signals to monitor in the next 30–90 days, with specific indicators that would confirm or deny them. Cap it at what someone will actually re-check next quarter, not at how many signals the scan happened to surface — a watch list of fifteen items is a filing exercise, not a decision tool.

**Two speeds, not one.** Current horizon-scanning practice separates the cadence of *watching* from the cadence of *deciding*: the sources behind each watch-list item are worth a quick look monthly or even weekly (a job board, a pricing page, a changelog don't wait for your calendar), while the strategic call — graduate, keep watching, or drop — stays a quarterly decision. A purely quarterly scan with no lighter check in between means a signal can move for two months before anyone notices.

**Graduation threshold.** A signal graduates from watch list to strategic priority when it picks up corroboration from a *different* category than the one it started in — a technology signal joined by a customer-behavior signal moving the same direction is a real promotion; three more mentions of the same job posting is not (see the corroboration rule above). Rate the promotion on category diversity, not on mention count.

**Demotion threshold.** A signal that has sat on the watch list through two consecutive quarterly reviews with no new corroborating evidence gets dropped, not carried forward out of habit. Carrying a stale signal quarter after quarter clutters the list and buries the ones that are actually moving — the same list-hygiene logic as retiring a dead lead rather than leaving it in permanent limbo.

---

## Rules

- **No scan without a reader.** Don't run the full six-category sweep for a team with no mandate to act on it, or for a domain that hasn't moved since the last review — see When Not to Run a Full Scan.
- **One mention is noise, not a signal.** A single job posting, a single blog post, a single anecdote earns nothing above Weak confidence on its own — confidence comes from independent source types converging, never from repetition within one source.
- **Category diversity promotes a signal; mention count doesn't.** A watch-list item graduates when a *different* category corroborates it, not when the same category repeats itself.
- **A stale signal gets dropped, not carried.** Two full quarterly reviews with no new corroboration is the demotion point — a watch list that only grows is a hoarding habit, not a discipline.
- **No invented conversion rates.** There is no sourced figure for what share of raw signals become real priorities — report the ratio actually observed on this scan, or say nothing, never a borrowed benchmark percentage.
- **A blank implication is honest; a filled-in guess is not.** If the evidence doesn't support a "who wins / who loses" call, say so — don't complete the template with a plausible story.
- **Spend OS Signal credits on named-account conviction, not open-ended curiosity.** The priciest signal types cost up to ~24x the cheapest per lead — reserve them for accounts the scan has already narrowed to, and turn a refresh off once its question is answered.
- **Watch what moves fast, review on a slower clock.** Check sources for the watch list monthly or weekly; keep the graduate/hold/drop decision itself quarterly. Don't let a purely quarterly cadence be the only thing standing between a moving signal and being noticed.