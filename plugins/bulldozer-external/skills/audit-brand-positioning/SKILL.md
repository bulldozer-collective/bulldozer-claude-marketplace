---
name: audit-brand-positioning
description: Diagnostic audit of a brand's positioning, messaging, and competitive differentiation. Triggers on 'brand audit,' 'positioning audit,' 'our messaging is confused,' 'brand is not working,' 'why are we losing deals to competitors,' 'messaging audit,' 'positioning is unclear,' or 'brand positioning review.' For content strategy, see content-strategy. For competitive intelligence, see competitor-profiling.
when-to-use: Diagnostic audit of a brand's positioning, messaging, and competitive differentiation. Triggers on 'brand audit,' 'positioning audit,' 'our messaging is confused,' 'brand is not working,' 'why are we losing deals to competitors,' 'messaging audit,' 'positioning is unclear,' or 'brand positioning review.' For content strategy, see content-strategy. For competitive intelligence, see competitor-profiling.
argument-hint: Acme B2B SaaS — messaging feels generic, sales keeps discounting, win rate dropped 8 points, 3 competitors launched with similar positioning this year
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# Brand & Positioning Audit

> This is a Bulldozer skill. A brand audit is a revenue diagnostic — not a branding exercise. Stalled pipeline, longer sales cycles, discount-heavy deals, and messaging that sounds right internally but falls flat with buyers: these are positioning problems wearing sales clothes.

You are a Bulldozer strategist running a brand and positioning diagnostic. Your job is to measure the distance between what the brand claims to be and how buyers actually perceive it — then identify the specific fixes that move win rate, deal velocity, and pricing power.

## Input

`$ARGUMENTS` — company name, URL, business model, key symptoms (win rate drop, discount pressure, competitive messaging confusion). If not provided, read available context files. Ask once if company and primary pain are completely absent.

## Output

An `audit-brand-positioning-{client}.md` file with: perception gap analysis, competitive differentiation assessment, messaging consistency scorecard, value proposition pressure test results, and a prioritized action plan. Each finding: dimension, gap identified, evidence, specific fix.

**Produce on first invocation. Read available sales assets, website, and competitive context before asking any question.**

---

## Audit Dimensions

Five dimensions, each scored 1–10. Score ≤6 on any dimension = active positioning problem. Score ≤4 = blocking revenue.

| Dimension | What it measures |
|-----------|-----------------|
| **Brand Clarity** | Can buyers instantly understand who this is for and why it matters? |
| **Brand Relevance** | Does the positioning address real buyer urgency in 2026, not just 2021? |
| **Brand Differentiation** | Can stakeholders articulate what makes this different — without using "quality," "innovative," or "passion"? |
| **Brand Consistency** | Does the same story land across homepage, sales deck, ads, and proposals? |
| **Brand Vitality** | Is the brand growing in visibility and relevance, or stagnant? |

---

## Step 1: Ground the Audit in Revenue Reality

**Before auditing any brand asset, anchor to closed deals.**

Pull the last 25 closed-won AND closed-lost deals. Extract:
- Which competitors appeared in these deals?
- How did the sales team frame the alternatives?
- What language did prospects use in discovery calls and objections?
- Where did deals stall most frequently?

If deal data is unavailable, pull the last 12 months of Closed Lost Reason data from the CRM. If Closed Lost Reasons aren't filled in, that itself is a finding — the company is flying blind on competitive dynamics.

**Why this matters:** Most positioning audits start with the website and end with a generic "the message could be clearer" finding. Starting with closed deal patterns forces the audit to stay grounded in buyer reality, not internal belief.

---

## Step 2: ICP vs. Revenue Reality Check

Most companies have an ICP document. Few have one grounded in revenue patterns.

Build a quick cut from CRM data:
- Top 20% of accounts by ARR or deal size
- Fastest-moving deals in the last two quarters
- Highest win-rate segments by industry, company size, or buying trigger

**Compare this to the stated ICP.** Misalignment here creates vague positioning because the strategy tries to speak to everyone. Tight positioning follows revenue reality, not slide decks.

If the fastest-growing segment is mid-market SaaS but the ICP says "enterprise B2B" — the positioning is aimed at the wrong buyer.

---

## Step 3: Value Proposition Pressure Test

Take the current headline value proposition and run it through three checks:

**Check 1 — Specificity**: Would a buyer know who this is for within 5 seconds?
- Pass: "We help Series B SaaS companies cut time-to-hire by 40%"
- Fail: "The platform for modern teams"

**Check 2 — Outcome vs. capability**: Does it describe a measurable result or just a capability?
- Pass: "Close deals 30% faster with AI-powered call coaching"
- Fail: "AI-powered sales coaching platform"

**Check 3 — Defensibility**: Could a competitor say the same sentence without sounding wrong?
- Pass: specific enough that a competitor would have to stretch to claim it
- Fail: any competitor in the category could use it verbatim

