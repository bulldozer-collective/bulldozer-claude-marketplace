# Output Template — the filled-in breakdown

This is the shape every analysis produces (Step 7 of the main framework). Fill in every
section — an analysis that skips one loses the traceability the framework exists to give.
Keep prose tight; tables and bullet lists read faster than paragraphs for most of this.

## 1. Ad Overview

- **Source**: where the ad came from (competitor name, platform link, or "client-supplied")
- **Brand / Product**: who it's for and what it sells
- **Duration**: total length
- **Aspect ratio**: 9:16, 1:1, 16:9, etc.
- **Platform**: where it was seen or where it's native to
- **Production level**: UGC, semi-pro, professional, or AI-generated

## 2. Format Classification

- **Primary format**: one of the 12 in `references/ad-formats.md`
- **Secondary / hybrid elements**: if the ad blends formats, name the second one and where
  it shows up
- **Hook type**: one of the 10 in `references/hook-types.md`

## 3. Scene-by-Scene Breakdown

One row per scene:

| Timestamp | Visual | Audio | Text overlay | Camera (angle/movement/framing) | Purpose | Transition |
|---|---|---|---|---|---|---|
| 0:00–0:02 | … | … | … | … | hook | … |
| … | … | … | … | … | problem / agitate / solution / feature / proof | … |

Purpose is drawn from the same vocabulary as Step 3 of the main framework
(hook/problem/agitate/solution/feature/proof/CTA). The table always ends with a CTA scene
— name its CTA type explicitly (e.g. "swipe up," "shop now button," "link in bio," spoken
call to action) rather than leaving it as "CTA."

## 4. Script Extraction

- **Full transcript**, timestamped
- **Word count** and **words per second**
- **Tone**: one or two words, not a paragraph
- **Script structure**: name the pattern (e.g. PAS — Problem/Agitate/Solution — or
  Before/After, or another named structure if neither fits)
- **Notable techniques**: rhetorical questions, repetition, social proof placed mid-script
  rather than at the end, pattern breaks in the copy itself, etc.

## 5. Visual Strategy

- Color palette
- Lighting style
- Text overlay style: font, color, position, frequency
- B-roll share: rough proportion of the runtime that's B-roll vs. presenter/product shot
- Presenter profile (if any): age range, style, delivery
- Brand elements: logo, brand colors, watermark — where and how often they appear
- Captions / subtitle style

## 6. Pacing Analysis

- Total duration
- Cut count
- Average shot length
- Pacing pattern: constant, accelerating, decelerating, or variable
- A timestamped cut map
- Energy curve across start/middle/end, with the single peak moment called out

## 7. Strengths and Weaknesses

Specific, reasoned observations — not generic praise or generic criticism. Each point
should name the exact scene or technique it's about ("the hook at 0:00 works because the
split-screen reads before the voiceover even starts," not "strong hook").

## 8. Reusable Template

A fill-in-the-blank version of the ad's own structure, scene by scene, with `[PRODUCT]`,
`[BENEFIT]`, and `[AUDIENCE]` placeholders standing in for anything specific to the
original brand. Include production notes alongside it: music direction, pacing target,
tone, and the single creative decision that makes the original ad work (the one thing to
preserve even if everything else about the execution changes).

## 9. Recreation Path

Name the next Bulldozer skill in the chain for each goal — this template hands off into
the same flow as the main skill's `## Handoff to Production`, not into a separate tool:

| Goal | Next skill |
|---|---|
| Turn the template into a brief for a different product | `ad-creative-brief` |
| Generate the actual video from the adapted template | `video-ad-production` |
| Check the generated ad against the original before it ships | `ad-creative-scorecard` |

Don't name a generation or cloning tool that isn't one of Bulldozer's own skills — the
upstream version of this template points to its publisher's own commercial API surface,
which has no equivalent here.
