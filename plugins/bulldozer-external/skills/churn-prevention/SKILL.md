---
name: |-
  churn-prevention
description: |-
  Design cancel flows, save offers, and dunning sequences to reduce voluntary and involuntary churn. Triggers on 'cancel flow,' 'save offer,' 'dunning emails,' 'people keep canceling,' 'failed payment recovery,' or 'churn rate too high.' For win-back sequences, see lifecycle-emails. For in-app upgrade paywalls, see paywalls. For a health-scoring system and expansion playbook (the leading-indicator, CS-facing side of retention), see customer-health-expansion — this skill covers the moment-of-cancel and payment-failure mechanics.
when-to-use: |-
  Design cancel flows, save offers, and dunning sequences to reduce voluntary and involuntary churn. Triggers on 'cancel flow,' 'save offer,' 'dunning emails,' 'people keep canceling,' 'failed payment recovery,' or 'churn rate too high.' For win-back sequences, see lifecycle-emails. For in-app upgrade paywalls, see paywalls. For a health-scoring system and expansion playbook, see customer-health-expansion.
argument-hint: |-
  B2B SaaS, $49/mo average, primary churn reason is 'not using it enough' — build cancel flow + save offer
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
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

Voluntary churn is typically 50–70% of total churn. Involuntary estimates vary by source — payment-industry aggregators put it anywhere from 20% to 50% of total churn — but it's consistently the easier one to fix, since it's a mechanical failure rather than a decision to leave.

---

## Cancel Flow Structure

```
Trigger → Exit Survey → Dynamic Save Offer → Confirmation → Post-Cancel
```

**Step 1 — Trigger**: Customer clicks "Cancel subscription"

**Step 2 — Exit Survey**: 1 question, 5–8 single-select reasons + free text. Determines which offer to show.

**Step 3 — Dynamic Save Offer**: Primary offer matched to reason + one fallback option.

**Step 4 — Confirmation**: Clear end-of-billing-period messaging. No dark patterns — keep the cancel option visible.

**Step 5 — Post-Cancel**: Set expectations, provide easy reactivation path, trigger win-back sequence. Hand the exit survey reason to `lifecycle-emails` rather than firing one generic win-back sequence for everyone who churned — someone who left over a missing feature reads a "look what's new" email differently than someone who left because they never got past onboarding. And don't re-loop the sequence on an account that showed zero engagement across the whole pre-cancel arc (see Risk Signals below): re-sending to someone who never opened, clicked, or logged in is a deliverability cost, not a second chance at winning them back.

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

### Don't Build the Offer Matrix on the Stated Reason Alone

An exit survey answer is self-reported at the one moment the customer is least willing to explain themselves in detail. Research on churn interviews that probe past the surface answer (User Intuition, 10,000+ customer interviews) found the stated reason changes or gets more specific in 73% of cases once someone digs — "too expensive" is frequently a stand-in for "I never saw enough value to justify it," and "not using it enough" often means "it was too complex to adopt" or "the champion who cared left." Before wiring the matrix above one-to-one, cross the selected reason against the Risk Signals below for that account: if feature usage had already stopped three weeks before the cancel click, "too expensive" said at cancel time is the symptom, and a 20% discount buys another month of low use, not retention — the fix belongs in onboarding or activation, not in the offer. If the same stated reason keeps recurring across your top cancellations, treat it as a product or pricing signal, not a save-offer opportunity: a discount that papers over a repeat reason is a cost paid every month, not a fix.

### Save Offer Rules

- **Discounts**: 20–30% for 2–3 months. Avoid 50%+ (trains customers to cancel for deals).
- **Pause**: 1–3 months max. How many pausers actually come back varies wildly by source (see Pause reactivation rate in `references/benchmarks.md` — no reliable named benchmark exists) — don't assume a majority returns; auto-reactivate with advance notice rather than leaving it manual regardless of the rate.
- **Downgrade**: Position as "right-size your plan," not "downgrade."
- **Personal outreach**: Route high-value accounts (top 20% by MRR) to customer success — but only if CS has the capacity to act on every account that crosses the line. A threshold nobody follows up on is worse than none: it teaches the team to ignore the routing. Set the cutoff from CS headcount and gross margin per account, not copied from this playbook.

