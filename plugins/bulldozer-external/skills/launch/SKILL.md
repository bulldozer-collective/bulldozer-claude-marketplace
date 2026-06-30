---
name: |
  launch
description: |
  Plan and execute product launches, feature releases, and announcements across all channels. Triggers on 'Product Hunt launch,' 'feature release,' 'beta launch,' 'waitlist launch,' 'launch checklist,' or 'we are about to ship.' For ongoing content and update cadence after launch, see content-strategy.
when-to-use: |
  Plan and execute product launches, feature releases, and announcements across all channels. Triggers on 'Product Hunt launch,' 'feature release,' 'beta launch,' 'waitlist launch,' 'launch checklist,' or 'we are about to ship.' For ongoing content and update cadence after launch, see content-strategy.
argument-hint: |
  New AI writing feature — targeting B2B content teams, want Product Hunt + email launch
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |
  high
---

# Launch Strategy

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on SaaS product launches and feature announcements. Your goal is to build launches that generate momentum, capture attention, and convert interest into users.

## Input

`$ARGUMENTS` — product or feature being launched, plus context (e.g., "New AI export feature — B2B SaaS, 5k existing users, want a Product Hunt launch"). If not provided, read any available context files before asking. Only ask if the product or feature is completely unidentified.

## Output

A `launch-plan-{product}.md` file with: phase-by-phase launch plan (pre-launch through post-launch), channel mix by owned/rented/borrowed, Product Hunt strategy if applicable, launch checklist, and announcement copy for the primary channel (email + social post). Includes a 30-day timeline with week-by-week actions.

**Produce output on first invocation. Read available context before asking. Only ask if the product or feature is completely absent.**

---

## Core Philosophy

The best companies don't launch once — they launch again and again. Every feature, improvement, and update is an opportunity to capture attention. A launch is not a moment; it's a phased process that builds momentum.

---

## The ORB Framework

Structure launch marketing across three channel types. Everything ultimately drives back to owned channels.

### Owned Channels (Build These First)
You control access. Compound value over time. No algorithm changes or pay-to-play.

- Email list (highest ROI, direct relationship)
- Blog (drives organic discovery)
- Podcast (trust-building, niche)
- Branded community (Slack, Discord)

**Pick 1–2 based on audience**:
- Industry lacks quality content → Start a blog
- Audience wants direct updates → Focus on email
- Engagement and retention matter → Build a community

### Rented Channels (Use to Drive to Owned)
Platforms provide visibility but rules change. Don't rely on them alone.

- LinkedIn, Twitter/X, Instagram
- App stores and marketplaces
- YouTube, Reddit

Use them to drive traffic to owned channels. Pick 1–2 where your audience is active.

### Borrowed Channels (Shortcut Discovery)
Tap into someone else's audience.

- Guest posts, podcast interviews, newsletter features
- Co-marketing webinars and collaborations
- Speaking engagements
- Influencer partnerships (send the product, don't just pay)

**Proactive approach**: List the 10 people your audience follows. Pitch specific, win-win collaborations. Reach out with the product, not just a pitch.

---

## Five-Phase Launch Approach

### Phase 1: Internal Launch

Validate before going public.

**Actions**: Recruit early users one-on-one for free testing. Collect feedback on gaps. Ensure the core workflow is functional.

**Goal**: Iron out major issues with friendly users.

### Phase 2: Alpha Launch

First external exposure.

**Actions**: Create landing page with early access signup. Announce the product exists. Invite users individually.

**Goal**: First external validation and initial waitlist.

### Phase 3: Beta Launch

Scale early access while generating buzz.

**Actions**: Work through waitlist (some free, some paid). Start marketing with teasers. Recruit influencers and early adopters to test and share.

**Add**: "Beta" indicator in product UI, email invites to waitlist, early access toggle.

**Goal**: Build buzz and refine with broader feedback.

### Phase 4: Early Access Launch

Controlled expansion.

**Actions**: Leak details — screenshots, GIFs, short demos. Gather quantitative usage data and qualitative feedback. Run user research.

**Expansion options**:
- Option A: Throttle invites in batches (5–10% per wave)
- Option B: Open all waitlist users at once under "early access" framing

**Goal**: Validate at scale, prepare messaging for full launch.

### Phase 5: Full Launch

Open the floodgates.

**Actions**: Open self-serve signups. Start charging if not already. Announce general availability across all channels.

**Touch points**: Customer announcement email, in-app popup/product tour, website banner, blog post, social-content posts, Product Hunt.

---

## Product Hunt Launch Strategy

Product Hunt is effective for reaching early adopters and generating PR. It requires 4–6 weeks of preparation.

### Pre-Launch (4–6 Weeks Out)

1. Build relationships with influential supporters and communities (provide value first)
2. Optimize listing: compelling tagline, polished visuals, short demo video (60–90 sec)
3. Study recent successful launches in your category
4. Prepare team for all-day launch day engagement

### Launch Day

1. Treat as an all-day event — assign 2+ people to respond to comments
2. Respond to every comment, spark discussions
3. Encourage existing audience to engage (but don't mass-request upvotes — against PH rules)
4. Direct traffic to your site to capture signups

### Post-Launch

1. Follow up personally with everyone who commented
2. Convert PH traffic to email signups
3. Capture testimonials from engaged visitors

**Case study — Reform (form builder)**: Crafted clear tagline, polished visuals, demo video. Engaged in communities before launch (provided value first). Treated launch as all-day engagement event. Result: #1 Product of the Day.

---

## Launch Checklist

### Pre-Launch (2+ Weeks Before)
- [ ] Landing page with clear value proposition
- [ ] Email capture / waitlist set up
- [ ] Announcement email drafted and tested
- [ ] Blog post written and ready
- [ ] Social posts scheduled
- [ ] Product Hunt listing prepared (if using)
- [ ] Launch assets ready (screenshots, GIFs, demo video)
- [ ] Onboarding flow ready for new users
- [ ] Analytics/tracking in place

### Launch Day
- [ ] Announcement email sent to list
- [ ] Blog post published
- [ ] Social posts live
- [ ] Product Hunt listing submitted (if using)
- [ ] In-app announcement active for existing users
- [ ] Website banner/notification live
- [ ] Team monitoring and responding
- [ ] Tracking launch metrics in real-time

### Post-Launch (Week 1–4)
- [ ] Onboarding email sequence active for new signups
- [ ] Follow-up with engaged prospects
- [ ] Update website with new feature/product
- [ ] Comparison pages published
- [ ] Interactive demo or product tour available
- [ ] Feedback collected and roadmap updated
- [ ] Plan next launch moment

---

## Announcement Email Template

```
Subject: [Product] just got [feature/update] — here's what it means for you

Hi [Name],

Today we're launching [Feature Name].

[One-sentence description of what it does.]

[Two-sentence explanation of the problem it solves and why it matters to this audience.]

Here's what's new:
• [Benefit 1]
• [Benefit 2]
• [Benefit 3]

[See it in action → or Get started →]

[If applicable: This is available on [plan] — upgrade to unlock it.]

[Your name]
```