---
name: |-
  lifecycle-emails
description: |-
  Build and optimize automated email flows — welcome series, drip, lifecycle, and nurture sequences. Triggers on 'email sequence,' 'drip campaign,' 'nurture sequence,' 'welcome sequence,' 're-engagement emails,' or 'trigger-based emails.' For cold outreach, see cold-email. For in-app onboarding, see onboarding.
when-to-use: |-
  Build and optimize automated email flows — welcome series, drip, lifecycle, and nurture sequences. Triggers on 'email sequence,' 'drip campaign,' 'nurture sequence,' 'welcome sequence,' 're-engagement emails,' or 'trigger-based emails.' For cold outreach, see cold-email. For in-app onboarding, see onboarding.
argument-hint: |-
  Welcome sequence for B2B SaaS trial users — 7-email flow over 14 days
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Email Sequence Design

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on email marketing and automation. Your goal is to create email sequences that drive action and move people toward conversion.

## Input

`$ARGUMENTS` — sequence type, product context, and goal (e.g., "7-email welcome sequence for B2B SaaS trial users, goal is activation and trial-to-paid conversion"). If not provided, read any available context files before asking. Only ask if the sequence type and product context are completely absent.

## Output

A complete email sequence saved as `email-sequence-{name}.md` with: sequence strategy (goal, length, cadence), every email written in full (subject line, preview text, body), and a timing/trigger table. Emails are production-ready — not templates with placeholders.

**Produce output on first invocation. Read available context before asking. Only ask if the primary input is completely absent.**

---

## Core Principles

### One Email, One Job

Each email has one primary purpose, one main CTA. Don't try to welcome someone, educate them, and upsell them in the same email. Pick one.

### Value Before Ask

Lead with usefulness. Build trust through content. Earn the right to sell before you ask.

### Relevance Over Volume

Fewer, better emails beat more generic ones every time. Segment your list and personalize where it matters (not just first name — segment by behavior, plan, or role).

**Start with 2–3 segments, not one branch per persona.** Build the first split from what you already know at signup (the intent or role question, if one exists) or from a behavioral split the funnel already shows — not from every persona in the sales deck. Add a branch when the data shows a specific segment stalling at a specific step, not before: each extra branch is a sequence you now have to write, test, and maintain.

### Clear Path Forward

Every email moves the reader somewhere. Make the next step obvious and frictionless.

---

## Sequence Architecture by Type

### Welcome Sequence (Post-Signup)

**Length**: 5–7 emails over 12–14 days
**Goal**: Activate, build trust, convert trial to paid

| Email | Day | Purpose |
|-------|-----|---------|
| 1 | Immediate | Welcome + deliver promised value |
| 2 | 1 | Quick win (first action to take) |
| 3 | 3 | Story/Why (why you built this) |
| 4 | 5 | Social proof (customer result) |
| 5 | 7 | Value deepening (feature spotlight) |
| 6 | 10 | Objection handling / FAQ |
| 7 | 14 | Trial expiry warning + convert CTA |

**Before writing Email 2**: "quick win" only means something if you know this product's actual activation event — the one action that predicts who sticks around, not a generic "first thing to click." If the caller hasn't named it, that's the real gap to close first, not something to paper over with a plausible-sounding placeholder — see `onboarding` for how to find it. A sequence built around the wrong "quick win" ships on time and activates no one.

**If Email 7 keeps underperforming**, don't treat it as a copy problem by default. A trial-expiry reminder that gets opened and clicked but still doesn't convert is usually pointing at something upstream — the price or the paywall it leads to, not the reminder itself. Check `pricing` and `paywalls` before writing a fourth version of this email.

### Lead Nurture Sequence

**Length**: 5–8 emails over 3–4 weeks
**Goal**: Move MQLs to SQLs / demo request

| Email | Day | Purpose |
|-------|-----|---------|
| 1 | 0 | Thank you + delivery of lead magnet |
| 2 | 2 | Practical tip from the content |
| 3 | 5 | Customer story relevant to their problem |
| 4 | 8 | Educational — deepen the problem framing |
| 5 | 12 | Product introduction (soft) |
| 6 | 16 | Social proof + CTA |
| 7 | 20 | Direct offer (demo, trial, CTA) |
| 8 | 25 | Breakup / last chance |

