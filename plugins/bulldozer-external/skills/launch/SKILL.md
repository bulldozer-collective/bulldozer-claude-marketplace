---
name: |-
  launch
description: |-
  Plan and execute product launches, feature releases, and announcements across all channels. Triggers on 'Product Hunt launch,' 'feature release,' 'beta launch,' 'waitlist launch,' 'launch checklist,' or 'we are about to ship.' For ongoing content and update cadence after launch, see content-strategy.
when-to-use: |-
  Plan and execute product launches, feature releases, and announcements across all channels. Triggers on 'Product Hunt launch,' 'feature release,' 'beta launch,' 'waitlist launch,' 'launch checklist,' or 'we are about to ship.' For ongoing content and update cadence after launch, see content-strategy.
argument-hint: |-
  New AI writing feature — targeting B2B content teams, want Product Hunt + email launch
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Launch Strategy

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on SaaS product launches and feature announcements. Your goal is to build launches that generate momentum, capture attention, and convert interest into users.

## Input

`$ARGUMENTS` — product or feature being launched, plus context (e.g., "New AI export feature — B2B SaaS, 5k existing users, want a Product Hunt launch"). If not provided, read any available context files before asking. Only ask if the product or feature is completely unidentified.

## Output

A `launch-plan-{product}.md` file with: phase-by-phase launch plan (pre-launch through post-launch), channel mix by owned/rented/borrowed, Product Hunt strategy if applicable, launch checklist, and announcement copy for the primary channel (email + social post). Includes a 30-day timeline with week-by-week actions.

When the project has a Bulldozer workspace, also offer to save the plan there with `bdzCreateWorkspaceTextFile` (name it `launch-plan-{product}`) so it lives with the project instead of only on local disk. If more than one workspace exists (`bdzListWorkspaces`), ask which one — never guess.

**Produce output on first invocation. Read available context before asking. Only ask if the product or feature is completely absent.**

---

## Core Philosophy

The best companies don't launch once — they launch again and again. Every feature, improvement, and update is an opportunity to capture attention. A launch is not a moment; it's a phased process that builds momentum.

---

## Match the Machinery to the Launch

Before reaching for the ORB framework or the five phases below, decide how much of this playbook the launch actually earns. Several public product-marketing playbooks (a tiering framework attributed to Pragmatic Institute, plus independent tiering write-ups from PMM practitioners) converge on the same rough three-way split — none of them were readable directly in this environment (network egress blocked on every domain tried), so treat the shape of the split as the durable part, not any exact week-count or launches-per-year figure a given source attaches to it:

- **Major launch** — net-new capability that changes what the product is for, or a release the whole company rallies behind. This is the tier that earns the full five phases below, a dedicated waitlist, Product Hunt, and real cross-functional lead time.
- **Significant update** — a real improvement existing users will notice and value, but not a new reason to buy. Worth a campaign (announcement email, a blog post, a sales enablement refresh), rarely worth a Product Hunt slot or a multi-week waitlist program.
- **Incremental improvement** — table-stakes work, useful but only to people already touching the feature it changes. An in-product notice and a changelog line are the whole launch; running Phases 1–5 on it spends team capacity the next major launch will need.

**The failure mode runs both directions.** Under-tiering wastes weeks of prep and outreach on something nobody outside the product will notice. Over-tiering is more common and more expensive: measuring a quietly-shipped incremental fix against a major launch's reach manufactures a "failure" that was never a fair comparison, and conversely measuring a real launch against a changelog entry's bar hides a genuine miss. Pick the tier before picking a channel — it decides everything from here down, including whether Product Hunt belongs in this launch at all (see `references/product-hunt.md`).

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

Use them to drive traffic to owned channels. Pick 1–2 where your audience is active. For LinkedIn specifically, `bdzCreateLinkedInPost` publishes to the connected LinkedIn account directly — use it to actually ship the launch post instead of drafting copy that gets pasted in manually. Its `message` parameter (the post text) is required and rejected outright when blank — pass the actual drafted post copy, not a placeholder.

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

**Actions**: Recruit early users one-on-one for free testing. Collect feedback on gaps. Ensure the core workflow is functional. **Name the activation event before moving on** — the single action that, once a user has done it, changes how likely they are to stay (first report generated, first integration connected, first send — whatever it is for this product). Every later phase reads its numbers against this event, not against signups or logins alone.

**Goal**: Iron out major issues with friendly users, and leave this phase with one named, measurable activation event — not just "it works."

### Phase 2: Alpha Launch

First external exposure.

**Actions**: Create landing page with early access signup. Announce the product exists. Invite users individually. Name, in the landing page copy, the specific status quo this replaces for the visitor — a spreadsheet, a manual process, an incumbent tool, or doing nothing. The competitor for an early-access product is almost never another named vendor; it's whatever the visitor is already doing instead, and the copy should say so rather than compare only to other software.

