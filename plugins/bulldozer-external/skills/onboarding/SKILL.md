---
name: |-
  onboarding
description: |-
  Optimize post-signup onboarding, user activation, and time-to-value for SaaS products. Triggers on 'onboarding flow,' 'activation rate,' 'aha moment,' 'users aren't activating,' 'time to value,' or 'first session experience.' For signup funnel optimization, see signup-optimization. For ongoing lifecycle emails, see lifecycle-emails.
when-to-use: |-
  Optimize post-signup onboarding, user activation, and time-to-value for SaaS products. Triggers on 'onboarding flow,' 'activation rate,' 'aha moment,' 'users aren't activating,' 'time to value,' or 'first session experience.' For signup funnel optimization, see signup-optimization. For ongoing lifecycle emails, see lifecycle-emails.
argument-hint: |-
  B2B SaaS project management tool — users sign up but only 30% complete setup and see the aha moment
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Onboarding & Activation

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on user onboarding and activation. Your goal is to help users reach their "aha moment" as quickly as possible and establish habits that lead to long-term retention.

## Input

`$ARGUMENTS` — product type, current activation rate (if known), and the specific problem (e.g., "users sign up but 70% never activate — B2B SaaS for reporting teams"). If not provided, read any available context files. Only ask if the product is completely absent.

## Output

A `onboarding-brief-{product}.md` file with: activation metric definition (specific aha moment), onboarding flow design (step-by-step with copy for each step), empty state copy, trigger-based email sequence, and a funnel measurement plan. If an existing flow is provided, outputs an audit (findings → impact → recommendation → priority).

**Produce output on first invocation. Read available context before asking. Only ask if the product is completely absent.**

---

## Core Principles

**Time-to-value is everything.** Remove every step between signup and experiencing core value — but only the steps that are actually the blocker. If users stall because they don't yet see the value, cutting form fields won't move the number. Confirm the real obstacle (funnel data, user research) before you simplify; use the ab-testing skill to prove it rather than assume it.

**One goal per session.** Focus first session on one successful outcome. Save advanced features for later.

**Do, don't show.** Interactive beats tutorial. Doing the thing beats learning about the thing.

**Progress creates motivation.** Show advancement. Celebrate completions. Make the path visible.

**Personalize the path, don't just decorate it.** A single generic flow for every signup is the default that's aging worst: branching the first step by declared role or intent (not a cosmetic tour) is now the standard way products raise activation, because the same setup wizard makes no sense for a solo user and a team admin. Route on the intent question you already ask at signup, not an added step.

**Refuse to branch past what you can maintain.** Two or three paths from the intent question you already ask at signup is the right starting point — not a tree built from every persona in the sales deck. Each extra branch is a flow someone has to keep current as the product changes, and a path built for a guessed persona before you have signups in it is maintenance debt with no evidence behind it. Add a branch when funnel data shows a specific segment stalling at a specific step, not before — the segment earns its branch, the branch doesn't come first.

---

## Step 1: Define Activation

### Finding the Aha Moment

The action that correlates most strongly with retention:
- What do retained users do that churned users don't?
- What's the earliest indicator of future engagement?

**Correlation is not the finding — it's the hypothesis.** An action that correlates with retention in your existing user base doesn't automatically cause that retention — it can just as easily be something already-engaged users happen to do. The only way to tell the difference: push more new users toward the candidate action through an actual onboarding change, then check whether the cohort that got pushed retains better, not just whether it completed the action more often. If retention doesn't move, you found a symptom of engagement, not a lever for it — building the whole flow around it will move an activation dashboard without moving the business. Discard any candidate that only a small minority of signups ever reach, however strongly it correlates: an aha moment has to be reachable by most new users, ideally in the first session, or it's a filter for people who were already sold rather than something onboarding can cause.

**Examples by product type:**

| Product Type | Aha Moment |
|-------------|-----------|
| Project management | Create first project + add team member |
| Analytics | Install tracking + see first report |
| Design tool | Create first design + export/share |
| Marketplace | Complete first transaction |
| CRM | Add first contact + log first activity |
| Communication | Send first message to team member |

### Activation Metrics to Track

- % of signups who reach activation event
- Time to activation (hours or days from signup)
- Steps to activation
- Activation rate by cohort/channel/plan

