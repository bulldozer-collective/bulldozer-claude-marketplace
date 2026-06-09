---
name: popups
description: Build and optimize popups, modals, overlays, slide-ins, and banners for lead capture and conversion. Triggers on 'exit intent popup,' 'popup conversions,' 'modal optimization,' 'lead capture popup,' 'announcement banner,' or 'scroll trigger popup.' For forms outside of popups or general page optimization, see conversion-optimization.
when-to-use: Build and optimize popups, modals, overlays, slide-ins, and banners for lead capture and conversion. Triggers on 'exit intent popup,' 'popup conversions,' 'modal optimization,' 'lead capture popup,' 'announcement banner,' or 'scroll trigger popup.' For forms outside of popups or general page optimization, see conversion-optimization.
argument-hint: Exit intent popup for SaaS pricing page — trying to capture emails before visitors leave
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# Popup CRO

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on popup and modal optimization. Your goal is to create popups that convert without annoying users or damaging brand perception.

## Input

`$ARGUMENTS` — what the popup is for and where it lives (e.g., "exit intent popup on pricing page, want to capture emails"). If not provided, read any available context files before asking. Only ask if you have no idea what the popup is for.

## Output

A `popup-spec-{name}.md` file with: popup type, trigger strategy, targeting rules, frequency rules, complete copy (headline, subheadline, CTA, decline option), design notes, and 3 A/B test hypotheses. Output includes ready-to-use copy for all text elements.

**Produce output on first invocation. Read available context before asking. Only ask if the primary input is completely absent.**

---

## Core Principles

### 1. Timing Is Everything
Too early = annoying interruption. Too late = missed opportunity. Right time = helpful offer at the moment of need.

### 2. Value Must Be Obvious
The popup must offer something worth the interruption. "Subscribe to our newsletter" is not a value proposition. "Get the 12-step onboarding checklist used by 5,000 teams" is.

### 3. Respect the User
Easy to dismiss. Don't trap. Remember preferences. Users who can't find the close button will leave the site — not fill the form.

---

## Trigger Strategies

| Trigger | When to use | Best for |
|---------|-------------|----------|
| **Exit intent** | Cursor moves toward browser close | Last-chance capture before leaving |
| **Scroll depth (50%)** | Proven content engagement | Blog posts, long-form content |
| **Time-based (30–60 sec)** | After user has explored | General site visitors |
| **Click-triggered** | User initiates by clicking button/link | Lead magnets, gated content, demos |
| **Page count (3+ pages)** | Research/comparison behavior | Multi-page journeys |
| **Behavior-based** | Specific pages visited, cart abandonment | High-intent segments |

**Never**: "Show after 5 seconds" — 5 seconds is too fast; user hasn't read anything yet. Minimum 30 seconds for time-based triggers.

---

## Popup Types and Templates

### Email Capture Popup

**Goal**: Newsletter/list subscription

**Copy structure**:
```
[Headline] Get the Growth Newsletter
[Subhead] 3 tactics every Monday. Read by 12,000 growth teams.
[Email field]
[CTA] Send Me the Newsletter
[Decline] No thanks, I'll figure it out myself
```

**Best practices**: Single email field only. Specific benefit with cadence. Include list size if >1,000.

### Lead Magnet Popup

**Goal**: Exchange content for email

```
[Cover image of the guide]
[Headline] The Landing Page Teardown Guide
[Subhead] 47 pages. Real examples. Used by 3,200+ marketers.
[Email field]
[CTA] Get the Free Guide
[Decline] Not interested
```

**Best practices**: Show the cover image. Specific page count or asset size. Instant delivery expectation.

### Exit Intent Popup

**Goal**: Last-chance conversion before leaving

```
[Headline] Before you go — get 10% off
[Subhead] Use code WELCOME10 at checkout.
[Email field]
[CTA] Claim My Discount
[Decline] I'll pay full price
```

**Best practices**: Different offer from entry popup. Address a specific concern (price, commitment). No guilt-trippy decline copy.

### Announcement Banner (Top of Page)

**Goal**: Site-wide time-sensitive communication

```
🚀 New: AI Report Generation is live — [See what's new →]    [×]
```

**Best practices**: Single, clear message. Always dismissable. Link to more info. Remove after 14 days maximum — stale announcements damage credibility.

---

## Design Rules

**Visual hierarchy**:
1. Headline (largest, first seen)
2. Value prop (clear benefit)
3. Form/CTA (obvious action)
4. Close option (visible)

**Close button**: Always visible in top-right corner. Large enough to tap on mobile (44px min). Alternative: "No thanks" text link below CTA.

**Sizing**: Desktop 400–600px wide. Never cover the entire screen. Mobile: full-width bottom or center — not full-screen.

**Mobile**: Can't reliably detect exit intent — use time-based (30+ sec) or scroll-based (50%+) instead. Test on mobile specifically; what works on desktop often fails there.

---

## CTA Copy Formulas

| Pattern | Example |
|---------|---------|
| First-person possessive | "Get My Discount" > "Get Your Discount" |
| Specific over generic | "Send Me the Guide" > "Submit" |
| Value-focused | "Claim My 10% Off" > "Subscribe" |
| Outcome-focused | "Start Saving Time" > "Sign Up" |

**Decline options**: Polite and neutral. "No thanks" or "Maybe later." Avoid manipulative: "No, I don't want to save money."

---

## Frequency and Targeting Rules

| Rule | Setting |
|------|---------|
| Max per session | Once |
| Dismiss cool-down | 7–30 days before reshowing |
| Exclude converted users | Always — never show an email popup to subscribers |
| Exclude checkout/payment flows | Always — never interrupt a transaction |
| Context match | Blog popups offer content, pricing popups offer trial/demo |

---

## Compliance

**Google SEO**: Intrusive interstitials hurt mobile SEO. Avoid full-screen popups on mobile before content loads. Cookie notices and age verification are exempt.

**GDPR**: Clear consent language. Link to privacy policy. Never pre-checked opt-ins.

**Accessibility**: Keyboard navigable (Tab, Enter, Esc to close). Focus trap while open. Sufficient color contrast.

---

## Benchmarks

| Popup type | Typical conversion rate |
|-----------|------------------------|
| Email popup (general) | 2–5% |
| Exit intent | 3–10% |
| Click-triggered (self-selected) | 10%+ |
| Lead magnet (relevant) | 5–15% |

---

## A/B Test Hypotheses

**Test 1 — Trigger**: Exit intent vs. 50% scroll depth for the same email capture offer. Hypothesis: scroll-triggered outperforms exit intent because user is engaged, not leaving.

**Test 2 — Incentive type**: Discount code vs. content lead magnet on pricing page exit popup. Hypothesis: on pricing pages, discount outperforms content because purchase intent is higher.

**Test 3 — Decline copy**: "No thanks" vs. "I'll figure it out myself." Hypothesis: self-deprecating decline copy increases conversions by creating mild contrast (unverified — test this).