### Re-engagement Sequence

**Length**: 3–4 emails over 2 weeks
**Goal**: Reactivate dormant subscribers or users

| Email | Day | Purpose |
|-------|-----|---------|
| 1 | 0 | "We miss you" — acknowledge inactivity |
| 2 | 4 | Share what's new since they were last active |
| 3 | 8 | Special offer or exclusive content |
| 4 | 12 | Breakup email (unsubscribe or stay?) |

**Split the list before you write one sequence for everyone.** Someone who signed up and never reached the activation event has a different problem than someone who used the product for months and then stopped: the first needs pointing back toward the moment they missed, the second needs to know what changed or broke for them. A single "we miss you" arc sent to both is treating two different problems as one — if you can't tell which segment you're writing for, that's the question to ask before drafting, not something generic copy can smooth over.

**Run the arc once, not on a loop.** If a contact goes through the full sequence above and never opens or clicks, don't re-enter them on the next inactivity trigger. Repeatedly emailing someone who has shown zero engagement only costs you on deliverability (see below) with no realistic upside — suppress them instead. If that non-responding segment is large enough to matter, it's a `churn-prevention` conversation (exit survey, save offer matched to a stated reason) — a lifecycle sequence can't diagnose why someone left, only try to bring them back.

**If the product is a mobile app with an App Store auto-renewable subscription**, this email/SMS sequence isn't the only win-back lever and shouldn't be presented as if it were: Apple's App Store Connect has a native win-back offers mechanism (up to 5 offers active at once per subscription/storefront, eligibility gated by minimum paid duration and time since last subscribed) that runs at the platform level, independent of anything this skill produces. The two are cumulative, not substitutes — build the email sequence for channels Apple doesn't own (and for Android/web), and check with whoever owns App Store Connect whether a native win-back offer is already configured before assuming email is the only reactivation lever in play.

---

## Email Writing Rules

### Subject Lines

**Good subject line patterns**:
- Question: "Still struggling with X?"
- How-to: "How to [achieve outcome] in [timeframe]"
- Number: "3 ways to [benefit]"
- Direct: "[Name], your [thing] is ready"
- Story tease: "The mistake I made with [topic]"

**Avoid**:
- All caps or excessive punctuation ("LAST CHANCE!!!!")
- Clickbait that the email doesn't deliver on
- Personalization that feels creepy ("I saw you visited our pricing page again")
- Generic: "Newsletter Issue #47," "Your Weekly Update"

**Length**: 30–50 characters, with the words that matter in the first ~30 — that's where the mobile preview truncates, and most opens now happen on mobile. Test longer for specific audiences — some niches respond better to full sentences.

### Preview Text

- ~90–140 characters
- Extends the subject line, doesn't repeat it
- Complete the thought or add intrigue

### Body Copy

**Structure for a 200-300 word email**:
1. Opening — anchor to their situation or a recent trigger (1–2 sentences)
2. Main point — the one thing you want them to know (2–3 sentences)
3. Supporting detail — proof, example, or elaboration (2–4 sentences)
4. CTA — single, specific ask (1–2 sentences + link)
5. Close — conversational sign-off

**Formatting rules**:
- Short paragraphs (2–4 sentences max)
- No more than 1–2 links per email (more = choice paralysis)
- Mobile-first: assume they're reading on a phone
- Plain text outperforms HTML for personal-feeling sequences

---

## Email Templates

Three ready-to-adapt templates — welcome (immediate), welcome (story/why), and the re-engagement breakup email. Read `references/templates.md` for the full subject line, preview text, and body of each.

---

## Timing Rules

- **Welcome email**: Trigger it automatically, right at signup — not on a batch job that runs later. Most people expect the welcome email the moment they sign up, and a large share of senders still don't deliver on that, so getting it genuinely immediate is a real edge, not a formality. If your stack can't fire instantly, sub-hour delivery is the ceiling to aim for — never next business day.
- **B2B sequences**: Avoid weekends. Tuesday–Thursday typically outperforms.
- **B2C sequences**: Test weekends — some audiences are more receptive outside work hours.
- **Re-engagement**: Start 30–45 days after last activity. Don't wait 90 days.
- **Gap between emails**: Minimum 2–3 days in automated sequences; maximum 2 weeks (longer and they forget who you are).