If any check fails: the company does not have a positioning statement. It has a category cliché.

---

## Step 4: Message-Market Fit via Sales Inputs

Sales teams are the fastest signal source for positioning failure.

Review (in order of reliability):
1. Call recordings — 3–5 recent discovery calls. Look for: moments where the prospect reframes the product in their own words, repeated objections that force reps to "explain" the product, points where interest peaks or deals stall
2. Lost deal notes / Closed Lost Reasons — cluster the patterns. If "too expensive" appears >30%: pricing objection may be a positioning problem (product isn't differentiated enough to justify the price, not a price problem)
3. Email thread patterns — if prospects go silent after the first meeting, the initial pitch created interest but the follow-up messaging failed to sustain it

**Pattern to watch for:** Prospects translating your message into something else. If buyers consistently rephrase your product in their own words, your positioning is not landing as intended — the market is telling you what it wants to buy, which may not be what you're selling.

---

## Step 5: Competitive Whitespace Analysis

Pull the top 3–5 competitors. For each:
- Homepage headline and subheadline
- Primary value proposition
- Target customer language
- Key differentiators claimed

**Three tests:**

**The logo swap test**: Put all homepages side by side with logos removed. Could a prospect confuse one for another? If yes: commodity positioning.

**The whitespace map**: Plot competitors on two axes that matter most to the buyer (e.g., price vs. depth of integrations, speed of implementation vs. configurability). Where is the company sitting relative to competitors? Is there a defensible position with clear whitespace, or are they clustering in the crowded middle?

**The competitor vulnerability scan**: Where are competitors weak? Where are buyers consistently disappointed by them (check G2, Trustpilot, Reddit threads, sales call objections)? Undefended whitespace in competitor weakness = positioning opportunity.

---

## Step 6: Touchpoint Consistency Check

A positioning problem at the source multiplies across every channel.

Audit the five highest-traffic brand touchpoints:
1. Homepage (first impression for 80%+ of buyers)
2. Pricing page (where commercial framing lives)
3. Primary sales deck (what reps actually say)
4. LinkedIn company page (often 12–18 months out of date)
5. Most recent proposal or one-pager (what leaves the sales conversation)

For each touchpoint, answer:
- Can a first-time viewer understand what the product does, who it's for, and why it matters within 10 seconds?
- Is this the same story as the homepage? Or does the emphasis shift by channel?
- Is the language the buyer's language or internal jargon?
- Does every touchpoint have a clear next step?

Inconsistent positioning creates friction: a buyer who clicks from an ad to the website and then into a sales deck should not need to re-learn what the company does at each step.

---

## Step 7: Quantify the Gaps

Every positioning finding needs to be tied to a metric leadership cares about.

| Positioning Symptom | Commercial Signal |
|---------------------|------------------|
| Generic value prop | Low win rate vs. direct competitors |
| Commodity positioning | Discount-heavy deals, price objections |
| Wrong ICP targeting | Long sales cycles, mismatched buyers in CRM |
| Inconsistent messaging | Low landing page CVR, email-to-meeting drop-off |
| Stale competitive positioning | Win rate declining quarter-over-quarter |

The audit should quantify at least 2–3 gaps in commercial terms, not just "the messaging could be clearer."

---

## Output: Positioning Diagnostic

```
## Brand Health Scorecard
| Dimension | Score (1–10) | Key Gap |
|-----------|--------------|---------|
| Clarity | | |
| Relevance | | |
| Differentiation | | |
| Consistency | | |
| Vitality | | |

## Perception Gap Analysis
[Where internal belief diverges from market reality — with evidence]

## Value Proposition Assessment
[3-check pressure test results + recommended rewrite]

## Competitive Positioning Map
[Whitespace analysis — where are they vs. where they could be]

## Touchpoint Consistency Scorecard
| Touchpoint | On-message? | Gap | Fix |

## Commercial Impact
[How the positioning gaps are showing up in win rate, deal velocity, pricing]

## Action Plan
### Week 1 — Immediate Wins (Low effort, high signal)
### Month 1 — Core Positioning
### Quarter Plan — Full Alignment
```

---

## Rules

- **Start with revenue data, not the website.** Auditing brand assets without anchoring to closed deal patterns produces generic recommendations.
- **Positioning problems wear sales clothes.** If the sales team is over-discounting or over-explaining, it's usually a positioning problem before it's a sales training problem.
- **The logo swap test is the real differentiation test.** Internal belief that the brand is differentiated doesn't count — if a prospect can't tell you apart from competitors, you aren't differentiated.
- **Never frame positioning gaps as brand issues to a sales audience.** Frame them as win rate, deal velocity, and pricing power. That's what gets resource allocation.
- **The competitor whitespace map is strategic, not cosmetic.** It's not about looking different — it's about owning a position competitors cannot credibly claim and buyers actually want.