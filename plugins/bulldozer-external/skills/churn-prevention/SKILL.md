---
name: |
  churn-prevention
description: |
  Design cancel flows, save offers, and dunning sequences to reduce voluntary and involuntary churn. Triggers on 'cancel flow,' 'save offer,' 'dunning emails,' 'people keep canceling,' 'failed payment recovery,' or 'churn rate too high.' For win-back sequences, see lifecycle-emails. For in-app upgrade paywalls, see paywalls.
when-to-use: |
  Design cancel flows, save offers, and dunning sequences to reduce voluntary and involuntary churn. Triggers on 'cancel flow,' 'save offer,' 'dunning emails,' 'people keep canceling,' 'failed payment recovery,' or 'churn rate too high.' For win-back sequences, see lifecycle-emails. For in-app upgrade paywalls, see paywalls.
argument-hint: |
  B2B SaaS, $49/mo average, primary churn reason is 'not using it enough' — build cancel flow + save offer
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# Churn Prevention

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on SaaS retention and churn prevention. Your goal is to reduce both voluntary churn (customers choosing to cancel) and involuntary churn (failed payments) through well-designed cancel flows, dynamic save offers, and dunning strategies.

## Input

`$ARGUMENTS` — product context, billing setup, and churn scenario (e.g., "B2B SaaS, $49/mo, primary cancel reasons are cost and low usage"). If not provided, read any available context files before asking. Only ask if the primary input is completely absent.

## Output

A `churn-brief-{product}.md` file with: cancel flow diagram (step-by-step), exit survey questions, save offer matrix (reason → offer), dunning email sequence (3–4 emails), and key metrics targets. Deliverable is production-ready — copy is written, logic is specified.

**Produce output on first invocation. Read available context before asking. Only ask if the product and billing setup are completely absent.**

---

## Churn Type Breakdown

| Type | Cause | Solution |
|------|-------|----------|
| **Voluntary** | Customer chooses to cancel | Cancel flows, save offers, exit surveys |
| **Involuntary** | Payment fails | Dunning emails, smart retries, card updaters |

Voluntary churn is typically 50–70% of total churn. Involuntary is 30–50% but is often easier to fix.

---

## Cancel Flow Structure

```
Trigger → Exit Survey → Dynamic Save Offer → Confirmation → Post-Cancel
```

**Step 1 — Trigger**: Customer clicks "Cancel subscription"

**Step 2 — Exit Survey**: 1 question, 5–8 single-select reasons + free text. Determines which offer to show.

**Step 3 — Dynamic Save Offer**: Primary offer matched to reason + one fallback option.

**Step 4 — Confirmation**: Clear end-of-billing-period messaging. No dark patterns — keep the cancel option visible.

**Step 5 — Post-Cancel**: Set expectations, provide easy reactivation path, trigger win-back sequence.

### Exit Survey Reason Categories

| Reason | Save Offer |
|--------|-----------|
| Too expensive | Discount 20–30% for 2–3 months, or downgrade |
| Not using it enough | Pause 1–3 months, or free onboarding session |
| Missing a feature | Roadmap preview + timeline |
| Switching to competitor | Competitive comparison + discount |
| Technical issues | Escalate to support + credit |
| Temporary need | Pause subscription |
| Business closed | No offer — respect the situation |

### Save Offer Rules

- **Discounts**: 20–30% for 2–3 months. Avoid 50%+ (trains customers to cancel for deals).
- **Pause**: 1–3 months max. 60–80% of pausers return. Auto-reactivate with advance notice.
- **Downgrade**: Position as "right-size your plan," not "downgrade."
- **Personal outreach**: Route high-value accounts (top 20% by MRR) to customer success.

---

## Proactive Retention — Risk Signals

Track these leading indicators before the customer ever clicks "Cancel":

| Signal | Risk Level | Timeframe |
|--------|-----------|-----------|
| Login frequency drops 50%+ | High | 2–4 weeks before cancel |
| Key feature usage stops | High | 1–3 weeks before cancel |
| Billing page visits increase | High | Days before cancel |
| Team seats removed | High | 1–2 weeks before cancel |
| Data export initiated | Critical | Days before cancel |
| NPS score drops below 6 | Medium | 1–3 months before cancel |

### Health Score Formula

```
Health Score = (
  Login frequency  × 0.30 +
  Feature usage    × 0.25 +
  Support sentiment × 0.15 +
  Billing health   × 0.15 +
  Engagement score × 0.15
)
```

| Score | Status | Action |
|-------|--------|--------|
| 80–100 | Healthy | Upsell opportunities |
| 60–79 | Needs attention | Proactive check-in |
| 40–59 | At risk | Intervention campaign |
| 0–39 | Critical | Personal outreach |

---

## Involuntary Churn: Dunning Stack

```
Pre-dunning → Smart retry → Dunning emails → Grace period → Hard cancel
```

### Pre-Dunning Prevention

- Card expiry alerts: 30, 15, and 7 days before expiry
- Backup payment method prompt at signup
- Card updater services (Visa/Mastercard auto-update — reduces hard declines 30–50%)
- Pre-billing notification 3–5 days before annual charges

### Smart Retry Logic

| Decline Type | Examples | Strategy |
|-------------|----------|----------|
| Soft decline | Insufficient funds, processor timeout | Retry 3–5x over 7–10 days |
| Hard decline | Card stolen, account closed | Don't retry — ask for new card |
| Auth required | 3D Secure, SCA | Send customer to update payment |

**Retry timing**: Day 1, Day 3, Day 5, Day 7 (with dunning email escalation). After 4 retries: hard cancel with reactivation path.

### Dunning Email Sequence

| Email | Timing | Tone | Content |
|-------|--------|------|---------|
| 1 | Day 0 (failure) | Friendly alert | "Your payment didn't go through. Update your card." |
| 2 | Day 3 | Helpful reminder | "Quick reminder — update your payment to keep access." |
| 3 | Day 7 | Urgency | "Your account will be paused in 3 days. Update now." |
| 4 | Day 10 | Final warning | "Last chance to keep your account active." |

---

## Key Metrics

| Metric | Formula | Target |
|--------|---------|--------|
| Monthly churn rate | Churned / Start-of-month customers | <5% B2C, <2% B2B |
| Net revenue churn | (Lost MRR – Expansion MRR) / Start MRR | Negative = net expansion |
| Cancel flow save rate | Saved / Total cancel sessions | 25–35% |
| Offer acceptance rate | Accepted offers / Shown offers | 15–25% |
| Pause reactivation rate | Reactivated / Total paused | 60–80% |
| Dunning recovery rate | Recovered / Total failed payments | 50–60% |

---

## Tool Stack

| Tool | Best For |
|------|----------|
| **Churnkey** | Full cancel flow + dunning, AI-powered adaptive offers |
| **ProsperStack** | Advanced cancel flow rules engine |
| **Raaft** | Simple cancel flow for early-stage |
| **Stripe Smart Retries** | Built-in dunning with ML retry optimization |
| **Chargebee Retention** | Native for Chargebee customers |

---

## Common Mistakes

- No cancel flow at all — even a simple survey + one offer saves 10–15%
- Same offer for every reason — a blanket discount won't fix "missing feature"
- Discounts too deep — 50%+ trains customers to cancel-and-return for deals
- Ignoring involuntary churn — often 30–50% of total and the easiest to fix
- Pausing too long — pauses beyond 3 months rarely reactivate
- No post-cancel reactivation path — some churned users want to come back