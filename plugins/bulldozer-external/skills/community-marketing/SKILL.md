---
name: |-
  community-marketing
description: |-
  Design, launch, and grow an online community — Discord, Slack, Circle, or forum — for product-led growth and retention. Triggers on 'community strategy,' 'Discord community,' 'Slack community,' 'community-led growth,' 'brand advocates,' or 'community flywheel.' For structured referral programs, see referral-program.
when-to-use: |-
  Design, launch, and grow an online community — Discord, Slack, Circle, or forum — for product-led growth and retention. Triggers on 'community strategy,' 'Discord community,' 'Slack community,' 'community-led growth,' 'brand advocates,' or 'community flywheel.' For structured referral programs, see referral-program.
argument-hint: |-
  B2B SaaS data tool, 3k users, want to launch a Slack community for data practitioners
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Community Marketing

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on community marketing. Your goal is to design, launch, and grow a community that creates genuine value for members while driving measurable business outcomes.

## Input

`$ARGUMENTS` — company/product, target community persona, and goal (e.g., "B2B SaaS data tool, want a Slack community for data analysts who use our product"). If not provided, read any available context files before asking. Only ask if the product and target community are completely absent.

## Output

A `community-strategy-{product}.md` file with: platform recommendation with rationale, community identity definition, channel architecture, new member journey (welcome DM + intro prompt), launch playbook (weeks 1–4), recurring ritual calendar, and ambassador program brief. Ready to implement immediately.

**Produce output on first invocation. Read available context before asking. Only ask if the primary input is completely absent.**

---

## Community Strategy Principles

### Build Around a Shared Identity, Not Just a Product

The strongest communities are built around who members *are* or aspire to be — not around your product. Members join because of the product but stay because of the people and identity.

Examples:
- Indie Hackers (identity: bootstrapped founders)
- r/homelab (identity: tinkerers who self-host)
- Figma Community (identity: designers who care about craft)

**Define before building**: What identity does this community reinforce for its members?

### Value Must Flow to Members First

Every community touchpoint answers: *What does the member get from this?*
- Exclusive knowledge or early access
- Peer connections not available elsewhere
- Recognition and status within a respected group
- Direct influence on product roadmap
- Career visibility or opportunities

### The Community Flywheel

```
Members join → get value → engage → create content/help others
    ↑                                          ↓
    ←←←←← new members discover the community ←←
```

Design for the flywheel from day one. Every decision should ask: does this accelerate the loop or slow it down?

### The Pre-Launch Tell: Is There Already a Community, Informally?

Before recommending a platform or a launch date, look for the thing that predicts whether a
formal community will work: is this behavior already happening somewhere, unprompted, for
free? Users helping each other in a support Slack DM, a GitHub Discussions thread, a
subreddit nobody at the company started, a Discord server fans made on their own. If people
are already doing this without being asked, a formal community gives them a better room. If
nobody is doing it, a formal community doesn't create the behavior — it just gives the company
a channel to talk *at* people who have shown no sign of wanting to talk to each other.

If the honest answer to "where is this happening informally today" is "nowhere," don't skip
this — say so in the output, and recommend the smaller move first (a newsletter reply-all
thread, a recurring AMA, an existing forum) before a dedicated platform and a launch plan. This
is the single most common reason branded communities fail — for the full reasoning, read
`references/pre-launch-tell-notes.md`.

---

## Platform Selection

Six platforms to choose from — Discord, Slack, Circle, Skool, Discourse, Reddit — each strong
for a different audience and with its own key drawback to flag to the client up front. For the
full comparison table (best-for / drawback per platform), read
`references/platform-selection.md` before writing the platform recommendation.

**Decision rule**: If your audience is technical or developer-oriented → Discord. If your audience is B2B/SaaS buyers who already live in Slack → Slack. If you want to bundle the community with a course or a gamified progression → Skool. If you want SEO + long-form discussion → Discourse.

**Note on Bulldozer OS**: none of these platforms are natively connected to the OS — there is no `bdz…` tool that posts to Discord, Slack, Circle, or Skool on your behalf. What the OS *can* do is instrument what happens around the platform: capturing applicants, tracking founding members, and measuring whether people actually find the community. See below.

---

## Launch Playbook (4-Week Plan)

### Week 1: Seed the Community Privately

Recruit 20–50 founding members manually. DM your most engaged users, beta testers, and power users. Don't open publicly until there's baseline activity.

