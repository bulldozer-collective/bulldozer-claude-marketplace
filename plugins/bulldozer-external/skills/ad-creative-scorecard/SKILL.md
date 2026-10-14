---
name: |-
  ad-creative-scorecard
description: |-
  Score any video ad against an 8-dimension rubric — hook, message clarity, visual quality, audience targeting, pacing, CTA strength, emotional resonance, sound-off effectiveness — using a 3-persona expert panel (performance marketer, creative director, target consumer). Triggers on 'evaluate this ad,' 'score my ad,' 'is this ad good,' 'rate this video ad,' 'creative QA,' 'will this ad perform,' or any pre-flight quality check on a video ad. For decomposing without judging, see ad-reverse-engineer. For producing the ad in the first place, see video-ad-production.
when-to-use: |-
  Score any video ad against an 8-dimension rubric — hook, message clarity, visual quality, audience targeting, pacing, CTA strength, emotional resonance, sound-off effectiveness — using a 3-persona expert panel (performance marketer, creative director, target consumer). Triggers on 'evaluate this ad,' 'score my ad,' 'is this ad good,' 'rate this video ad,' 'creative QA,' 'will this ad perform,' or any pre-flight quality check on a video ad. For decomposing without judging, see ad-reverse-engineer. For producing the ad in the first place, see video-ad-production.
argument-hint: |-
  Score this 30s Meta ad before we push spend behind it — full rubric + top 3 fixes
allowed-tools:
  - Bash
  - Read
effort: |-
  medium
---

# Ad Creative Scorecard

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on creative QA. Your goal is to catch the obvious flaw — a weak hook, a buried CTA, a drowned message — before spend goes behind a video ad, using the same rigor a panel of three different experts would apply independently.

## Input

$ARGUMENTS — a video file, ad URL, or a script + storyboard description for pre-production review. If not provided, read any available context files before asking. Only ask if no ad or script is available at all.

**If the ad is already live in a Bulldozer-connected ad account, pull it — don't ask the user to re-upload or re-describe something the OS already has.** `bdzListAdLayer3` finds the ad (by campaign/ad group or name), then `bdzGetAdLayer3Creatives(id)` returns the creative actually being served — media URL, full body copy, CTA — straight from the platform, not a stale local copy.

## Output

A structured evaluation: 8 dimension scores with justification, weighted overall score, verdict, top strengths, top weaknesses, and prioritized, actionable fixes.

**Produce output on first invocation. Read available context before asking. Only ask if the primary input is completely absent.**

---

## Frame Extraction (for video file input)

```bash
python scripts/extract_video.py input_video.mp4 --output-dir frames/ --num-frames 8
```

Pulls evenly-spaced frames including the first (hook), middle (body), and last (CTA).

---

## The Three Evaluation Personas

Performance Marketer — Will this convert? Does the hook stop the scroll? Is the CTA compelling? Evaluates hook rate potential, CTA clarity, targeting precision. Red flags: unclear value proposition, weak CTA, no social proof.

Creative Director — Is this well-crafted? Does the visual storytelling work? Is the brand represented well? Evaluates visual quality, pacing, narrative structure, brand consistency. Red flags: amateur visuals, poor pacing, off-brand elements, derivative concepts.

Target Consumer — Would I actually watch this? Does it feel authentic? Would I click? Evaluates relatability, authenticity, interest, trust. Red flags: too salesy, inauthentic feel, irrelevant, annoying.

---

## The 8-Dimension Rubric (0-10 each)

| Dimension | 9-10 | 5-6 | 1-2 |
|-----------|------|-----|-----|
| Hook Effectiveness (0-3s) | Pattern interrupt + curiosity gap, impossible to scroll past | Decent but not distinctive | No hook, nearly everyone scrolls |
| Message Clarity | Single clear message, articulable in one sentence | Present but requires effort to extract | No discernible message |
| Visual Quality | Exceptional, perfectly matched to platform | Acceptable, some rough edges | Blurry, poorly lit, visually broken |
| Audience Targeting | Laser-targeted, "made for me" feeling | Generic enough to be for anyone | Could be for any product to any person |
| Pacing & Structure | Every second earns the next, builds to CTA | Uneven, some dead spots | Rambling, repetitive, flat |
| CTA Strength | Compelling, clear, urgent | Present but weak/generic | No CTA at all |
| Emotional Resonance | Strong response — excitement, desire, empathy, humor, surprise | Neutral, informative but flat | Cringe, offensive, trust-destroying |
| Sound-Off Effectiveness | Fully effective with sound off — captions/text carry it | Gets the gist, loses nuance | Completely dependent on audio |

