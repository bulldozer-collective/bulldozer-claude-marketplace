---
name: |-
  founder-content
description: |-
  Build a founder LinkedIn content system — voice profile, 3-pillar strategy, monthly idea extraction workflow, and a 30-post content calendar. Triggers on 'founder LinkedIn content,' 'personal brand for founders,' 'founder-led content system,' 'build my LinkedIn presence,' 'content calendar for founders,' or 'thought leadership pipeline.' For general social content across channels, see social-content. For brand platform and positioning, see brand-platform.
when-to-use: |-
  Build a founder LinkedIn content system — voice profile, 3-pillar strategy, monthly idea extraction workflow, and a 30-post content calendar. Triggers on 'founder LinkedIn content,' 'personal brand for founders,' 'founder-led content system,' 'build my LinkedIn presence,' 'content calendar for founders,' or 'thought leadership pipeline.' For general social content across channels, see social-content. For brand platform and positioning, see brand-platform.
argument-hint: |-
  B2B SaaS founder, Series A, ICP is VP Marketing and CMO at 50-500 employee companies. Currently posting maybe 2x per month with no system. Want to build an inbound pipeline from LinkedIn. No ghostwriter — I write myself.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
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

1. **Generic insights.** Posts that start with "I've been thinking about leadership lately..." or "Here are 5 lessons from scaling our startup" are content that anyone could have written. LinkedIn's own research team published a large decoder-only language model for personalized feed ranking, roughly 150B parameters — the trade press nicknamed it "360Brew." Marketing blogs now claim it's live in production, ranking the public feed by a post's semantic substance instead of counting keywords or early likes — but every one of those sources traces back to the same unverified "engineering blog" post and date, and LinkedIn's own channels have stayed unreachable to check directly. Treat the model and its scale as real; treat "it's live and judging substance" as the plausible, not confirmed, reason a generic opener underperforms. Either way, a generic, interchangeable opener reads as low-signal — and if the insight isn't yours, it shows.

2. **Inconsistent cadence.** Posting 3x one week, zero the next, teaches the algorithm nothing and builds no audience expectation. The minimum viable cadence is 3x per week sustained for 90 days. At 2x per month, you're gathering 2 data points per month. At 5x per week, you gather 20. Iteration speed is the compound variable. There's a ceiling too: posting more than once a day works against the same goal — LinkedIn avoids showing the same viewer two posts from the same creator in a short window, so a same-day second post mostly competes with the first one's reach instead of adding to it.

3. **Product-first framing.** Founders who mention their product in every post train their audience to scroll past. The content funnel ratio that works: 60-70% MOFU (category expertise, thought leadership), 20% TOFU (founder story, team, building-in-public), 10-20% BOFU (results, product announcements). Resist the urge to sell in every post.

---

## Voice Profile

Before writing a single post, extract the founder's voice. This is the reference document for everything that follows. A post written without the voice profile sounds like marketing copy. A post written with it sounds like them.

**5 dimensions to profile:**

For the five voice dimensions to profile (vocabulary and cadence, core opinions, stories they return to, what they refuse to say, energy level), read `references/voice-and-pillars.md`.

**Ground it against what's already on file.** If this is a connected Bulldozer project, call `bdzGetProjectToneOfVoice` before the extraction session — it returns the brand's registered tone (mission, tones, key values) when one is already set up. The founder's personal voice must read as distinct from that brand voice, not an echo of it: a founder post that sounds like the company's own tone-of-voice document defeats the point of founder content. If nothing is on file, or the project isn't connected, proceed on the extraction session alone. Read the error code, don't treat every non-response the same: a 404 means no tone of voice is configured yet — common, and your cue to proceed as above — but a 402 means the project's subscription tier doesn't include this field, which is a plan limit to flag to whoever owns the account, not a silent "brand undefined."

