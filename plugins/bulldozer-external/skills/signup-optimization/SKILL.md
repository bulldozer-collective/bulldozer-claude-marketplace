---
name: |-
  signup-optimization
description: |-
  Optimize signup, registration, and trial activation flows to reduce dropoff and increase completion rates. Triggers on 'signup conversions,' 'signup form optimization,' 'reduce signup dropoff,' 'nobody completes registration,' or 'simplify our signup.' For post-signup activation, see onboarding. For lead capture forms, see conversion-optimization.
when-to-use: |-
  Optimize signup, registration, and trial activation flows to reduce dropoff and increase completion rates. Triggers on 'signup conversions,' 'signup form optimization,' 'reduce signup dropoff,' 'nobody completes registration,' or 'simplify our signup.' For post-signup activation, see onboarding. For lead capture forms, see conversion-optimization.
argument-hint: |-
  B2B SaaS trial signup — currently 4 fields plus email verification, high dropoff
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Signup Flow CRO

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on signup and registration flow optimization. Your goal is to reduce friction, increase completion rates, and set users up for successful activation.

## Input

`$ARGUMENTS` — description of the current signup flow or a URL (e.g., "4-field form + email verification, B2B SaaS, 23% completion rate"). If not provided, read any available context files before asking. Only ask if you have no context about the signup flow.

## Output

A `signup-audit-{product}.md` file with: field-by-field audit, quick wins (implement this week), high-impact changes (next sprint), A/B test hypotheses, and recommended field set with complete copy (labels, placeholders, error messages, CTA). Includes a before/after comparison of the form.

**Produce output on first invocation. Read available context before asking. Only ask if the primary input is completely absent.**

---

## Core Principles

### 1. Minimize Required Fields

Every field reduces conversion. For each field, ask: can we collect this later?

**Priority tier**:
- Essential at signup: Email (or phone), Password
- Usually necessary: Name
- Often deferrable to onboarding: Company, Role, Team size, Phone, Use case

The rule: if you don't use the data to personalize the experience in the first session, don't ask for it at signup.

Before cutting a field, know what action defines activation for this product (see `onboarding`). That's what tells you whether a field is safe to defer — versus a field the activation flow needs on day one, where "deferring" it just moves the same friction one screen later without fixing anything.

**Don't trust that activation action if it was only ever picked by correlation.** An action that correlates with retention in your existing user base can be a symptom of engagement rather than a cause of it — the only real evidence is an A/B test that pushes more new signups toward the candidate action and checks that retention itself moves, not just that completion of the action goes up. This matters here specifically because a wrong activation action produces a wrong field-cutting decision: you'll defer or keep a field based on a signal that was never causal.

### 2. Show Value Before Asking for Commitment

What can users experience before creating an account? Reverse the order: value first, signup-optimization second.

### 3. Reduce Perceived Effort

Multi-step forms with progress indicators feel easier than single long forms. Show progress. Use smart defaults. Pre-fill where possible.

### 4. Remove Uncertainty

"Takes 30 seconds." "No credit card required." "Free forever." Set expectations before the user reaches the form.

---

## Field-by-Field Optimization

### Email Field
- Single field — no email confirmation field (users copy-paste correctly; the confirmation field adds friction while catching almost no errors)
- Inline validation for format (show error as they type, not on submit)
- Check for common typos (gmial.com → did you mean gmail.com?)
- Clear, specific error messages: "This email is already registered — [sign in] or [reset your password]"

### Password Field
- Show/hide toggle (eye icon) — essential
- Show requirements upfront, update in real-time as they type
- Allow paste (never disable clipboard on password fields)
- Consider passwordless signup via magic link — especially effective for B2B
- Consider passkeys (WebAuthn) as a native option alongside or instead of a password — adoption has moved from niche to mainstream on both the consumer and enterprise side; see `references/plateformes-et-outils.md` for the sourced 2026 figures. The tradeoff to design for, not skip: a passkey-only signup still needs a fallback (magic link or password) for unsupported browser/device combinations, and a clear recovery path if the device holding the passkey is lost.

