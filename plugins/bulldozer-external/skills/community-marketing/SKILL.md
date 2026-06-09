---
name: community-marketing
description: Design, launch, and grow an online community — Discord, Slack, Circle, or forum — for product-led growth and retention. Triggers on 'community strategy,' 'Discord community,' 'Slack community,' 'community-led growth,' 'brand advocates,' or 'community flywheel.' For structured referral programs, see referral-program.
when-to-use: Design, launch, and grow an online community — Discord, Slack, Circle, or forum — for product-led growth and retention. Triggers on 'community strategy,' 'Discord community,' 'Slack community,' 'community-led growth,' 'brand advocates,' or 'community flywheel.' For structured referral programs, see referral-program.
argument-hint: B2B SaaS data tool, 3k users, want to launch a Slack community for data practitioners
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
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

---

## Platform Selection

| Platform | Best for | Key drawback |
|----------|----------|-------------|
| **Discord** | Developer, creator, gaming communities; real-time | High noise, onboarding friction, hard to search |
| **Slack** | B2B/professional communities; familiar to SaaS buyers | Free tier limits history; feels like work |
| **Circle** | Creator/course communities; clean UX | Less organic discovery; requires driving traffic |
| **Discourse** | Long-form technical communities; SEO value | Slower velocity; higher effort to post |
| **Reddit** | High-volume public communities | You don't own it; moderation is hard |

**Decision rule**: If your audience is technical or developer-oriented → Discord. If your audience is B2B/SaaS buyers → Slack. If you want SEO + long-form discussion → Discourse.

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

**Step 1 — Immediate**: Automated welcome DM sent on join

```
Hey [Name]! Welcome to the [Community Name] community.

A few things to get started:
1. Introduce yourself in #introductions
2. Get help or share a tip in #help-and-support
3. Check out #resources for the best community content

Happy to have you here.
— [Community Manager Name]
```

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

**Early warning signals**:
- Questions go unanswered >24 hours
- Same 5 people account for >80% of posts
- New members stop posting after intro message

---

## Ambassador Program

**Step 1 — Identify candidates**: Look for members who already help others unprompted, reply frequently, and produce quality content.

**Step 2 — Personal outreach**: Reach out 1:1. Explain why you chose them specifically. Don't send a generic form.

**Step 3 — Offer meaningful benefits**:
- Early product access or beta features
- Direct line to product team
- Public recognition (community ambassador badge, featured profile)
- Invitations to private calls with founders
- Swag or event invitations

**Step 4 — Give them tools**: Private channel for ambassadors, shareable community content, key talking points.

**Step 5 — Track**: Referrals driven, engagement generated, content created. Recognize top contributors publicly monthly.