**The gate before any of this starts.** Two situations mean the system shouldn't be built yet, however complete the brief looks. First, if the founder has no belief they're willing to state out loud — every warm-up answer comes back as "things are moving fast" or "we're really customer-obsessed" — the calendar will produce competent, forgettable thought leadership no matter how well it's built; that's a positioning gap, not a content gap, and the fix is a positioning conversation (route to `audit-brand-positioning`), not a better hook. Second, if the founder plans to delegate the monthly extraction session itself to someone else — a comms lead answering on their behalf — refuse the personal-voice version of this system: dimensions 2 through 4 below (core opinions, what they refuse to say, energy) can't be observed secondhand, and the output will read as marketing copy wearing the founder's name.

---

## The 3-Pillar System

Every sustainable founder content system organizes around three pillars — recurring themes that train the algorithm and give the audience a reason to follow *specifically this founder*.

**With more than one founder posting**, assign pillars per person rather than letting both write across all three. Two accounts publishing the same take in the same week reads as a coordinated marketing push, not two independent voices — it works against the exact authenticity signal this system is built on.

For the full description of Pillar 1 (category problem), Pillar 2 (building-in-public) and Pillar 3 (contrarian takes), read `references/voice-and-pillars.md`.

**Approximate split:** 60% Pillar 1 / 25% Pillar 2 / 15% Pillar 3.

---

## Idea Extraction Protocol

The bottleneck in every founder content program is not writing — it's ideas. The idea extraction protocol solves this at the source.

**Monthly extraction session (45 minutes, recorded):**

Run the founder through these prompts. Record the session. The posts come from the transcript, not from asking them to write outlines.

From a 45-minute session: 8-12 post-worthy ideas. Two sessions per month = a full content calendar without the founder staring at a blank screen.

For the 45-minute session prompts by pillar (warm-up, Pillar 1, 2 and 3) and how to record the session properly, read `references/idea-extraction-session.md`.

---

## Post Structure

**The hook is the post.** LinkedIn shows 2-3 lines before "see more." If the hook doesn't earn the click, the post doesn't exist. Every post starts with one of:

For hook examples, read `references/post-formats.md`.

**Post body (for the 3 main formats):**

For the story, insight and contrarian post formats (including when a Pillar 1 insight is a framework), read `references/post-formats.md`.

---

## Monthly Content Calendar Structure

**The 5x cadence is conditional, not a target to defend.** It only holds while the founder is still writing or closely editing every post themselves at that pace. The moment volume forces a ghostwriter to draft without the founder's real-time input, drop to 3x/week rather than protect the higher number — a slower system that's still theirs beats a faster one that's quietly become the comms team's, and readers notice the second one before the founder does.

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

**Reuse cadence:** Every pillar-1 and pillar-3 post that performs above 2× average engagement gets recycled at 90 days — different hook, same core insight. If the founder's LinkedIn profile is tracked in Bulldozer, don't estimate this from memory: `bdzListLinkedInPosts` (filtered by `profileUrl`, sorted with `orderBy=LINKED_IN_POST_SORT_FIELD_REACTION_COUNT` or `LINKED_IN_POST_SORT_FIELD_COMMENT_COUNT`) returns the founder's actual posts ranked by real performance, so the reuse list comes from data instead of a guess. Finding a winning angle and running it into the ground is not lazy, it's smart.

---

## Anti-Slop Rules

