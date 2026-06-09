---
name: slides-deck
description: Generate a PowerPoint (.pptx) presentation — pitch decks, QBRs, client updates, internal briefings, or board decks. Triggers on 'create slides,' 'make a deck,' 'generate a PowerPoint,' 'build a presentation,' 'pitch deck,' 'QBR slides,' or 'board deck.' For PDF output, see pdf-report. For Word documents, see word-document.
when-to-use: Generate a PowerPoint (.pptx) presentation — pitch decks, QBRs, client updates, internal briefings, or board decks. Triggers on 'create slides,' 'make a deck,' 'generate a PowerPoint,' 'build a presentation,' 'pitch deck,' 'QBR slides,' or 'board deck.' For PDF output, see pdf-report. For Word documents, see word-document.
argument-hint: QBR deck for Acme — Q1 results vs targets, pipeline health, 3 GTM initiatives for Q2, ask for budget increase
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
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

---

## Slide Writing Rules

1. **The headline is the message** — write it as a conclusion, not a topic. "Pipeline grew 34% QoQ" not "Pipeline Update."
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

```python
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.chart.data import ChartData
from pptx.enum.chart import XL_CHART_TYPE

# ── Theme colors ──────────────────────────────────────────────────────────────
DARK    = RGBColor(0x0F, 0x17, 0x2A)  # slide bg
CARD    = RGBColor(0x1E, 0x29, 0x3B)  # card / panel bg
ACCENT  = RGBColor(0x63, 0x66, 0xF1)  # indigo primary
ACCENT2 = RGBColor(0x22, 0xC5, 0x5E)  # green secondary
WHITE   = RGBColor(0xFF, 0xFF, 0xFF)
MUTED   = RGBColor(0x94, 0xA3, 0xB8)  # slate-400
TEXT    = RGBColor(0xE2, 0xE8, 0xF0)  # slide body text

prs = Presentation()

# ── Slide size: widescreen 16:9 ───────────────────────────────────────────────
prs.slide_width  = Inches(13.33)
prs.slide_height = Inches(7.5)

W = prs.slide_width
H = prs.slide_height

def blank_slide(prs):
    """Add a blank slide with dark background."""
    layout = prs.slide_layouts[6]  # blank
    slide = prs.slides.add_slide(layout)
    bg = slide.background
    fill = bg.fill
    fill.solid()
    fill.fore_color.rgb = DARK
    return slide

def add_shape(slide, left, top, width, height, color=None, alpha=None):
    """Add a filled rectangle."""
    shape = slide.shapes.add_shape(
        1,  # MSO_SHAPE_TYPE.RECTANGLE
        left, top, width, height
    )
    shape.line.fill.background()  # no border
    if color:
        shape.fill.solid()
        shape.fill.fore_color.rgb = color
    return shape

def add_text(slide, text, left, top, width, height,
             size=24, bold=False, color=WHITE, align=PP_ALIGN.LEFT,
             font="Calibri", italic=False):
    txBox = slide.shapes.add_textbox(left, top, width, height)
    tf = txBox.text_frame
    tf.word_wrap = True
    tf.auto_size = None
    p = tf.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    run.font.name = font
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.italic = italic
    run.font.color.rgb = color
    return txBox

def slide_headline(slide, headline, subtext=None):
    """Top headline bar with optional subtext underneath."""
    # Accent bar (left edge indicator)
    add_shape(slide, Inches(0), Inches(0.45), Inches(0.08), Inches(0.8), color=ACCENT)
    # Headline
    add_text(slide, headline,
             left=Inches(0.25), top=Inches(0.35),
             width=Inches(12.8), height=Inches(1.0),
             size=28, bold=True, color=WHITE)
    if subtext:
        add_text(slide, subtext,
                 left=Inches(0.25), top=Inches(1.0),
                 width=Inches(12.8), height=Inches(0.4),
                 size=14, color=MUTED)

def add_bullets(slide, items, left, top, width, height,
                size=18, color=TEXT, spacing=6):
    txBox = slide.shapes.add_textbox(left, top, width, height)
    tf = txBox.text_frame
    tf.word_wrap = True
    for i, item in enumerate(items):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = f"• {item}"
        p.font.size = Pt(size)
        p.font.color.rgb = color
        p.space_after = Pt(spacing)

def add_kpi_block(slide, kpis, left, top, card_w=Inches(2.8), card_h=Inches(1.8), gap=Inches(0.15)):
    """kpis: [{"label": str, "value": str, "delta": str, "up": bool}]"""
    for i, kpi in enumerate(kpis):
        x = left + i * (card_w + gap)
        # Card background
        add_shape(slide, x, top, card_w, card_h, color=CARD)
        # Label
        add_text(slide, kpi["label"], x + Inches(0.15), top + Inches(0.1),
                 card_w - Inches(0.3), Inches(0.35), size=10, color=MUTED)
        # Value
        add_text(slide, kpi["value"], x + Inches(0.15), top + Inches(0.4),
                 card_w - Inches(0.3), Inches(0.7), size=28, bold=True, color=WHITE)
        # Delta
        delta_color = ACCENT2 if kpi.get("up", True) else RGBColor(0xEF, 0x44, 0x44)
        arrow = "▲" if kpi.get("up", True) else "▼"
        add_text(slide, f"{arrow} {kpi['delta']}",
                 x + Inches(0.15), top + Inches(1.1),
                 card_w - Inches(0.3), Inches(0.35),
                 size=12, color=delta_color)

def slide_number(slide, num, total):
    add_text(slide, f"{num} / {total}",
             left=Inches(11.8), top=Inches(7.1),
             width=Inches(1.4), height=Inches(0.3),
             size=9, color=MUTED, align=PP_ALIGN.RIGHT)

# ── Slide 1: Cover ────────────────────────────────────────────────────────────
s1 = blank_slide(prs)
add_shape(s1, Inches(0), Inches(0), Inches(0.3), H, color=ACCENT)  # left bar
add_text(s1, "QUARTERLY BUSINESS REVIEW", Inches(0.6), Inches(1.8),
         Inches(9), Inches(0.5), size=11, color=ACCENT, bold=True)
add_text(s1, "Q1 2024 — Results & Q2 Plan", Inches(0.6), Inches(2.4),
         Inches(10), Inches(1.2), size=38, bold=True, color=WHITE)
add_text(s1, "Prepared for Acme Inc.  ·  April 2024", Inches(0.6), Inches(3.9),
         Inches(8), Inches(0.4), size=14, color=MUTED)

# ── Slide 2: At a Glance (KPIs) ───────────────────────────────────────────────
s2 = blank_slide(prs)
slide_headline(s2, "We hit 3 of 4 Q1 targets — pipeline is the gap")
slide_number(s2, 2, 12)

kpis = [
    {"label": "New Revenue", "value": "$2.4M", "delta": "+12% vs target", "up": True},
    {"label": "Pipeline Generated", "value": "$6.1M", "delta": "-18% vs target", "up": False},
    {"label": "Win Rate", "value": "34%", "delta": "+4pts QoQ", "up": True},
    {"label": "New Logos", "value": "18", "delta": "On target", "up": True},
]
add_kpi_block(s2, kpis, left=Inches(0.3), top=Inches(1.7))

# ── Slide 3: Content slide with bullets + note ────────────────────────────────
s3 = blank_slide(prs)
slide_headline(s3, "Pipeline shortfall is driven by two root causes")
slide_number(s3, 3, 12)
add_bullets(s3, [
    "Outbound volume dropped 40% in Feb — 2 SDR vacancies unfilled for 6 weeks",
    "ICP shifted: mid-market deals now take 90 days avg vs 60 last year",
    "Inbound still healthy — 22 MQLs/week, conversion holding at 28%",
], left=Inches(0.5), top=Inches(1.6),
   width=Inches(8), height=Inches(3.5), size=20)

# Speaker note
notes_slide = s3.notes_slide
notes_slide.notes_text_frame.text = (
    "Emphasize this is recoverable. Q2 plan addresses both root causes directly."
)

# ── Save ──────────────────────────────────────────────────────────────────────
prs.save("output.pptx")
print("Saved output.pptx — 3 slides (extend with more blank_slide() calls)")
```

---

## Layout Patterns

| Pattern | When to use |
|---------|-------------|
| `slide_headline` + `add_kpi_block` | Summary / at-a-glance slides |
| `slide_headline` + `add_bullets` | Narrative / explanation slides |
| `slide_headline` + chart | Data slides — always pair with a conclusion headline |
| Full-bleed image + title overlay | Cover, section dividers |
| Two columns | Comparison, before/after, two options |

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

---

## Quality Checklist

- [ ] Every slide has a headline that is a conclusion (not a topic label)
- [ ] Max 4 bullets per content slide
- [ ] Slide size is 13.33 × 7.5 inches (16:9 widescreen)
- [ ] Sp