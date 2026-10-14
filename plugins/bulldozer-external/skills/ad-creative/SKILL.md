---
name: |-
  ad-creative
description: |-
  Generate, iterate, and scale ad creative — headlines, descriptions, and primary text for any paid platform. Triggers on 'ad copy variations,' 'generate headlines,' 'RSA headlines,' 'write me some ads,' 'Facebook ad copy,' 'Google ad headlines,' or 'I need more ad variations.' For campaign strategy and targeting, see paid-strategy. For landing page copy, see copywriting.
when-to-use: |-
  Generate, iterate, and scale ad creative — headlines, descriptions, and primary text for any paid platform. Triggers on 'ad copy variations,' 'generate headlines,' 'RSA headlines,' 'write me some ads,' 'Facebook ad copy,' 'Google ad headlines,' or 'I need more ad variations.' For campaign strategy and targeting, see paid-strategy. For landing page copy, see copywriting.
argument-hint: |-
  Google RSA campaign for B2B project management software — need 15 headlines and 4 descriptions
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Ad Creative

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on performance ad creative. Your goal is to generate high-performing ad copy at scale — headlines, descriptions, and primary text that drive clicks and conversions — and iterate based on performance data.

## Input

`$ARGUMENTS` — platform, product, and goal (e.g., "Google RSA headlines for B2B SaaS project management tool, targeting ops managers" or "Meta primary text variations for DTC skincare, anti-aging angle"). If not provided, read any available context files before asking. Only ask if platform and product context are completely absent.

## Output

Ad creative organized by angle, with character counts per element and platform compliance verified. Format includes: per-angle headline sets, description/primary text sets, and an iteration log if performance data was provided. For bulk production, delivers copy-paste ready CSV format.

**Produce output on first invocation. Read available context before asking. Only ask if platform and product context are completely absent.**

---

## Platform Character Limits

Verify every piece before delivery. Platforms truncate without warning.

| Platform | Element | Char limit | Quantity |
|----------|---------|:----------:|:--------:|
| **Google Ads (RSA)** | Headline | 30 | Up to 15 |
| | Description | 90 | Up to 4 |
| | Display URL path | 15 each | 2 paths |
| **Meta (FB/IG)** | Primary text | 125 visible (2,200 max) | 1 |
| | Headline | 27 visible, 40 hard cap | 1 |
| | Description | 25 visible, 30 hard cap | 1 |
| **LinkedIn** | Intro text | 150 recommended (truncates on mobile), ~255 max | 1 |
| | Headline | 70 max | 1 |
| **TikTok** | Ad text | 100 max (in-feed caption; ~4 lines visible before truncation) | 1 |
| **X (Twitter)** | Post text | 280 (257 if it carries a link — every URL is wrapped and counted as 23 chars) | 1 |

Limits move. Meta and LinkedIn publish a *recommended* length (what shows without truncation on
most placements) and a separate hard cap the interface will actually let you type — the two rows
above give both, because writing to the hard cap produces copy that gets cut on mobile.

---

## Creative Angles (Define Before Writing)

Before writing individual headlines, establish 3–5 distinct angles — different reasons someone would click. Vary the motivation, not just the words.

| Angle category | Example |
|----------------|---------|
| Pain point | "Stop wasting time on manual reports" |
| Outcome | "Cut reporting time by 75%" |
| Social proof | "Join 10,000+ teams who automated their ops" |
| Curiosity | "The one thing fast-growing teams do differently" |
| Comparison | "Unlike [category], we don't require IT setup" |
| Identity | "Built for ops managers who hate busywork" |
| Contrarian | "Why your reporting process is slowing your team down" |

Angles should vary the *reason* to click, not the *voice*. When the work happens inside a
Bulldozer project, pull the brand's tone of voice first (`bdzGetProjectToneOfVoice`) — it returns
`tones` (e.g. expert / challenger / executive), `keyValues`, `keywords` and, just as usefully,
`antiKeywords` — words and postures the brand has already ruled out. Five angles that all violate
`antiKeywords` aren't five angles, they're one mistake five times.

**Size the angle count to the account's conversion volume, not to a fixed "3–5."** An account
converting a handful of times a week can't tell five angles apart in any useful timeframe —
splitting thin volume five ways just means each one takes five times longer to read. Start with
2–3 angles on a low-volume account (early B2B, a new product line) and only widen once the
account is producing enough conversions per week that a comparison between angles means
something (see the volume floor in `references/gabarits.md`, under *Common Mistakes*). A high-volume DTC account can run the
full 3–5 from the first round.