- **The insight test:** Before publishing any post, ask: could a competitor's founder have written this? If yes, rewrite the hook and the main point until the answer is no.
- **No AI-generated insight.** Use AI to structure and polish — never to generate the observation. The observation must come from the founder's actual experience.
- **Specificity over generality.** "We increased conversion by 34% by removing one field from the signup form" beats "We simplified our onboarding." Specific beats polished every time.
- **No humility theater.** Posts that begin "I'm humbled to share..." or "So grateful for this recognition..." destroy credibility. Real authority doesn't announce itself.
- **The tell moved past em dashes.** Most models are now trained to drop the em dash, so its absence proves nothing and its presence isn't a reliable signal on its own anymore. What still reads as AI-smoothed in 2026: sentences that run the same length one after another with nothing short to break the rhythm, and clauses strung together with "and" instead of a period, a comma, or a parenthetical. Read the draft aloud for rhythm, not for a list of banned words — and don't over-correct either: stripping every long sentence and every "and" to dodge a detector produces a post that sounds just as manufactured as the padding it replaced.
- **No link in the post body — or the first comment.** External links cut reach, and the "put the link in the first comment instead" workaround stopped working in 2026: LinkedIn's ranking now treats a link dropped there the same as one in the body. Don't quote a single precise percentage to a founder as if the size were settled — 2026 studies on the same question don't converge: Ordinal (900K+ posts, Feb 2023–Feb 2026) measures a penalty that grew from roughly 5% to 42% over that window (26.5% averaged across it); van der Blom reports a lower median hit; other sources cite a flat ~60%; and one outlier, Saywhat's Q1 2026 sample (~400K posts), found posts with 1-3 external links got *more* reach, not less. Only the direction holds up across sources — a link usually costs reach. One wrinkle worth knowing, not a reason to relax the rule: the one source that breaks the penalty down by account type (Ordinal) finds it concentrated on company pages, with personal profiles showing almost no measurable hit — and everything this system publishes, including anything sent through `bdzCreateLinkedInPost`, goes out from the founder's personal profile, never a company page. That's grounds to worry a little less, not a number to quote to a founder as settled. If a post needs to point somewhere, default to a document post (see Post Structure) over a link, use a native format (a newsletter) as the other option, or send the link separately — never a raw URL inside the post.
- **Lead time:** Never publish same-day. Write posts in batches, schedule 48-72 hours out, review cold. A post that reads sharp in the heat of writing it can read as tone-deaf, defensive, or simply wrong two days later — the batch-and-review step catches what same-day publishing never will. On publish day, if the founder's LinkedIn account is connected in Bulldozer, `bdzCreateLinkedInPost` posts straight to their personal feed — it has no native scheduling, so treat it as a same-day publish action, not a way to queue posts ahead; the batching still happens in the calendar, not in the tool.

---

## Quality Checklist

Before a post goes into the calendar, it passes all five:

- [ ] The voice profile check: read it aloud. Does it sound like the founder talking, or like a marketing team writing as the founder?
- [ ] The competitor test: could a rival founder in the same category have posted this unchanged? If yes, it's not specific enough yet.
- [ ] The pillar tag: every post maps to exactly one of the three pillars. A post that tries to serve all three usually lands none.
- [ ] The hook survives on its own: read only the first two lines. If they don't make the reader want "see more," rewrite the hook before touching the body.
- [ ] No same-day posts: everything in the calendar was written at least 48 hours before its publish date and reviewed cold.

## Common Mistakes

- **Ghostwriting without a voice profile.** A ghostwriter or AI tool without the 5-dimension voice profile produces content that reads as generic thought leadership — competent, forgettable, and indistinguishable from every other founder's feed.
- **Chasing virality instead of pipeline.** A post optimized purely for reach (broad platitudes, engagement bait) attracts an audience that isn't the ICP. Optimize for "the right people commented or shared," not raw impression count.
- **Abandoning the system after a flat stretch.** Founder content compounds; it does not convert linearly. A founder who stops posting after a run of low engagement never reaches the point where the audience and the algorithm both recognize the pattern. Before concluding at the 90-day mark that the pillars or hooks are wrong, rule out an alignment problem first: does the founder's headline and bio actually state the category they're posting about, and is their first-degree network built from buyers and peers rather than vendors and recruiters? A content problem and an alignment problem produce the same flat engagement curve — fixing the wrong one just spends another 90 days finding out.
- **Letting the calendar go stale.** A calendar built once and executed on autopilot for 90 days without a fresh monthly extraction session runs out of specific material and drifts back into generic advice.
- **Skipping the cold review.** Publishing straight from the writing session skips the one step that catches posts that are reactive, off-voice, or make a claim the founder can't defend in the comments.