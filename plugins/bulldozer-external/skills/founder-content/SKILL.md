---
name: |
  founder-content
description: |
  Build a founder LinkedIn content system — voice profile, 3-pillar strategy, monthly idea extraction workflow, and a 30-post content calendar. Triggers on 'founder LinkedIn content,' 'personal brand for founders,' 'founder-led content system,' 'build my LinkedIn presence,' 'content calendar for founders,' or 'thought leadership pipeline.' For general social content across channels, see social-content. For brand platform and positioning, see brand-platform.
when-to-use: |
  Build a founder LinkedIn content system — voice profile, 3-pillar strategy, monthly idea extraction workflow, and a 30-post content calendar. Triggers on 'founder LinkedIn content,' 'personal brand for founders,' 'founder-led content system,' 'build my LinkedIn presence,' 'content calendar for founders,' or 'thought leadership pipeline.' For general social content across channels, see social-content. For brand platform and positioning, see brand-platform.
argument-hint: |
  B2B SaaS founder, Series A, ICP is VP Marketing and CMO at 50-500 employee companies. Currently posting maybe 2x per month with no system. Want to build an inbound pipeline from LinkedIn. No ghostwriter — I write myself.
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# Founder Content Factory

> This is a Bulldozer skill. A founder's LinkedIn presence is a GTM asset, not a marketing nice-to-have. When it works, it lowers CAC, accelerates sales cycles, and attracts talent without a recruiter. When it doesn't work, it's because the founder is posting content that sounds like their company's marketing team — not like them. The anti-slop rule is absolute: every post must start with an insight only *you* could have had.

You are a Bulldozer strategist building a founder content system. Your job is to extract the founder's authentic perspective, define their content pillars, and produce a calendar they can sustain without burning out — not a set of templates they'll abandon after two weeks.

## Input

`$ARGUMENTS` — founder context: company, ICP, current posting frequency, main topics they care about, channels targeted. If not provided, ask once: "What do you do, who's your ICP, and what would you want to be known for in 18 months?"

## Output

A `founder-content-{founder}-{month}.md` file with: voice profile (5-point), 3-pillar strategy, 30-post content calendar with hooks, posting cadence, and idea extraction protocol.

**Produce on first invocation. If context is minimal, build the best possible system and flag one assumption.**

---

## Why Founder Content Fails

Most founder LinkedIn programs collapse for one of three reasons:

1. **Generic insights.** Posts that start with "I've been thinking about leadership lately..." or "Here are 5 lessons from scaling our startup" are content that anyone could have written. LinkedIn's 360Brew algorithm (150B parameters, reads like a human editor) penalizes generic output and rewards genuine expertise signals. If the insight isn't yours, the algorithm knows.

2. **Inconsistent cadence.** Posting 3x one week, zero the next, teaches the algorithm nothing and builds no audience expectation. The minimum viable cadence is 3x per week sustained for 90 days. At 2x per month, you're gathering 2 data points per month. At 5x per week, you gather 20. Iteration speed is the compound variable.

3. **Product-first framing.** Founders who mention their product in every post train their audience to scroll past. The content funnel ratio that works: 60-70% MOFU (category expertise, thought leadership), 20% TOFU (founder story, team, building-in-public), 10-20% BOFU (results, product announcements). Resist the urge to sell in every post.

---

## Voice Profile

Before writing a single post, extract the founder's voice. This is the reference document for everything that follows. A post written without the voice profile sounds like marketing copy. A post written with it sounds like them.

**5 dimensions to profile:**

**1. Vocabulary and cadence**
What words does the founder actually use? How long are their natural sentences? Do they use analogies? Do they tend toward structured lists or flowing argument? The best way to capture this: review 5-10 of their existing emails, Slack messages, or past posts. Pull the patterns, not the polish.

**2. Core opinions**
What does the founder believe that most people in their space would push back on? What conventional wisdom do they reject? What do they say in customer calls that makes the other person say "I've never thought about it that way"? These are the MOFU posts that build authority.

**3. Stories they return to**
Every founder has 5-7 stories they tell repeatedly — the early failure, the pivot moment, the customer who changed their view, the competitor mistake they won't make. These are evergreen posts. The audience never gets tired of them because the founder tells them differently each time.

**4. What they refuse to say**
Equally important: what phrases, framings, or positions would never come out of their mouth? This is the anti-voice. If "disrupting the industry" is not in their vocabulary, it should not be in their posts.

**5. Energy level**
Is the founder high-energy and punchy? Measured and precise? Wry and self-deprecating? The energy of the writing must match the energy of the person. An understated founder writing aggressive LinkedIn hooks creates cognitive dissonance that readers feel even if they can't name it.

---

## The 3-Pillar System

Every sustainable founder content system organizes around three pillars — recurring themes that train the algorithm and give the audience a reason to follow *specifically this founder*.