Platform-specific quality bar: TikTok/Reels tolerates (even prefers) UGC quality; YouTube pre-roll expects higher production value; LinkedIn expects professional but not cinematic.

## Weighted Overall Score

Overall = (Hook x 1.5 + Message x 1.3 + Visual x 1.0 + Audience x 1.2 + Pacing x 1.0 + CTA x 1.3 + Emotion x 1.0 + SoundOff x 0.7) / 9.0

Weights reflect real-world impact on performance — hook and CTA matter most.

| Overall Score | Verdict | Action |
|---------------|---------|--------|
| 8.5-10 | Excellent | Ship it. Monitor and scale spend. |
| 7.0-8.4 | Good | Ship with minor tweaks. |
| 5.5-6.9 | Average | Fix the 2 weakest dimensions before shipping. |
| 4.0-5.4 | Below Average | Significant rework — consider a new creative direction. |
| <4.0 | Poor | Start over. Fundamental issue with concept or execution. |

---

## Method

1. Extract frames (video file input) — 8 key frames spanning hook, body, CTA.
2. Run all three personas independently — do not average into a single verdict first.
3. Score all 8 dimensions with a one-line justification each.
4. Apply the weighted formula and read the verdict.
5. If the ad has already been running in a Bulldozer-connected account, check the panel's read against what actually happened: `bdzGetAdAnalytics(target=AD_ANALYTICS_TARGET_LAYER_3_ALL, adAccountId, platform)` returns per-ad ctr, cpc, conversions, hookRate, videoAvgTimeWatchedSeconds, and thruPlays. Pass `from`/`to` explicitly — left out, the tool defaults to a 180-day lookback, which blends a creative's recent performance into a six-month average. A high predicted hook score next to a measured hookRate that's actually low is a reason to revisit the panel's read, not to discard the data; the reverse (panel predicted a weak hook, hookRate is strong) is just as informative. A brand-new ad with no spend yet has nothing to reconcile — say so rather than treating the absence of data as a weak signal.
6. Produce the structured report using references/evaluation_template.md.

## Next Steps by Weak Dimension

- Low hook score → video-ad-production hook formulas (§1.2) — write 5 variants and A/B test them.
- Poor visual quality → revisit the visual direction in the brief (ad-creative-brief) before regenerating.
- Want to clone a stronger competitor ad → ad-reverse-engineer to extract the template, then recreate with video-ad-production.
- Full loop: evaluate → identify weakest dimensions → regenerate with targeted fixes → re-evaluate.

---

## Common Mistakes

- Averaging the three personas into one score before evaluating — each persona's independent read is the point; don't collapse them early.
- Scoring a dimension without justification — a bare number isn't actionable feedback.
- Recommending to ship below 5.5 without a targeted fix pass — the two weakest dimensions must be addressed first.
- Not flagging pre-production evaluations as such — a script/storyboard review estimates visual and pacing dimensions; it doesn't measure them off a final render.
- Asking the user to re-upload or re-describe an ad that's already live in a connected account — pull the served creative via `bdzListAdLayer3` + `bdzGetAdLayer3Creatives` instead.
- Treating the panel's verdict as the final word once the ad has real spend behind it — reconcile the predicted scores against `bdzGetAdAnalytics` (hookRate, thruPlays, conversions) before handing over a recommendation.

## Source

Adapted from Creatify-AI/ad-creative-evaluator, MIT © Creatify AI. Bundled files: scripts/extract_video.py, references/rubric.md, references/personas.md, references/evaluation_template.md.