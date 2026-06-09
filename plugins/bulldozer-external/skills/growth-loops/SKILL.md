---
name: growth-loops
description: Define the North Star Metric and map growth loops that compound user acquisition and retention. Triggers on 'north star metric,' 'growth loops,' 'define our key metric,' 'growth flywheel,' or 'retention loop.' For paid acquisition strategy, see paid-strategy. For referral loops specifically, see referral-program.
when-to-use: Define the North Star Metric and map growth loops that compound user acquisition and retention. Triggers on 'north star metric,' 'growth loops,' 'define our key metric,' 'growth flywheel,' or 'retention loop.' For paid acquisition strategy, see paid-strategy. For referral loops specifically, see referral-program.
argument-hint: B2B project management SaaS, PLG motion, 500 teams, want to find our NSM and growth loops
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# North Star Metric & Growth Loops

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on North Star Metric definition and growth loop mapping. Your goal is to identify the metric that best captures delivered value, map the loops that compound growth, and prioritize which lever to pull first.

## Input

`$ARGUMENTS` — company description and GTM motion (e.g., "B2B project management SaaS, PLG motion, 500 active teams, mixing self-serve and sales-assisted"). If not provided, read any available context files before asking. Only ask if the company type and GTM motion are completely absent.

## Output

A `growth-strategy-{company}.md` file with: North Star Metric definition (with diagnostic sub-metrics), 2–3 growth loop diagrams (text-based), growth lever prioritization matrix, and 90-day action plan targeting the highest-leverage loop. Each loop includes: trigger, action, output, and compounding mechanism.

**Produce output on first invocation. Read available context before asking. Only ask if the primary input is completely absent.**

---

## What Makes a Good North Star Metric

A North Star Metric (NSM) is the single metric that best captures the value your product delivers to customers. When it goes up, your business is healthy. When it stagnates, something is wrong.

**Four criteria for a valid NSM**:
1. **Measures delivered value** — not just activity ("tasks created" is activity; "projects completed" is value)
2. **Leads revenue** — NSM growth precedes revenue growth; revenue is a lagging indicator
3. **Owned by the whole team** — product, marketing, and sales all contribute to it
4. **Actionable** — you can identify specific product or marketing changes that move it

