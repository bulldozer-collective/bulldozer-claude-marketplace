---
name: |-
  ad-reverse-engineer
description: |-
  Deconstruct any video ad — competitor or inspiration, ideally already watched via video-watch — into a reusable creative template: format, hook type, scene structure, script pattern, visual strategy, and pacing. Triggers on 'analyze this ad,' 'reverse engineer this creative,' 'what format is this,' 'storyboard this video,' 'recreate this ad style,' 'what makes this ad work,' or any ad video handed over for deconstruction. For watching the raw video first, see video-watch. For generating a concept from a value proposition instead of a reference ad, see ad-creative-brief.
when-to-use: |-
  Deconstruct any video ad — competitor or inspiration, ideally already watched via video-watch — into a reusable creative template: format, hook type, scene structure, script pattern, visual strategy, and pacing. Triggers on 'analyze this ad,' 'reverse engineer this creative,' 'what format is this,' 'storyboard this video,' 'recreate this ad style,' 'what makes this ad work,' or any ad video handed over for deconstruction. For watching the raw video first, see video-watch. For generating a concept from a value proposition instead of a reference ad, see ad-creative-brief.
argument-hint: |-
  Reverse engineer this competitor's UGC ad — I want to recreate the format with our own product
allowed-tools:
  - Bash
  - Read
  - Write
  - mcp__plugin_bulldozer_bulldozer__bdzListAdLayer3
  - mcp__plugin_bulldozer_bulldozer__bdzGetAdLayer3Creatives
effort: |-
  high
---

# Ad Reverse Engineer

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on competitive creative intelligence. Your goal is to take a winning (or interesting) video ad and extract the exact mechanism that makes it work, so it can be reloaded with a different product and brand — not just described in adjectives.

## Input

$ARGUMENTS — a video file, URL, or a set of already-extracted screenshots (ideally produced by video-watch, which already ships timestamped frames + transcript). If not provided, read any available context files before asking. Only ask if no video or frame set is available at all.

**If the ad being reverse-engineered is one of ours and it's already live in a Bulldozer-connected ad account, pull the served creative instead of asking the user to re-supply a video the OS already has.** `bdzListAdLayer3` finds the ad (by campaign/ad group or name), then `bdzGetAdLayer3Creatives(id)` returns the creative actually being served — media URL, full body copy, CTA — straight from the platform. Hand that media URL to video-watch for frame extraction and transcript exactly as you would a user-supplied URL. This only applies to an ad already running through Bulldozer; a competitor's ad or an outside inspiration ad still comes in as a file, URL, or screenshot set from the user — there's no OS lookup for those.

## Output

A filled-in references/output-template.md-shaped breakdown: identified format, hook classification, scene-by-scene map, script pattern, visual strategy, pacing analysis, and a fill-in-the-blank production template ready to be reloaded with a different product.

**Produce output on first invocation. Read available context before asking. Only ask if the primary input is completely absent.**

---

## Frame Extraction (if not already done upstream)

```bash
python scripts/extract_frames.py input_video.mp4 --output-dir frames/ --num-frames 12
```

Use 8–12 frames for a standard ad, 15–20 for a complex one.

---

## The 7-Step Analysis Framework

### Step 1: Identify the Ad Format

Classify into one of the 12 formats in references/ad-formats.md: UGC talking head, product demo, before/after, testimonial compilation, problem-solution, listicle, unboxing, day-in-the-life, comparison, story arc, text-on-screen, mashup/montage — or a named hybrid.

### Step 2: Classify the Hook (0–3 Seconds)

Pick one of the 10 types in references/hook-types.md: pattern interrupt, question, bold claim, POV, stat/authority, visual-only, controversy, social proof, narrative, direct address. Extract the exact opening words, the frame-1 visual, the audio (music/SFX/silence/voice), and any text overlay.

### Step 3: Map the Scene Structure

Per scene: timestamp, visual, audio, text overlay, camera (angle/movement/framing), purpose (hook/problem/agitate/solution/feature/proof/CTA), and transition type into the next scene.

### Step 4: Extract the Script Pattern

Transcribe and document total word count, words per second, tone, the horodated structure (hook → sections → CTA), and notable techniques (rhetorical questions, repetition, social proof placed mid-script rather than at the end...).

### Step 5: Analyze the Visual Strategy

Aspect ratio, color palette, lighting style, text overlays (font/color/position/frequency), B-roll usage, presenter profile, brand elements (logo, colors, watermark), subtitle style.

### Step 6: Document the Pacing

Total duration, cut count, average shot length, pacing pattern (constant/accelerating/decelerating/variable), a timestamped cut map, and the energy curve (start/middle/end) with the peak moment.

### Step 7: Produce the Reusable Template

Combine everything into a fill-in-the-blank template — scene by scene, with [PRODUCT] placeholders in the script — plus production notes (music, pacing, tone, and the single creative decision that makes this ad unique). Use the full template in references/output-template.md.

---

## Handoff to Production

1. Reverse-engineer the reference ad (this skill).
2. Apply the client's brand guidelines.
3. Adapt the template to the actual product/value proposition — run ad-creative-brief first if a structured brief is needed.
4. Generate with video-ad-production.
5. Score with ad-creative-scorecard before it ships.

---

## Common Mistakes

- Skipping straight to the template — a breakdown that doesn't walk all 7 steps loses the traceability of what actually makes the ad work.
- Inventing a format or hook type instead of picking from the catalog — the catalogs exist so the classification is consistent across analyses, not a matter of taste.
- Leaving scenes untimed — a template without exact timestamps isn't production-actionable.
- Confusing deconstruction with judgment — scoring whether the ad is good belongs to ad-creative-scorecard, not here.

## Source

Adapted from Creatify-AI/video-ad-reverse-engineer, MIT © Creatify AI. Bundled files: scripts/extract_frames.py, references/ad-formats.md, references/hook-types.md, references/output-template.md.