**Instrumenting it in Bulldozer OS.** Once the aha-moment action is defined, fire it as a GA4 event in the product and mark it a key event — Google's own term since it renamed GA4 conversions outside Google Ads in March 2024 ("conversions" now refers to the Google Ads context specifically). From there, a Bulldozer OS GA4 report template (`bdzCreateGoogleAnalyticsReportTemplate`, run with `bdzRunGoogleAnalyticsReportTemplate`) tracks the key event over any date range, and every run flags metrics that deviate more than 2 standard deviations from history automatically — that's the built-in guard against reading a noisy week as a trend before you act on it.

---

## Step 2: Design the Onboarding Flow

### Immediate Post-Signup Approach

| Approach | Best For | Risk |
|----------|----------|------|
| Product-first | Simple products, B2C, mobile | Blank slate overwhelm |
| Guided setup | Products needing personalization | Adds friction before value |
| Value-first (demo data) | Complex products, B2B | May not feel "real" |

**Whatever you choose:**
- Single clear next action — one button, one link, one choice
- No dead ends — every screen has a next step
- Progress indication if multi-step

### Onboarding Checklist Pattern

Use when: multiple setup steps required, B2B product, several features to discover.

**Best practices:**
- 3–7 items (not overwhelming)
- Order by value: most impactful first
- Start with quick wins (confidence builders)
- Show progress % or steps remaining
- Celebrate on completion (animation, message, confetti)
- Always include a dismiss option — don't trap users

The checklist pattern is not a legacy tactic — it stays one of the most reliable onboarding devices precisely because an open, visible list of remaining steps creates its own pull to finish it. Don't drop it for a flashier pattern without a reason.

### Empty States

Every empty state is an onboarding opportunity.

**Good empty state structure:**
- Explains what this area is for (1 sentence)
- Shows what it looks like with data (preview or illustration)
- Clear primary action: "Add your first [thing]"
- Optional: pre-populate with example data for immediate orientation

### Tooltips and Guided Tours

Use sparingly for complex UI or features users might miss.

**Rules:**
- Max 3–5 steps per tour
- Dismissable at any time
- Never repeat for returning users
- Triggered by action, not on page load

---

## Step 3: Multi-Channel Coordination

### Trigger-Based Email Sequence

| Trigger | Email | Timing |
|---------|-------|--------|
| Signup | Welcome + first action | Immediate |
| No activation after 24h | Nudge: pick up where you left off | Day 1 |
| No activation after 72h | Remove blocker: "what's stopping you?" | Day 3 |
| Activation achieved | Celebrate + introduce next step | Immediately on trigger |
| Day 7 inactive | Feature discovery | Day 7 |
| Day 14 inactive | Re-engagement / personal outreach | Day 14 |

**Email rules:**
- Drive back to the product with a specific CTA (not the homepage — the exact step they need)
- Personalize based on actions taken, not just name
- Plain, simple formatting tends to outperform heavily designed HTML for early onboarding emails — test it rather than assume it on your own list

At scale, this sequence is still bulk mail: Gmail and Yahoo apply stricter sender-authentication and complaint-rate requirements to any sender above their volume threshold. If activation emails aren't landing in the inbox, that's a delivery problem before it's a copy problem — see the lifecycle-emails skill for the authentication and complaint-rate rules.

**The same sequence as mobile push, not email, is a platform rule, not a style choice.** A reactivation or win-back push is marketing push under Apple's Guideline 4.5.4: it needs both an in-app opt-in and an in-app opt-out, never just one, and push can never be required for the app to work. Give it its own consent moment — don't assume an OS permission grant already covers it.

**Don't read this sequence by its open rate.** On iOS Mail, Apple's Mail Privacy Protection pre-fetches the tracking pixel before the user ever opens the message, so a meaningful share of "opens" happen whether or not anyone actually read the email — a stable mechanism at this point, not a temporary quirk. A healthy-looking open rate doesn't prove a nudge worked. Read clicks and the real in-product action (did they come back and do the next step) as the signal that matters; open rate is only useful as a rough trend over time, never as proof that one send beat another.

---

## Step 4: Handling Stalled Users

### Detection

Define "stalled" with specific criteria:
- X days since signup with no activation
- Completed setup but no return visit
- Used once but never returned

**A stalled flag on usage alone can be wrong.** "No return visit in X days" treats every silent account the same, but some of them got exactly what they came for in one session (a one-off export, a single calculation) and have no reason to come back yet — flagging them as at-risk and nudging them wastes the touch and can read as tone-deaf. Pair the stall criteria with what the user said they were trying to do at signup (the same intent field driving personalization above) before triggering an alert, not usage thresholds alone.

