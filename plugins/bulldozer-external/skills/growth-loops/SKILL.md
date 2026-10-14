---
name: |-
  growth-loops
description: |-
  Define the North Star Metric and map growth loops that compound user acquisition and retention. Triggers on 'north star metric,' 'growth loops,' 'define our key metric,' 'growth flywheel,' or 'retention loop.' For paid acquisition strategy, see paid-strategy. For referral loops specifically, see referral-program.
when-to-use: |-
  Define the North Star Metric and map growth loops that compound user acquisition and retention. Triggers on 'north star metric,' 'growth loops,' 'define our key metric,' 'growth flywheel,' or 'retention loop.' For paid acquisition strategy, see paid-strategy. For referral loops specifically, see referral-program.
argument-hint: |-
  B2B project management SaaS, PLG motion, 500 teams, want to find our NSM and growth loops
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
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

**Don't validate the aha moment by correlation alone.** An action that correlates with retention among your existing users can be a symptom of engagement rather than a cause — the accounts already retaining are the ones most likely to have found time to do it. The only real proof is an experiment: push more new users toward the candidate action and check whether their actual retention moves, not just whether they complete the action. Watch for a second trap: if only a small minority of signups ever reach the candidate action, it isn't a usable aha moment even when it correlates strongly with retention — it's filtering for people already convinced, not something onboarding can actually push the rest toward. Pick an earlier, more reachable candidate instead.

---

## Growth Loop Architecture

A growth loop is a self-reinforcing system where an output becomes an input to the next cycle. Growth loops compound; funnels decay.

### Loop Structure

```
[Trigger] → [Action] → [Output] → [Feeds back to Trigger]
```

Every company has 2–3 primary loops. Map them all before choosing where to invest.

**A loop only compounds what's already there.** If accounts aren't retaining, an acquisition or content loop just pours more users into a bucket that's leaking — it won't read as "growth" for long, because acquisition cost keeps climbing to replace the churn, and the team burns a quarter concluding "the loop doesn't work" when the loop was never the problem. Before mapping loops, check the direction of retention with whatever signal is already available (even a rough one — is usage in week 4 flat or dropping across the last few cohorts). If it's dropping, the highest-leverage move is fixing the Retention Loop below, not picking a lever from the matrix that assumes it's already healthy.

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

K > 1 is rare in practice outside consumer social products — treat it as a diagnostic ceiling, not a target to chase by bolting on more invite prompts. In a mixed self-serve/sales-assisted B2B motion, K itself can mislead: seats often expand because a champion rolls the product out to teammates during onboarding or a sales-assisted deal, not because an end user forwarded an invite link. Where that's the real mechanism, measure it as the Monetization Loop below (seats added per account), not as virality — forcing a K coefficient onto an expansion that isn't viral just produces a number nobody can act on.

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

That 8-week window needs its own stop rule, or it turns into an excuse to keep funding a lever that was never going to work. At the 4-week midpoint, check the loop metric itself, not the NSM: no movement at all, past normal noise, means something in the mechanism is broken — the trigger doesn't fire, the action has friction nobody removed, the output never reaches the next user — and the fix is to re-instrument or redesign that step, not to keep waiting out the clock. A metric moving the right way but short of target at week 8 is a different case entirely: that's "not there yet," and killing it on a calendar deadline throws away a lever that was working.

**Don't score a lever whose "Impact" column is a guess.** A loop diagram with no real trigger rate, action rate, or output rate behind its arrows is a hypothesis, not a growth loop — and this matrix is worthless if it's scored on assumed numbers dressed up as data. Instrument at least the weakest-looking arrow before scoring levers against each other, not after picking a favorite.

---

## 90-Day Action Plan

**Weeks 1–2: Measure**
- Instrument the NSM in your analytics (if not already tracked). If the project runs on Bulldozer OS: check `bdzListGoogleAnalyticsReportTemplates` before building anything — the project may already carry a template close to what the NSM needs, and duplicate templates are common when nobody checks first. Where none fits, `bdzCreateGoogleAnalyticsReportTemplate` builds one from the GA4 dimensions/metrics behind the NSM's core action — reference the metric as `conversions`, the name Bulldozer OS's own curated GA4 catalog uses for a non-Google-Ads conversion event (Google's own product has called this a "key event" since March 2024, but that's not the field name this tool expects).
- If the core action lives behind a CMS form rather than a GA4 event (a signup, an invite, a waitlist join), `bdzListCmsForms` + `bdzListCmsFormSubmissions` give the real per-form submission count instead of guessing from traffic.
- If the NSM needs to reconcile usage with revenue (expansion, upgrades, seats added) and the CRM connected is HubSpot, `query_crm_data` on the DEAL object pulls closed-won/expansion revenue to check the NSM's "leads revenue" criterion against real pipeline — the OS supplies the underlying events and revenue records, it does not compute the NSM formula for you.
- Build a cohort analysis: what behaviors in week 1 predict 90-day retention? Know the limit before promising this: Bulldozer OS's curated GA4 dimension catalog has no per-user cohort dimension — only `newVsReturning`, a flat new-vs-returning split — and `bdzAggregateGoogleAnalyticsReport` rolls metrics up across properties/sites, not across a cohort over time. Past that flag, this analysis runs outside the OS: the product's own event data, or a dedicated analytics tool, not a GA4 report template.
- Map your current loop performance (what's the K coefficient? what's the expansion rate?)

**Weeks 3–6: Prioritize and Execute**
- Identify the bottleneck in your highest-leverage loop
- Run one focused experiment targeting that bottleneck. Read it like any A/B test, not like a demo: 95% significance, 80% power, and a minimum two-week run to cover a full weekly cycle. Reading it early because the trend looks good is how noise gets mistaken for a result you then build the next 8 weeks on.
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
- **Treating the NSM as permanent**: A metric chosen for last year's product and segment can quietly stop predicting anything. Re-check that it still predicts retention and revenue roughly every 6 months, especially after a pricing change, a new segment, or a major feature shift — not just when growth stalls and someone starts asking why.