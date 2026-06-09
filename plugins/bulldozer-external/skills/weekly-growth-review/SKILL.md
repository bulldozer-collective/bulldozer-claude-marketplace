---
name: |
  weekly-growth-review
description: |
  Build a weekly growth review system — north star metric, leading indicator KPI tree, 60-minute meeting structure, red/amber/green threshold system, and IDS issue resolution protocol. Triggers on 'weekly growth review,' 'weekly metrics review,' 'growth meeting,' 'weekly KPIs,' 'growth dashboard,' 'how do we track growth weekly,' or 'we're always surprised at month end.' For attribution methodology, see attribution-funnel. For cohort analysis, see cohort-mmm.
when-to-use: |
  Build a weekly growth review system — north star metric, leading indicator KPI tree, 60-minute meeting structure, red/amber/green threshold system, and IDS issue resolution protocol. Triggers on 'weekly growth review,' 'weekly metrics review,' 'growth meeting,' 'weekly KPIs,' 'growth dashboard,' 'how do we track growth weekly,' or 'we're always surprised at month end.' For attribution methodology, see attribution-funnel. For cohort analysis, see cohort-mmm.
argument-hint: |
  B2B SaaS, sales-led motion, 4-person growth team, currently doing ad-hoc monthly reporting — want a weekly rhythm that surfaces issues before month-end surprises
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# Weekly Growth Review

> This is a Bulldozer skill. Monthly reporting is a post-mortem. Weekly review is a cockpit. By the time you find out at month-end that your pipeline dried up, you had 3 weeks to fix it and didn't see it. The weekly review exists to make that impossible.

You are a Bulldozer growth operator building a weekly growth review system. Your job is to define the north star metric, build a lean KPI tree, design a 60-minute meeting structure, set red/amber/green thresholds, and create an issue resolution protocol that converts red metrics into closed actions — not discussion.

## Input

`$ARGUMENTS` — company stage, GTM motion (sales-led, marketing-led, PLG), team size, current metrics tracked and where they live, and what "growth" means in this context. If not provided, read available context files. Ask once if stage and motion are completely absent.

## Output

A `growth-review-{company}.md` file with: north star metric definition and validation, full KPI tree (north star → stage metrics → leading indicators), 60-minute meeting agenda, threshold system per metric, and the IDS issue resolution protocol. Ready to run on Monday.

**Produce on first invocation. Default to a sales-led B2B motion. Adapt based on context.**

---

## Why Monthly Reporting Fails

Monthly reporting produces three failure modes:
1. **Discovery too late** — A pipeline drop visible in week 1 becomes an unfixable miss by week 4. You spend the last week explaining what happened instead of fixing what's happening.
2. **Lagging indicators dominate** — Monthly reviews track revenue and closed deals. By then the decision is 30–60 days old. Leading indicators — outreach sent, demos held, activation completions — live at the weekly level.
3. **Meeting fills with updates, not decisions** — When metrics are only reviewed monthly, everyone shows up to explain their number. A weekly rhythm forces decisions because the same number will appear again in 7 days.

**The rule:** Every red metric in week 1 gets an owner, a root cause, and a countermeasure before the meeting ends. No exceptions.

---

## Step 1: Define the North Star Metric

The North Star Metric (NSM) is the single metric that best captures the value your product delivers to customers. It is not revenue — revenue is the output. The NSM is the behavior that predicts revenue.

**Three tests for a valid NSM:**
1. **Behavioral** — It measures value-creating behavior, not activity. "Accounts with 2+ collaborators" beats "logins." "Deals advanced to proposal stage" beats "demos held."
2. **Controllable** — Teams can influence it weekly. If it only moves monthly, it's not a weekly metric.
3. **Predictive** — It correlates with retention and revenue in cohort analysis. Back-test: do accounts that hit the NSM milestone in week 2 retain at higher rates than those that don't?

**NSM candidates by motion:**

| Motion | Strong NSM candidates |
|--------|----------------------|
| Sales-led | Qualified pipeline created per week, or discovery calls held with ICP-fit accounts |
| Marketing-led | MQLs reaching sales-ready threshold, or inbound demo requests from target segment |
| PLG | Accounts reaching activation milestone by day 7, or weekly active accounts with 2+ users on core feature |
| Hybrid | Qualified opportunities created (marketing or sales sourced) |

**NSM definition format:**
> "We succeed when [specific actor] [completes specific behavior] [within specific timeframe]."
> Example: "We succeed when ICP-fit accounts book a discovery call within 14 days of first outbound touch."

**Guardrails (what not to optimize against):**
Define 1–2 guardrails that prevent gaming the NSM. Example: if NSM is "demos held," the guardrail is "demo-to-proposal conversion ≥35%" — prevents booking low-quality demos just to hit the number.

---

## Step 2: Build the KPI Tree

The KPI tree connects the NSM to the weekly actions teams can take. Maximum structure: 1 NSM → 4 stage metrics → 8–10 leading indicators.

**Standard tree for sales-led B2B:**

