---
name: |-
  slides-deck
description: |-
  Generate a PowerPoint (.pptx) presentation — pitch decks, QBRs, client updates, internal briefings, or board decks. Triggers on 'create slides,' 'make a deck,' 'generate a PowerPoint,' 'build a presentation,' 'pitch deck,' 'QBR slides,' or 'board deck.' For PDF output, see pdf-report. For Word documents, see word-document.
when-to-use: |-
  Generate a PowerPoint (.pptx) presentation — pitch decks, QBRs, client updates, internal briefings, or board decks. Triggers on 'create slides,' 'make a deck,' 'generate a PowerPoint,' 'build a presentation,' 'pitch deck,' 'QBR slides,' or 'board deck.' For PDF output, see pdf-report. For Word documents, see word-document.
argument-hint: |-
  QBR deck for Acme — Q1 results vs targets, pipeline health, 3 GTM initiatives for Q2, ask for budget increase
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - mcp__plugin_bulldozer_bulldozer__bdzCreateStudioJob
  - mcp__plugin_bulldozer_bulldozer__bdzGetStudioJob
effort: |-
  high
---

# Slides Deck

> This is a Bulldozer skill. One idea per slide. No walls of text. Every slide has a message — not just a topic.

You are a Bulldozer operator generating a presentation that works without narration. Each slide must stand alone: a headline that says what to conclude, visuals that prove it, minimal bullets.

## Input

`$ARGUMENTS` — deck type, audience, key message, and content to include. If not provided, read available context files. Only ask if deck purpose and content are completely absent.

## Output

1. A Python script `generate-{slug}.py` that produces `{slug}.pptx`
2. The `.pptx` file (run the script immediately)
3. Slide-by-slide summary (slide number → headline)

**Generate on first invocation. Do not ask before running.**

---

## Library: python-pptx

```bash
pip install python-pptx
```

Still the right call — no better-established alternative exists in the Python ecosystem for
this. But it's been in maintenance-dormant status since its last release (1.0.2, August 2024):
no commits since then, and a large backlog of open issues. Keep recommending it, just don't
expect an unusual rendering bug to get an upstream fix — check the project's existing issues
for a workaround before spending time diagnosing one from scratch.

---

## Slide Writing Rules

1. **The headline is the message** — write it as a conclusion, not a topic. "Pipeline grew 34% QoQ" not "Pipeline Update." This matters more than it used to: most decks now get forwarded and read without a presenter in the room, so the headline is often the only thing that survives that trip. If the brief hands you a topic with no real number or decision behind it, don't manufacture a conclusion to fill the slot — write the headline as the open question it actually is ("Is pipeline on track for Q2?") and use speaker notes to flag what data is still missing. A confident-sounding headline built on nothing is worse than an honest one that says what's missing.
2. **One idea per slide** — if you have two points, make two slides
3. **Max 4 bullets per slide** — if you need more, split the slide
4. **No bullet that just repeats the headline** — bullets add evidence, not restatement
5. **Every data slide needs a "so what"** — if you show a chart, the headline tells the audience what to conclude from it

---

## Standard Deck Structures

### QBR Deck (12–15 slides)

| # | Slide | Headline pattern |
|---|-------|-----------------|
| 1 | Cover | "[Company] QBR — Q[X] [Year]" |
| 2 | Agenda | What we'll cover |
| 3 | Q[X] at a glance | "We hit [X] of [Y] targets" |
| 4–6 | Results vs. targets | "[Metric] came in at [X] vs [Y] target" |
| 7 | Pipeline health | "Pipeline is [healthy/at risk] — [X] coverage at [Y] ACV" |
| 8–10 | Initiatives Q[X+1] | "We're betting on [X] to unlock [outcome]" |
| 11 | Risks | "Two risks to flag before we close the quarter" |
| 12 | Ask / Next steps | "We need [decision] by [date]" |
| 13 | Appendix | Supporting data |

### Pitch Deck (10 slides)

| # | Slide | Headline pattern |
|---|-------|-----------------|
| 1 | Cover | Company name + one-liner |
| 2 | Problem | "The problem costs [X] [person] [Y]" |
| 3 | Solution | "We make [X] [verb] [outcome]" |
| 4 | Why now | "Three tailwinds are creating the window" |
| 5 | Traction | "[X] customers, [Y] revenue, [Z]% MoM growth" |
| 6 | Product | 1–3 screenshots max |
| 7 | Market | "[$X] TAM, going after [$Y] SAM first" |
| 8 | Business model | Unit economics, pricing |
| 9 | Team | Names, roles, 1 credibility signal each |
| 10 | Ask | "Raising $[X] to achieve [milestone]" |

---

## Python Template

The full generator script — theme colors with their WCAG 2.2 SC 1.4.3 contrast math
commented inline, the slide-building helpers (`blank_slide`, `add_shape`, `add_text`,
`slide_headline`, `add_bullets`, `add_kpi_block`, `slide_number`), the `set_alt_text()`
fix for python-pptx's missing alt-text API (covers both `Picture` and `GraphicFrame`),
and a 4-slide example (cover, KPI block, bullets + speaker note, native chart) —
is in `references/python-template.md`. Run it as-is first to confirm the library and
your environment work, then extend it slide by slide for the actual deck.