**Resist the pull to name a new category to make the comparison disappear.** A category name is a multi-year investment large incumbents make deliberately, on purpose, with years of repetition behind it — a single product or feature launch doesn't have that budget, and inventing one just relabels the avoidance of naming the real status quo above. Compare against it instead.

**OS-backed waitlist**: create a dedicated list with `bdzCreateLeadList` (e.g. "Launch waitlist — {product}") rather than tracking signups in a spreadsheet. Every signup goes in with `bdzAddLeadToList`, using the free-text `source` field to record where they came from (landing page, a specific post, a referral) — that field only accepts the first value written per lead, so set it accurately on the way in.

**Goal**: First external validation and initial waitlist.

### Phase 3: Beta Launch

Scale early access while generating buzz.

**Actions**: Work through waitlist (some free, some paid). Start marketing with teasers. Recruit influencers and early adopters to test and share.

**Add**: "Beta" indicator in product UI, email invites to waitlist, early access toggle.

**Measuring signup volume for real**: if the waitlist form lives on a connected Webflow site, don't estimate submissions — `bdzListCmsForms` identifies the exact form by `pageName` + `formElementId` (several forms on one site often share the same display name, so name alone won't find the right one), and `bdzListCmsFormSubmissions` filtered on that `formElementId` gives the real count. One check before trusting that count as the waitlist's own: `bdzListCmsFormSubmissions` filters only on `formElementId`, never on a page, and the same form element is routinely reused across more than one page (a real site checked for this skill had two such elements, each shared by two distinct pages). Confirm in the `bdzListCmsForms` listing that the waitlist page's `formElementId` doesn't also appear under a different `pageName` — if it does, the submission count mixes in signups from whatever other page reuses that same form.

**A large waitlist is not validation by itself.** It measures curiosity, not fit — the number worth reporting upward is how much of the list converts to the named activation event once invited, not how many rows sit in it. A waitlist that never gets read against activation is a vanity metric with an early-access label on it.

**Goal**: Build buzz and refine with broader feedback.

### Phase 4: Early Access Launch

Controlled expansion.

**Actions**: Leak details — screenshots, GIFs, short demos. Gather quantitative usage data and qualitative feedback. Run user research.

**Track the activation event, not just usage volume**: if GA4 is connected, check `bdzListGoogleAnalyticsReportTemplates` for an existing report before building a new one — the project may already track this. Otherwise `bdzCreateGoogleAnalyticsReportTemplate` can carry the activation event as a metric. Google's own GA4 UI has called conversion-marked events "key events" since the March 2024 rename, but Bulldozer OS's curated metric catalog for this template (`bdzListGoogleAnalyticsMetrics`) doesn't expose a `keyEvents` field at all — the metric to select is `conversions`, the name the OS catalog actually returns. Build the template against that name, not the GA4 UI's own term for the concept.

**Expansion options**:
- Option A: Throttle invites in batches (5–10% per wave) — gate each wave on the activation rate of the current cohort clearing some bar you set in Phase 1, not on a fixed calendar. Opening the next wave on schedule regardless of whether the current one is activating just scales whatever is or isn't working. Set that bar once, in Phase 1, in absolute terms — matching or beating the friendly-user cohort's activation rate — and hold it there. The discipline that actually matters is refusing to quietly lower the bar wave after wave as pressure builds to keep the calendar moving; a bar that erodes under pressure to expand isn't a bar.
- Option B: Open all waitlist users at once under "early access" framing

**Goal**: Validate at scale, prepare messaging for full launch.

### Phase 5: Full Launch

Open the floodgates.

**Actions**: Open self-serve signups. Start charging if not already. Announce general availability across all channels. If pricing is being set or changed here, treat it as a product decision, not a finance exercise — what gets charged for signals who the product is for, and separates the customers worth having from the ones who'll churn on the first renewal. This isn't the moment to improvise a number without the pricing work already done upstream of this launch.

**Touch points**: Customer announcement email, in-app popup/product tour, website banner, blog post, social-content posts, Product Hunt.

---

## Product Hunt Launch Strategy

Product Hunt remains an active channel in 2026 (a databox analysis of close to 5,000 launches tracked Jan–Sep of that year shows real, ongoing volume, despite a 2024 grievance in indie-hacker circles about declining launch counts — a reputational signal, not evidence the platform went quiet). It fits a self-serve product with a founder or small-team buyer; it mostly doesn't fit an enterprise sale gated behind security review and multiple stakeholders — check that fit before booking the 4–6 weeks of prep it requires.

For the full playbook — the audience-fit test, pre-launch prep, the weekday data for picking launch day, the rule against soliciting upvotes, and post-launch follow-up — read `references/product-hunt.md`.

---

## Launch Checklist

The full pre-launch / launch-day / post-launch checklist — the operational dispatch
to run during the launch itself — lives in `references/launch-checklist.md`. Read it
when the plan moves from drafting to execution.

---

## Announcement Email Template

The subject-line and body gabarit for the announcement email lives in
`references/announcement-email-template.md` — adapt it for the primary-channel
deliverable named in `Output` above.