---
name: |
  word-document
description: |
  Generate a formatted Word (.docx) document — proposals, statements of work, contracts, client reports, or internal documentation. Triggers on 'create a Word doc,' 'generate a .docx,' 'write a proposal,' 'draft an SOW,' 'make a contract,' or 'client documentation.' For PDF output, see pdf-report. For presentations, see slides-deck.
when-to-use: |
  Generate a formatted Word (.docx) document — proposals, statements of work, contracts, client reports, or internal documentation. Triggers on 'create a Word doc,' 'generate a .docx,' 'write a proposal,' 'draft an SOW,' 'make a contract,' or 'client documentation.' For PDF output, see pdf-report. For presentations, see slides-deck.
argument-hint: |
  Statement of work for a 3-month GTM engagement with Acme — deliverables, timeline, pricing, payment terms
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |
  high
---

# Word Document

> This is a Bulldozer skill. Generate a clean, properly styled .docx that the recipient can open in Word or Google Docs and edit without reformatting everything.

You are a Bulldozer operator producing a professional Word document. Use paragraph styles, not manual formatting. Keep the document editable by the client.

## Input

`$ARGUMENTS` — document type, content or outline, audience, and any specific sections required. If not provided, read available context files first. Only ask if document type and subject are completely absent.

## Output

1. A Python script `generate-{slug}.py` that produces `{slug}.docx`
2. The `.docx` file (run the script immediately)
3. A one-line summary of sections and document type

**Generate on first invocation. Do not ask before running.**

---

## Library: python-docx

```bash
pip install python-docx
```

python-docx handles paragraph styles, tables, headers/footers, sections, and inline formatting. It produces `.docx` compatible with Word 2010+ and Google Docs.

---

## Document Types and Standard Structure

### Proposal / SOW

| Section | Content |
|---------|---------|
| Cover | Client name, project title, date, prepared by |
| Executive Summary | Problem, proposed solution, expected outcome (max 1 page) |
| Scope of Work | Deliverables list with acceptance criteria |
| Timeline | Phases with start/end dates and milestones |
| Pricing | Fee table, payment schedule, what's excluded |
| Terms | Payment terms, IP ownership, confidentiality, termination |
| Signatures | Client and provider signature blocks |

### Client Report

| Section | Content |
|---------|---------|
| Cover | Report title, client, date, period covered |
| Summary | 3–5 bullet findings |
| Findings | Numbered sections with data, analysis, charts |
| Recommendations | Prioritized action items |
| Next Steps | Who does what by when |

### Internal Documentation

Cover + Sections + Appendix. No cover page needed for internal docs.

---

## Python Template