**Refuse a "5 angles" brief that's actually one angle worded five ways.** If two angles from the
table above would survive being read blind — stripped of headline, just the underlying claim —
and someone can't tell which is which, they're the same angle. Send it back to the intake
question ("what's the actual reason someone clicks, not the words") rather than padding out a
count.

**When a winning angle collides with `antiKeywords` or an established `tone`, that's a real
trade-off, not a rule to enforce silently.** A contrarian or curiosity angle that outperforms in
early testing but reads as a posture the brand has explicitly ruled out shouldn't be dropped
without saying so, and shouldn't ship without saying so either — flag it back to whoever owns the
brand voice as "this angle works, it also breaks `tone`/`antiKeywords`, here's the data," and let
that be a decision made once, not an angle quietly excluded from every future round for a reason
nobody wrote down.

---

## Google Ads — RSA Best Practices

**Headline rules for RSA**:
- Headlines must make sense independently and in any combination (Google mixes them)
- Include at least 2–3 keyword-focused headlines
- Include at least 3–4 benefit-focused headlines
- Include at least 2 CTA headlines ("Start Free Trial," "Get a Demo Today")
- Pin only headlines that must always appear in position 1 (overuse of pinning limits optimization).
  **In practice: 2–3 pinned headlines, never one pinned to every position** — a single headline
  pinned everywhere turns the RSA into a static ad and throws away the format's reason to exist.
  Reserve pinning for what genuinely can't rotate (a legal disclaimer, a locked brand name) —
  don't pin a headline just because it tested well; let it win the rotation instead.
- **Only Headline 1, Headline 2, and Description 1 actually guarantee serving.** The interface —
  and Bulldozer's own ad group update tool — will happily accept a pin on Headline 3 or
  Description 2, but that pin isn't honored the same way; it's accepted without error and simply
  doesn't carry the same guarantee. Don't promise a client "this headline is locked into position
  3" on a pin the platform doesn't actually back.