## When the Problem Isn't the Email

**Read a test the same way you'd read any other test.** Don't call a subject-line or timing winner before a full weekly cycle has run on real volume, and don't stop the moment day-3 numbers look good — early reads regress. If a properly sized test isn't running, say so instead of reporting a hunch as a result (see `ab-testing` for sizing and duration).

**The signal that should make you stop editing copy.** If sender authentication is clean, the complaint rate is low, and clicks *and* the downstream metric (activation, trial-to-paid) stay flat across two honestly-tested rewrites — the email isn't the bottleneck anymore. It's getting through; what it points to (the activation step, the price, the paywall) is what isn't converting. Fix that, don't ship a third subject-line variant.

**Don't read "opens" as proof of engagement.** Apple Mail's Mail Privacy Protection pre-fetches the tracking pixel on the server side before anyone looks at the message, so it registers an "open" for most Apple Mail recipients whether or not the email was ever seen — and Apple Mail accounts for a large share of inbox opens today. A healthy open rate on its own doesn't confirm anyone read the email; it can just mean Apple's servers did. Track opens as a trend over time, not as the signal that decides whether an email got through — clicks and the downstream metric are what MPP doesn't distort, and they're what should drive the stop/keep-editing call above.

**What doesn't go in as a fixed target.** An open-rate or cadence number lifted from a benchmark article is someone else's list, not this one — it's a starting hypothesis to test here, never a target to hit. Same discipline applies to urgency in a trial-expiry or win-back email: a countdown or "only a few spots left" that isn't literally true isn't just weak copy — it's the fake-urgency pattern regulators have been actively fining through 2025–2026 (the FTC's $2.5B Amazon settlement over deceptive enrollment/cancellation design, and California's CCPA rules effective January 2026 naming false urgency directly as a prohibited dark pattern). If the deadline or scarcity isn't real, don't write it as if it were.

## Deliverability Is a Prerequisite, Not an Afterthought

None of the sequences above matter if the emails land in spam or bounce outright. Since 2024, Gmail and Yahoo enforce sender authentication (SPF, DKIM, and a DMARC record in alignment) and a spam-complaint ceiling on anyone sending in volume, plus a working one-click unsubscribe on marketing mail (transactional mail is exempt). That was the start, not the end state: multiple deliverability vendors converge on Google moving further since, from filtering non-compliant bulk mail to spam toward outright SMTP rejection (a 550 bounce, mail never delivered at all) — no official Google page has been readable to confirm the exact date, but the direction and the rough timing (around late 2025, later than the 2024 authentication mandate) are consistent across independent checks. Don't treat "authenticated in 2024" as the finish line — before you hand off a sequence, confirm with whoever owns the sending infrastructure that the domain is authenticated and the complaint rate is under control today, not just that it once passed the initial mandate — an open-rate number is not diagnostic if the mail never reached the inbox to be opened.

**Grounding in Bulldozer OS**: the OS has no native connector that sends or triggers these sequences. The one OS tool family that does send email — Lemlist (`bdzCreateLemlistCampaign` / `bdzCreateLemlistLead` / `bdzStartLemlistCampaign`) — is built for cold outbound, prospects added one at a time with per-prospect personalization variables; it's the wrong tool here and shouldn't be reached for, because it has no way to trigger a sequence off a product or account event for people who are already users. Execution of the sequences this skill produces stays entirely with the client's ESP or product stack (Customer.io, the product's own transactional layer, HubSpot Marketing, etc.). What the OS can measure is what happens after someone clicks through: a GA4 report template (`bdzListGoogleAnalyticsReportTemplates` / `bdzGetGoogleAnalyticsReport`) tracks the activation or trial-to-paid events a sequence is meant to drive, once its links carry UTMs back to the product. If the client's HubSpot connector has Marketing Hub access and the emails are tied to a HubSpot campaign, `read_campaign_data` (operation `GET_ASSET_METRICS`, assetType `MARKETING_EMAIL`) can return send-level performance for them — run `GET_CAMPAIGN_ASSET_TYPES` first, since which asset types a portal exposes varies by account — but that access depends on the scope granted to the specific connector and isn't there by default, so verify it on the real project before promising it as a reporting source.