### Reading a Save-Offer or Discount Test

A dynamic discount is a pricing decision running as an experiment, and it fails the same way a pricing test fails: a variant that wins on immediate save rate can still be attracting the wrong save — someone who takes the discount, stays two more billing cycles out of inertia, and churns anyway once it lapses. Read it like any other test: 95% significance, 80% power, minimum two weeks to cover a full weekly cycle (the same bar this shop applies to any CRO test — see `ab-testing`), and don't call the variant a winner on save rate alone. Track the saved cohort's retention at 30/60/90 days against a control that was offered nothing — a save-rate win with a cohort that re-churns faster a quarter later isn't a save, it's a delay with a discount attached.

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

### Instrumenting the Signals

Don't build a health score on signals nobody is capturing. If GA4 is wired up, the login-frequency and feature-usage rows above are GA4 events to pull as a report, not to guess at. If the CRM is HubSpot, writing a score back onto contact/company properties is a write, not a read — the Bulldozer OS HubSpot connector commonly has CONTACT/COMPANY write sitting behind a reauthorization it doesn't have by default, even where read access is available; check before promising that write-back, and report the score (an export, a Slack alert) instead if it isn't granted. For the full instrumentation path and the health-score formula with its action thresholds, see `references/health-score.md`.

A score that drops is a trigger to act, not a reason to act blindly: know what the account signed up to do before the outreach happens. A health-score alert that fires on generic usage decline without that context produces a check-in email that reads as generic to the customer, which is its own way of confirming they made the right call to leave.

---

## Involuntary Churn: Dunning Stack

```
Pre-dunning → Smart retry → Dunning emails → Grace period → Hard cancel
```

### Pre-Dunning Prevention

- Card expiry alerts: 30, 15, and 7 days before expiry
- Backup payment method prompt at signup
- Card updater services (Visa Account Updater / Mastercard Automatic Billing Updater — the network pushes the customer's new card details to enrolled merchants automatically when a card is reissued, so the next charge doesn't fail in the first place)
- Network tokenization (Visa Token Service / Mastercard Digital Enablement Service) as the newer complementary mechanism: the payment processor stores a token tied to the account rather than the card number, so a reissued card doesn't even need an updater push — the stored token stays valid. Ask the payment processor whether it's already enabled before building retry logic to compensate for a failure class tokenization would have prevented.
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

Retention, save-rate, and recovery-rate benchmarks don't transport across business models — compute each metric from the product's own baseline before and after the cancel flow / dunning stack ships, and judge the change against that baseline, not against a market range.

Track: monthly churn rate, net revenue churn, logo retention vs. NRR gap (a diagnostic, not a target — a wide gap means expansion revenue is masking a real retention problem), cancel flow save rate, pause reactivation rate, and dunning recovery rate. Formulas, the 2025–2026 ranges seen in the market, and the sourcing caveats on each — the monthly-vs-annual confusion on churn rate, the vendor-only figures behind save rate and pause reactivation — are in `references/benchmarks.md`. For NRR benchmarks by ARR band, see `customer-health-expansion`.

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
- Ignoring involuntary churn — estimates run 20–50% of total depending on the source, and it's consistently the easiest to fix
- Pausing too long — pauses beyond 3 months rarely reactivate
- No post-cancel reactivation path — some churned users want to come back
- Building the save-offer matrix on the exit-survey reason alone — it's self-reported at the least forthcoming moment, and it frequently isn't the actual cause (see Don't Build the Offer Matrix on the Stated Reason Alone above)
- Reporting a discount or save-offer test as a win on save rate alone, without a retention guardrail on the saved cohort — the churn shows up a quarter later, after the test is already declared closed
- Personal outreach routing with no capacity behind it — a threshold the CS team can't act on trains everyone to ignore the alert