- Pre-populate channels with 5–10 posts that model the behavior you want
- Welcome every founding member by name in a dedicated intro thread
- Host 1 live call with founders to establish culture

### Week 2: Establish Culture and Rituals

- Write community guidelines that describe the *vibe*, not just rules
- Launch 2–3 weekly ritual threads (e.g., "What are you building this week?")
- Reply to every post this week — you're buying social proof

### Week 3: Soft Launch

- Invite your email list (segment: most engaged users)
- Share 1 exclusive piece of content only available in the community
- Activate your first community AMA or expert session

### Week 4: Open Launch

- Announce publicly (social, product in-app notification, partner channels)
- Launch public invite link
- Post community metrics as social proof ("250 data practitioners already in")

**Don't move to Week 4 on the calendar alone.** The gate to open publicly isn't "three weeks
have passed," it's "founding members post without being prompted." If by the end of Week 3
staff is still writing the majority of unprompted first posts, hold Week 4 and repeat Week 2's
culture-building instead. For why a loud launch onto a quiet room is worse than a delayed one,
read `references/launch-playbook-notes.md`.

---

## Tracking Applicants and Founding Members in Bulldozer OS

Week 1 says "recruit 20–50 founding members manually" — manually finding them is fine, tracking
them by hand in a spreadsheet is not, if the project already runs on Bulldozer OS.

- **If the invite runs through a landing-page form** (an application, a waitlist, an "I'm in"
  button on the site), don't ask the client to export it — pull it. `bdzListCmsForms` finds the
  form's `formElementId` on the site, then `bdzListCmsFormSubmissions` returns every submission
  keyed by field label. That's the applicant list, already structured.
- **Turn the shortlist into a trackable list**: `bdzCreateLeadList` creates a list for the
  project, `bdzAddLeadToList` adds each candidate (deduplicated on email or LinkedIn URL), and
  `bdzListLeadListLeads` carries a per-person review state (to review / accepted / rejected) —
  so "who did we already DM, who said yes" lives in one place instead of a founder's memory.
- **Store the community's canonical link where the team can find it**: `bdzAddWorkspaceLink`
  attaches the invite URL (Discord/Slack/Circle/Skool) to the project workspace, with a name and
  description — not buried three DMs deep.
- **Before declaring the soft launch a win, check real traffic, not just sign-up count**: if the
  landing page carries GA4 tracking, `bdzGetGoogleAnalyticsReport` returns the stored report —
  tells "20 joined because 400 visited and 5% converted" apart from "20 joined because 22
  visited and word-of-mouth did all the work." Those call for different Week 4 moves.

These read/list operations layer on top of the manual outreach above — they replace re-deriving
"who have we already talked to" from memory each week, not the 1:1 DMs themselves.

---

## Channel Architecture (Example for B2B SaaS)

```
📢 announcements      — company updates only; members cannot post
👋 introductions      — new member intros
🆘 help-and-support   — product questions, peer assistance
💡 tips-and-tricks    — power user techniques
🔗 resources          — curated links, templates, tools
☕ off-topic           — anything else
🎤 #events            — upcoming calls, AMAs, webinars
```

**Rules**:
- Every channel needs a description
- Fewer channels > more channels (quality activity > channel count)
- Archive channels with <5 posts/week

---

## New Member Journey

**Name the activation moment before writing the journey.** It isn't "joined" — it's *a member's
first post gets a reply from someone other than staff, within the same day.* Track "posted but
got no reply within 24h" separately from "never posted at all": they're different failures with
different fixes. For the full reasoning and why each step below exists, and for the Step 1 DM
copy template, read `references/new-member-journey-notes.md`.

**Step 1 — Immediate**: Automated welcome DM sent on join (template in the reference above):
introduce yourself in #introductions, get help or share a tip in #help-and-support, check out
#resources.

**Step 2 — Day 2**: If no introduction posted, send a follow-up DM with a specific question to lower the barrier ("What's one thing you're trying to figure out with [Product/Topic] right now?")

**Step 3 — Day 7**: Share one piece of exclusive content or invitation to an upcoming event

---

## Community Health Metrics

Track weekly:

| Metric | Target | Warning sign |
|--------|:------:|-------------|
| DAU/MAU ratio | >15% | <5%: lurker community, not a flywheel |
| New member post rate | >25% | <10% new members post within 7 days |
| Thread reply rate | >60% | >40% of threads have 0 replies = posts going unacknowledged |
| Staff % of posts | <30% | >60%: your team is the community |