### Social Auth (Google, Microsoft, GitHub)
- Place prominently — often higher conversion than email form for B2B
- B2B audiences: Google + Microsoft (or GitHub for developers)
- B2C audiences: Google + Apple + Facebook
- Label clearly: "Continue with Google" not just the logo
- **If this signup form is embedded in a native iOS app** (not just reached through a browser), don't reach for "add Sign in with Apple" as a reflexive rule — App Store Review Guideline 4.8 sets three substantive criteria for the required alternative, and five exceptions that waive it entirely. See `references/plateformes-et-outils.md` before assuming the requirement applies.
- Visual separation between social auth and email form

### Name Field
- Single "Full name" field typically outperforms First/Last split (test this)
- Only require if used immediately for personalization ("Hi Sarah, let's set up...")
- Consider making optional — collect in onboarding instead

### Company / Organization
- Infer from email domain where possible (work email → auto-fill company) — a generic CRO pattern; it needs a domain-lookup enrichment service wired into the signup form itself, which Bulldozer OS does not provide out of the box
- Auto-suggest as they type: don't assume Bulldozer OS's own enrichment tool (`bdzEnrichContact`) covers this — it's a post-signup CRM enrichment step on a contact record that already exists, not a live autocomplete while someone is filling the form. See `references/plateformes-et-outils.md`
- Only require if critical to the product (e.g., team billing)

### Role / Use Case Question
- Move to onboarding, not signup — reduces barrier to entry
- If needed for routing (sales vs. self-serve), use a single select question, not a free text field

---

## Single-Step vs. Multi-Step

### Single-step works when:
- 3 or fewer fields
- High-intent visitors (from ads, referral-program, direct)
- B2C consumer products

### Multi-step works when:
- 4+ fields needed
- B2B products needing segmentation data
- Complex product requiring customization

### Multi-step best practices
- Show progress indicator (Step 1 of 2, not percentage — percentage feels slower)
- Lead with easy questions (email, name) — commit early, harder questions later
- Allow back navigation — don't lose data
- Each step completable in under 10 seconds
- Save progress so refresh doesn't lose data

**Progressive commitment pattern** (works well for B2B):
1. Email only → lowest barrier
2. Password + name → after micro-commitment
3. Segmentation question (optional) → only if needed for routing

**Don't design step 3 around the persona slides from the sales deck.** Start with at most 2-3 branches drawn from the one intent question you're already asking, not a tree built to cover every persona in the pitch. Add a branch only once behavioral data from the funnel shows a specific segment stalling at a specific step — never on a persona you assume exists. Each extra branch is a flow someone has to keep maintaining, and most never earn their upkeep.

---

## Trust and Friction Reduction

Place these near the signup form (not just at the bottom of the page):

- "No credit card required" — if true, this single phrase lifts conversion significantly. But treat requiring a card as a monetization decision, not a friction bug: dropping it reliably raises signup completion while also letting in visitors who were never going to pay, which dilutes trial-to-paid rate and loads more low-intent accounts onto activation and support. Whether to require a card is the same kind of call as setting a price — it decides who gets in, not just how many do — so it's a call for whoever owns pricing/monetization, not a default win to bank because completion went up.
- "Free for X days / Free forever" — sets clear expectation
- Privacy assurance: "We'll never share your data"
- Social proof: "Join 12,000 teams already using [Product]"
- Security signal: SOC 2 badge, GDPR compliance note (for relevant audiences)

---

## Error Handling

- Inline validation — show errors as they leave each field, not on submit
- Specific error messages — "Email already registered. [Sign in instead]" not "Invalid email"
- Don't clear the form on error — preserve all filled fields
- Auto-focus the problematic field on submit error

---

## Mobile Signup

- Appropriate keyboard types: `type="email"` for email, `type="tel"` for phone
- Autofill support (`autocomplete` attributes)
- Minimum touch target size: this is a web form, governed by WCAG 2.2 SC 2.5.8 (level AA) — not the native-app conventions (Apple HIG 44pt / Android Material 48dp) teams reach for by habit. Don't cite 44px as "the WCAG minimum": see `references/plateformes-et-outils.md` for the exact thresholds and why they differ.
- Single column layout
- Social auth buttons wider and easier to tap than email form

---

## Post-Submit Experience

**Success state**:
- Clear confirmation message
- Immediate next step (not just "check your email")

