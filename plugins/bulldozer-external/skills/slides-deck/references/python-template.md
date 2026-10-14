# Python Template — le script générateur complet

> Appelé depuis `PROPOSITION.md`, section « Python Template ». Rien ici n'est résumé : c'est
> le même script, déplacé tel quel parce qu'il est long, pas parce qu'il est secondaire —
> c'est lui qui produit réellement le `.pptx`.

## Sommaire

- Constantes de couleur, avec le calcul de contraste WCAG 2.2 commenté à côté de chacune
- Fonctions de mise en page : `blank_slide`, `add_shape`, `add_text`, `slide_headline`,
  `add_bullets`, `add_kpi_block`, `set_alt_text`, `slide_number`
- Exemple à quatre diapositives : couverture, bloc KPI, puces + note orateur, graphique natif

## Le script

```python
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE
from pptx.chart.data import ChartData
from pptx.enum.chart import XL_CHART_TYPE

# ── Theme colors ──────────────────────────────────────────────────────────────
# Contrast checked against this template's own backgrounds (WCAG 2.2 relative-luminance
# formula, SC 1.4.3): DARK and CARD are dark enough that WHITE/TEXT/MUTED all clear 4.5:1
# on both. ACCENT (indigo-500) does NOT — ~4.0:1 on DARK — so it stays a fill/bar color
# only; ACCENT_TEXT (indigo-400) is the version safe to set as a font color.
DARK       = RGBColor(0x0F, 0x17, 0x2A)  # slide bg
CARD       = RGBColor(0x1E, 0x29, 0x3B)  # card / panel bg
ACCENT     = RGBColor(0x63, 0x66, 0xF1)  # indigo-500 — bars, shapes, chart fills only
ACCENT_TEXT = RGBColor(0x81, 0x8C, 0xF8)  # indigo-400 — ~6:1 on DARK, use for accent TEXT
ACCENT2    = RGBColor(0x22, 0xC5, 0x5E)  # green secondary — ~6.4:1 on CARD, ~7.8:1 on DARK
DOWN       = RGBColor(0xF8, 0x71, 0x71)  # red-400 — ~4.9:1 on CARD (red-500 fails at ~3.9:1)
WHITE      = RGBColor(0xFF, 0xFF, 0xFF)
MUTED      = RGBColor(0x94, 0xA3, 0xB8)  # slate-400 — ~5.7–7:1 on DARK/CARD (fine here;
                                          # the same slate-400 fails ~2.8:1 on a WHITE page —
                                          # don't reuse this palette against a light background)
TEXT       = RGBColor(0xE2, 0xE8, 0xF0)  # slide body text

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
        MSO_SHAPE.RECTANGLE,
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
        # Delta — DOWN, not a raw red-500: red-500 on this CARD background measures
        # ~3.9:1, under the 4.5:1 text minimum. DOWN (red-400) clears ~4.9:1.
        delta_color = ACCENT2 if kpi.get("up", True) else DOWN
        arrow = "▲" if kpi.get("up", True) else "▼"
        add_text(slide, f"{arrow} {kpi['delta']}",
                 x + Inches(0.15), top + Inches(1.1),
                 card_w - Inches(0.3), Inches(0.35),
                 size=12, color=delta_color)

def set_alt_text(shape, text):
    """python-pptx has no public alt-text API on either graphical shape it can produce
    (verified against 1.0.2 by introspection and round-trip save/reopen): neither Picture
    (from add_picture()) nor GraphicFrame (from add_chart()) exposes .alt_text or .descr.
    Both share the same cNvPr element, so the same OOXML fix covers a chart as well as an
    image — call this on whatever add_picture()/add_chart() returns, not just pictures."""
    shape._element._nvXxPr.cNvPr.set("descr", text)

def slide_number(slide, num, total):
    add_text(slide, f"{num} / {total}",
             left=Inches(11.8), top=Inches(7.1),
             width=Inches(1.4), height=Inches(0.3),
             size=9, color=MUTED, align=PP_ALIGN.RIGHT)

# ── Slide 1: Cover ────────────────────────────────────────────────────────────
s1 = blank_slide(prs)
add_shape(s1, Inches(0), Inches(0), Inches(0.3), H, color=ACCENT)  # left bar
add_text(s1, "QUARTERLY BUSINESS REVIEW", Inches(0.6), Inches(1.8),
         Inches(9), Inches(0.5), size=11, color=ACCENT_TEXT, bold=True)
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

# ── Slide 4: Data slide with a native chart ───────────────────────────────────
s4 = blank_slide(prs)
slide_headline(s4, "Outbound volume recovered in March after two SDR hires")
slide_number(s4, 4, 12)

chart_data = ChartData()
chart_data.categories = ["Dec", "Jan", "Feb", "Mar"]
chart_data.add_series("Outbound touches", (1200, 1100, 720, 1350))
gframe = s4.shapes.add_chart(
    XL_CHART_TYPE.COLUMN_CLUSTERED,
    Inches(0.5), Inches(1.6), Inches(8), Inches(4.5), chart_data,
)
# add_chart() returns a GraphicFrame, not a Picture — same missing-alt-text gap, same fix.
set_alt_text(gframe, "Bar chart, outbound touches by month: Dec 1200, Jan 1100, Feb 720, Mar 1350")

# ── Save ──────────────────────────────────────────────────────────────────────
prs.save("output.pptx")
print("Saved output.pptx — 4 slides (extend with more blank_slide() calls)")
```