None of the four targets above are a published market benchmark for community engagement
specifically — they're directional heuristics, not numbers to defend in a QBR. Establish the
community's own baseline in week 3–4 of the launch, then track movement against *that* — a
rising or falling trend against your own history is the signal, a static external percentage is
not. Staff % of posts in particular only means something after the open launch — staff carrying
the room during Weeks 1–2 of seeding is the plan working, not a red flag. For the full reasoning
(why a real benchmark like Mixpanel's product-stickiness number still doesn't transfer, and what
to do if the warning signs below are still true 6–8 weeks after open launch), read
`references/community-health-metrics.md`.

**Early warning signals**:
- Questions go unanswered >24 hours
- Same 5 people account for >80% of posts
- New members stop posting after intro message

If the community sits behind a public landing or waitlist page, `bdzGetGoogleAnalyticsReport`
gives you the actual visit-to-join funnel for that page — pair it with the platform's own
member count so "growth" means people finding and joining, not just the platform's activity
counter climbing.

---

## Ambassador Program

**Step 1 — Identify candidates**: Look for members who already help others unprompted, reply frequently, and produce quality content. If a candidate is a public voice worth watching beyond the community itself, check first rather than guessing from one community thread: `bdzListLinkedInPosts` reads whatever the OS already has stored for their profile URL, free and read-only. Nothing stored yet? `bdzCreateLinkedInPostListJob` runs a one-off scrape (poll with `bdzGetLinkedInPostListJob`, then re-read `bdzListLinkedInPosts`) — that's enough to see whether they already talk about the space before you make the offer. For tracking a candidate's posts on an ongoing basis once they're an ambassador (a paid, jeton-metered tool, distinct from this one-time check), read `references/ambassador-program-notes.md`.

**Step 2 — Personal outreach**: Reach out 1:1. Explain why you chose them specifically. Don't send a generic form.

**Step 3 — Offer meaningful benefits**:
- Early product access or beta features
- Direct line to product team
- Public recognition (community ambassador badge, featured profile)
- Invitations to private calls with founders
- Swag or event invitations

**Step 4 — Give them tools**: Private channel for ambassadors, shareable community content, key talking points.

**Step 5 — Track**: Referrals driven, engagement generated, content created. Recognize top contributors publicly monthly.

**Don't offer "Direct line to product team" or roadmap access before the unprompted behavior in
Step 1 has actually happened** — grant it after weeks of evidence, not at the moment of the
offer. For why this specific benefit carries that risk, and for when to re-evaluate a roster
member who's gone quiet, read `references/ambassador-program-notes.md`.

---

## Rules

- **Never recommend a formal community with zero informal precedent as if it were a safe bet.**
  If nobody is already helping each other unprompted somewhere — a support channel, a forum,
  a fan-made server — say that plainly in the output and size the recommendation down to a
  smaller move, not a platform and a four-week launch plan.
- **Never open publicly on the calendar date alone.** Week 4 is earned by founding members
  posting unprompted by the end of Week 3, not by three weeks having passed. Hold the launch
  and repeat Week 2 if that hasn't happened — a loud launch onto a quiet room burns the one
  first impression you get with most of the people who show up.
- **Never read "Staff % of posts" against the same threshold in Week 1 as in Week 8.** Staff
  carrying the room during seeding is the plan working; the same number after open launch is
  the warning sign.
- **Never treat a community as the fix for a retention or activation problem that lives in the
  product.** A community can extend genuine value, not manufacture goodwill the product itself
  isn't earning — if the honest read is "we're launching this because churn is bad," say so in
  the output rather than write the brief as if community were the lever.
- **Never keep inviting new members into a room with unanswered questions.** If the warning
  signs in Community Health Metrics are still true 6–8 weeks after open launch, pause growth
  and fix the room, or fold the format down to something one person can sustain — don't scale
  the invite list hoping more people fixes what more people would only make worse.
- **Never hand out "direct line to product team" or roadmap access at the moment of the
  ambassador offer.** Grant it after the unprompted behavior that earned the offer, not before
  — early access to the product team is the one benefit that changes what people post for.
- **Never score community health against a market benchmark.** No published number is specific
  to community engagement (as opposed to product engagement) with a source solid enough to cite
  to a client — build the community's own baseline in weeks 3–4 and track movement against it.