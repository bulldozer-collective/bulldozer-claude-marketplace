---
name: |
  market-signals
description: |
  Scan for early macro signals — regulatory shifts, technology inflection points, and behavioral changes that will reshape a market before they're obvious. Triggers on 'weak signals,' 'early signals,' 'macro trends,' 'what's coming,' 'horizon scanning,' 'strategic foresight,' or 'emerging threats.' For current market category dynamics, see market-category. For market size, see market-sizing.
when-to-use: |
  Scan for early macro signals — regulatory shifts, technology inflection points, and behavioral changes that will reshape a market before they're obvious. Triggers on 'weak signals,' 'early signals,' 'macro trends,' 'what's coming,' 'horizon scanning,' 'strategic foresight,' or 'emerging threats.' For current market category dynamics, see market-category. For market size, see market-sizing.
argument-hint: |
  B2B SaaS in HR tech — scan for weak signals that could reshape the market in 12-24 months
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
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

## What Is a Weak Signal?

A weak signal is an early, ambiguous indicator that something important is changing — before that change becomes widely recognized and priced into competitive behavior.

**Strong signal**: "AI is disrupting X" — everyone knows this. Not useful.

**Weak signal**: "Three enterprise HR teams quietly replaced vendor X for a no-name AI tool in Q4" — anomalous, specific, early. Useful.

The value of weak signals is that they allow decisions before competitors react. By the time a trend is on Gartner's Hype Cycle cover, it's too late to build advantage from it.

---

## Signal Categories

Scan across these six domains:

### 1. Technology Signals

| Signal Type | What to Look For |
|-------------|-----------------|
| Model capability jumps | New AI models that change what's automatable in your domain |
| Infrastructure cost drops | API/compute costs falling that change the economics of a product category |
| Developer ecosystem shifts | New frameworks, tools, or APIs that enable products that weren't feasible |
| Platform changes | App store policy changes, API deprecations, platform consolidation |

**Sources**: AI research papers (arxiv.org), developer community discussions (HN, r/MachineLearning), startup activity in the space (AngelList, Crunchbase), OSS project growth rates.

### 2. Regulatory Signals

| Signal Type | What to Look For |
|-------------|-----------------|
| Draft legislation | Bills in committee stage, not yet law — 12–24 months from impact |
| Regulatory guidance | Agencies clarifying rules before formal rulemaking |
| Enforcement actions | What regulators are actively pursuing — signals future priorities |
| International adoption | Regulations enacted elsewhere spreading to new jurisdictions |

**Sources**: Federal Register (US), EUR-Lex (EU), FTC/SEC/NLRB press releases, law firm regulatory blogs, government RFI responses.

### 3. Behavioral Signals

| Signal Type | What to Look For |
|-------------|-----------------|
| Buyer behavior shifts | New procurement patterns, new evaluation criteria, new stakeholders involved in decisions |
| Talent / hiring patterns | What skills companies are hiring for — signals strategic direction |
| Usage pattern changes | How end users are using adjacent tools differently |
| Vocabulary shifts | New language buyers are using to describe problems (precedes product category awareness) |

**Sources**: LinkedIn job postings (track changes over time), Reddit and Slack community discussions, customer support tickets, sales call recordings, G2 review language changes.

### 4. Competitive Signals

| Signal Type | What to Look For |
|-------------|-----------------|
| Strategic pivots | Incumbents quietly changing product direction or messaging |
| Funding patterns | Where VC money is moving in the category |
| M&A activity | Acquisitions that signal what incumbents see as strategic |
| Pricing changes | Competitors repricing — up (confidence) or down (pressure) |
| Hire patterns | Executive hires that signal new product bets |

**Sources**: Press releases, LinkedIn job postings (executive hires), Crunchbase funding, product changelog tracking, pricing page history (Wayback Machine).

### 5. Customer Signals

| Signal Type | What to Look For |
|-------------|-----------------|
| Churn to unexpected alternatives | Customers leaving for tools not previously on your radar |
| Feature requests clustering | Multiple unrelated customers requesting the same thing — may indicate a market shift |
| Language changes in conversations | Customers using new vocabulary to describe their problems |
| New stakeholders in deals | A new persona entering the buying process |

**Sources**: CRM notes and call recordings, churn surveys, NPS verbatims, support ticket tagging, sales meeting notes.

### 6. Macro / Economic Signals

| Signal Type | What to Look For |
|-------------|-----------------|
| Budget pressures | Macro conditions shifting IT/marketing/ops budgets |
| Workforce changes | Remote work shifts, labor market changes that affect your buyer's priorities |
| Industry consolidation | M&A in your customers' industries changing who the buyers are |
| Supply chain / infrastructure changes | Changes in the infrastructure your product runs on |

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
| Behavioral | Reddit subs for your ICP, LinkedIn posts by power users, customer interviews |
| Competitive | Competitors' changelogs, job boards, Crunchbase, SEC filings |
| Customer | Your CRM, NPS data, churn interviews, support tickets |
| Macro | McKinsey Global Institute, FRED data, industry reports |

### Step 2 — Signal Collection

Search each source for anomalies — things that don't fit the current narrative. Don't look for confirmation of what you already know. Look for contradictions.

### Step 3 — Pattern Matching

Group signals by theme. Three unrelated signals pointing in the same direction is stronger than one obvious one.

### Step 4 — Implication Mapping

For each signal cluster: if this plays out, what changes? Who wins? Who loses? Where is the asymmetric opportunity?

---

## Watch List

The scan output includes a **prioritized watch list** — the top 3–5 signals to monitor in the next 30–90 days, with specific indicators that would confirm or deny them.

Reviewed quarterly. Signals graduate from watch list to strategic priorities when confirmation accumulates.