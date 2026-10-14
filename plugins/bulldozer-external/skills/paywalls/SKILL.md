---
name: |-
  paywalls
description: |-
  Build and optimize in-app paywalls, upgrade screens, and feature gates to convert free users to paid. Triggers on 'paywall optimization,' 'upgrade screen,' 'freemium conversion,' 'feature gate,' 'free users won't upgrade,' or 'how do I get users to pay.' For public pricing pages, see conversion-optimization. For pricing strategy, see pricing.
when-to-use: |-
  Build and optimize in-app paywalls, upgrade screens, and feature gates to convert free users to paid. Triggers on 'paywall optimization,' 'upgrade screen,' 'freemium conversion,' 'feature gate,' 'free users won't upgrade,' or 'how do I get users to pay.' For public pricing pages, see conversion-optimization. For pricing strategy, see pricing.
argument-hint: |-
  Feature gate paywall for our AI-generation feature — need copy and timing
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
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

Don't set that moment from correlation alone. An action that correlates with retention in your existing user base can be a symptom of engagement rather than its cause — the only real proof is a test that pushes more new users toward the candidate action and checks whether retention itself moves, not just how many people complete the action. Watch too for a candidate action only a small share of signups ever reach: it isn't a usable trigger even when it correlates strongly, because it's filtering people who were already sold rather than giving the paywall a lever anyone can pull.

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

Setting that "X days" number from a correlation between early usage and later retention repeats the aha-moment trap above — validate it the same way, with a test that actually moves retention, not from reading a cohort that already looked engaged.

**Hard gate vs. soft gate is a channel decision, not a style preference.** A hard paywall (no access before payment) fits high-intent traffic — someone who searched for the app by name already expects to pay. A soft paywall (limited free access, then a wall) fits discovery traffic — someone who found the app browsing a store or a feed and hasn't decided yet. Don't pick one on taste: match it to how most users are arriving, and test the other before assuming.

---

## Paywall Screen Components

Every paywall screen needs these elements in order:

1. **Headline** — what they unlock, not what they pay for ("Unlock AI Reports" not "Upgrade to Pro")
2. **Value demonstration** — preview screenshot, before/after, or "With Pro you could…" bullet list
3. **Feature comparison** — brief table or list: what they have now vs. what they get
4. **Pricing** — clear, with annual vs. monthly toggle if applicable. The amount that will actually be charged today must be the most visually prominent price on screen — a per-month breakdown of an annual plan, or a "save X%" comparison, can appear but has to sit smaller and less prominent than the real billed amount. Showing "$39/mo" in large type for a plan that actually bills $468 once a year is the single most common reason a subscription paywall gets rejected in App Store review.
5. **Social proof** — one customer quote or "[X] teams already upgraded" stat
6. **Primary CTA** — specific and value-oriented ("Start Getting Reports" not "Upgrade")
7. **Escape hatch** — clearly visible "Not now" or "Continue with Free" — not hidden
8. **Legal and account disclosures** — see Store Compliance Requirements below. Not optional on a mobile in-app purchase screen.

---

## Store Compliance Requirements (iOS App Store & Google Play)

If the paywall sells a subscription through Apple's or Google's in-app billing, the screen isn't just a conversion surface — it's reviewed. Missing any of the following is the standard reason a subscription paywall gets bounced in App Store review under Guideline 3.1.2, and it also affects Google Play policy compliance:

- **The subscription's name and duration, and what the period actually unlocks** — Apple lists this as a required sign-up-screen element in its own right, not an implied detail: name the plan, its billing period, and the content or service it provides during that period, not just its price.
- **The price actually billed today**, shown more prominently than any per-period breakdown or savings comparison (see Pricing above), and localized in the currencies the app supports.
- **Trial terms, if a free trial is offered** — the trial length and the price that bills once it ends, both visible before the user starts the trial, not only in a follow-up email.
- **A functional link to Terms of Use (EULA) and to the Privacy Policy** — near the CTA, not buried in a settings menu three taps away.
- **A way for a current subscriber to sign in or restore a previous purchase**, and to manage or cancel the subscription from inside the app. Apple's requirement is either path — an account that already recognizes the purchase on sign-in satisfies it, restore isn't the only route — and both stores have pushed toward subscription cancellation that doesn't force the user to leave the app or hunt through account settings.
- **No toggle tricks** — a pre-selected "free trial" toggle that silently switches the billed plan, or a close button that's actually a second upgrade CTA, is the kind of dark pattern both stores reject on sight in 2026, not just a CRO anti-pattern.
- **If selling through Apple's in-app purchase catalog, the product name and description configured in App Store Connect have hard character limits** — 35 characters for the in-app purchase name, 55 for its description, and no more than 20 in-app purchases/subscriptions shown combined on one product page. A spec that writes a long marketing-style tier name ("Pro Unlimited Everything Plan") will get truncated or bounced at configuration time. Keep the App Store Connect name short and put the marketing framing in the paywall headline instead, which has no such limit.

None of this replaces legal review for a specific store submission — it's the minimum a paywall spec needs to ship without bouncing back from review.

---

## Native In-App Purchase vs. External Purchase Link

Everything above assumes the CTA leads to Apple's or Google's own purchase sheet. As of 2026 that's not the only legal route, and where the CTA sends the user is now a real design decision for a US (and soon UK/EEA Android) audience.