### Re-engagement Tactics

1. **Email sequence** — reminder of value, address common blockers, offer help
2. **In-app recovery** — "Welcome back" screen with clear "pick up where you left off" path
3. **Human touch** — for high-value accounts (high plan, large company), personal outreach from founder or CS

Reserve tactic 3 for accounts where the expected value of saving them clearly exceeds a rep's time — top-tier plan, expansion-eligible logo, a signed contract with usage as a renewal condition. Manually reaching out to every stalled trial doesn't scale, and it trains reps to spend time on accounts that were never going to convert.

**Treat "why didn't you activate" answers as a symptom, not the cause.** Whether it comes from an in-app prompt or a support ticket, the stated reason ("too complicated," "didn't have time") is usually the surface of something else — an interview study across more than 10,000 B2B SaaS accounts (User Intuition) found the stated reason changed or got more specific in 73% of cases once someone asked a follow-up question. Cross-reference the stated reason against where in the flow they actually stopped and what plan or channel they came from before you build a fix around it word-for-word.

---

## Measurement Framework

### Funnel Analysis

Track drop-off at each step:

```
Signup → Step 1 → Step 2 → Activation → Day 7 retention
100%      80%       60%       40%           25%
```

Identify the biggest drop-off. Fix that before optimizing anything else.

**Read this by segment before you trust the aggregate.** The step that looks worst overall can be healthy for most of your traffic and broken for one channel or one device — a funnel that's fine on desktop and failing on mobile shows up in the blended numbers as "a mediocre Step 2," not as the real, fixable problem. Cut the same funnel by acquisition channel and device before deciding which step to fix; the biggest drop-off in the aggregate and the biggest drop-off in the segment that matters most to you are often not the same step.

### Key Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| Activation rate | % reaching aha moment | Set your own baseline, improve from it |
| Time to activation | Median hours from signup | Track trend, reduce |
| Onboarding completion | % completing setup checklist | Set your own baseline, improve from it |
| Day 1 retention | Users who return Day 1 | Set your own baseline, improve from it |
| Day 7 retention | Users who return Day 7 | Set your own baseline, improve from it |
| Day 30 retention | Users who return Day 30 | Set your own baseline, improve from it |

**Don't import a market number as your target.** Activation and retention rates don't transfer across business models — what counts as good depends on your product's usage frequency and who you sell to. A B2B tool used daily and a seasonal B2C app have nothing comparable to say to each other about Day 7 retention. Compute your own baseline (this cohort table) and compare each release against it, not against a number from someone else's funnel. Be wary of a single outside reference point, too: the published 2026 benchmark reports don't converge on one activation number — cut by product category, they disagree by close to an order of magnitude (single digits for some categories, past 50% for others) — and none of them are audited primary sources. That spread is itself the reason to treat any published figure as a loose sanity check at best, never as the target.

---

## Experiment Ideas

| Test | Hypothesis |
|------|-----------|
| Remove a setup step | Less friction → higher activation |
| Add demo/sample data | Users see value without setup → higher activation |
| Progress bar | Visible progress → higher completion |
| Checklist reorder | Most impactful item first → faster aha moment |
| Personalization by role | Role-specific first step → more relevant path |
| Reduce required fields | Fewer fields at signup → more users reach onboarding |

Run one test at a time. Use the ab-testing skill to design statistically valid experiments.

Read every test against the same bar as any other experiment — 95% significance, 80% power, at least two weeks of data before you call it, never on the first day a chart looks good (full method in the ab-testing skill). Onboarding tests have a specific way to fail this: a variant that lifts Day-1 activation by rushing more signups through the flow can still lose on Day 30 retention, because it pulled in a worse-fit user as easily as it pulled in one who just needed less friction. Don't declare a win on the activation number alone — check that the lift holds at the retention checkpoints in the Measurement Framework below before you ship it broadly.

---

## Common Onboarding Patterns by Product Type

| Product Type | Key Steps |
|-------------|-----------|
| B2B SaaS | Setup wizard → first value action → team invite → deep setup |
| Marketplace | Complete profile → browse → first transaction → repeat loop |
| Mobile App | Permissions → quick win → push notification setup → habit loop |
| Content Platform | Follow/customize → consume → create → engage |