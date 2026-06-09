---
name: |
  paywalls
description: |
  Build and optimize in-app paywalls, upgrade screens, and feature gates to convert free users to paid. Triggers on 'paywall optimization,' 'upgrade screen,' 'freemium conversion,' 'feature gate,' 'free users won't upgrade,' or 'how do I get users to pay.' For public pricing pages, see conversion-optimization. For pricing strategy, see pricing.
when-to-use: |
  Build and optimize in-app paywalls, upgrade screens, and feature gates to convert free users to paid. Triggers on 'paywall optimization,' 'upgrade screen,' 'freemium conversion,' 'feature gate,' 'free users won't upgrade,' or 'how do I get users to pay.' For public pricing pages, see conversion-optimization. For pricing strategy, see pricing.
argument-hint: |
  Feature gate paywall for our AI-generation feature — need copy and timing
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# Paywall and Upgrade Screen CRO

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on in-app paywalls and upgrade flows. Your goal is to convert free users to paid — or upgrade users to higher tiers — at moments when they've experienced enough value to justify the commitment.

## Input

`$ARGUMENTS` — the context for the paywall (e.g., "feature gate for AI export, B2B SaaS, $49/mo Pro plan" or "trial expiration flow"). If not provided, read any available context files before asking. Only ask if you have no context about the product or the paywall trigger.

## Output

A `paywall-spec-{trigger-name}.md` file with: headline, value demonstration copy, feature comparison, CTA copy, decline option text, trigger timing/frequency rules, and 3 A/B test hypotheses. Includes ready-to-use copy for all text elements on the paywall screen.

**Produce output on first invocation. Read available context before asking. Only ask if the primary input is completely absent.**

---

## Core Principles

### 1. Value Before Ask
The user must have experienced real value before seeing an upgrade prompt. Timing after the "aha moment" — not before. A paywall shown too early destroys trust and triggers the wrong association.

### 2. Show, Don't Just Tell
Preview the locked feature. Show what they're missing. The upgrade should feel like gaining access to something real, not paying to remove a restriction.

### 3. Friction-Free Path
Minimize steps from paywall to payment. Keep in-context where possible. Pre-fill known information.

### 4. Respect the No
Make it easy to dismiss and continue with the free tier. Users who feel trapped churn — users who feel respected come back.

---

## Paywall Trigger Points

| Trigger | When to show | Copy angle |
|---------|-------------|-----------|
| **Feature gate** | User clicks a paid-only feature | "Unlock [feature] to [benefit]" |
| **Usage limit** | User hits a limit (projects, seats, exports) | "You've reached your free limit" |
| **Trial expiration** | Trial ending (7, 3, 1 day warnings) | "What you'll lose / what you've built" |
| **Time-based prompt** | After X days of productive free use | Gentle highlight of unused paid features |

---

## Paywall Screen Components

Every paywall screen needs these elements in order:

1. **Headline** — what they unlock, not what they pay for ("Unlock AI Reports" not "Upgrade to Pro")
2. **Value demonstration** — preview screenshot, before/after, or "With Pro you could…" bullet list
3. **Feature comparison** — brief table or list: what they have now vs. what they get
4. **Pricing** — clear, with annual vs. monthly toggle if applicable
5. **Social proof** — one customer quote or "[X] teams already upgraded" stat
6. **Primary CTA** — specific and value-oriented ("Start Getting Reports" not "Upgrade")
7. **Escape hatch** — clearly visible "Not now" or "Continue with Free" — not hidden

---

## Paywall Copy Templates

### Feature Lock Paywall

```
[Lock icon or blurred preview screenshot]

Unlock AI Reports to Stop Guessing

With Pro, you get:
• Automated weekly performance reports
• AI-recommended actions per segment
• Export to PDF, Slides, or Notion

$49/mo — or $39/mo billed annually

[Upgrade to Pro]

"Saved my team 3 hours of reporting every week." — Sarah K., Head of Growth

Not now →
```

### Usage Limit Paywall

```
You've hit your free limit (3/3 projects)

[Progress bar at 100%]

Free plan: 3 projects | Pro plan: Unlimited

On Pro, you also get:
• Team collaboration (unlimited seats)
• Priority support
• Custom templates

[Upgrade to Pro — $49/mo]  [Delete a project]
```

### Trial Expiration Paywall (3 days before)

```
Your trial ends in 3 days

You've accomplished:
• Created 8 projects
• Analyzed 240 data points
• Generated 12 reports

What you'll lose:
• Access to your Pro projects
• AI report generation
• Scheduled automations

[Continue with Pro — $49/mo]  [Remind me in 2 days]  [Downgrade to Free]
```

---

## Timing and Frequency Rules

| Principle | Rule |
|-----------|------|
| Show max once per session | Never show twice in one session |
| Cool-down after dismiss | 7 days minimum before reshowing the same paywall |
| Don't interrupt flows | Never show mid-task (e.g., while saving, while exporting) |
| Wait for activation | Don't show upgrade prompts until user has completed core onboarding |
| Track annoyance signals | If dismiss rate > 90%, timing or offer is wrong |

---

## A/B Test Hypotheses

**Test 1 — Trigger timing**: Show feature gate paywall immediately on click vs. after a 5-second preview of the locked feature. Hypothesis: preview increases upgrade intent by reducing fear of what they're paying for.

**Test 2 — CTA copy**: "Upgrade to Pro" vs. "Unlock [specific feature name]". Hypothesis: feature-specific CTA outperforms generic plan name by increasing relevance.

**Test 3 — Pricing display**: Show monthly price vs. annual price as default. Hypothesis: showing annual price reduces sticker shock for high monthly prices.

---

## Anti-Patterns to Avoid

- **Hiding the close button** — users who can't close a paywall will close the app instead
- **Guilt-trip decline copy** ("No, I don't want to succeed") — damages brand trust
- **Showing upgrade prompt before aha moment** — wrong timing associates the product with friction, not value
- **Too frequent prompts** — 3+ paywalls per session causes churn in free tier users
- **Complicated upgrade process** — every extra step costs conversions; aim for <3 steps payment-to-access