**iOS, US storefront only.** Apple's own Guidelines (3.1.1(a)/3.1.3) now say external-purchase entitlements "are not required" for a button or link to another purchase method — but only on the US storefront; elsewhere the StoreKit External Purchase Link Entitlement is still required and region-limited. A US CTA can legally route to an external web checkout outside Apple's Guideline 3.1.2 review — none of the disclosure rules above apply there. Don't write a fixed commission number into a spec as fact: this carve-out comes from the Epic v. Apple injunction, and the commission Apple can charge on it is still being relitigated (contempt finding against Apple, April 2025; Ninth Circuit upheld the finding but struck the "zero commission" part in December 2025, sending the rate back to district court; US Supreme Court granted cert June 30, 2026, ruling expected mid-2027).

**Android, from June 30, 2026.** Google announced in March 2026 a comparable shift (independent press coverage only, Google's own page wasn't readable this pass): a mechanism replacing User Choice Billing/External Offers that lets an app link to its own web checkout, phased in by storefront (US/UK/EEA first, then AU, then JP/KR, then the rest of the world by late 2027). Sources agree on a split-fee structure but disagree on the exact post-threshold rate — don't cite one as confirmed until Google's rate card is read directly.

**What this changes for a spec.** For a US product (and UK/EEA Android from mid-2026), native IAP is a choice, not the only option — the alternative is an external web checkout with its own screen and its own unsettled fee structure. If a brief doesn't say which route the product took, ask before specifying copy for the wrong screen.

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

The three templates above are copy scaffolding — before shipping any of them as a real in-app purchase screen, add what Store Compliance Requirements lists (billed price prominence, trial terms, legal links, restore/cancel) near the CTA. And don't treat the copy itself as proven: it's a first-draft hypothesis for this product, not a quick win borrowed from someone else's measured result — what converted on their audience and price point isn't evidence for yours until it's been tested here.

---

## Timing and Frequency Rules

| Principle | Rule |
|-----------|------|
| Show max once per session | Never show twice in one session |
| Cool-down after dismiss | 7 days minimum before reshowing the same paywall |
| Don't interrupt flows | Never show mid-task (e.g., while saving, while exporting) |
| Wait for activation | Don't show upgrade prompts until user has completed core onboarding |
| Track annoyance signals | If dismiss rate > 90%, timing or offer is wrong |

Seven days is a default for a product used several times a week — don't carry it over without checking. For a workflow tool someone opens twice a month, a 7-day cooldown reshows the paywall at nearly every session; count in sessions the user is likely to have, not calendar days, and size the cooldown from actual usage frequency for this product rather than the number above.

---

## A/B Test Hypotheses

Read these against a real threshold, not against whichever variant is ahead after a few days: 95% significance, 80% power, and a minimum run of two weeks to cover a full weekly cycle. Stopping early because significance was hit on day 4 reads noise as a result — and it's the mistake that gets built on top of later. See `ab-testing` for the full method.

**Test 1 — Trigger timing**: Show feature gate paywall immediately on click vs. after a 5-second preview of the locked feature. Hypothesis: preview increases upgrade intent by reducing fear of what they're paying for.

**Test 2 — CTA copy**: "Upgrade to Pro" vs. "Unlock [specific feature name]". Hypothesis: feature-specific CTA outperforms generic plan name by increasing relevance.

**Test 3 — Pricing display**: Show monthly price vs. annual price as default. Hypothesis: showing annual price reduces sticker shock for high monthly prices. Caution: don't lean on this to justify a decoy third tier — the most-cited large-scale replication (Yang & Lynn, "More Evidence Challenging the Robustness and Usefulness of the Attraction Effect," *Journal of Marketing Research* 51(4), 2014) reran the decoy/asymmetric-dominance effect 91 times across 23 product categories and found only 11 reliable effects, dropping further once options were described the way a real paywall describes plans (words, not abstract numbers). Test it on this paywall rather than assuming it from a framework; see `pricing` for the pricing-strategy side of this.

If the product logs paywall views, dismissals, and purchases to GA4 (including through Firebase on mobile) and you're pulling that data through a Bulldozer OS report template (`bdzCreateGoogleAnalyticsReportTemplate`), name those events as **conversions**, not "key events" — the OS's curated GA4 metric catalog only exposes `conversions`; `keyEvents` (the label Google itself now uses in the GA4 UI since its 2024 rename) isn't in that catalog and the tool call fails if you ask for it.

---

## Anti-Patterns to Avoid

- **Hiding the close button** — users who can't close a paywall will close the app instead
- **Guilt-trip decline copy** ("No, I don't want to succeed") — damages brand trust
- **Showing upgrade prompt before aha moment** — wrong timing associates the product with friction, not value
- **Too frequent prompts** — 3+ paywalls per session causes churn in free tier users
- **Complicated upgrade process** — every extra step costs conversions; aim for <3 steps payment-to-access
- **Missing legal or billing disclosures** — no Terms/Privacy link, no visible trial-end price, no stated subscription name/duration/what's included, no way to sign in or restore a purchase — this isn't just a trust problem, it's the standard reason App Store review bounces a subscription paywall (Guideline 3.1.2)
- **Cancellation harder than signup** — forcing a user out of the app, or through several settings screens, to cancel a subscription is now a compliance risk on top of a trust one; both stores have moved toward requiring in-app cancellation in a small, fixed number of steps