**If email verification required**:
- Explain what to do: "Check your inbox — we sent a confirmation to [email]"
- Easy resend option
- Option to correct email if wrong
- Let users explore the product while waiting — don't block with a verification gate

**Better alternative**: Delay verification until a meaningful action (first export, invite a teammate, publish something). Most users abandon verification-gated flows.

**Where I won't apply that rule**: delaying verification is an abuse surface, not just a UX choice, the moment the unverified account can act on someone else outside itself — sending an invite email, publishing something publicly reachable, or starting a paid transaction. Those are exactly the actions "delay until a meaningful action" tells you to gate on, which is the point: gate verification on the first action that touches the outside world, not on every action, and not never.

---

## Recommended Form Copy Template

Full field-by-field copy — headline, labels, placeholders, CTA, below-form links — is in `references/gabarit-formulaire.md`. Use it as the starting draft for the recommended field set in the `signup-audit-{product}.md` deliverable.

---

## Measuring the Signup Funnel in Bulldozer OS

Don't audit a signup form on assumptions alone — before proposing a change, pull the real numbers:

- `bdzGetCmsTrafficReport` gives one metric at a time for the page holding the form (Webflow sites, requires the Analyze add-on) — `metricScope` picks SESSION (default), USER, or PAGEVIEW per call, they aren't returned together. Pull SESSION for your baseline: 100 pageviews can be 40 sessions from 12 users, and comparing a submission count against pageviews instead of sessions makes the completion rate look worse than it is, since one visitor can load the page several times before submitting once.
- `bdzListCmsForms` identifies the signup form by its `pageName` + `formElementId`, not by its display name: several forms on the same site routinely share a label like "Email Form."
- `bdzListCmsFormSubmissions`, filtered on that `formElementId`, gives the actual submission count — combine it with the SESSION traffic report for a real page-to-submission rate instead of a guessed one. The tool returns raw submissions with no bot/spam flag: before reading a change in that count as a real completion-rate move, sanity-check it against the traffic report for the same window — a submission spike with no matching rise in sessions is more likely automated form-fill than a genuine lift.
- On the HubSpot side, `get_content_analytics_report` (metric: SUBMISSIONS, needs a Pro or Enterprise portal) tracks the same submission volume from the CMS side. `get_campaign_attribution_reports` only reaches further than that for **closed-won deals** — it reports revenue and deal counts already attributed to a won deal, not movement through open pipeline stages. Don't describe it as connecting signups to "the pipeline": it has no visibility into a deal sitting in an open stage, only into what eventually closed won.

This doesn't replace a session recording or field-level abandonment data (most CMS form tooling doesn't expose per-field drop-off) — but it replaces "we think dropoff is high" with an actual number before a fix is proposed.

---

## A/B Test Hypotheses

**Test 1 — Social auth prominence**: Social auth buttons above email form vs. below. Hypothesis: above placement increases social auth usage and overall completion — measure the lift on your own traffic rather than importing a number from another product; a placement that wins on a B2C consumer signup can lose on a B2B trial where the visitor already trusts the brand from a sales conversation.

**Test 2 — Field reduction**: Remove company field from signup entirely (collect in onboarding). Hypothesis: fewer fields lift completion — true directionally, but the size depends on which field and what it costs downstream (a company field feeding lead routing or account-based sales isn't free to remove even if completion goes up).

**Test 3 — Email verification delay**: Allow product access immediately, verify before export/publish/invite. Hypothesis: removes a major abandonment point in flows requiring immediate verification.

**Reading the result**: apply the same bar as any CRO test — 95% significance, 80% power, and a minimum two-week run to cover a full weekly cycle before deciding. Stopping early because a variant looks ahead is the most common way a signup test produces a false winner.

**What a clean win still doesn't prove**: a test that clears that bar tells you completion moved, not that you fixed the right thing. Before shipping a field-removal or verification-delay change permanently, check it against activation (or paid conversion, if the product monetizes fast) over the following weeks — not just completion at signup. If completion is up but activation at 30 days hasn't moved, the friction you removed wasn't the one holding back the metric you actually care about; the fix was cosmetic, and the real blocker is still there, now with less data collected at the door to diagnose it.