```python
from docx import Document
from docx.shared import Pt, Cm, RGBColor, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
from datetime import date

doc = Document()

# ── Page margins ──────────────────────────────────────────────────────────────
for section in doc.sections:
    section.top_margin    = Cm(2.5)
    section.bottom_margin = Cm(2.5)
    section.left_margin   = Cm(2.8)
    section.right_margin  = Cm(2.8)

# ── Core style helpers ────────────────────────────────────────────────────────
DARK    = RGBColor(0x0F, 0x17, 0x2A)  # slate-900
ACCENT  = RGBColor(0x63, 0x66, 0xF1)  # indigo
MUTED   = RGBColor(0x64, 0x74, 0x8B)  # slate-500
BODY    = RGBColor(0x1E, 0x29, 0x3B)  # slate-800

def styled_para(doc, text, style="Normal", bold=False, size=11, color=None,
                align=WD_ALIGN_PARAGRAPH.LEFT, space_before=0, space_after=6):
    p = doc.add_paragraph(style=style)
    run = p.add_run(text)
    run.bold = bold
    run.font.size = Pt(size)
    run.font.color.rgb = color or BODY
    p.alignment = align
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    return p

def heading(doc, text, level=1):
    """Heading 1 = section title, Heading 2 = subsection"""
    sizes = {1: 16, 2: 13, 3: 11}
    colors = {1: DARK, 2: DARK, 3: BODY}
    p = doc.add_paragraph()
    run = p.add_run(text)
    run.bold = True
    run.font.size = Pt(sizes.get(level, 11))
    run.font.color.rgb = colors.get(level, BODY)
    p.paragraph_format.space_before = Pt(18 if level == 1 else 12)
    p.paragraph_format.space_after = Pt(6)
    # Heading 1 gets a colored top border
    if level == 1:
        pPr = p._p.get_or_add_pPr()
        pBdr = OxmlElement("w:pBdr")
        top = OxmlElement("w:top")
        top.set(qn("w:val"), "single")
        top.set(qn("w:sz"), "12")
        top.set(qn("w:color"), "6366F1")
        pBdr.append(top)
        pPr.append(pBdr)
    return p

def bullet(doc, text, level=0):
    p = doc.add_paragraph(style="List Bullet")
    run = p.add_run(text)
    run.font.size = Pt(10.5)
    run.font.color.rgb = BODY
    p.paragraph_format.left_indent = Cm(0.5 * (level + 1))
    p.paragraph_format.space_after = Pt(3)
    return p

def add_table(doc, headers, rows, col_widths=None):
    """headers: list[str], rows: list[list], col_widths: list[Cm] or None"""
    table = doc.add_table(rows=1 + len(rows), cols=len(headers))
    table.style = "Table Grid"
    table.alignment = WD_TABLE_ALIGNMENT.CENTER

    # Header row
    hdr = table.rows[0]
    hdr.height = Cm(0.9)
    for i, h in enumerate(headers):
        cell = hdr.cells[i]
        cell.text = h
        cell.paragraphs[0].runs[0].bold = True
        cell.paragraphs[0].runs[0].font.size = Pt(10)
        cell.paragraphs[0].runs[0].font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        tc = cell._tc
        tcPr = tc.get_or_add_tcPr()
        shd = OxmlElement("w:shd")
        shd.set(qn("w:fill"), "0F172A")
        shd.set(qn("w:color"), "auto")
        shd.set(qn("w:val"), "clear")
        tcPr.append(shd)
        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER

    # Data rows
    for r_idx, row_data in enumerate(rows, 1):
        row = table.rows[r_idx]
        for c_idx, val in enumerate(row_data):
            cell = row.cells[c_idx]
            cell.text = str(val)
            cell.paragraphs[0].runs[0].font.size = Pt(10)
            cell.paragraphs[0].runs[0].font.color.rgb = BODY

    # Column widths
    if col_widths:
        for i, w in enumerate(col_widths):
            for row in table.rows:
                row.cells[i].width = w

    doc.add_paragraph()  # spacing after table
    return table

def page_break(doc):
    doc.add_page_break()

def add_signature_block(doc, parties):
    """parties: [{"name": "Acme Inc.", "title": "CEO"}]"""
    heading(doc, "Signatures", level=2)
    table = doc.add_table(rows=3, cols=len(parties) * 2)
    for i, party in enumerate(parties):
        col = i * 2
        table.cell(0, col).text = party["name"]
        table.cell(1, col).text = party.get("title", "")
        table.cell(2, col).text = "Date: _______________"
        table.cell(0, col + 1).text = "Signature: _______________________________"

# ── Document body ─────────────────────────────────────────────────────────────

# Cover page
styled_para(doc, "STATEMENT OF WORK", bold=True, size=9, color=ACCENT,
            align=WD_ALIGN_PARAGRAPH.CENTER, space_before=60)
styled_para(doc, "GTM Engagement — Acme Inc.", bold=True, size=22, color=DARK,
            align=WD_ALIGN_PARAGRAPH.CENTER, space_before=12, space_after=8)
styled_para(doc, f"Prepared by Bulldozer  ·  {date.today().strftime('%B %d, %Y')}",
            size=10, color=MUTED, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=4)
styled_para(doc, "Confidential", size=9, color=MUTED,
            align=WD_ALIGN_PARAGRAPH.CENTER)
page_break(doc)

# Executive Summary
heading(doc, "Executive Summary")
styled_para(doc, "This statement of work defines the scope, deliverables, timeline, "
            "and commercial terms for the GTM engagement between Bulldozer and Acme Inc.")
for item in [
    "3-month engagement covering ICP refinement, outbound build, and pipeline activation",
    "Fixed-fee structure with milestone-based payment",
    "Weekly check-ins and monthly reporting included",
]:
    bullet(doc, item)

# Scope
heading(doc, "Scope of Work")
heading(doc, "Deliverables", level=2)
add_table(doc,
    headers=["#", "Deliverable", "Description", "Acceptance Criteria"],
    rows=[
        ["1", "ICP Definition", "Researched ICP with firmographic and behavioral profiles", "Signed off by client"],
        ["2", "Outbound Sequence", "5-email cadence per segment", "Delivered in Lemlist"],
        ["3", "Pipeline Report", "Monthly Excel dashboard", "Shared each month-end"],
    ],
    col_widths=[Cm(1.2), Cm(4), Cm(6), Cm(5)]
)

# Timeline
heading(doc, "Timeline")
add_table(doc,
    headers=["Phase", "Start", "End", "Milestones"],
    rows=[
        ["Phase 1: Discovery", "Week 1", "Week 2", "ICP, positioning brief"],
        ["Phase 2: Build", "Week 3", "Week 8", "Sequences live, first sends"],
        ["Phase 3: Optimize", "Week 9", "Week 12", "Reporting, handoff"],
    ],
    col_widths=[Cm(4), Cm(3), Cm(3), Cm(6.5)]
)

# Pricing
heading(doc, "Pricing and Payment")
add_table(doc,
    headers=["Item", "Amount", "Due"],
    rows=[
        ["Phase 1 — Discovery", "€4,000", "On signature"],
        ["Phase 2 — Build", "€8,000", "Start of Phase 2"],
        ["Phase 3 — Optimize", "€4,000", "Start of Phase 3"],
        ["Total", "€16,000", ""],
    ],
    col_widths=[Cm(7), Cm(4), Cm(5.5)]
)

# Signatures
page_break(doc)
add_signature_block(doc, [
    {"name": "Bulldozer", "title": "Managing Director"},
    {"name": "Acme Inc.", "title": "CEO"},
])

# Save
doc.save("output.docx")
print("Saved output.docx")
```

---

## Style Rules

- **Always use paragraph styles** — never manually bold/size every paragraph; define helpers at top and reuse
- **Heading 1** for top-level sections (visible in Word's Navigation pane)
- **No empty paragraphs** for spacing — use `space_before` / `space_after` on paragraph format
- **Tables**: always set `table.style = "Table Grid"` so borders show in Google Docs too
- **Page breaks**: use `doc.add_page_break()`, never multiple `\n`

---

## Quality Checklist

- [ ] Document opens in Word and Google Docs without layout shifts
- [ ] All tables have a styled header row
- [ ] Consistent font sizes (body 10.5pt, h1 16pt, h2 13pt)
- [ ] Page margins set (2.5cm top/bottom, 2.8cm sides)
- [ ] Cover page ends with page break
- [ ] Signature blocks have enough blank space for actual signatures
- [ ] No raw Python errors — run and confirm `.docx` is created