**What it is NOT**:
- Revenue (lagging, doesn't capture value delivery)
- DAU/MAU (activity, doesn't capture value)
- Registered users (acquisition, not retention)
- NPS (sentiment, not behavior)

### NSM Examples by Business Model

| Business type | Example NSM | Why |
|--------------|-------------|-----|
| PLG SaaS (productivity) | "Teams completing 3+ projects per month" | Captures adoption depth, not just signup |
| Marketplace | "Transactions per month with repeat on both sides" | Captures liquidity + retention |
| B2B SaaS (workflow) | "Weekly active users per paying team" | Captures expansion potential and health |
| Consumer subscription | "Subscribers active at day 30" | Retention-weighted acquisition |
| E-commerce | "Customers placing 2nd order within 60 days" | Repeat purchase = sustainable unit economics |
| Community | "Members posting at least once per week" | Contribution, not lurking |

---

## North Star Metric Definition Workshop

Work through these questions to find the NSM:

**1. What is the "aha moment" — when does a user first experience real value?**
Not what they signed up for. The moment they get the output they came for.

**2. What behavior signals they've embedded your product into their workflow?**
This is the habit formation moment. It often happens at a specific frequency threshold.

**3. What does an account that never churns look like?**
Find the behavioral signature of retained accounts and build backward.

**4. What does an account that expands (upgrades, adds seats) have in common?**
Expansion leads to revenue. The NSM should predict both retention and expansion.

**Candidate NSM formula**: "Number of [user segments] who [core action] [frequency threshold] within [time window]"

Example: "Teams who complete a project and invite a collaborator within their first 14 days"

---

## Growth Loop Architecture

A growth loop is a self-reinforcing system where an output becomes an input to the next cycle. Growth loops compound; funnels decay.

### Loop Structure

```
[Trigger] → [Action] → [Output] → [Feeds back to Trigger]
```

Every company has 2–3 primary loops. Map them all before choosing where to invest.

### The Four Core Loop Types

**1. Acquisition Loop (Virality)**

```
User gets value → Shares with others → New users join → They get value → Loop
```

Mechanics: referrals, sharing features, co-created content, embeddable widgets, "powered by" branding.

Metric: viral coefficient K = (invitations per user) × (conversion rate of invitation)
- K > 1: exponential growth
- K 0.5–1: meaningful support for other channels
- K < 0.5: loop exists but needs other acquisition

**2. Retention Loop (Habit Formation)**

```
User builds data/history → Product gets more valuable → User comes back → More data → Loop
```

Mechanics: data accumulation, personalization, network effects within the account, notification triggers.

Strong retention loops make churn expensive — users lose something real when they leave. This is the most underrated growth lever.

**3. Monetization Loop (Expansion)**

```
Team adopts product → More teams/seats needed → Account expands → More budget invested → Loop
```

Mechanics: seat-based pricing, usage-based pricing, team-viral within an org, cross-department spread.

**4. Content Loop (SEO + Authority)**

```
Users generate outputs → Outputs get indexed/discovered → New users find product → Use it → Generate outputs → Loop
```

Mechanics: user-generated content, public templates/profiles, embeddable showcases.

---

## Text-Based Loop Diagrams

### Loop Diagram Format

```
[INPUT]
  │
  ▼
[ACTION]
  │
  ▼
[OUTPUT]
  │
  └──────────────────► [feeds back to INPUT]
```

### Example: PLG Acquisition Loop

```
[User solves a problem with the product]
  │
  ▼
[Invites teammate to collaborate]
  │
  ▼
[Teammate joins → new active user]
  │
  ▼
[New user solves a problem with the product]
  │
  └──────────────────► [Invites their teammates → Loop]

Metric: Team invitations per active project
Target: 0.8+ invitations per project within 30 days
Lever: Make collaboration the default (not optional) in core workflow
```

### Example: Retention + Monetization Loop

```
[Team uses product for core workflow]
  │
  ▼
[Builds projects, history, templates]
  │
  ▼
[Value locked in product increases (switching cost rises)]
  │
  ▼
[Team expands to other departments / adds seats]
  │
  ▼
[More departments → more workflow → more projects]
  │
  └──────────────────► [Value locked in increases further → Loop]

Metric: Departments per account using the product
Target: 2+ departments active within 90 days
Lever: Cross-department template sharing and reporting
```

---

## Lever Prioritization Matrix

Score each potential lever on three dimensions (1–5 each):

| Lever | Impact on NSM | Speed to effect | Effort to build | Score |
|-------|:-------------:|:---------------:|:---------------:|:-----:|
| [Lever 1] | | | | |
| [Lever 2] | | | | |

Score = (Impact × 2 + Speed) / Effort

**Bulldozer rule**: Pick the single highest-scoring lever and go all-in for 8 weeks before evaluating the next one. Splitting attention across 5 levers simultaneously is the most common growth failure mode.

---

## 90-Day Action Plan

**Weeks 1–2: Measure**
- Instrument the NSM in your analytics (if not already tracked)
- Build a cohort analysis: what behaviors in week 1 predict 90-day retention?
- Map your current loop performance (what's the K coefficient? what's the expansion rate?)

**Weeks 3–6: Prioritize and Execute**
- Identify the bottleneck in your highest-leverage loop
- Run one focused experiment targeting that bottleneck
- Track weekly: NSM trend + loop metric

**Weeks 7–12: Compound**
- Validate experiment results
- Scale what worked
- Identify next bottleneck in the loop
- Evaluate secondary loop

---

## Common NSM Mistakes

- **Choosing revenue as the NSM**: Revenue is an output of value delivery, not the delivery itself. A team that maximizes revenue in the short term can do so by degrading the product experience. The NSM should be the leading indicator of sustainable revenue.
- **Choosing an easily-gamed metric**: "Monthly logins" can be inflated with email notifications. Choose a metric that represents actual value consumption.
- **Having multiple NSMs**: One NSM, 3–5 diagnostic sub-metrics. Teams that track 12 "north star" metrics track none of them.
- **Picking an aspirational metric you can't yet measure**: If you don't have the data to calculate it today, pick a proxy you can measure now and plan to migrate to the ideal metric in 6 months.