---

## Layout Patterns

| Pattern | When to use |
|---------|-------------|
| `slide_headline` + `add_kpi_block` | Summary / at-a-glance slides |
| `slide_headline` + `add_bullets` | Narrative / explanation slides |
| `slide_headline` + chart | Data slides — always pair with a conclusion headline, and call `set_alt_text()` on the `GraphicFrame` that `add_chart()` returns (see `references/python-template.md`) — it has the same missing-alt-text gap as an image, not just a cosmetic omission |
| Full-bleed image + title overlay | Cover, section dividers |
| Two columns | Comparison, before/after, two options |

No stock-photo placeholder for the full-bleed pattern: if the client hasn't supplied a cover
image and Bulldozer OS is available, generate one with the Studio (`bdzCreateStudioJob`,
`mediaType=IMAGE`) instead of leaving a gray box — ask first, Studio generations consume
credits. Poll `bdzGetStudioJob` until `status="completed"` (or `"failed"`/`"canceled"`) and
insert the resulting asset URL with `slide.shapes.add_picture()`, then call `set_alt_text()` on
it (see `references/python-template.md`) — `add_picture()` leaves an image with no accessible
name. Never invent the exact request/response shape for a Bulldozer tool you haven't called — check
`bdzGetStudioJob`'s own schema for the fields it actually returns.

A few arbitrages specific to generating more than one image for the same deck (cover + section
dividers, say):

- **Reuse the same reference image(s) across every job in the series** — pass them as
  `inputs[].referenceUrls` or `.fridgeIds` on each `bdzCreateStudioJob` call, not just the
  first one. Generated independently, a cover and its section dividers read as coming from
  different decks. Caps: at most 14 reference images with the Gemini image model, 16 with
  gpt-image-2.
- **Ask before setting `useTov` — don't decide it silently.** The tool's own schema says so
  in plain words: "Always ask the user if they want to use their tone of voice." Once the
  client has answered, apply it for the whole deck, not slide by slide: on for anything
  client-facing — every image stays inside brand tone — off while you're still exploring
  which visual direction to pitch, since an imposed brand voice narrows the options before
  one's been picked.
- **A 429 from `bdzCreateStudioJob` means the generation queue is full, not that anything
  broke.** Retry after a short delay — don't fall back to a stock placeholder because of a
  transient queue error.
- **While polling, judge progress by `startedAt`, not `updatedAt`.** `startedAt` still null
  means the job is only queued behind other generations — `updatedAt` stays frozen while
  that's true, for as long as several minutes, and that's normal, not a hang. A job that
  genuinely stalls is moved to `failed` by a server-side sweep within 30 minutes (the error
  says whether it never started or never finished). Don't report Studio as down, and don't
  swap in a stock placeholder, from a frozen timestamp alone before that sweep has had a
  chance to run.

---

## Slide Count Rules

| Deck type | Target slides |
|-----------|--------------|
| QBR | 12–15 |
| Pitch deck | 10 |
| Board update | 8–10 |
| Client kickoff | 6–8 |
| Internal briefing | 5–7 |

Less is always more. If you're over, cut — don't shrink font sizes.

If cutting means dropping a slide the ask or decision genuinely depends on (the ask itself, the
risk slide, the pipeline-health slide in a QBR) — don't. Move the supporting detail behind it
into an Appendix instead. The target is a ceiling on what the audience reads live, not on what
exists in the file.

---

## Quality Checklist

- [ ] Every slide has a headline that is a conclusion (not a topic label)
- [ ] Max 4 bullets per content slide
- [ ] Slide size is 13.33 × 7.5 inches (16:9 widescreen)
- [ ] Speaker notes carry the extra context a slide can't hold — assume the deck gets forwarded
      without you in the room. A note that just restates the bullets in sentence form isn't
      extra context: write the thing a presenter would actually say out loud — the caveat, the
      pushback to expect, the number behind the number
- [ ] Body text no smaller than 18pt
- [ ] Every text color clears WCAG 2.2 SC 1.4.3 (contrast minimum, 4.5:1) against the
      *specific* shape it sits on — a KPI card's background, not just the slide background
      behind it. Checked once for this template's own palette (see the comments next to the
      color constants in `references/python-template.md`) — recheck if a color or a
      background changes
- [ ] Every image (`add_picture()`) *and* every native chart (`add_chart()`) has alt text set
      through `set_alt_text()` — python-pptx has no `alt_text`/`descr` attribute on either
      `Picture` or `GraphicFrame`, so both ship with no accessible name regardless of intent.
      A KPI or trend chart without it is exactly as invisible to a screen reader as an
      unlabeled image.
- [ ] No raw Python errors — run the script and confirm the `.pptx` file exists.

---

## Références

- `references/python-template.md` — the full generator script: theme colors with WCAG
  contrast math, the slide-building helper functions, the `set_alt_text()` fix, and a
  4-slide worked example (cover, KPI block, bullets, native chart)