```
NORTH STAR: Qualified pipeline created per week
│
├── ACQUISITION
│   Stage metric: ICP accounts contacted per week
│   Leading indicators:
│   • Outreach sequences activated (target: [X]/week)
│   • ICP accounts in active sequence (target: [X] total)
│
├── ACTIVATION (MQL → SQL)
│   Stage metric: Discovery calls held with ICP accounts
│   Leading indicators:
│   • Positive reply rate to outreach (target: >5%)
│   • Discovery-to-pipeline conversion (target: >60%)
│
├── REVENUE (SQL → Close)
│   Stage metric: Opportunities advanced per stage per week
│   Leading indicators:
│   • Pipeline coverage ratio (next quarter: target >3x)
│   • Demo-to-proposal conversion (target: >50%)
│   • Avg sales cycle vs. target (flag if >120% of target)
│
└── RETENTION (Pipeline health)
    Stage metric: NRR (tracked monthly, flagged weekly if warning signals)
    Leading indicators:
    • At-risk accounts (usage below activation threshold)
    • Expansion opportunities identified
```

**Rules for the KPI tree:**
- Each leading indicator must be movable by a named team or person in a single week
- No orphan metrics (metrics that require other teams but have no joint owner)
- No lagging indicators at the weekly level — track them monthly, reference them in the weekly for context only

---

## Step 3: 60-Minute Meeting Structure

The weekly growth review is not a status update. It is a decision-making session.

**Structure (60 minutes, fixed):**

| Block | Duration | Format | Goal |
|-------|----------|--------|------|
| Action review | 5 min | Read the action log from last week | Close open items; surface blockers |
| Scorecard reporting | 10 min | Each owner calls their metric: number + RAG status | Get a complete health picture fast |
| Issues discussion | 45 min | Work the red and orange metrics using IDS | Identify root cause + assign action + set deadline |

**Scorecard reporting rules:**
- Each person calls their metric and its RAG status in 30 seconds. Number, status, nothing else.
- No discussion during reporting. No "let me explain." Red metrics get 5 characters max: "16, red." That's it.
- All discussion happens in the issues block.

**What lives on the shared dashboard:**
- NSM (this week vs. last week vs. 4-week average)
- Each stage metric with RAG status
- 3–5 leading indicators with weekly targets
- Annotations: any external factor affecting numbers (holiday, campaign launch, pricing change)

**Meeting rules:**
- No slides — one shared dashboard, visible to all, updated before the meeting
- No updates — if it's not a number or a decision, it doesn't belong in this meeting
- Every red metric leaves with an owner, root cause, and due date logged

---

## Step 4: RAG Threshold System

For each metric, define three thresholds. These are not opinions — they are pre-committed rules. Thresholds set in the moment of a red metric always favor the metric owner.

**Threshold structure:**

| Status | Definition | Response |
|--------|-----------|----------|
| **Green** | Within 10% of target | No action required |
| **Amber** | 10–25% below target | Flag with one hypothesis; monitor next week |
| **Red** | >25% below target OR red two weeks in a row | Full IDS treatment — owner, root cause, action, deadline |

**Example thresholds:**

| Metric | Target | Amber | Red |
|--------|--------|-------|-----|
| ICP outreach sequences activated | 20/week | <18 | <15 or 2 weeks <18 |
| Positive reply rate | 5% | <4.5% | <3.5% |
| Discovery calls held | 8/week | <7 | <6 or 2 weeks <7 |
| Pipeline coverage (next Q) | 3.5x | <3.0x | <2.5x |
| Demo-to-proposal conversion | 50% | <45% | <37% |

**The two-week rule:** A metric that is amber for two consecutive weeks automatically becomes red. Growth problems rarely resolve themselves.

---

## Step 5: IDS Issue Resolution Protocol

IDS = Identify, Discuss, Solve. The structure that turns a red metric into a closed action in 15 minutes.

**Identify (3 minutes):**
State the metric, the gap, and one hypothesis for the root cause. No debate here — one hypothesis per metric owner. "Pipeline coverage is at 2.1x against 3.5x target. Hypothesis: we had 3 reps at the sales conference last week and outreach volume dropped 40%."

**Discuss (7 minutes):**
Test the hypothesis with the data available. Is the drop structural (ICP targeting) or episodic (conference week)? Pull the leading indicator: did outreach volume actually drop? Did reply rate hold up despite lower volume? Or did both drop simultaneously — which would suggest a different root cause?

The three root cause buckets for most growth metric drops:
1. **Volume problem** — Not enough top-of-funnel activity (outreach, traffic, leads). Fix: increase volume this week.
2. **Conversion problem** — Volume is fine but conversion between stages dropped. Fix: diagnose the stage where conversion dropped and identify what changed (messaging, targeting, ICP quality).
3. **Lag problem** — Nothing is actually wrong; the pipeline is building but hasn't converted yet. Fix: no action, increase monitoring.

**Solve (5 minutes):**
One action, one owner, one deadline. Log it in the action tracker. The action must be specific enough that next week's meeting can verify it was done.

Format: "Who does what by when? [Name] will [specific action] by [specific date]."

Not: "The team will improve outreach quality." That's not an action.
Yes: "Alex will rewrite the top 3 outreach sequences using the updated ICP criteria and launch by Thursday."

---

## Weekly KPI Template

```
## Weekly Growth Review — Week of [Date]

### North Star: [NSM name]
This week: [number] | Last week: [number] | 4-week avg: [number] | Status: [RAG]

### Stage Metrics
| Metric | Target | This Week | Status | Owner |
|--------|--------|-----------|--------|-------|
| [Stage 1] | | | | |
| [Stage 2] | | | | |
| [Stage 3] | | | | |
| [Stage 4] | | | | |

### Leading Indicators
| Metric | Target | This Week | Status | Owner |
|--------|---