- If the campaign has **Final URL expansion** turned on (part of Google's "AI Max for Search"),
  pinned assets are overridden — the point of pinning disappears. **Since September 1, 2026,
  Google has been auto-upgrading eligible Search campaigns into AI Max for Search** — the
  trigger is either of two settings already on the campaign (Automatically Created Assets, or
  broad match at the account/campaign level), never a request from the advertiser; the rollout
  was expected to finish by end of September 2026. Once a campaign has gone through that
  auto-upgrade, **Final URL expansion can no longer be switched off entirely — only constrained**,
  via page feeds and URL exclusions. Don't offer "we'll just turn expansion off to protect the
  pins" as a standing option anymore: check whether the campaign has already been auto-upgraded
  (Automatically Created Assets or broad match on) before promising it. If it has, write every
  headline for free rotation and use page-feed/URL-exclusion constraints as the available lever
  instead of a toggle — and say so plainly in the handoff, since it changes what pinning can
  realistically buy a client on that campaign.
- Ad Strength ("Excellent"/"Good") is a diversity-of-assets score, not a performance forecast — an
  "Excellent" RSA with generic copy still loses to a "Good" one tightly matched to search intent.
  **The senior call is to stop at "Good," not chase "Excellent."** Padding toward Excellent
  usually means adding a 13th or 14th headline that only exists to satisfy the score — diluting
  combinations without adding a real angle. Spend that effort writing one more genuine angle
  instead, or leave it at 8–10 sharp headlines.

**Description rules**:
- Complement headlines, don't repeat them
- Add proof points (numbers, guarantees, social-content proof)
- Handle objections ("No credit card required," "Setup in minutes")
- One strong CTA per description

**Output format for RSA**: see `references/gabarits.md` for the exact template (headline
and description blocks, numbered, char counts shown).

---

## Meta Ads — Primary Text Structure

Lead with the hook in the first 3 lines (everything before "See More"). Front-load value.
Structure: hook line, 1–2 sentences bridging to the product, social proof or a specific
stat, then the CTA — see `references/gabarits.md` for the worked example.

**Write to the visible length for cold audiences, closer to the hard cap only for warm ones.**
A cold-audience ad on a Stories/Reels-heavy placement is read in under two seconds before the
scroll continues — if the hook doesn't land inside the ~125 visible characters, "See More" never
gets tapped and the rest of the copy (proof, CTA) is never read at all. Retargeting and warm
audiences already know the product, so a longer primary text that unpacks an objection is read
by people who chose to expand it. Don't write one primary-text length for every audience
temperature and hope the truncation point doesn't matter — it's the whole game for a cold hook.

**Since February 2026, every new Meta Sales/Leads/App Promotion campaign launches with
Advantage+ Creative fully on** — text variations, background generation, image expansion and the
rest apply by default unless switched off per campaign. The primary text written here isn't
guaranteed to be what actually serves: Meta's own AI can reword or restage it after launch. Since
March 2026, any ad Meta detects as AI-generated or AI-modified — its own enhancements included —
carries a disclosure label. Turn off the enhancements the account doesn't want live, and say so in
the handoff, rather than assuming the copy above ships unmodified. (Convergent agency reporting on
both dates; no Meta help-center page could be read directly from this environment — reconfirm
against the account's own Advantage+ Creative settings before relying on it.)

---

## Iterating from Performance Data

**When the work is inside a Bulldozer project, don't ask the client for an export — pull it.**
`bdzListAdLayer3` (filtered by `adAccountId`, optionally `l2Id`) lists the individual ads/creatives
already running; `bdzGetAdLayer3Creatives` on one of those IDs returns the creative actually
served — media URL, body copy, CTA — so you're reading the real headline and primary text, not a
paraphrase of it. `bdzGetAdAnalytics` with `target: AD_ANALYTICS_TARGET_LAYER_3_ALL` (or
`_LAYER_3` for a single ad) returns per-ad `ctr`, `cpc`, `cpl`, `conversions`, `costPerConversion`,
and — for video — `hookRate` and `videoAvgTimeWatchedSeconds`. That last pair is the earliest
creative-fatigue signal available: a falling hook rate on a still-fresh ad means the opening
seconds stopped working before the CTR did. Only fall back to asking the user to paste a CSV when
no ad account is connected for this project.

**Two `bdzGetAdAnalytics` traps that produce a confidently wrong iteration call:**

- **The default window is 180 days back, not "recent."** Leave `from`/`to` unset and the response
  is a cost-per-conversion averaged over six rolling months — exactly the wrong number for "is
  this angle working *now*." Pass `from` explicitly (30–60 days for most accounts) whenever the
  question is current performance, and only pull the unbounded default when the question really
  is a long-run baseline.
- **On Meta, never sum `conversionsPerType` — or `custom_pixel_events`, when it's present — into
  `conversions`.** `conversions` already counts every terminal event (purchase, lead, subscribe,
  etc.); `conversionsPerType` additionally lists the upper-funnel events (view_content,
  add_to_cart, initiate_checkout…) that overlap with, and are already excluded from, that terminal
  count. `custom_pixel_events` is a further wrinkle: an unnamed fallback bucket the response uses
  only when the account's individual custom pixel events couldn't be resolved by name — also
  excluded from `conversions` for the same reason. Adding any of these back in doesn't give a
  richer total — it inflates the denominator with events that were never the conversion the CPA is
  measuring against.

**Don't retire an angle on a B2B account before its sales cycle has had a chance to close.** A
click-to-revenue lag of two to six weeks is normal in B2B — judging conversions at two weeks
measures whether the pipeline had time to close, not whether the angle worked. Hook rate and CTR
are safe to read early (they're not gated by the sales cycle); conversions and cost-per-conversion
aren't, and killing an angle on them before the cycle has run is judging the wrong clock, not the
wrong copy.

**Refuse to push a new batch of variants into an ad set that's still in — or would be reset out
of — its learning phase.** Meta's learning phase runs on ~50 optimization events per rolling
7-day window; swapping in a wave of new creative, or changing budget by more than ~20% at the
same time, resets it and burns the days already spent stabilizing delivery. If the ad set hasn't
cleared that threshold yet, wait — don't ship the "next round" of variations on schedule just
because the iteration cadence says round 3 is due.

Analyze before generating either way — identify winning patterns from top performers, losing
patterns from the worst ones, then generate variations that double down on what won and avoid
what didn't; see `references/gabarits.md` for the three-step checklist in full.

### Iteration Log Format

See `references/gabarits.md` for the exact log format (round, date, top performer, winning
patterns, what's being retired and why, new angles under test).

---

## Quality Standards

Specific beats vague, benefits beat features, active voice beats passive, a real number beats
a round claim — and the inverse of each is what to cut on a pass. Full checklist (strong-headline
traits and what to avoid) in `references/gabarits.md`.

---

## Common Mistakes

Each rule below is argued in full earlier in this file; this is the pre-delivery recap. See
`references/gabarits.md` for the complete seven-point checklist (impressions vs. outcomes,
sameness across variations, missing CTA headlines, over-pinning, retiring creative too early,
the 6-month-average trap, and shipping into an unstabilized learning phase).