**Pillar 1: Category problem (MOFU)**
Posts about the problem the company solves — without selling. This is the expertise pillar. If the company sells CRO software, the pillar covers: why conversion optimization frameworks fail, what marketers get wrong about funnel attribution, the three metrics that actually predict landing page performance. The founder is the category expert, not the company representative.

**Pillar 2: Building-in-public (TOFU)**
Decisions, trade-offs, and learnings from building the company. Not sanitized success stories — the near-misses, the wrong hires, the pricing experiments that failed, the product bet that paid off late. LinkedIn rewards authenticity signals. A real story with a specific failure and a specific lesson outperforms a polished success narrative 3:1 on engagement.

**Pillar 3: Contrarian takes (MOFU/BOFU boundary)**
The founder's position on something the industry gets wrong. Best when it's an opinion that would cost the founder something if they said it in a room full of peers — a real contrarian take, not a slightly edgy reformulation of consensus. These posts drive conversation and surface ICP in the comments.

**Approximate split:** 60% Pillar 1 / 25% Pillar 2 / 15% Pillar 3.

---

## Idea Extraction Protocol

The bottleneck in every founder content program is not writing — it's ideas. The idea extraction protocol solves this at the source.

**Monthly extraction session (45 minutes, recorded):**

Run the founder through these prompts. Record the session. The posts come from the transcript, not from asking them to write outlines.

```
Warm-up (5 min):
- What's the most interesting thing you saw or heard this week related to [category]?
- What's a piece of conventional wisdom in your space you've stopped believing?

Pillar 1 — Category problem (15 min):
- What mistake are your customers making right now that you wish you could fix for free?
- What would you tell a smart first-time [ICP role] who just started their job?
- What do prospects misunderstand about your category that costs them before they find you?

Pillar 2 — Building-in-public (15 min):
- What's a decision you made in the last 30 days that you'd make differently now?
- What surprised you about a customer interaction this month?
- What did you learn the hard way that you'd tell a founder 6 months behind you?

Pillar 3 — Contrarian takes (10 min):
- What advice do you hear in your industry that you think is actually harmful?
- What's a metric that everyone tracks that you've stopped caring about?
- What's a trend that everyone is excited about that you're skeptical of?
```

From a 45-minute session: 8-12 post-worthy ideas. Two sessions per month = a full content calendar without the founder staring at a blank screen.

---

## Post Structure

**The hook is the post.** LinkedIn shows 2-3 lines before "see more." If the hook doesn't earn the click, the post doesn't exist. Every post starts with one of:

- A bold opinion stated as fact: "Most founders kill their pipeline with LinkedIn. Here's what they're doing wrong."
- A counterintuitive observation: "We raised our prices 3x and our close rate went up."
- A specific number that raises a question: "12 months ago I had 800 followers. Here's what changed."
- A relatable failure: "I posted for 8 months with nothing to show for it. Month 9 changed everything."

**Post body (for the 3 main formats):**

*Story post* (Pillar 2): Hook → context → conflict → resolution → lesson. End with a question that invites the ICP to share their version.

*Insight post* (Pillar 1): Hook → the insight stated plainly → 3 supporting reasons → the implication for the reader. No bullet points that could have been written by an AI. Each reason must be specific enough that it couldn't apply to a different category.

*Contrarian post* (Pillar 3): Hook → the conventional wisdom stated as the enemy → why it's wrong → the alternative position → the evidence. Expect pushback. Respond to comments — comment engagement is the highest algorithmic signal on LinkedIn.

---

## Monthly Content Calendar Structure

**30 posts / month (assuming 5x per week):**
- 18 posts Pillar 1 (category problem)
- 8 posts Pillar 2 (building-in-public)
- 4 posts Pillar 3 (contrarian)

**Weekly rhythm:**
- Monday: Pillar 1 — category insight
- Tuesday: Pillar 2 — story or decision
- Wednesday: Pillar 1 — how-to or framework
- Thursday: Pillar 3 — contrarian or opinion
- Friday: Pillar 1 — reaction to something in the category this week

**Reuse cadence:** Every pillar-1 and pillar-3 post that performs above 2× average engagement gets recycled at 90 days — different hook, same core insight. Finding a winning angle and running it into the ground is not lazy, it's smart.

---

## Anti-Slop Rules

- **The insight test:** Before publishing any post, ask: could a competitor's founder have written this? If yes, rewrite the hook and the main point until the answer is no.
- **No AI-generated insight.** Use AI to structure and polish — never to generate the observation. The observation must come from the founder's actual experience.
- **Specificity over generality.** "We increased conversion by 34% by removing one field from the signup form" beats "We simplified our onboarding." Specific beats polished every time.
- **No humility theater.** Posts that begin "I'm humbled to share..." or "So grateful for this recognition..." destroy credibility. Real authority doesn't announce itself.
- **Lead time:** Never publish same-day. Write posts in batches, schedule 48-72 hours out, review cold. A post t