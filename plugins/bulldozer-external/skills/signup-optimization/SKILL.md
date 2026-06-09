---
name: signup-optimization
description: Optimize signup, registration, and trial activation flows to reduce dropoff and increase completion rates. Triggers on 'signup conversions,' 'signup form optimization,' 'reduce signup dropoff,' 'nobody completes registration,' or 'simplify our signup.' For post-signup activation, see onboarding. For lead capture forms, see conversion-optimization.
when-to-use: Optimize signup, registration, and trial activation flows to reduce dropoff and increase completion rates. Triggers on 'signup conversions,' 'signup form optimization,' 'reduce signup dropoff,' 'nobody completes registration,' or 'simplify our signup.' For post-signup activation, see onboarding. For lead capture forms, see conversion-optimization.
argument-hint: B2B SaaS trial signup — currently 4 fields plus email verification, high dropoff
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
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

### Social Auth (Google, Microsoft, GitHub)
- Place prominently — often higher conversion than email form for B2B
- B2B audiences: Google + Microsoft (or GitHub for developers)
- B2C audiences: Google + Apple + Facebook
- Label clearly: "Continue with Google" not just the logo
- Visual separation between social auth and email form

### Name Field
- Single "Full name" field typically outperforms First/Last split (test this)
- Only require if used immediately for personalization ("Hi Sarah, let's set up...")
- Consider making optional — collect in onboarding instead

### Company / Organization
- Infer from email domain where possible (work email → auto-fill company)
- Auto-suggest as they type (Clearbit Enrichment or equivalent)
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

---

## Trust and Friction Reduction

Place these near the signup form (not just at the bottom of the page):

- "No credit card required" — if true, this single phrase lifts conversion significantly
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
- Minimum 44px touch target height
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

---

## Recommended Form Copy Template

```
[Headline above form]
Start your free trial — no card required

[Form]
Full name
  Placeholder: "Alex Johnson"

Work email
  Placeholder: "alex@company.com"

Password
  Placeholder: "8+ characters"
  [Show/Hide toggle]

[CTA Button]
Create My Account →

[Below button]
By continuing, you agree to our Terms and Privacy Policy.

[Separator]
— or —

[Continue with Google]
[Continue with Microsoft]

[Below form]
Already have an account? Sign in
```

---

## A/B Test Hypotheses

**Test 1 — Social auth prominence**: Social auth buttons above email form vs. below. Hypothesis: above placement increases social auth usage by 30%+ and overall completion.

**Test 2 — Field reduction**: Remove company field from signup entirely (collect in onboarding). Hypothesis: removes one field → 5–15% lift in completion.

**Test 3 — Email verification delay**: Allow product access immediately, verify before export/publish/invite. Hypothesis: removes single biggest abandonment point in flows requiring immediate verification.